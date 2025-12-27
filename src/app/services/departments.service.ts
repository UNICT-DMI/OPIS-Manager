import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CDS } from '@interfaces/cds.interface';
import { Department } from '@interfaces/department.interface';
import { DELAY_API_MS } from '@values/delay-api';
import { UNICT_ID_DEPARTMENT_MAP } from '@values/deps-id-unict';
import { DEPARTMENT_ICONS } from '@values/icons-deps';
import { AcademicYear } from '@values/years';
import { delay, map, Observable, of } from 'rxjs';
import { env } from 'src/enviroment';

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private readonly BASE_URL = env.api_url + '/dipartimento';
  private readonly _http = inject(HttpClient);

  public canStartUserFlow = signal(false);
  public selectedYear = signal<AcademicYear>('2020/2021');

  private departmentsApi(year: AcademicYear): Observable<Department[]> {
    const url = `${this.BASE_URL}?anno_accademico=${year}`;

    return this._http.get<Department[]>(url).pipe(
      map((res) =>
        res.map((respDep) => {
          const nameDep = UNICT_ID_DEPARTMENT_MAP[respDep.unict_id];
          const icon = DEPARTMENT_ICONS[nameDep] ?? DEPARTMENT_ICONS.DEFAULT;

          return {
            ...respDep,
            icon,
          };
        }),
      ),
      delay(DELAY_API_MS),
    );
  }

  private cdsOfDepartmentApi(department: number) {
    const url = `${this.BASE_URL}/with-id/` + department + '/cds';

    return this._http.get<CDS[]>(url).pipe(delay(DELAY_API_MS));
  }

  public getDepartmentByYear() {
    return rxResource({
      params: () => this.selectedYear(),
      stream: ({ params }) => this.departmentsApi(params),
    });
  }

  public getCdsDepartment(department: WritableSignal<Department | null>) {
    return rxResource({
      params: () => department(),
      stream: ({ params }) => {
        if (!params) return of([]);
        return this.cdsOfDepartmentApi(params.id);
      },
    });
  }
}
