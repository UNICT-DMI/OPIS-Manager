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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eta: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anno_iscr: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  num_studenti: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ragg_uni: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  studio_gg: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  studio_tot: any;
  domande: number[][];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  domande_nf: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  motivo_nf: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sugg: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sugg_nf: any;
  id_insegnamento: number;
}
