import {
  ChangeDetectionStrategy,
  Component,
  computed,
  linkedSignal,
  input,
  output,
} from '@angular/core';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { YearRangeSelection } from '@interfaces/year-range.interface';

/** Dual-thumb slider selecting an interval of academic years (by index). */
@Component({
  selector: 'opis-year-range',
  imports: [NgxSliderModule],
  templateUrl: './year-range.html',
  styleUrl: './year-range.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearRange {
  readonly years = input.required<readonly string[]>();
  readonly initialStartIndex = input<number>();
  readonly initialEndIndex = input<number>();
  readonly rangeChange = output<YearRangeSelection>();

  private readonly lastIndex = computed(() => Math.max(this.years().length - 1, 0));

  protected readonly startIndex = linkedSignal(() =>
    this.clamp(this.initialStartIndex() ?? 0),
  );
  protected readonly endIndex = linkedSignal(() =>
    this.clamp(this.initialEndIndex() ?? this.lastIndex()),
  );

  protected readonly options = computed<Options>(() => {
    const years = this.years();
    return {
      floor: 0,
      ceil: this.lastIndex(),
      step: 1,
      showTicks: true,
      translate: (value: number): string => years[value] ?? '',
    };
  });

  protected onStartChange(value: number): void {
    this.startIndex.set(value);
    this.emit();
  }

  protected onEndChange(value: number): void {
    this.endIndex.set(value);
    this.emit();
  }

  private emit(): void {
    const years = this.years();
    const start = this.startIndex();
    const end = this.endIndex();
    this.rangeChange.emit({
      startIndex: start,
      endIndex: end,
      startYear: years[start] ?? '',
      endYear: years[end] ?? '',
    });
  }

  private clamp(value: number): number {
    return Math.min(Math.max(value, 0), this.lastIndex());
  }
}
