import { AcademicYear } from '@values/years';

export type Means = [number[], number[][]];
export type MeansPerYear = Record<AcademicYear, Means>;
