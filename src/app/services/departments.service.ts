import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CDS } from '@interfaces/cds.interface';
import { Department } from '@interfaces/department.interface';
import { OPIS_DEPARTMENT_MAP } from '@values/deps-id';
import { DEPARTMENT_ICONS } from '@values/icons-deps';
import { AcademicYear } from '@values/years';
import { map } from 'rxjs';
import { env } from 'src/enviroment';

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private readonly BASE_URL = env.api_url + '/dipartimento';
  private readonly _http = inject(HttpClient);

  public canStartUserFlow = signal(false);
  public selectedYear = signal<AcademicYear>('2020/2021');

  private departmentsApi(year: AcademicYear) {
    const url = `${this.BASE_URL}?anno_accademico=${year}`;
    return this._http.get<Department[]>(url);
  }

  public getCDSOfDepartment(department: number) {
    const url = `${this.BASE_URL}/width-id/` + department + '/cds';
    return this._http.get<CDS[]>(url);
  }

  public getDepartmentByYear() {
    return rxResource({
      params: () => this.selectedYear(),
      stream: ({ params }) => {
        return this.departmentsApi(params).pipe(
          map((res) =>
            res.map((respDep) => {
              const nameDep = OPIS_DEPARTMENT_MAP[respDep.unict_id];
              const icon = DEPARTMENT_ICONS[nameDep] ?? DEPARTMENT_ICONS.DEFAULT;

              return {
                ...respDep,
                icon,
              };
            }),
          ),
        );
      },
    });
  }
}
