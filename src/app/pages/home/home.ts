import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { LogoAnimated } from '@components/logo-animated/logo-animated';
import { DepartmentsService } from '@services/departments.service';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';

@Component({
  selector: 'opis-home',
  imports: [LogoAnimated],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly _departmentService = inject(DepartmentsService);

  public readonly allYears = ACADEMIC_YEARS;
  public canShowDepartments = computed(this._departmentService.canStartUserFlow);
  public selectedYear = signal<AcademicYear>('2020/2021');

  public respDepartments = rxResource({
    params: () => this.selectedYear(),
    stream: ({ params }) => {
      return this._departmentService.getAllDepartments(params);
    },
  });

  public selectYear(year: AcademicYear) {
    const isValidAcademicYear = ACADEMIC_YEARS.includes(year);
    if (!isValidAcademicYear) return;
    this.selectedYear.set(year);
  }
}
