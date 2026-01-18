export const OpisGroup = {
  Group1: 'V1',
  Group2: 'V2',
  Group3: 'V3',
} as const;

export type OpisGroupType = (typeof OpisGroup)[keyof typeof OpisGroup];
