import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DepartmentsService } from '@services/departments/departments.service';
import { ACADEMIC_YEARS, AcademicYear } from '@values/years';

@Component({
  selector: 'opis-year-section',
  imports: [],
  templateUrl: './year-section.html',
  styleUrl: './year-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearSection {
  private readonly _departmentService = inject(DepartmentsService);

  protected readonly allYears = ACADEMIC_YEARS;
  protected readonly selectedYear = computed(this._departmentService.selectedYear);
  protected readonly canShowDepartments = computed(this._departmentService.canStartUserFlow);

  protected selectYear(year: AcademicYear): void {
    const isValidAcademicYear = this.allYears.includes(year);
    if (!isValidAcademicYear) return;
    this._departmentService.selectedYear.set(year);
  }
}
