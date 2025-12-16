import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Department } from '@interfaces/department.interface';
import { DepartmentsService } from '@services/departments.service';

@Component({
  selector: 'opis-department',
  imports: [],
  templateUrl: './department.html',
  styleUrl: './department.scss',
})
export class DepartmentPage implements OnInit, OnDestroy {
  private readonly _departmentService = inject(DepartmentsService);

  private departmentData = signal<Department | null>(null);

  public department = computed(() => this.departmentData() ?? {} as Department);
  public cdsList = this._departmentService.getCdsDepartment(this.departmentData);

  ngOnInit(): void {
    this.retrieveDepartmentInfo();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('department');
  }

  private retrieveDepartmentInfo() {
    const rawDepartment = localStorage.getItem('department');
    if(!rawDepartment) throw new Error(
      'Impossibile recuperare le info del dipartimento selezionato'
    ); // todo ritorno in home

    const correctDepFormat = JSON.parse(rawDepartment);
    this.departmentData.set(correctDepFormat);
  }
}
