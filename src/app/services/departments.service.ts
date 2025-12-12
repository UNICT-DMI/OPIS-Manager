import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CDS } from '@interfaces/cds.interface';
import { Department } from '@interfaces/department.interface';
import { AcademicYear } from '@values/years';
import { env } from 'src/enviroment';

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private readonly BASE_URL = env.api_url + '/dipartimento';
  private readonly _http = inject(HttpClient);

  public canStartUserFlow = signal(false);

  public getAllDepartments(year: AcademicYear) {
    const url = `${this.BASE_URL}?anno_accademico=${year}`;
    return this._http.get<Department[]>(url);
  }

  public getCDSOfDepartment(department: number) {
    const url = `${this.BASE_URL}/width-id/` + department + '/cds';
    return this._http.get<CDS[]>(url);
  }
}
