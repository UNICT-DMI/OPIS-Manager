import { Teaching } from './teaching.interface';
import { GraphView } from './graph-config.interface';
import { MeansPerYear } from '@c_types/means-graph.type';
import { GraphSelectionType } from '@enums/chart-typology.enum';

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
  teachings: Teaching[];
  coarse: MeansPerYear;
  graphs: ReadyGraph;
}

export type ReadyGraph = {
  [key in GraphSelectionType]: GraphView | null;
};
