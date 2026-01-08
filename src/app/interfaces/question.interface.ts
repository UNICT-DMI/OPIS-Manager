import { OpisGroup } from '@enums/opis-group.enum';

export interface Question {
  id: number;
  peso_standard: number;
  gruppo: OpisGroup;
  created_at: string;
  updated_at: string;
}
