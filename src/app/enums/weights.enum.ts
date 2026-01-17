export const AnswerWeights = {
  DefinitelyNo: 1,
  MoreNoThanYes: 4,
  MoreYesThanNo: 7,
  DefinitelyYes: 10
} as const;

export type AnswerWeightsType = typeof AnswerWeights[keyof typeof AnswerWeights];