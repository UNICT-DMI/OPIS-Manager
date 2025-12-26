import { CDS } from "@interfaces/cds.interface";

export const NO_CHOICE_CDS: CDS = {
  id: -1,
  unict_id: -1,
  nome: 'Scegli un corso di studi',
  classe: '**/**',
  anno_accademico: '',
  id_dipartimento: -1,
  scostamento_numerosita: -1,
  scostamento_media: -1,
  pesi_domande: null,
  insegnamenti: []
};