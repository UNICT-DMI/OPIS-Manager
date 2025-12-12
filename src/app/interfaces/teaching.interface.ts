import { SchedaOpis } from "./opis-record.interface";

export interface Teaching {
  id: number;
  codice_gomp: number;
  nome: string;
  anno_accademico: string;
  anno: string;
  semestre: string;
  cfu: string;
  docente: string;
  canale: string;
  id_modulo: number;
  nome_modulo: string;
  tipo: string;
  ssd: string;
  assegn: string;
  id_cds: number;
  schedeopis: SchedaOpis;
}