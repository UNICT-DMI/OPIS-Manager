import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Department } from '@interfaces/department.interface';
import { DepartmentsService } from '@services/departments/departments.service';
import { CdsService } from '@services/cds/cds.service';
import { CDS } from '@interfaces/cds.interface';
import { NO_CHOICE_CDS, NO_SELECTION_CDS_ID } from '@values/no-choice-cds';
import { CdsSelectedSection } from '@sections/cds-selected-section/cds-selected-section';
import { QuestionService } from '@services/questions/questions.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IconComponent } from '@shared-ui/icon/icon';
import { Loader } from '@shared-ui/loader/loader';
import { GraphService } from '@services/graph/graph.service';
import { TeachingService } from '@services/teachings/teachings.service';
import { GraphSelection, GraphSelectionType } from '@enums/chart-typology.enum';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { Disclaimers } from '@cards/disclaimer/disclaimers';
import { OpisGroup_Disclaimers } from '@values/disclaimers.value';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';

const VALID_VIEWS: ReadonlySet<GraphSelectionType> = new Set<GraphSelectionType>([
  GraphSelection.CDS_GENERAL,
  GraphSelection.TEACHINGS_CDS,
  GraphSelection.YEAR,
]);

@Component({
  selector: 'opis-department',
  imports: [Loader, IconComponent, CdsSelectedSection, Disclaimers],
  templateUrl: './department.html',
  styleUrl: './department.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentPageComponent implements OnInit, OnDestroy {
  private readonly _departmentService = inject(DepartmentsService);
  private readonly _cdsService = inject(CdsService);
  private readonly _questionService = inject(QuestionService);
  private readonly _graphService = inject(GraphService);
  private readonly _teachingService = inject(TeachingService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _analytics = inject(AnalyticsService);

  private readonly departmentData = signal<Department | null>(null);
  private readonly _cdsRestored = signal(false);
  private readonly _pendingTeachingId = signal<number | null>(null);

  protected readonly NO_CHOICE_VALUE = NO_CHOICE_CDS;
  protected readonly GroupsDisclaimers = OpisGroup_Disclaimers;

  protected readonly isCdsSelected = computed<boolean>(() => this.cds().id !== NO_SELECTION_CDS_ID);
  protected readonly department = computed(() => this.departmentData() ?? null);
  protected readonly cds = computed(() => this._cdsService.cdsSelected() ?? this.NO_CHOICE_VALUE);
  protected cdsList = this._departmentService.getCdsDepartment(this.departmentData);

  protected readonly graphBtns = computed(this._graphService.graphBtns);
  protected readonly isLoading = this._cdsService.isLoading;

  constructor() {
    this.retrieveQuestions();
    this.restoreViewAndSubStateFromRoute();
    this.restoreCdsFromRoute();
    this.applyPendingTeaching();
    this.syncRouteWithState();
  }

  ngOnInit(): void {
    this.retrieveDepartmentInfo();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('department');
    this._cdsService.cdsSelected.set(this.NO_CHOICE_VALUE);
    this._departmentService.currentDepartment.set(null);
  }

  private retrieveQuestions(): void {
    this._questionService
      .loadQuestionsWeights()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => console.log('[LOG RESP] ==> Domande salvate con successo!'),
        error: (error) => console.warn(error),
      });
  }

  private retrieveDepartmentInfo(): void {
    const rawDepartment = localStorage.getItem('department');
    if (!rawDepartment)
      throw new Error('Impossibile recuperare le info del dipartimento selezionato'); // todo ritorno in home dopo tot secondi

    const correctDepFormat = JSON.parse(rawDepartment);
    this.departmentData.set(correctDepFormat);
    this._departmentService.currentDepartment.set(correctDepFormat);
  }

  private restoreViewAndSubStateFromRoute(): void {
    const params = this._route.snapshot.queryParamMap;

    const view = params.get('view') as GraphSelectionType | null;
    if (view && VALID_VIEWS.has(view)) {
      this._graphService.graphKeySelected.set(view);
    }

    const year = params.get('year');
    if (year && (ACADEMIC_YEARS as readonly string[]).includes(year)) {
      this._graphService.selectedYear.set(year as AcademicYear);
    }

    const search = params.get('search');
    if (search) this._graphService.teachingSearch.set(search);

    const teaching = params.get('teaching');
    if (teaching) {
      const id = Number(teaching);
      if (Number.isFinite(id)) this._pendingTeachingId.set(id);
    }
  }

  private restoreCdsFromRoute(): EffectRef {
    return effect(() => {
      const list = this.cdsList.value();
      if (!list?.length) return;
      if (this._cdsRestored()) return;

      const cdsId = this._route.snapshot.queryParamMap.get('cds');
      if (cdsId) {
        const found = list.find((c) => c.id === Number(cdsId));
        if (found) this._cdsService.cdsSelected.set(found);
      }
      this._cdsRestored.set(true);
    });
  }

  private applyPendingTeaching(): EffectRef {
    return effect(() => {
      const info = this._cdsService.getInfoCds.value();
      if (!info) return;

      const pending = this._pendingTeachingId();
      if (!pending) return;

      const teaching = info.teachings.find((t) => t.id === pending);
      if (teaching) this._teachingService.selectedTeaching.set(teaching);
      this._pendingTeachingId.set(null);
    });
  }

  private syncRouteWithState(): EffectRef {
    return effect(() => {
      if (!this._cdsRestored()) return;

      const cds = this._cdsService.cdsSelected();
      const view = this._graphService.graphKeySelected();
      const year = this._graphService.selectedYear();
      const search = this._graphService.teachingSearch();
      const teaching = this._teachingService.selectedTeaching();
      const pendingTeaching = this._pendingTeachingId();
      const hasCds = !!cds && cds.id !== NO_SELECTION_CDS_ID;

      let params: Record<string, string | null>;
      if (!hasCds) {
        params = { cds: null, view: null, year: null, search: null, teaching: null };
      } else {
        const teachingValue = teaching
          ? String(teaching.id)
          : pendingTeaching
            ? String(pendingTeaching)
            : null;
        params = {
          cds: String(cds.id),
          view,
          year: view === GraphSelection.YEAR && year ? year : null,
          search: view === GraphSelection.YEAR && search ? search : null,
          teaching: view === GraphSelection.TEACHINGS_CDS ? teachingValue : null,
        };
      }

      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: params,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  protected selectCds(newCds: CDS): void {
    if (newCds.id === NO_SELECTION_CDS_ID) {
      this.selectGraphType('cds_year');
      this._graphService.selectedYear.set(null);
      this._graphService.selectedVIndex.set(0);
      this._graphService.teachingSearch.set('');
      this._teachingService.selectedTeaching.set(null);
    } else {
      this._analytics.trackEvent('select_cds', {
        cds_id: newCds.id,
        cds_name: newCds.nome,
        cds_class: newCds.classe,
      });
    }

    this._cdsService.cdsSelected.set(newCds);
  }

  protected selectGraphType(newGraph: GraphSelectionType): void {
    this._graphService.graphKeySelected.set(newGraph);
  }
}
