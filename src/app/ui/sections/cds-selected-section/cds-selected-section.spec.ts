import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdsSelectedSection } from './cds-selected-section';

describe('CdsSelectedSection', () => {
  let component: CdsSelectedSection;
  let fixture: ComponentFixture<CdsSelectedSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CdsSelectedSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdsSelectedSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
