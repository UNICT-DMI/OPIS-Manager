import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  public round(v: number, padding = 2): number {
    const pad = parseInt(1 + '0'.repeat(padding), 2);
    return Math.round(v * pad) / pad;
  }

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

  public elaborateFormula(insegnamenti: []): [number[], string[][]] {
    const v1 = [];
    const v2 = [];
    const v3 = [];

    for (const i of Object.keys(insegnamenti)) {
      const [V1, V2, V3] = this.applyWeights(insegnamenti[i]);

      v1.push(V1);
      v2.push(V2);
      v3.push(V3);
    }

    const means = [0.0, 0.0, 0.0];

    for (const x of Object.keys(v1)) {
      means[0] += parseFloat(v1[x]);
      means[1] += parseFloat(v2[x]);
      means[2] += parseFloat(v3[x]);
    }
    means[0] = means[0] / v1.length;
    means[1] = means[1] / v2.length;
    means[2] = means[2] / v3.length;

    return [means, [v1, v2, v3]];
  }

  public parseSchede(schede, subject: string = null): any[] {
    const insegnamenti: any = [];

    for (let i = 0; i < schede.length; i++) {

      if (schede[i].tot_schedeF < 6) { continue; }
      if (subject != null && schede[i].nome.toUpperCase().indexOf(subject.toUpperCase()) === -1) { continue; }

      insegnamenti[i] = {};
      insegnamenti[i].nome = schede[i].nome;
      insegnamenti[i].nome_completo = schede[i].nome;
      insegnamenti[i].anno = schede[i].anno;

      if (insegnamenti[i].nome.length > 35) {
        insegnamenti[i].nome = insegnamenti[i].nome.substring(0, 35) + '... ';
        insegnamenti[i].nome += insegnamenti[i].nome.substring(insegnamenti[i].nome.length - 5, insegnamenti[i].nome.length);
      }

      if (schede[i].canale.indexOf('no') === -1) {
        insegnamenti[i].nome += ' (' + schede[i].canale + ')';
        insegnamenti[i].nome_completo += ' (' + schede[i].canale + ')';
      }

      if (schede[i].id_modulo.length > 3 && schede[i].id_modulo !== '0') {
        insegnamenti[i].nome += ' (' + schede[i].id_modulo + ')';
        insegnamenti[i].nome_completo += ' (' + schede[i].id_modulo + ')';
      }

      insegnamenti[i].nome += ' - ' + schede[i].tot_schedeF;
      insegnamenti[i].nome_completo += ' - ' + schede[i].tot_schedeF;
      insegnamenti[i].canale = schede[i].canale;
      insegnamenti[i].id_modulo = schede[i].id_modulo;
      insegnamenti[i].docente = schede[i].docente;
      insegnamenti[i].tot_schedeF = schede[i].tot_schedeF;

      insegnamenti[i].domande = [];
      insegnamenti[i].domande[0] = [];

      let index = 0;
      for (let j = 0; j < schede[i].domande.length; j++) {
        if (j % 5 === 0 && j !== 0) {
          index++;
          insegnamenti[i].domande[index] = [];
        }

        insegnamenti[i].domande[index].push(schede[i].domande[j]);
      }
    }

    return insegnamenti.filter((el) => el != null); // remove empty slot
  }

}
