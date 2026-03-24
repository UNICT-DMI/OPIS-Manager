import { SchedaOpis } from '@interfaces/opis-record.interface';

export const exampleSchedaOpis: SchedaOpis = {
  id: 1,
  anno_accademico: '2023/2024',
  totale_schede: 10,
  totale_schede_nf: 0,
  femmine: 0,
  femmine_nf: 0,
  fc: 0,
  inatt: 0,
  inatt_nf: 0,
  eta: null,
  anno_iscr: null,
  num_studenti: null,
  ragg_uni: null,
  studio_gg: null,
  studio_tot: null,
  domande: [
    [10, 0, 0, 0], // Q1 → d=10, V1 += (10/10)*1 = 1
    [0, 10, 0, 0], // Q2 → d=40, V2 += (40/10)*1 = 4
    [0, 0, 10, 0], // Q3 → d=70, V3 += (70/10)*1 = 7
  ],
  domande_nf: null,
  motivo_nf: null,
  sugg: null,
  sugg_nf: null,
  id_insegnamento: 1,
};
