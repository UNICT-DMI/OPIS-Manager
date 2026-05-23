import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { YearRange } from './year-range';
import { YearRangeSelection } from '@interfaces/year-range.interface';

@Component({
  selector: 'ngx-slider',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MockNgxSlider {
  readonly value = input<number>();
  readonly highValue = input<number>();
  readonly options = input<unknown>();
  readonly valueChange = output<number>();
  readonly highValueChange = output<number>();
}

const YEARS = ['2013/2014', '2014/2015', '2015/2016', '2016/2017'];

describe('YearRange', () => {
  let component: YearRange;
  let fixture: ComponentFixture<YearRange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [YearRange] })
      .overrideComponent(YearRange, {
        remove: { imports: [NgxSliderModule] },
        add: { imports: [MockNgxSlider] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(YearRange);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('years', YEARS);
    fixture.detectChanges();
  });

  it('[YEAR-RANGE]: should create', () => expect(component).toBeTruthy());

  it('[YEAR-RANGE]: options span the full index range with a year-label translator', () => {
    const opts = component['options']();
    expect(opts.floor).toBe(0);
    expect(opts.ceil).toBe(YEARS.length - 1);
    expect(opts.step).toBe(1);
    expect(opts.translate?.(2, 'value' as never)).toBe('2015/2016');
  });

  it('[YEAR-RANGE]: defaults to the full range', () => {
    expect(component['startIndex']()).toBe(0);
    expect(component['endIndex']()).toBe(YEARS.length - 1);
  });

  it('[YEAR-RANGE]: honors initial indices', () => {
    fixture.componentRef.setInput('initialStartIndex', 1);
    fixture.componentRef.setInput('initialEndIndex', 2);
    fixture.detectChanges();
    expect(component['startIndex']()).toBe(1);
    expect(component['endIndex']()).toBe(2);
  });

  it('[YEAR-RANGE]: clamps out-of-bounds initial indices', () => {
    fixture.componentRef.setInput('initialStartIndex', -5);
    fixture.componentRef.setInput('initialEndIndex', 99);
    fixture.detectChanges();
    expect(component['startIndex']()).toBe(0);
    expect(component['endIndex']()).toBe(YEARS.length - 1);
  });

  it('[YEAR-RANGE]: onStartChange updates the start and emits the selection', () => {
    const spy = vi.fn();
    component.rangeChange.subscribe((s: YearRangeSelection) => spy(s));

    component['onStartChange'](1);

    expect(component['startIndex']()).toBe(1);
    expect(spy).toHaveBeenCalledWith({
      startIndex: 1,
      endIndex: 3,
      startYear: '2014/2015',
      endYear: '2016/2017',
    });
  });

  it('[YEAR-RANGE]: onEndChange updates the end and emits the selection', () => {
    const spy = vi.fn();
    component.rangeChange.subscribe((s: YearRangeSelection) => spy(s));

    component['onEndChange'](2);

    expect(component['endIndex']()).toBe(2);
    expect(spy).toHaveBeenCalledWith({
      startIndex: 0,
      endIndex: 2,
      startYear: '2013/2014',
      endYear: '2015/2016',
    });
  });

  it('[YEAR-RANGE]: hides the slider when there is a single year', () => {
    fixture.componentRef.setInput('years', ['2013/2014']);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ngx-slider')).toBeNull();
  });
});
