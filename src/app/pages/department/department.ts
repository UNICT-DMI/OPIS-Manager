import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
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
})
export class DepartmentPage implements OnInit, OnDestroy {
  private readonly _departmentService = inject(DepartmentsService);
  private readonly _cdsService = inject(CdsService);
  private readonly _questionService = inject(QuestionService);

  private departmentData = signal<Department | null>(null);

  public isCdsSelected = false;

  public readonly NO_CHOICE_VALUE = NO_CHOICE_CDS;
  public department = computed(() => this.departmentData() ?? ({} as Department));
  public cds = computed(() => this._cdsService.cdsSelected() ?? this.NO_CHOICE_VALUE);
  public cdsList = this._departmentService.getCdsDepartment(this.departmentData);

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

  private retrieveQuestions() {
    this._questionService.loadQuestionsWeights().pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: () => console.log('[LOG RESP] ==> Domande salvate con successo!'),
      error: (error) => console.warn(error)
    });
  }

  private retrieveDepartmentInfo() {
    const rawDepartment = localStorage.getItem('department');
    if (!rawDepartment)
      throw new Error('Impossibile recuperare le info del dipartimento selezionato'); // todo ritorno in home dopo tot secondi

    const correctDepFormat = JSON.parse(rawDepartment);
    this.departmentData.set(correctDepFormat);
  }

  private manageListVisibility() {
    return effect(() => (this.isCdsSelected = this.cds().id !== this.NO_CHOICE_VALUE.id));
  }

  public selectCds(newCds: CDS) {
    this._cdsService.cdsSelected.set(newCds);
  }
}
