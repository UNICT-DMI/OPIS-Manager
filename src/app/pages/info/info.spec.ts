import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { Info } from './info';

describe('Info', () => {
  let component: Info;
  let fixture: ComponentFixture<Info>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Info],
    }).compileComponents();

    fixture = TestBed.createComponent(Info);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('[INFO]: created', () => expect(component).toBeTruthy());
});
