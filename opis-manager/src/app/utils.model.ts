export interface Config {
  apiUrl: string;
  years: string[];
}

export interface TeachingSchede {
  anno: string;
  totale_schede: number;
  v1: number;
  v2: number;
  v3: number;
}

export interface TeachingSummary {
  nome: string;
  nome_completo: string;
  anno: string;
  canale: string;
  id_modulo: number;
  nome_modulo: string;
  docente: string;
  tot_schedeF: number;
  tot_schedeNF: number;
  domande: any;
}

export interface SchedaOpis {
  totale_schede: number;
  domande: number[][];
}
