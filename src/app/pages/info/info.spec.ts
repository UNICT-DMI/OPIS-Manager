import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { InfoPageComponent } from './info';

describe('InfoPageComponent', () => {
  let component: InfoPageComponent;
  let fixture: ComponentFixture<InfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('[INFO]: created', () => expect(component).toBeTruthy());
});
