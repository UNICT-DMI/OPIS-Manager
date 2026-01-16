import { ChangeDetectionStrategy, Component, computed, effect, EffectRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Department } from '@interfaces/department.interface';
import { DepartmentsService } from '@services/departments/departments.service';
import { RouterLink } from '@angular/router';
import { CdsService } from '@services/cds/cds.service';
import { CDS } from '@interfaces/cds.interface';
import { NO_CHOICE_CDS } from '@values/no-choice-cds';
import { Loader } from '@components/loader/loader';
import { Icon } from '@components/icon/icon';
import { CdsSelectedSection } from '@sections/cds-selected-section/cds-selected-section';
import { QuestionService } from '@services/questions/questions.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'opis-department',
  imports: [RouterLink, Loader, Icon, CdsSelectedSection],
  templateUrl: './department.html',
  styleUrl: './department.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepartmentPageComponent implements OnInit, OnDestroy {
  private readonly _departmentService = inject(DepartmentsService);
  private readonly _cdsService = inject(CdsService);
  private readonly _questionService = inject(QuestionService);

  private departmentData = signal<Department | null>(null);

  protected readonly NO_CHOICE_VALUE = NO_CHOICE_CDS;
  
  protected isCdsSelected = false;
  protected department = computed(() => this.departmentData() ?? null);
  protected cds = computed(() => this._cdsService.cdsSelected() ?? this.NO_CHOICE_VALUE);
  protected cdsList = this._departmentService.getCdsDepartment(this.departmentData);

  constructor() {
    this.manageListVisibility();
    this.retrieveQuestions();
  }

  ngOnInit(): void {
    this.retrieveDepartmentInfo();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('department');
    this._cdsService.cdsSelected.set(this.NO_CHOICE_VALUE);
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
  }

  private manageListVisibility(): EffectRef {
    return effect(() => (this.isCdsSelected = this.cds().id !== this.NO_CHOICE_VALUE.id));
  }

  public selectCds(newCds: CDS): void {
    this._cdsService.cdsSelected.set(newCds);
  }
}
