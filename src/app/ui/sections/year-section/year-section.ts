import { Component, computed, inject } from '@angular/core';
import { DepartmentsService } from '@services/departments/departments.service';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';

@Component({
  selector: 'opis-year-section',
  imports: [],
  templateUrl: './year-section.html',
  styleUrl: './year-section.scss',
})
export class YearSection {
  private readonly _departmentService = inject(DepartmentsService);

  public readonly allYears = ACADEMIC_YEARS;
  public selectedYear = computed(this._departmentService.selectedYear);
  public canShowDepartments = computed(this._departmentService.canStartUserFlow);

  public selectYear(year: AcademicYear) {
    const isValidAcademicYear = ACADEMIC_YEARS.includes(year);
    if (!isValidAcademicYear) return;
    this._departmentService.selectedYear.set(year);
  }
}
