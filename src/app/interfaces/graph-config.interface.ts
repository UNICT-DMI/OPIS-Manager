import { ChartData, ChartType } from 'chart.js';

export interface GraphView {
  type: ChartType;
  data: ChartData;
}
