import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdsSelectedSection } from './cds-selected-section';
import { exampleCDS } from '@mocks/cds-mock';

describe('CdsSelectedSection', () => {
  let component: CdsSelectedSection;
  let fixture: ComponentFixture<CdsSelectedSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdsSelectedSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdsSelectedSection);
    fixture.componentRef.setInput('cds', exampleCDS);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read cds without throwing', () => {
    expect(component.cds()).toEqual(exampleCDS);
  });
});
