import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OpisGroup } from '@enums/opis-group.enum';
import { AnswerWeights } from '@enums/weights.enum';
import { AnswerRow, QuestionRow } from '@interfaces/formula.interface';
import { Question } from '@interfaces/question.interface';
import { QuestionService } from '@services/questions/questions.service';
import { Loader } from '@shared-ui/loader/loader';

const QUESTION_TEXTS: Record<number, string> = {
  1: "Le conoscenze preliminari possedute sono risultate sufficienti per la comprensione degli argomenti previsti nel programma d'esame?",
  2: "Il carico di studio dell'insegnamento è proporzionato ai crediti assegnati?",
  3: 'Il materiale didattico (indicato e disponibile) è adeguato per lo studio della materia?',
  4: 'Le modalità di esame sono state definite in modo chiaro?',
  5: 'Gli orari di svolgimento di lezioni, esercitazioni e altre eventuali attività didattiche sono rispettati?',
  6: "Il docente stimola/motiva l'interesse verso la disciplina?",
  7: 'Il docente espone gli argomenti in modo chiaro?',
  8: 'Le attività didattiche integrative (esercitazioni, tutorati, laboratori, ... etc) sono utili all’apprendimento della materia?',
  9: "L'insegnamento è stato svolto in maniera coerente con quanto dichiarato sul sito web del corso di studio?",
  10: 'Il docente è reperibile per chiarimenti e spiegazioni?',
  11: 'È interessato/a agli argomenti trattati nell’insegnamento?',
  12: 'È complessivamente soddisfatto/a dell’insegnamento?',
};

const DISMISSED_QUESTION_IDS = new Set([8, 11, 12]);

@Component({
  selector: 'opis-formula',
  imports: [Loader],
  templateUrl: './formula.html',
  styleUrl: './formula.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormulaComponent implements OnInit {
  private readonly _questionService = inject(QuestionService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _questions = signal<Question[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly hasError = signal<boolean>(false);

  protected readonly Groups = OpisGroup;

  protected readonly answerRows: AnswerRow[] = [
    { label: 'Decisamente no', code: 'E1', value: AnswerWeights.DefinitelyNo },
    { label: 'Più no che sì', code: 'E2', value: AnswerWeights.MoreNoThanYes },
    { label: 'Più sì che no', code: 'E3', value: AnswerWeights.MoreYesThanNo },
    { label: 'Decisamente sì', code: 'E4', value: AnswerWeights.DefinitelyYes },
  ];

  protected readonly questionRows = computed<QuestionRow[]>(() => {
    const weights = this._questions();
    return Object.keys(QUESTION_TEXTS)
      .map(Number)
      .sort((a, b) => a - b)
      .map((id) => {
        const dismissed = DISMISSED_QUESTION_IDS.has(id);
        const match = weights.find((w) => w.id === id);
        return {
          id,
          text: QUESTION_TEXTS[id],
          group: dismissed ? null : (match?.gruppo ?? null),
          dismissed,
        };
      });
  });

  protected readonly groupedRows = computed(() => {
    const rows = this.questionRows();
    return {
      V1: rows.filter((row) => row.group === OpisGroup.Group1),
      V2: rows.filter((row) => row.group === OpisGroup.Group2),
      V3: rows.filter((row) => row.group === OpisGroup.Group3),
      dismissed: rows.filter((row) => row.dismissed),
    };
  });

  protected getWeight(id: number): number | null {
    return this._questions().find((w) => w.id === id)?.peso_standard ?? null;
  }

  ngOnInit(): void {
    this._questionService
      .loadQuestionsWeights()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (weights) => {
          this._questions.set(weights);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }
}
