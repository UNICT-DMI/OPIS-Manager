import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DepCard } from './dep-card';
import { signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { exampleDepartment } from '@mocks/department-mock';

describe('DepCard', () => {
  let fixture: ComponentFixture<DepCard>;

  const mockActivatedRoute = {
    params: signal({}),
    queryParams: signal({}),
    snapshot: {
      params: {},
      queryParams: {},
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepCard],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(DepCard);
    fixture.componentRef.setInput('department', exampleDepartment);
    fixture.detectChanges();
  });

  it('[CARD_DEPARTMENT]: Created', () => expect(fixture.componentInstance).toBeTruthy());

  it('[CARD_DEPARTMENT]: saveInfo writes the department JSON to localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined);
    fixture.componentInstance['saveInfo']();
    expect(spy).toHaveBeenCalledWith('department', JSON.stringify(exampleDepartment));
  });

  it('[CARD_DEPARTMENT]: ngOnInit computes a slug detailUrl from the department name', () => {
    expect(fixture.componentInstance['detailUrl'].startsWith('/')).toBe(true);
    expect(fixture.componentInstance['detailUrl']).not.toMatch(/[A-Z\s]/);
  });
});
