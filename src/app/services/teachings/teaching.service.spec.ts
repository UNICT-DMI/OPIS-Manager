import { TestBed } from "@angular/core/testing";
import { MeansPerYear } from "@c_types/means-graph.type";
import { Teaching } from "@interfaces/teaching.interface";
import { exampleTeaching } from "@mocks/teaching-mock";
import { TeachingService } from "./teachings.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { GraphMapper } from "@mappers/graph.mapper";
import { AcademicYear } from "@values/years";
import { SchedaOpis } from "@interfaces/opis-record.interface";
import { provideHttpClient } from "@angular/common/http";
import { GraphService } from "@services/graph/graph.service";

const BASE_URL = 'https://api-opis.unictdev.org/api/v2/insegnamento';

const exampleTeachingWithoutDomande: Teaching = {
  ...exampleTeaching,
  schedeopis: { ...exampleTeaching.schedeopis, domande: null as any },
};

const mockMeansPerYear: MeansPerYear = {
  '2020/2021': [[1, 2], [[1, 2], [3, 4]]],
} as unknown as MeansPerYear;

const flush = async (times = 3): Promise<void> => {
  for (let i = 0; i < times; i++) await (TestBed.tick() as unknown as Promise<void>);
};



describe('[SERVICE] == Teaching', () => {
  let service: TeachingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.spyOn(GraphMapper, 'groupByYear').mockReturnValue({} as Record<AcademicYear, SchedaOpis[]>);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TeachingService);
    httpMock = TestBed.inject(HttpTestingController);

    const graphService = TestBed.inject(GraphService);
    vi.spyOn(graphService, 'computeMeansPerYear').mockReturnValue(mockMeansPerYear);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('[GET TEACHINGS]: selection null, return null', async () => {
    const resource = TestBed.runInInjectionContext(() => service.getTeachingGraph());
    await flush();

    const url = `${BASE_URL}/coarse/${exampleTeaching.codice_gomp}/schedeopis`;
    httpMock.expectNone(url);

    await vi.waitFor(async () => {
      await (TestBed.tick() as unknown as Promise<void>);
      expect(resource.value()).toBeNull();
    });
  })

  it('[GET_TEACHING_GRAPH]: Fetches and computes means when teaching is set', async () => {
    service.selectedTeaching.set(exampleTeaching);
    const resource = TestBed.runInInjectionContext(() => service.getTeachingGraph());
    await flush();

    const expectedUrl = `${BASE_URL}/coarse/${exampleTeaching.codice_gomp}/schedeopis?canale=${exampleTeaching.canale}&id_modulo=${exampleTeaching.id_modulo}`;
    httpMock.expectOne(expectedUrl).flush([exampleTeaching]);

    await vi.waitFor(async () => {
      await (TestBed.tick() as unknown as Promise<void>);
      expect(resource.value()).toEqual(mockMeansPerYear);
    });
  });

  it('[GET_TEACHING_GRAPH]: Filters out teachings without domande', async () => {
    service.selectedTeaching.set(exampleTeaching);
    const resource = TestBed.runInInjectionContext(() => service.getTeachingGraph());
    await flush();

    const expectedUrl = `${BASE_URL}/coarse/${exampleTeaching.codice_gomp}/schedeopis?canale=${exampleTeaching.canale}&id_modulo=${exampleTeaching.id_modulo}`;
    httpMock.expectOne(expectedUrl).flush([exampleTeaching, exampleTeachingWithoutDomande]);

    await vi.waitFor(async () => {
      await (TestBed.tick() as unknown as Promise<void>);
      expect(GraphMapper.groupByYear).toHaveBeenCalledWith(
        [exampleTeaching],
        expect.any(Function),
      );
    });
  });

  it('[GET_TEACHING_GRAPH]: Uses canale "no" if canale is not set', async () => {
    const teachingNoCanale: Teaching = { ...exampleTeaching, canale: null as any };
    service.selectedTeaching.set(teachingNoCanale);
    const resource = TestBed.runInInjectionContext(() => service.getTeachingGraph());
    await flush();

    const expectedUrl = `${BASE_URL}/coarse/${exampleTeaching.codice_gomp}/schedeopis?canale=no&id_modulo=${exampleTeaching.id_modulo}`;
    httpMock.expectOne(expectedUrl).flush([]);

    await vi.waitFor(async () => {
      await (TestBed.tick() as unknown as Promise<void>);
      expect(resource.value()).toEqual(mockMeansPerYear);
    });
  });

  it('[GET_TEACHING_GRAPH]: Refetches on selectedTeaching change', async () => {
    const resource = TestBed.runInInjectionContext(() => service.getTeachingGraph());
    await flush();

    service.selectedTeaching.set(exampleTeaching);

    await vi.waitFor(async () => {
      await (TestBed.tick() as unknown as Promise<void>);
      const req = httpMock.match(
        `${BASE_URL}/coarse/${exampleTeaching.codice_gomp}/schedeopis?canale=A&id_modulo=201`,
      );
      if (!req.length) throw new Error('no request yet');
      req[0].flush([exampleTeaching]);
    });

    await vi.waitFor(async () => {
      await (TestBed.tick() as unknown as Promise<void>);
      expect(resource.value()).toEqual(mockMeansPerYear);
    });
  });
});