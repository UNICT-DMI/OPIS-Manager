import { Component, OnInit } from '@angular/core';
import { WeightService } from '../weight.service';
import { Options } from 'ng5-slider';
import { AuthService } from '../auth.service';
import { Domanda } from '../api.model';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
})
export class FormulaComponent implements OnInit {

  public questionsWeights: Domanda[];
  public answersWeights: number[];
  public isLogged = false;

  constructor(
    public readonly weightService: WeightService,
    public readonly authService: AuthService,
  ) { }


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

  ngOnInit(): void {
    this.isLogged = this.authService.authTokenIsPresent();
    this.answersWeights = this.weightService.getAnswersWeights();
    const temp = setInterval(() => {
      this.questionsWeights = this.weightService.getQuestionsWeights();
      if (this.questionsWeights != null) {
        clearInterval(temp);
      }
    }, 1000);
  }

  // TODO: refactor / remove or use Output()
  public switchV(v: number): void {
    this.selectedV = v;
  }

  public changeVWeights(): void {
    if (this.getGroupWeight('V1') !== 1) {
      alert('La somma di V1 è diversa da 1');
    } else if (this.getGroupWeight('V2') !== 1) {
      alert('La somma di V2 è diversa da 1');
    } else if (this.getGroupWeight('V3') !== 1) {
      alert('La somma di V3 è diversa da 1');
    } else {
      this.weightService.updateQuestionsWeights().subscribe(
        data => alert('Pesi aggiornati correttamente!'),
        err => {
          alert('Errore nell\'aggiornare i pesi');
          console.log(err);
        }
      );
    }
  }

  private getGroupWeight(group: string): number {
    return this.questionsWeights.filter(domanda => domanda.gruppo === group)
      .map(domanda => domanda.peso_standard)
      .reduce((acc, val) => acc + val);
  }

  public changeAnswersWeights(): void {
    // save in DB
  }
}
