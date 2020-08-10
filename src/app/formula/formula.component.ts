import { Component } from '@angular/core';
import { WeightService } from '../weight.service';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
})
export class FormulaComponent {

  public questionsWeights: number[];
  public answersWeights: number[];
  public isAdmin = false;


  constructor(
    public readonly weightService: WeightService,
  ) {
    this.questionsWeights = weightService.getQuestionsWeights();
    this.answersWeights = weightService.getAnswersWeights();
  }

  public answerSliderOptions: Options = {
    floor: 1,
    ceil: 10,
    step: 1,
    minLimit: 0,
    maxLimit: 10,
    showTicks: true,
  };

  public questionSliderOptions: Options = {
    floor: 0,
    ceil: 1,
    step: 0.1,
    minLimit: 0.1,
    maxLimit: 0.9,
    showTicks: true,
  };

  selectedV = 1;

  paragraphContent = `
  Il numero $D_j = \\frac{1}{N} \\sum_{i=1}^{4} X_{ij}  E_i  p_j $ rappresenta\
  la valutazione pesata relativa alla domanda $ D_j $ secondo il peso $ p_j $.
  $ \\newline $
  $ \\ $
  $ \\newline $
  I pesi sono numeri compresi tra zero e uno e vengono assegnati – all'interno di\
  un singolo gruppo di domande – in modo che la loro somma sia pari ad uno.
  La valutazione complessiva del corso – relativamente al gruppo di domande considerato\
   – si ottiene sommando le valutazioni ottenute secondo la formula
  $$ V = \\frac{1}{N} \\sum_{j=1}^{n} \\sum_{i=1}^{4} X_{ij} E_i p_j $$
  `;

  // TODO: refactor / remove or use Output()
  public switchV(v: number): void {
    this.selectedV = v;
  }

  public changeVWeights(): void {
    if (this.questionsWeights[0] + this.questionsWeights[1] !== 1) {
      alert('La somma di V1 è diversa da 1');
    } else if (this.questionsWeights[3] + this.questionsWeights[4] + this.questionsWeights[8] + this.questionsWeights[9] !== 1) {
      alert('La somma di V2 è diversa da 1');
    } else if (this.questionsWeights[2] + this.questionsWeights[5] + this.questionsWeights[6] !== 1) {
      alert('La somma di V3 è diversa da 1');
    } else {
      // save in DB
    }
  }

  public changeAnswersWeights(): void {
    // save in DB
  }
}
