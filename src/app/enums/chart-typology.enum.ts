export const GraphSelection = {
  CDS_GENERAL: 'cds_general',
  TEACHINGS_CDS: 'teaching_cds',
  YEAR: 'cds_year',
} as const;

export type GraphSelectionType = (typeof GraphSelection)[keyof typeof GraphSelection];