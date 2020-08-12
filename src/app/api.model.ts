export interface Department {
  id: number;
  unict_id: number;
  nome: string;
  anno_accademico: string;
  tot_cds: number;
  tot_moduli: number;
  tot_valutati: number;
  report: any;
  tot_schedeF: number;
  tot_schedeNF: number;
}

export interface CDS {
  id: number;
  unict_id: number;
  nome: string;
  classe: string;
  anno_accademico: string;
  id_dipartimento: number;
  scostamento_numerosita: number;
  scostamento_media: number;
  pesi_domande: any;
  insegnamenti: Teaching[];
}

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

export interface SchedaOpis {
  id: number;
  anno_accademico: string;
  totale_schede: number;
  totale_schede_nf: number;
  femmine: number;
  femmine_nf: number;
  fc: number;
  inatt: number;
  inatt_nf: number;
  eta: any;
  anno_iscr: any;
  num_studenti: any;
  ragg_uni: any;
  studio_gg: any;
  studio_tot: any;
  domande: number[][];
  domande_nf: any;
  motivo_nf: any;
  sugg: any;
  sugg_nf: any;
  id_insegnamento: number;
}

export interface Domanda {
  id: number;
  peso_standard: number;
  gruppo: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}