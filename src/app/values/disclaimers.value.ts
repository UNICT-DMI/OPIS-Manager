import { DisclaimerInfo } from "@interfaces/graph-config.interface";

export const OpisGroup_Disclaimers: DisclaimerInfo[] = [
  {
    title: "V1 – Come lo studente vede il corso",
    description: `
      <p>Il punteggio è calcolato sulla base di <strong>2 domande</strong> con i seguenti pesi:</p>
      <table class="opis-table--groups">
        <thead>
          <tr>
            <th>Domanda</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>[1]</strong> Le conoscenze preliminari possedute sono risultate sufficienti per la comprensione degli argomenti previsti nel programma d'esame?</td>
            <td>0.7</td>
          </tr>
          <tr>
            <td><strong>[2]</strong> Il carico di studio dell'insegnamento è proporzionato ai crediti assegnati?</td>
            <td>0.3</td>
          </tr>
        </tbody>
      </table>
    `,
    type: "info",
    icon: "info",
    isAccordion: true,
    isOpen: false
  },
  {
    title: "V2 – Come lo studente vede il docente",
    description: `
      <p>Il punteggio è calcolato sulla base di <strong>4 domande</strong> con i seguenti pesi:</p>
      <table class="opis-table--groups">
        <thead>
          <tr>
            <th>Domanda</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>[4]</strong> Le modalità di esame sono state definite in modo chiaro?</td>
            <td>0.1</td>
          </tr>
          <tr>
            <td><strong>[5]</strong> Gli orari di svolgimento di lezioni, esercitazioni e altre eventuali attività didattiche sono rispettati?</td>
            <td>0.3</td>
          </tr>
          <tr>
            <td><strong>[9]</strong> L'insegnamento è stato svolto in maniera coerente con quanto dichiarato sul sito web del corso di studio?</td>
            <td>0.3</td>
          </tr>
          <tr>
            <td><strong>[10]</strong> Il docente è reperibile per chiarimenti e spiegazioni?</td>
            <td>0.3</td>
          </tr>
        </tbody>
      </table>
    `,
    type: "info",
    icon: "info",
    isAccordion: true,
    isOpen: false
  },
  {
    title: "V3 – Come il docente interagisce con lo studente",
    description: `
      <p>Il punteggio è calcolato sulla base di <strong>3 domande</strong> con i seguenti pesi:</p>
      <table class="opis-table--groups">
        <thead>
          <tr>
            <th>Domanda</th>
            <th>Peso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>[3]</strong> Il materiale didattico (indicato e disponibile) è adeguato per lo studio della materia?</td>
            <td>0.1</td>
          </tr>
          <tr>
            <td><strong>[6]</strong> Il docente stimola/motiva l'interesse verso la disciplina?</td>
            <td>0.5</td>
          </tr>
          <tr>
            <td><strong>[7]</strong> Il docente espone gli argomenti in modo chiaro?</td>
            <td>0.4</td>
          </tr>
        </tbody>
      </table>
    `,
    type: "info",
    icon: "info",
    isAccordion: true,
    isOpen: false
  }
];