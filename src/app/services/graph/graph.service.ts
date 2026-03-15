import { inject, Injectable, ResourceRef, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Means, MeansPerYear } from '@c_types/means-graph.type';
import { GraphSelectionType } from '@enums/chart-typology.enum';
import { OpisGroup, OpisGroupType } from '@enums/opis-group.enum';
import { AnswerWeights } from '@enums/weights.enum';
import { GraphSelectionBtn } from '@interfaces/graph-config.interface';
import { SchedaOpis } from '@interfaces/opis-record.interface';
import { QuestionService } from '@services/questions/questions.service';
import { typedKeys } from '@utils/object-helpers.utils';
import { mean, round } from '@utils/statistics.utils';
import { CHART_BTNS } from '@values/selection-graph';
import { AcademicYear } from '@values/years';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GraphService {
  private readonly _questionService = inject(QuestionService);

  public graphKeySelected = signal<GraphSelectionType>('cds_general');
  public graphBtns = signal<GraphSelectionBtn[]>(CHART_BTNS);

  private applyWeights(scheda: SchedaOpis): number[] {
    const questionsWeights = this._questionService.questionWeights;
    const { totale_schede, domande: questions } = scheda;

    if (totale_schede < 5) return [0, 0, 0];

    const V: Record<OpisGroupType, number> = {
      [OpisGroup.Group1]: 0,
      [OpisGroup.Group2]: 0,
      [OpisGroup.Group3]: 0,
    };

    for (let j = 0; j < questions.length; j++) {
      const singleQuestion = questions[j];

      let d = 0;
      d += singleQuestion[0] * AnswerWeights.DefinitelyNo;
      d += singleQuestion[1] * AnswerWeights.MoreNoThanYes;
      d += singleQuestion[2] * AnswerWeights.MoreYesThanNo;
      d += singleQuestion[3] * AnswerWeights.DefinitelyYes;

      const domanda = questionsWeights.find((question) => question.id === j + 1);
      if (!domanda) continue;

      const { gruppo, peso_standard } = domanda;
      if (Object.prototype.hasOwnProperty.call(V, gruppo)) {
        V[gruppo] += (d / totale_schede) * peso_standard;
      }
    }

    return [round(V[OpisGroup.Group1]), round(V[OpisGroup.Group2]), round(V[OpisGroup.Group3])];
  }

  /**
   * Computes V1/V2/V3 scores for a set of OPIS schedules.
   * Returns both the aggregate means and the per-schedule values.
   */
  private elaborateFormulaFor(opisSchedules: SchedaOpis[]): Means {
    const v1: number[] = [];
    const v2: number[] = [];
    const v3: number[] = [];

    for (const schedaOpis of opisSchedules) {
      const [V1, V2, V3] = this.applyWeights(schedaOpis);
      v1.push(V1);
      v2.push(V2);
      v3.push(V3);
    }

    const means = [round(mean(v1)), round(mean(v2)), round(mean(v3))];
    return [means, [v1, v2, v3]];
  }

  /**
   * Returns the currently active graph button based on graphKeySelected.
   * Updates the active flag across all buttons reactively.
   */
  public manageGraphSelection(): ResourceRef<GraphSelectionBtn | undefined> {
    return rxResource({
      params: this.graphKeySelected,
      stream: ({ params: graphSelected }) => {
        const currentBtns = structuredClone(this.graphBtns());
        const graph = currentBtns.find(btn => btn.value === graphSelected) ?? currentBtns[0];

        for (const graphStored of currentBtns) {
          graphStored.active = graphStored.value === graph.value;
        }

        this.graphBtns.set(currentBtns);
        return of(graph);
      },
    });
  }

  /**
   * Computes V1/V2/V3 means for each academic year from a pre-grouped record of OPIS schedules.
   * Delegates the formula elaboration to `elaborateFormulaFor` for each year's set of schedules.
   */
  public computeMeansPerYear(schedeByYear: Record<AcademicYear, SchedaOpis[]>): MeansPerYear {
    const meansPerYear = {} as MeansPerYear;

    for (const year of typedKeys(schedeByYear)) {
      const allSchedules = schedeByYear[year];

      meansPerYear[year] = this.elaborateFormulaFor(allSchedules);
    }

    return meansPerYear;
  }
}
