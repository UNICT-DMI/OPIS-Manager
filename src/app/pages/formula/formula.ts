import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { OpisGroup, OpisGroupType } from '@enums/opis-group.enum';
import { AnswerWeights } from '@enums/weights.enum';
import { AnswerRow, QuestionRow } from '@interfaces/formula.interface';
import { Question } from '@interfaces/question.interface';
import { SaveMessage } from '@interfaces/save-message.interface';
import { AuthService } from '@services/auth/auth.service';
import { QuestionService } from '@services/questions/questions.service';
import { Loader } from '@shared-ui/loader/loader';

/** Each question group's weights must sum to 1; allow tiny float drift (step is 0.05). */
const GROUP_SUM_EPSILON = 0.01;

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
  imports: [Loader, NgxSliderModule, DecimalPipe],
  templateUrl: './formula.html',
  styleUrl: './formula.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormulaComponent implements OnInit {
  private readonly _questionService = inject(QuestionService);
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);

  private readonly _questions = signal<Question[]>([]);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly hasError = signal<boolean>(false);

  protected readonly isLogged = this._authService.isLogged;
  protected readonly saving = signal<boolean>(false);
  protected readonly saveMessage = signal<SaveMessage | null>(null);

  protected readonly sliderOptions: Options = { floor: 0, ceil: 1, step: 0.05 };

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

  protected readonly groupSums = computed(() => {
    const questions = this._questions();
    const sumFor = (group: OpisGroupType): number =>
      questions
        .filter((q) => q.gruppo === group)
        .reduce((acc, q) => acc + (q.peso_standard ?? 0), 0);
    return {
      V1: sumFor(OpisGroup.Group1),
      V2: sumFor(OpisGroup.Group2),
      V3: sumFor(OpisGroup.Group3),
    };
  });

  protected readonly groupsValid = computed(() => {
    const sums = this.groupSums();
    return (
      Math.abs(sums.V1 - 1) < GROUP_SUM_EPSILON &&
      Math.abs(sums.V2 - 1) < GROUP_SUM_EPSILON &&
      Math.abs(sums.V3 - 1) < GROUP_SUM_EPSILON
    );
  });

  protected readonly editGroups = computed(() => {
    const grouped = this.groupedRows();
    const sums = this.groupSums();
    return [
      { label: OpisGroup.Group1, rows: grouped.V1, sum: sums.V1 },
      { label: OpisGroup.Group2, rows: grouped.V2, sum: sums.V2 },
      { label: OpisGroup.Group3, rows: grouped.V3, sum: sums.V3 },
    ].map((group) => ({ ...group, valid: Math.abs(group.sum - 1) < GROUP_SUM_EPSILON }));
  });

  /** Danger message explaining why saving is blocked, or null when every group sums to 1. */
  protected readonly groupsError = computed<string | null>(() => {
    const invalid = this.editGroups()
      .filter((group) => !group.valid)
      .map((group) => group.label);
    if (invalid.length === 0) return null;
    if (invalid.length === 1) return `La somma ${invalid[0]} è diversa da 1`;
    return `Le somme ${invalid.join(', ')} sono diverse da 1`;
  });

  protected setWeight(id: number, value: number): void {
    this._questions.update((questions) =>
      questions.map((q) => (q.id === id ? { ...q, peso_standard: value } : q)),
    );
    this.saveMessage.set(null);
  }

  protected save(): void {
    if (!this.groupsValid()) {
      this.saveMessage.set({
        type: 'error',
        text: 'La somma dei pesi di ogni gruppo (V1, V2, V3) deve essere pari a 1.',
      });
      return;
    }

    const token = this._authService.getAuthToken();
    if (!token) return;

    this.saving.set(true);
    this.saveMessage.set(null);
    this._questionService
      .updateQuestionWeights(this._questions(), token)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.saveMessage.set({ type: 'success', text: 'Pesi aggiornati correttamente!' });
        },
        error: () => {
          this.saving.set(false);
          this.saveMessage.set({ type: 'error', text: "Errore nell'aggiornare i pesi." });
        },
      });
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
