import { GraphSelectionType } from '@enums/chart-typology.enum';
import { ChartData, ChartType } from 'chart.js';

export interface GraphView {
  type: ChartType;
  data: ChartData;
}

export interface GraphSelectionBtn {
  value: GraphSelectionType;
  active: boolean;
  description: string;
  label: string;
  icon: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
}
