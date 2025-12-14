import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { DepCard } from '@cards/dep-card/dep-card';
import { LogoAnimated } from '@components/logo-animated/logo-animated';
import { DepartmentsService } from '@services/departments.service';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';

@Component({
  selector: 'opis-home',
  imports: [ LogoAnimated, DepCard ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnDestroy {
  private readonly _departmentService = inject(DepartmentsService);

  public readonly allYears = ACADEMIC_YEARS;
  public canShowDepartments = computed(this._departmentService.canStartUserFlow);
  public selectedYear = signal<AcademicYear>('2020/2021');

  public respDepartments = this._departmentService.getDepartmentByYear(this.selectedYear);

  ngOnDestroy(): void {
    this._departmentService.canStartUserFlow.set(false);
  }

  public selectYear(year: AcademicYear) {
    const isValidAcademicYear = ACADEMIC_YEARS.includes(year);
    if (!isValidAcademicYear) return;
    this.selectedYear.set(year);
  }
}
