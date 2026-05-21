import { GraphSelectionBtn } from '@interfaces/graph-config.interface';

export const CHART_BTNS: GraphSelectionBtn[] = [
  {
    value: 'cds_year',
    description:
      'Fotografia di un anno accademico specifico: confronta i punteggi medi di tutti gli insegnamenti nello stesso periodo.',
    label: 'Per anno',
    active: true,
    icon: 'calendar_month',
  },
  {
    value: 'cds_general',
    description:
      'Andamento storico delle medie V1, V2 e V3 del Corso di Studi, aggregate su tutti gli insegnamenti per anno accademico.',
    label: 'Generale',
    active: false,
    icon: 'show_chart',
  },
  {
    value: 'teaching_cds',
    description:
      "Punteggi medi per singolo insegnamento: confronta l'evoluzione di V1, V2 e V3 corso per corso nel tempo.",
    label: 'Corsi',
    active: false,
    icon: 'menu_book',
  },
  {
    value: 'cds_boxplot',
    description:
      'Distribuzione statistica delle valutazioni V1, V2 e V3: mediana, quartili e outlier di tutti gli insegnamenti per anno accademico.',
    label: 'Boxplot',
    active: false,
    icon: 'candlestick_chart',
  },
];
