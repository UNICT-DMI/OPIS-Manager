import { GraphSelectionBtn } from "@interfaces/graph-config.interface";

export const CHART_BTNS: GraphSelectionBtn[] = [
  {
    value: 'cds_general',
    description: 'Mostra l’andamento nel tempo delle medie V1, V2 e V3 del Corso di Studi, calcolate aggregando tutti gli insegnamenti per ciascun anno accademico.',
    label: 'Generale',
    active: true,
    icon: 'show_chart',
  },
  {
    value: 'teaching_cds',
    description: 'Visualizza i punteggi medi dei singoli insegnamenti, consentendo di analizzare l’andamento nel tempo di ciascun corso rispetto ai gruppi di valutazione V1, V2 e V3.',
    label: 'Corsi',
    active: false,
    icon: 'menu_book'
  },
  {
    value: 'cds_year',
    description: 'Permette di analizzare i risultati di un anno accademico specifico, confrontando i punteggi medi dei diversi insegnamenti all’interno dello stesso periodo.',
    label: 'Per anno',
    active: false,
    icon: 'calendar_month'
  },
];