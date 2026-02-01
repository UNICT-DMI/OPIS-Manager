import { AcademicYear } from '@values/years';
import { Teaching } from './teaching.interface';
import { GraphView } from './graph-config.interface';

export interface CDS {
  id: number;
  unict_id: number;
  nome: string;
  classe: string;
  anno_accademico: string;
  id_dipartimento: number;
  scostamento_numerosita: number;
  scostamento_media: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pesi_domande: any;
  insegnamenti: Teaching[];
}

export interface AllCdsInfoResp {
  teachings: Teaching[],
  coarse: Record<AcademicYear, [number[], number[][]]>
  graphs: {
    cds_stats: GraphView,
    // cds_stats_by_year: ChartData,
    // cds_techings: ChartData
  }
}