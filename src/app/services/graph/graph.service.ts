import { inject, Injectable } from '@angular/core';
import { OpisGroup, OpisGroupType } from '@enums/opis-group.enum';
import { AnswerWeights } from '@enums/weights.enum';
import { GraphView } from '@interfaces/graph-config.interface';
import { SchedaOpis } from '@interfaces/opis-record.interface';
import { QuestionService } from '@services/questions/questions.service';
import { mean, round } from '@utils/statistics.utils';
import { AcademicYear } from '@values/years';

@Injectable({ providedIn: 'root' })
export class GraphService {
  private readonly _questionService = inject(QuestionService);

  public formatCDSGraph(dataFromResp: Record<AcademicYear, [number[], number[][]]>): GraphView {
    const labels: AcademicYear[] = [];
    const v1: number[] = [];
    const v2: number[] = [];
    const v3: number[] = [];

    for(const year in dataFromResp) {
      const yearTyped = year as AcademicYear;
      const [ means ] = dataFromResp[yearTyped];
      
      const isYearAlredyIn = labels.some(year => year === yearTyped);
      if (!isYearAlredyIn) labels.push(yearTyped);

      v1.push(means[0]);
      v2.push(means[1]);
      v3.push(means[2]);
    }
    
    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'V1', data: [...v1] },
          { label: 'V2', data: [...v2] },
          { label: 'V3', data: [...v3] }
        ]
      }
    }
  }

  public applyWeights(scheda: SchedaOpis): number[] {
    const questionsWeights = this._questionService.questionWeights;
    const { totale_schede, domande: questions } = scheda;

    let d = 0;
    const V: Record<OpisGroupType, number> = {
      [OpisGroup.Group1]: 0,
      [OpisGroup.Group2]: 0,
      [OpisGroup.Group3]: 0,
    };

    if (totale_schede >= 5) {
      for (let j = 0; j < questions.length; j++) {
        const singleQuestion = questions[j];

        d = 0.0;
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
    }

    return [round(V[OpisGroup.Group1]), round(V[OpisGroup.Group2]), round(V[OpisGroup.Group3])];
  }

  public elaborateFormulaFor(opisSchedules: SchedaOpis[]): [number[], number[][]] {
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
}
