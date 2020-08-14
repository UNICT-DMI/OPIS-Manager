import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Domanda } from './api.model';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeightService {

  private questionsWeights: Domanda[];
  private answersWeights: number[];

  constructor(
    public readonly apiService: ApiService
  ) {
    this.apiService.getDomandePesi().pipe(take(1)).subscribe((pesi) => {
      this.questionsWeights = pesi;
    });
    this.answersWeights = [
      1,   // Decisamente no
      4,   // Più no che sì
      7,   // Più sì che no
      10,  // Decisamente sì
    ];
  }

  public getQuestionsWeights(): Domanda[] {
    return this.questionsWeights;
  }

  public getAnswersWeights(): number[] {
    return this.answersWeights;
  }

}
