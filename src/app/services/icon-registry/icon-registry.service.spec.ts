import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { IconRegistryService } from './icon-registry.service';

describe('IconRegistryService', () => {
  let service: IconRegistryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IconRegistryService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(IconRegistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('[ICON-REGISTRY]: should fetch the requested icon and trim it', async () => {
    const promise = firstValueFrom(service.load('github'));
    const req = httpMock.expectOne('/icons/github-icon.svg');
    expect(req.request.method).toBe('GET');
    req.flush('  <svg></svg>  ');
    await expect(promise).resolves.toBe('<svg></svg>');
  });

  it('[ICON-REGISTRY]: should cache and not hit HTTP again on subsequent calls', async () => {
    const first = firstValueFrom(service.load('linkedin'));
    httpMock.expectOne('/icons/linkedin-icon.svg').flush('<svg/>');
    await first;

    const second = firstValueFrom(service.load('linkedin'));
    httpMock.expectNone('/icons/linkedin-icon.svg');
    await expect(second).resolves.toBe('<svg/>');
  });
});
