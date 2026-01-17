import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Question } from '@interfaces/question.interface';
import { catchError, map, Observable, shareReplay, tap, throwError } from 'rxjs';
import { env } from 'src/enviroment';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly BASE_URL = env.api_url + '/domande';
  private readonly _http = inject(HttpClient);

  private readonly _questionWeights$ = this._http.get<Question[]>(this.BASE_URL).pipe(
    map((weights) => {
      if (!weights || weights.length === 0) {
        throw new Error('Risultati assenti!');
      }
      return weights;
    }),
    tap((weights) => (this.questionWeights = weights)),
    shareReplay({ bufferSize: 1, refCount: false }),
    catchError(() => throwError(() => new Error('Recupero dei pesi delle domande fallito'))),
  );

  public questionWeights: Question[];

  public loadQuestionsWeights(): Observable<Question[]> {
    return this._questionWeights$;
  }

  // TODO ???
  updateQuestionWeights(domande: Question[], token: string): Observable<object> {
    const domandeJson = JSON.stringify(
      domande.map((domanda) => ({
        id: domanda.id,
        peso: domanda.peso_standard,
        gruppo: domanda.gruppo,
      })),
    );
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token,
      }),
    };
    return this._http.put(this.BASE_URL + '?pesi_domande=' + domandeJson, {}, httpOptions);
  }
}
