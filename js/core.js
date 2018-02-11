const api_url = "API/public/index.php/api/";

// pesi singole domande
var pesi = [];
pesi[0] = 0.7;
pesi[1] = 0.3;
pesi[2] = 0.1;
pesi[3] = 0.1;
pesi[4] = 0.3;
pesi[5] = 0.4;
pesi[6] = 0.4;
pesi[7] = 0.1;
pesi[8] = 0.3;
pesi[9] = 0.3;
pesi[10] = 0.3;
pesi[11] = 0;   // questa domanda non viene considerata

// pesi risposte
var risposte = [];
risposte[0] = 1;  // Decisamente no
risposte[1] = 4;  // Più no che sì
risposte[2] = 7;  // Più sì che no
risposte[3] = 10; // Decisamente sì

$(document).ready(function() {

  $.getJSON(api_url + "dipartimento", function(data) {

    var dip = $("#dipartimenti");

    for (var i in data)
      dip.append(new Option(data[i].nome, data[i].id));

  });

});

function showCds(dipartimento) {

    $.getJSON(api_url + "cds/" + dipartimento , function(data) {

      var tmp = "", tmp2 = "", x = 0;
      tmp  += '<li class="nav-item active" OnClick="loadResults(' + data[x].id + ')"><a class="nav-link" data-toggle="tab" href="#tab' + x + '" role="tab" aria-controls="tab' + x + '" aria-selected="true">' + data[x].nome + ' ' + data[x].classe + '</a></li>';
      tmp2 += '<div class="tab-pane fade active" id="tab' + x + '" role="tabpanel" aria-labelledby="tab' + x + '-tab">tab' + x + '</div>';

      for (x = 1; x < data.length; x++) {
        tmp  += '<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#tab' + x + '" role="tab" aria-controls="tab' + x + '" aria-selected="false">' + data[x].nome + ' ' + data[x].classe + '</a></li>';
        tmp2 += '<div class="tab-pane fade" id="tab' + x + '" role="tabpanel" aria-labelledby="tab' + x + '-tab">tab' + x + '</div>';
      }

      $("#myTab").html(tmp);
      $("#myTabContent").html(tmp2);
    });
}

function loadResults(cds) {

  $.getJSON(api_url + "schede?cds=" + cds , function(data) {

    var insegnamenti = [], index = 0;

    for (var i in data) {
      insegnamenti[i] = {};

      insegnamenti[i].nome          = data[i].nome;
      insegnamenti[i].canale        = data[i].canale;
      insegnamenti[i].id_modulo     = data[i].id_modulo;
      insegnamenti[i].docente       = data[i].docente;
      insegnamenti[i].tot_schedeF   = data[i].tot_schedeF;

      insegnamenti[i].domande = [];
      insegnamenti[i].domande[0] = [];
      index = 0;

      for (var j in data[i].domande) {

        if (j % 5 == 0 && j !=0) {
          index++;
          insegnamenti[i].domande[index] = [];
        }

        insegnamenti[i].domande[index].push(data[i].domande[j]);
      }
    }

    var N = insegnamenti[0].tot_schedeF;
    var d = 0, v1 = 0;

    for (var i = 0; i < insegnamenti[0].domande.length; i++) {

      d = 0;
      d += insegnamenti[0].domande[i][0] * risposte[0]; // Decisamente no
      d += insegnamenti[0].domande[i][1] * risposte[1]; // Più no che sì
      d += insegnamenti[0].domande[i][2] * risposte[2]; // Più sì che no
      d += insegnamenti[0].domande[i][3] * risposte[3]; // Decisamente sì

      // V1
      if (i == 0 || i == 1)
        v1 += (d/N) * pesi[i%12];

    }

    console.log(v1.toFixed(2));

  });

}
