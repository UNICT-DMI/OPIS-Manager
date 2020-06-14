import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor() { }

  public applyWeights(vals): string[] {
    // pesi singole domande
    const weights = [
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

    // pesi risposte
    const risposte = [
      1,   // Decisamente no
      4,   // Più no che sì
      7,   // Più sì che no
      10,  // Decisamente sì
    ];

    const N = vals.tot_schedeF;
    let d = 0;
    let V1 = 0;
    let V2 = 0;
    let V3 = 0;

    if (N > 5) {

      for (let j = 0; j < vals.domande.length; j++) {

        d = 0.0;
        d += vals.domande[j][0] * risposte[0];   // Decisamente no
        d += vals.domande[j][1] * risposte[1];   // Più no che sì
        d += vals.domande[j][2] * risposte[2];   // Più sì che no
        d += vals.domande[j][3] * risposte[3];   // Decisamente sì

        if (j === 0 || j === 1) {                                 // V1 domande: 1,2
          V1 += ((d / N) * weights[j]);
        } else if (j === 3 || j === 4 || j === 8 || j === 9) {    // V2 domande: 4,5,9,10
          V2 += (d / N) * weights[j];
        } else if (j === 2 || j === 5 || j === 6) {               // V3 domande: 3,6,7
          V3 += (d / N) * weights[j];
        }
      }

    }

    return [V1.toFixed(2), V2.toFixed(2), V3.toFixed(2)];
  }

  public round(v: number, padding = 2): number {
    const pad = parseInt(1 + '0'.repeat(padding), 2);
    return Math.round(v * pad) / pad;
  }

}
