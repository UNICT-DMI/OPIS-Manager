import { ComponentFixture, TestBed } from '@angular/core/testing';

import { exampleCDS } from '@mocks/cds-mock';
import { CdsService } from '@services/cds/cds.service';
import { describe } from 'vitest';
import { CdsSelectedSection } from './cds-selected-section';

describe('CdsSelectedSection', () => {
  let component: CdsSelectedSection;
  let fixture: ComponentFixture<CdsSelectedSection>;
  let cdsService: CdsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdsSelectedSection],
      providers: [CdsService],
    }).compileComponents();

    cdsService = TestBed.inject(CdsService);
    cdsService.cdsSelected.set(exampleCDS);
    fixture = TestBed.createComponent(CdsSelectedSection);

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read cds without throwing', () => {
    expect(component['cds']()).toEqual(exampleCDS);
  });
});
