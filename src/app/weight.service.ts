import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeightService {

  private questionsWeights: number[] = [];
  private answersWeights: number[] = [];

  constructor() {
    // pesi singole domande
    this.questionsWeights = [
      0.7,  // 1
      0.3,  // 2
      0.1,  // 3
      0.1,  // 4
      0.3,  // 5
      0.5,  // 6
      0.4,  // 7
      0.0,  // 8   questa domanda non viene considerata
      0.3,  // 9
      0.3,  // 10
      0.0,  // 11  questa domanda non viene considerata
      0.0   // 12  questa domanda non viene considerata
    ];

    this.answersWeights = [
      1,   // Decisamente no
      4,   // Più no che sì
      7,   // Più sì che no
      10,  // Decisamente sì
    ];
  }

  public getQuestionsWeights(): number[] {
    return this.questionsWeights;
  }

  public getQuestionWeight(index: number): number {
    return this.questionsWeights[index];
  }

  public setQuestionsWeights(newWeights: number[]): void {
    this.questionsWeights = newWeights;
  }

  public setQuestionWeight(newWeight: number, index: number): void {
    this.questionsWeights[index] = newWeight;
  }

  public getAnswersWeights(): number[] {
    return this.answersWeights;
  }

  public getAnswerWeight(index: number): number {
    return this.answersWeights[index];
  }

  public setAnswersWeights(newWeights: number[]): void {
    this.answersWeights = newWeights;
  }

  public setAnswerWeight(newWeight: number, index: number): void {
    this.answersWeights[index] = newWeight;
  }

}
