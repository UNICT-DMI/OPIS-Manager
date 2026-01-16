import { OpisGroupType } from '@enums/opis-group.enum';

export interface Question {
  id: number;
  peso_standard: number;
  gruppo: OpisGroupType;
  created_at: string;
  updated_at: string;
}
