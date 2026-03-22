import { OpisGroup } from "@enums/opis-group.enum";
import { Question } from "@interfaces/question.interface";

export const exampleQuestion: Question = {
  id: 1,
  peso_standard: 1.5,
  gruppo: OpisGroup.Group1,
  created_at: '2020-01-01',
  updated_at: '2020-01-01',
};