import { AcademicYear } from '@values/years';
import { Teaching } from './teaching.interface';

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
}