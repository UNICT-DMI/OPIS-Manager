import { OpisGroupType } from '@enums/opis-group.enum';

export interface QuestionRow {
  readonly id: number;
  readonly text: string;
  readonly group: OpisGroupType | null;
  readonly dismissed: boolean;
}

export interface AnswerRow {
  readonly label: string;
  readonly code: string;
  readonly value: number;
}
