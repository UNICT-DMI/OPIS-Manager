import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect } from 'vitest';
import { CdsSelectedSection } from './cds-selected-section';
import { CdsService } from '@services/cds/cds.service';
import { exampleCDS } from '@mocks/cds-mock';
import { signal } from '@angular/core';

class MockCdsService {
  readonly cdsSelected = signal(exampleCDS);
  getInfoCds() {
    return {
      status: () => 'success',
      isLoading: () => false,
      hasValue: () => true,
      value: () => exampleCDS,
      error: null,
      refresh: () => {},
    };
  }
}

describe('CdsSelectedSection', () => {
  let component: CdsSelectedSection;
  let fixture: ComponentFixture<CdsSelectedSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdsSelectedSection],
      providers: [{ provide: CdsService, useClass: MockCdsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CdsSelectedSection);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read cds without throwing', () => {
    expect(component['cds']()).toEqual(exampleCDS);
  });
});
