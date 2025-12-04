import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Info } from './info';

describe('Info', () => {
  let component: Info;
  let fixture: ComponentFixture<Info>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Info]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Info);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
