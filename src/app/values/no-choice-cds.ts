import { CDS } from '@interfaces/cds.interface';

export const NO_SELECTION_CDS_ID = -1;

export const NO_CHOICE_CDS: CDS = {
  id: NO_SELECTION_CDS_ID,
  unict_id: NO_SELECTION_CDS_ID,
  nome: 'Scegli un corso di studi',
  classe: '**/**',
  anno_accademico: '',
  id_dipartimento: -1,
  scostamento_numerosita: -1,
  scostamento_media: -1,
  pesi_domande: null,
  insegnamenti: [],
};
