import { describe, expect, it } from 'vitest';
import { DepartmentsService } from './departments.service';

describe('DepartmentsService', () => {
  it('should be defined', () => {
    expect(DepartmentsService).toBeDefined();
  });
});

// TODO: Implement comprehensive tests
// import { TestBed } from '@angular/core/testing';
// import { provideHttpClient, provideHttpClientTesting } from '@angular/common/http';
// import { HttpTestingController } from '@angular/common/http/testing';

// describe('YourService getDepartmentByYear', () => {
//   let service: YourService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         provideHttpClient(),
//         provideHttpClientTesting(),
//         YourService,
//       ],
//     });

//     service = TestBed.inject(YourService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   it('should fetch departments', async () => {
//     await TestBed.runInInjectionContext(() => {
//       const resource = service.getDepartmentByYear();

//       // intercetta la chiamata HTTP
//       const req = httpMock.expectOne(`${(service as any).BASE_URL}?anno_accademico=2020/2021`);
//       req.flush([
//         { unict_id: 1, name: 'A' },
//         { unict_id: 2, name: 'B' },
//       ]);

//       // attendi microtask per rxResource
//       return Promise.resolve().then(() => {
//         expect(resource.value()).toEqual([
//           {
//             unict_id: 1,
//             name: 'A',
//             icon: service['DEPARTMENT_ICONS'][service['UNICT_ID_DEPARTMENT_MAP'][1]] ?? service['DEPARTMENT_ICONS'].DEFAULT,
//           },
//           {
//             unict_id: 2,
//             name: 'B',
//             icon: service['DEPARTMENT_ICONS'][service['UNICT_ID_DEPARTMENT_MAP'][2]] ?? service['DEPARTMENT_ICONS'].DEFAULT,
//           },
//         ]);
//       });
//     });
//   });
// });
