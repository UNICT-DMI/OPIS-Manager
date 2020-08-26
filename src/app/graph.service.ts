import { Injectable, OnInit } from '@angular/core';
import { WeightService } from './weight.service';
import { Teaching, Domanda } from './api.model';
import { mean } from 'mathjs';
import { TeachingSummary, SchedaOpis } from './utils.model';

@Injectable({
  providedIn: 'root'
})
export class GraphService {


  constructor(
    private readonly weightService: WeightService,
  ) { }

  public round(v: number, padding = 2): number {
    const pad = parseInt(1 + '0'.repeat(padding), 10);
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

    const means = [this.round(mean(v1)), this.round(mean(v2)), this.round(mean(v3))];
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

    if (N >= 5) {

      for (let j = 0; j < scheda.domande.length; j++) {

        d = 0.0;
        d += scheda.domande[j][0] * answersWeights[0];   // Decisamente no
        d += scheda.domande[j][1] * answersWeights[1];   // Più no che sì
        d += scheda.domande[j][2] * answersWeights[2];   // Più sì che no
        d += scheda.domande[j][3] * answersWeights[3];   // Decisamente sì

        const domanda = questionsWeights.filter(question => question.id === j + 1)[0];
        if (domanda.gruppo === 'V1') {
          V1 += (d / N) * domanda.peso_standard;
        } else if (domanda.gruppo === 'V2') {
          V2 += (d / N) * domanda.peso_standard;
        } else if (domanda.gruppo === 'V3') {
          V3 += (d / N) * domanda.peso_standard;
        }
      }

    }

    return [this.round(V1), this.round(V2), this.round(V3)];
  }

  public parseInsegnamentoSchede(insegnamenti: Teaching[], subjectToSearch?: string): TeachingSummary[] {
    const insegnamentiVal: TeachingSummary[] = [];
    for (let i = 0; i < insegnamenti.length; i++) {

      if (insegnamenti[i].schedeopis == null) { continue; }
      if (subjectToSearch != null && insegnamenti[i].nome.toUpperCase().indexOf(subjectToSearch.toUpperCase()) === -1) { continue; }

      insegnamentiVal[i] = {} as TeachingSummary;
      insegnamentiVal[i].nome = insegnamenti[i].nome;
      insegnamentiVal[i].nome_completo = insegnamenti[i].nome;

      if (insegnamentiVal[i].nome.length > 35) {
        insegnamentiVal[i].nome = insegnamentiVal[i].nome.substring(0, 35) + '... ';
      }


      if (insegnamenti[i].id_modulo !== 0 && insegnamenti[i].nome_modulo != null) {
        insegnamentiVal[i].nome += ' - ' + insegnamenti[i].nome_modulo;
        insegnamentiVal[i].nome_completo += ' -' + insegnamenti[i].nome_modulo;
      }

      if (insegnamenti[i].canale !== 'no') {
        insegnamentiVal[i].nome += ' (' + insegnamenti[i].canale + ')';
        insegnamentiVal[i].nome_completo += ' (' + insegnamenti[i].canale + ')';
      }

      // insegnamentiVal[i].nome += ' - ' + insegnamenti[i].schedeopis.totale_schede;
      insegnamentiVal[i].nome_completo += ' - ' + insegnamenti[i].schedeopis.totale_schede;

      insegnamentiVal[i].anno = insegnamenti[i].anno;
      insegnamentiVal[i].canale = insegnamenti[i].canale;
      insegnamentiVal[i].id_modulo = insegnamenti[i].id_modulo;
      insegnamentiVal[i].nome_modulo = insegnamenti[i].nome_modulo;
      insegnamentiVal[i].docente = insegnamenti[i].docente;
      insegnamentiVal[i].tot_schedeF = insegnamenti[i].schedeopis.totale_schede;
      insegnamentiVal[i].tot_schedeNF = insegnamenti[i].schedeopis.totale_schede_nf;

      insegnamentiVal[i].domande = insegnamenti[i].schedeopis.domande;
      /*insegnamentiVal[i].domande[0] = [];

      let index = 0;
      for (let j = 0; j < insegnamenti[i].domande.length; j++) {
        if (j % 5 === 0 && j !== 0) {
          index++;
          insegnamentiVal[i].domande[index] = [];
        }

        insegnamentiVal[i].domande[index].push(insegnamenti[i].domande[j]);
      }*/
    }

    return insegnamentiVal.filter((el) => el != null); // remove empty slot
  }

}
