import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { DepCard } from '@cards/dep-card/dep-card';
import { DepartmentsService } from '@services/departments/departments.service';
import { YearSection } from '@sections/year-section/year-section';
import { Loader } from '@shared-ui/loader/loader';
import { LogoAnimated } from '@shared-ui/logo-animated/logo-animated';

@Component({
  selector: 'opis-home',
  imports: [LogoAnimated, DepCard, YearSection, Loader],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnDestroy {
  private readonly _departmentService = inject(DepartmentsService);

  protected readonly canShowDepartments = computed(this._departmentService.canStartUserFlow);
  protected readonly respDepartments = this._departmentService.getDepartmentByYear();

  ngOnDestroy(): void {
    this._departmentService.canStartUserFlow.set(false);
  }
}
