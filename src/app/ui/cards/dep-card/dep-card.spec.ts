import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepCard } from './dep-card';

describe('DepCard', () => {
  let component: DepCard;
  let fixture: ComponentFixture<DepCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
