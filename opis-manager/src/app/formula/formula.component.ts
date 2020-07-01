import { Component } from '@angular/core';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss']
})
export class FormulaComponent {
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
}
