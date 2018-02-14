const api_url = "API/public/index.php/api/";

// pesi singole domande
var pesi = [];
pesi[0] = 0.7;
pesi[1] = 0.3;
pesi[2] = 0.1;
pesi[3] = 0.1;
pesi[4] = 0.3;
pesi[5] = 0.4; // [0.5]
pesi[6] = 0.4;
pesi[7] = 0.1; // [0.0]
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

    $.getJSON(api_url + "cds/" + dipartimento , function(cds) {

      var tmp = "", tmp2 = "", x = 0;

      for (x = 0; x < cds.length; x++) {
        tmp += `
        <li class="nav-item active ml" OnClick="loadResults(${cds[x].id}, ${x})">
          <a class="nav-link btn btn-success" data-toggle="tab" href="#tab${x}" role="tab" aria-controls="tab${x}" aria-selected="true">
            ${cds[x].nome} ${cds[x].classe}
          </a>
        </li>
        `;
        tmp2 += `
        <div class="tab-pane fade" id="tab${x}" role="tabpanel" aria-labelledby="tab${x}-tab">
          <br>
          <ul class="nav nav-tabs" id="tabs_${x}">
            <li class="nav-item ml">
              <a class="nav-link btn btn-success" data-toggle="tab" href="#tab${x}v1" role="tab" aria-controls="tab${x}" aria-selected="true">
                V1
              </a>
            </li>
            <li class="nav-item ml">
              <a class="nav-link btn btn-success" data-toggle="tab" href="#tab${x}v2" role="tab" aria-controls="tab${x}" aria-selected="true">
                V2
              </a>
            </li>
            <li class="nav-item ml">
              <a class="nav-link btn btn-success" data-toggle="tab" href="#tab${x}v3" role="tab" aria-controls="tab${x}" aria-selected="true">
                V3
              </a>
            </li>
          </ul>
          <div class="tab-content" id="tabs_content${x}">
            <div class="tab-pane fade" id="tab${x}v1" role="tabpanel" aria-labelledby="tab${x}v1-tab">
              <canvas id="${x}v1" style="width: 800px; height: 500px"></canvas>
            </div>
            <div class="tab-pane fade" id="tab${x}v2" role="tabpanel" aria-labelledby="tab${x}v2-tab">
              <canvas id="${x}v2" style="width: 800px; height: 500px"></canvas>
            </div>
            <div class="tab-pane fade" id="tab${x}v3" role="tabpanel" aria-labelledby="tab${x}v3-tab">
              <canvas id="${x}v3" style="width: 800px; height: 500px"></canvas>
            </div>
          </div>
        </div>
        `;
      }

      $("#tabs").html(tmp);
      $("#tabs_content").html(tmp2);
    });
}

function loadResults(id_cds, tab_position) {

  $.getJSON(api_url + "schede?cds=" + id_cds , function(data) {

    var insegnamenti = [], index = 0;

    var labels = ["V1", "V2", "V3"];

    for (let i in data) {
      insegnamenti[i] = {};

      insegnamenti[i].nome          = data[i].nome;
      insegnamenti[i].canale        = data[i].canale;
      insegnamenti[i].id_modulo     = data[i].id_modulo;
      insegnamenti[i].docente       = data[i].docente;
      insegnamenti[i].tot_schedeF   = data[i].tot_schedeF;

      insegnamenti[i].domande = [];
      insegnamenti[i].domande[0] = [];
      index = 0;

      for (let j in data[i].domande) {

        if (j % 5 == 0 && j !=0) {
          index++;
          insegnamenti[i].domande[index] = [];
        }

        insegnamenti[i].domande[index].push(data[i].domande[j]);
      }
    }

    // chartjs stuff
    var charts = [];
    var ctx = [];

    // Destroy and recreate canvas to clear (need refactoring)
    var canv = [];
    canv.push(document.getElementById(tab_position + "v1"));
    canv.push(document.getElementById(tab_position + "v2"));
    canv.push(document.getElementById(tab_position + "v3"));

    var parents = [];
    parents.push(canv[0].parentElement, canv[1].parentElement, canv[2].parentElement);

    parents[0].removeChild(canv[0]);
    parents[1].removeChild(canv[1]);
    parents[2].removeChild(canv[2]);

    var canvs = document.createElement('canvas');
    canvs.id = tab_position + "v1";
    canvs.style.width = "800px";
    canvs.style.height = "500px";
    parents[0].appendChild(canvs);

    canvs = document.createElement('canvas');
    canvs.id = tab_position + "v2";
    canvs.style.width = "800px";
    canvs.style.height = "500px";
    parents[1].appendChild(canvs);

    canvs = document.createElement('canvas');
    canvs.id = tab_position + "v3";
    canvs.style.width = "800px";
    canvs.style.height = "500px";
    parents[2].appendChild(canvs);

    canv = [];
    canv.push(document.getElementById(tab_position + "v1"));
    canv.push(document.getElementById(tab_position + "v2"));
    canv.push(document.getElementById(tab_position + "v3"));

    ctx.push(canv[0].getContext("2d"));
    ctx.push(canv[1].getContext("2d"));
    ctx.push(canv[2].getContext("2d"));

    var _options = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      responsive: false
    };

    var materie = []; // labels chartjs
    var values = []; // data chartjs
    var v1 = [], v2 = [], v3 = [];

    for (let i in insegnamenti) {

      var N = insegnamenti[i].tot_schedeF;
      var d = 0, _v1 = 0, _v2 = 0, _v3 = 0;

      materie.push(insegnamenti[i].nome);

      for (let j = 0; j < insegnamenti[i].domande.length; j++) {

        d = 0;
        d += insegnamenti[i].domande[j][0] * risposte[0]; // Decisamente no
        d += insegnamenti[i].domande[j][1] * risposte[1]; // Più no che sì
        d += insegnamenti[i].domande[j][2] * risposte[2]; // Più sì che no
        d += insegnamenti[i].domande[j][3] * risposte[3]; // Decisamente sì

        if (j == 0 || j == 1)                           // V1 domande: 1,2
          _v1 += (d/N) * pesi[j%12];
        else if (j == 3 || j == 4 || j == 8 || j == 9)  // V2 domande: 4,5,9,10
          _v2 += (d/N) * pesi[j%12];
        else if (j == 2 || j == 5 || j == 6)            // V3 domande: 3,6,7
          _v3 += (d/N) * pesi[j%12];
      }

      v1.push(_v1.toFixed(2));
      v2.push(_v2.toFixed(2));
      v3.push(_v3.toFixed(2));
    }

    values.push(v1, v2, v3);

    // Need to fix this "infinity" value
    for (var x in values[0])
      if (!isFinite(values[0][x]))
        values[0][x] = 0;

    console.log(values[0]);

    for (let c in ctx) {
      // chartjs data
      _data = {
        labels: materie,
        datasets: [{
          label: labels[c],
          data: values[c],
          backgroundColor: '#28a745',
          // borderColor: 'red',
          borderWidth: 1
        }]
      };

      charts.push(new Chart(ctx[c], {
          type: 'horizontalBar',
          data: _data,
          options: _options
      }));

    }


  });

}
