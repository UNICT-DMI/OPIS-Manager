import { Component, computed, inject, OnDestroy } from '@angular/core';
import { DepCard } from '@cards/dep-card/dep-card';
import { LogoAnimated } from '@components/logo-animated/logo-animated';
import { DepartmentsService } from '@services/departments.service';
import { YearSection } from '@components/year-section/year-section';

@Component({
  selector: 'opis-home',
  imports: [LogoAnimated, DepCard, YearSection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnDestroy {
  private readonly _departmentService = inject(DepartmentsService);

  public canShowDepartments = computed(this._departmentService.canStartUserFlow);
  public respDepartments = this._departmentService.getDepartmentByYear();

  ngOnDestroy(): void {
    this._departmentService.canStartUserFlow.set(false);
  }
}
