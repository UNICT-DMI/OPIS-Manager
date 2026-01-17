import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
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
});
