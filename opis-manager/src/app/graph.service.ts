import { Injectable } from '@angular/core';
import { WeightService } from './weight.service';
import { Teaching, SchedaOpis } from './api.model';
import { mean } from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  constructor(
    private readonly weightService: WeightService,
  ) { }

  public round(v: number, padding = 2): number {
    const pad = parseInt(1 + '0'.repeat(padding), 2);
    return Math.round(v * pad) / pad;
  }

  public elaborateFormula(schedeOpis: SchedaOpis[]): [number[], number[][]] {
    const v1: number[] = [];
    const v2: number[] = [];
    const v3: number[] = [];

    for (const schedaOpis of schedeOpis) {
      const [V1, V2, V3] = this.applyWeights(schedaOpis);
      v1.push(V1);
      v2.push(V2);
      v3.push(V3);
    }

    const means = [mean(v1), mean(v2), mean(v3)];
    return [means, [v1, v2, v3]];
  }

  public applyWeights(scheda: SchedaOpis): number[] {

    const questionsWeights = this.weightService.getQuestionsWeights();
    const answersWeights = this.weightService.getAnswersWeights();

    const N = scheda.totale_schede;
    let d = 0;
    let V1 = 0;
    let V2 = 0;
    let V3 = 0;

    scheda.domande = JSON.parse(scheda.domande);
    const domandeConv: number[][] = [];
    for (const i in scheda.domande) {
      if (scheda.domande[i] === 'u00a0') {
        continue;
      }
      const array: number[] = [];
      for (let j = 0; j < 4; j++) {
        array.push(parseInt(scheda.domande[i], 10));
      }
      domandeConv.push(array);
    }
    scheda.domande = domandeConv;

    if (N > 5) {

      for (let j = 0; j < scheda.domande.length; j++) {

        d = 0.0;
        d += scheda.domande[j][0] * answersWeights[0];   // Decisamente no
        d += scheda.domande[j][1] * answersWeights[1];   // Più no che sì
        d += scheda.domande[j][2] * answersWeights[2];   // Più sì che no
        d += scheda.domande[j][3] * answersWeights[3];   // Decisamente sì

        if (j === 0 || j === 1) {                                 // V1 domande: 1,2
          V1 += ((d / N) * questionsWeights[j]);
        } else if (j === 3 || j === 4 || j === 8 || j === 9) {    // V2 domande: 4,5,9,10
          V2 += (d / N) * questionsWeights[j];
        } else if (j === 2 || j === 5 || j === 6) {               // V3 domande: 3,6,7
          V3 += (d / N) * questionsWeights[j];
        }
      }

    }

    return [parseFloat(V1.toFixed(2)), parseFloat(V2.toFixed(2)), parseFloat(V3.toFixed(2))];
  }

  public parseInsegnamentoSchede(schede, subject: string = null): any[] {
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
      insegnamenti[i].tot_schedeNF = schede[i].tot_schedeNF;

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
