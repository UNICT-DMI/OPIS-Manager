// TODO: dinamicizzare in base alla risposta delle api,
// se il backend viene aggiornato con nuovi anni?

export const ACADEMIC_YEARS = [
  '2013/2014',
  '2014/2015',
  '2015/2016',
  '2016/2017',
  '2017/2018',
  '2018/2019',
  '2019/2020',
  '2020/2021',
] as const;
export type AcademicYear = (typeof ACADEMIC_YEARS)[number];
