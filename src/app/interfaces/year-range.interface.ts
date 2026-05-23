import { AcademicYear } from '@values/years';

export interface YearRangeSelection {
  startIndex: number;
  endIndex: number;
  startYear: string;
  endYear: string;
}

export interface YearInterval {
  startYear: AcademicYear;
  endYear: AcademicYear;
}
