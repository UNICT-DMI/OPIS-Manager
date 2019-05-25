// enable tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

const api_url = "https://localhost/OPIS-Managers/OPIS-Manager/API/public/index.php/api/";


let normalize = false;
let selectedCDSTabPosition = 0;

// pesi singole domande
let pesi = [];
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
let risposte = [];
risposte[0] = 1;  // Decisamente no
risposte[1] = 4;  // Più no che sì
risposte[2] = 7;  // Più sì che no
risposte[3] = 10; // Decisamente sì

let optionsForSelectFromYears = `<option>--</option>
<option data-pos="0">2013/2014</option>
<option data-pos="1">2014/2015</option>
<option data-pos="2">2015/2016</option>
<option data-pos="3">2016/2017</option>
<option data-pos="4">2017/2018</option>`;

let yearsArray = ["2013/2014", "2014/2015","2015/2016","2016/2017","2017/2018"];
let lastTeachingResults = []; // per ogni insegnamento ha anno, v1 e v2


$(document).ready(function() {
  $.getJSON(api_url + "dipartimento", function(data) {
    let dip = $("#dipartimenti");
    for (let i in data) {
      dip.append(new Option(data[i].nome, data[i].id));
    }
  });
    
});

function getSwitcherVal() {
    let selected = 0;
    $(".segmented label  input[type=radio]").each(function(){
        if($(this).parent().attr("class") == "checked"){
            selected = $(this).attr("data-val");
        }
    });
    return selected;
}

function resetValutations(tab_position) {
    let x =  tab_position;
    let tmp = `<div class="tab-pane fade" id="tab${x}v1" role="tabpanel" aria-labelledby="tab${x}v1-tab">
              <br>
              <h2>Come lo studente vede il corso</h2>
              <canvas id="${x}v1" style="width: 800px; height: 500px"></canvas>
            </div>
            <div class="tab-pane fade" id="tab${x}v2" role="tabpanel" aria-labelledby="tab${x}v2-tab">
              <br>
              <h2>Come lo studente vede il docente</h2>
              <canvas id="${x}v2" style="width: 800px; height: 500px"></canvas>
            </div>
            <div class="tab-pane fade" id="tab${x}v3" role="tabpanel" aria-labelledby="tab${x}v3-tab">
              <br>
              <h2>Come il docente interagisce con lo studente</h2>
              <canvas id="${x}v3" style="width: 800px; height: 500px"></canvas>
            </div>`;
    $("#tabs_content"+tab_position).html(tmp);
}

function unSetValutationsTab(tab_position) {
    for(let i = 1; i< 4;i++) {
        let v = $('#tabs_' + tab_position + ' a[href="#tab' + tab_position + 'v'+i+'"]');
        let className = v.attr("class");
        className.replace("active","");
        className = className.replace("active","");
        v.attr("class",className);
    }
}

function switcherObserver() {
     $(".segmented label input[type=radio]").each(function(){
        $(this).on("change", function(){
            let id_cds = $(".segmented").attr("data-id_cds");
            let tab_position = $(".segmented").attr("data-tab_position");
            let selectedPos = $("#tabs li").eq(tab_position).attr("data-select");
            let selectedSwitcherVal = $("#tabs li").eq(tab_position).attr("data-switcher");
            let switcherVal = $(this).attr("data-val");
            
            if(selectedSwitcherVal != switcherVal) selectedPos = "";
            if( switcherVal ==  0){
                createSelectFromYears(id_cds,tab_position,selectedPos)
            }
            else if(switcherVal == 1){
                createSelectFromTeachings(id_cds,tab_position,selectedPos); 
            }
            
            if($(this).is(":checked")){
               $(this).parent().siblings().each(function(){
                    $(this).removeClass("checked");
                });
                $(this).parent().addClass("checked");
                
            }
        });
    });
}


function createSelectFromTeachings(id_cds,tab_position,savedSelectVal){
     $.getJSON(api_url + "insegnamento/" + id_cds, function(ins) {
        let cont = $("#dynamicSelectContainer");
        let html = '<select id="dynamicSelect" style = "width:450px;" class="btn btn-success" OnChange=" loadResults('+id_cds+','+tab_position+',this)">';
        html += '<option>--</option>';   
        //questo riempie la select con gli insegnamenti relativi al corso di studi
         for (let i = 0; i< ins.length; i++){
             if(ins[i].canale == "no")  html += '<option data-pos = '+i+' data-id_ins = '+ins[i].id+' >'+ins[i].nome+'</option>';
             else html += '<option data-pos ='+i+' data-id_ins = '+ins[i].id+' data-canale="'+ins[i].canale+'">' + ins[i].nome + ' ('+ins[i].canale+')</option>';
         }
        html += '</select>';
        cont.html(html);
        $("#dynamicSelect > option").each(function(){
            if($(this).attr("data-pos") == savedSelectVal){
                $(this).attr("selected",true);
            }
        });    
     }); //chiudo chiamata get
}

function createSelectFromYears(id_cds,tab_position,savedSelectVal){
    //questa si può migliorare facendo una query che scarica gli anni piuttosto che fissarli qui come stringa in optionsForSelectFromYears
    let cont = $("#dynamicSelectContainer");
    let html = '<select id="dynamicSelect" style = "width:450px;" class="btn btn-success" OnChange=" loadResults('+id_cds+','+tab_position+',this,false)")">';
    html += optionsForSelectFromYears;
    html += '</select>';       
    cont.html(html);
    $("#dynamicSelect > option").each(function(){
        if($(this).attr("data-pos") == savedSelectVal){
            $(this).attr("selected",true);
        }
    });
}


function showSwitcherAndSelect(id_cds, tab_position){
    selectedCDSTabPosition = tab_position;
    let savedSelectVal = $("#tabs li").eq(tab_position).attr("data-select");
    let savedSwitcherVal = $("#tabs li").eq(tab_position).attr("data-switcher");
    let savedNormVal = $("#tabs li").eq(tab_position).attr("data-normalized");
    console.log("normalizzato = ", savedNormVal);
    if(savedNormVal == "true"){
        //check
        normalize = true;
        $("#normcheckbox input").prop("checked",true);
    }
    else{
        //uncheck
         normalize = false;
        $("#normcheckbox input").prop("checked",false);
    }
    let cont = $(".container-switcher");
    let html = '<div class="segmented" data-id_cds ='+id_cds+' data-tab_position = '+tab_position+'>';
    if (savedSwitcherVal == 0) {
         html+= '<label class="checked"><input type="radio"  name="segmented" data-val="0" checked />Anno accademico</label><label><input type="radio"  name="segmented" data-val= "1" />Insegnamento</label>';
    }
    else if(savedSwitcherVal == 1){
          html+= '<label class=""><input type="radio"  name="segmented" data-val="0"  />Anno accademico</label><label class="checked"><input type="radio"  name="segmented" data-val= "1" checked />Insegnamento</label>';
    }
    html += '</div>';
    cont.html(html);
    switcherObserver();
    
    if(savedSwitcherVal == 0) {
        $("#normcheckbox").show();
        createSelectFromYears(id_cds,tab_position,savedSelectVal);
    }
    else{
         $("#normcheckbox").hide();
        createSelectFromTeachings(id_cds, tab_position,savedSelectVal);
    }

}


 
function showCds(dipartimento) {
    console.log("showCDS");
    $("#normcheckbox").hide();
    $(".container-switcher").html("");
    $("#dynamicSelectContainer").html("");

    $.getJSON(api_url + "cds/" + dipartimento , function(cds) {
      let tmp = "";
      for (let x = 0; x < cds.length; x++) {
        tmp += `
        <li data-normalized = "false" data-idCds = "${cds[x].id}" class="nav-item active tabs_button" data-switcher="0" data-select = "--" >
          <a  class="nav-link btn btn-success" data-toggle="tab" href="#tab${x}" role="tab" aria-controls="tab${x}" aria-selected="true" OnClick="showSwitcherAndSelect(${cds[x].id}, ${x})">
            ${cds[x].nome} ${cds[x].classe}
          </a>
        </li>
        `;  
          showValutations(cds);
      }
      $("#tabs").html(tmp); 
    });
}

function showValutations(cds){
    let tmp = "";
    for (let x in cds){
    tmp += `
        <div class="tab-pane fade" id="tab${x}" role="tabpanel" aria-labelledby="tab${x}-tab">
          <br>
          <ul class="nav nav-tabs" id="tabs_${x}">
            <li class="nav-item tabs_button">
              <a class="nav-link btn btn-success" data-toggle="tab" href="#tab${x}v1" role="tab" aria-controls="tab${x}" aria-selected="true">
                V1
              </a>
            </li>
            <li class="nav-item tabs_button">
              <a class="nav-link btn btn-success" data-toggle="tab" href="#tab${x}v2" role="tab" aria-controls="tab${x}" aria-selected="true">
                V2
              </a>
            </li>
            <li class="nav-item tabs_button">
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
    $("#tabs_content").html(tmp); 
    $('[data-togglex="tooltip"]').tooltip(); 
}


function loadResults(id_cds, tab_position, dynamicSelect, norm) {
    //elimino i valori scaricati attualmente
    if (!norm) resetValutations(tab_position);

    let nowSwitcherVal = getSwitcherVal();
    let dsVal = $(dynamicSelect).val();
    let dsPos = $("#dynamicSelect option:selected").attr("data-pos")

    $("#tabs li").eq(tab_position).attr("data-switcher",nowSwitcherVal);
    $("#tabs li").eq(tab_position).attr("data-select",dsPos);

    if (nowSwitcherVal == 0) { // query per anno
        getDataForYear(id_cds, tab_position, dsVal,norm);
    }  
    else{  // query insegnamento 
        console.log("query insegnamento");
        getDataForTeaching(id_cds,tab_position,dynamicSelect);
      
    }                                      
}

function showTeachingChart(){
    console.log("SHOWCHARTS");

    $("#normcheckbox").hide();
    let charts = [];
    unSetValutationsTab(selectedCDSTabPosition);
    let matr = [];
    matr[0] = [];
    matr[1] = [];
    matr[2] = [];

    console.log(lastTeachingResults);

    let j = 0;
    for (let i in yearsArray) {
        let val1 = 0 ,val2 = 0, val3 = 0;

        console.log(yearsArray[i]);

        if (j < lastTeachingResults.length && yearsArray[i] == lastTeachingResults[j].anno) {
            val1 = Math.round(lastTeachingResults[j].v1 * 100) / 100;
            val2 = Math.round(lastTeachingResults[j].v2 * 100) / 100;
            val3 = Math.round(lastTeachingResults[j].v3 * 100) / 100;
            j++;
        }
        matr[0].push(val1);
        matr[1].push(val2);
        matr[2].push(val3);
    }

    if (j != 0) console.log("esistono elementi");

    //configuro grafici
    for (let i = 1; i< 4 ; i++) {
      let config = {
        type: 'line',
        data: {
          labels: yearsArray,
          datasets: [{
            label: 'V'+i,
            fill: false,
            backgroundColor: "#28a745",
            borderColor: "#28a745",
            data: matr[i-1],
          }]
        },
        options: {
          // maintainAspectRatio: false,
          responsive: true,
          title: {
            display: true,
            text: $("#dynamicSelect option:selected").val() + ' V'+i
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Anno accademico'
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'V'+i
              }
            }]
          }
        }
      };

      console.log("innerhtml del grafico")

      $("#tab"+selectedCDSTabPosition+"v"+i).html("<div style = 'width:70%;height:70%;'><canvas id='yearsChart"+selectedCDSTabPosition+"V"+i+"'></canvas></div>");
      let ctx = document.getElementById('yearsChart'+selectedCDSTabPosition+'V'+i).getContext('2d');
      charts.push(new Chart(ctx, config));
    }
    $('#tabs_' +selectedCDSTabPosition+ ' a[href="#tab'+selectedCDSTabPosition+ 'v1"]').tab('show');        
}



function getDataForTeaching(id_cds, tab_position, dynamicSelect){
    let id_ins = $("#dynamicSelect option:selected").attr("data-id_ins");
    let canale = $("#dynamicSelect option:selected").attr("data-canale");    
    if (canale == undefined || canale == "") canale = "no";
    //ti prendi la option selezionata prendi i valori nel data- della option e lanci la richiesta get

    $.getJSON(api_url + "schedeInsegnamento?id_ins="+id_ins+"&canale="+canale, function (data) {

        let anni_accademici = [];
        for (let i in data) {

            anni_accademici[i] = {};
            anni_accademici[i].v1 = 0;
            anni_accademici[i].v2 = 0;
            anni_accademici[i].v3 = 0;
            anni_accademici[i].anno = data[i].anno_accademico;

            let valori = [];
            valori.tot_schedeF   = data[i].totale_schede;
            valori.domande = [];

            valori.domande[i] = [];
            let index = 0;    
            for (let j in data[i].domande) {
                if (j % 5 == 0 && j !=0) {
                    index++;
                    console.log("accedo a indixe"+ index);
                    valori.domande[index] = [];
                }

                if (valori.domande[index] == undefined) valori.domande[index] = [];

                valori.domande[index].push(data[i].domande[j]);
            }


            let N = valori.tot_schedeF;
            let d = 0, _v1 = 0, _v2 = 0, _v3 = 0;
            if (N > 5) {
                for (let j = 0; j < valori.domande.length; j++) {
                  d = 0;
                  d += valori.domande[j][0] * risposte[0]; // Decisamente no
                  d += valori.domande[j][1] * risposte[1]; // Più no che sì
                  d += valori.domande[j][2] * risposte[2]; // Più sì che no
                  d += valori.domande[j][3] * risposte[3]; // Decisamente sì

                  if (j == 0 || j == 1)                           // V1 domande: 1,2
                    _v1 += ((d/N) * pesi[j%12]);
                  else if (j == 3 || j == 4 || j == 8 || j == 9)  // V2 domande: 4,5,9,10
                    _v2 += (d/N) * pesi[j%12];
                  else if (j == 2 || j == 5 || j == 6)            // V3 domande: 3,6,7
                    _v3 += (d/N) * pesi[j%12];

                }
              }
            //abbiamo v1 v2 e v3
            console.log("v1",_v1);
            console.log("v2",_v2);
            console.log("v3",_v3);
            anni_accademici[i].v1 = _v1
            anni_accademici[i].v2 = _v2
            anni_accademici[i].v3 = _v3
            
        }
        lastTeachingResults = anni_accademici;
        showTeachingChart();
        
    })
}


function getDataForYear(id_cds, tab_position, dynamicSelectVal, norm) {
    $("#normcheckbox").show();
    if(!norm)  unSetValutationsTab(tab_position);
    
  $.getJSON(api_url + "schede?cds=" + id_cds + "&anno_accademico="+ dynamicSelectVal , function(data) {

    let insegnamenti = [], index = 0;

    let labels = ["V1", "V2", "V3"];

    for (let i in data) {

      if (data[i].tot_schedeF < 6) continue;

      insegnamenti[i] = {};

      insegnamenti[i].nome = data[i].nome;

      if (insegnamenti[i].nome.length > 35)
        insegnamenti[i].nome = insegnamenti[i].nome.substring(0, 35) + "... " + insegnamenti[i].nome.substring(insegnamenti[i].nome.length-5, insegnamenti[i].nome.length);

      if (data[i].canale != "no")
        insegnamenti[i].nome += " (" + data[i].canale + ")";

      if (data[i].id_modulo.length > 2)
        insegnamenti[i].nome += " (" + data[i].id_modulo.substring(0, data[i].id_modulo.indexOf("-")-1) + ")";

      insegnamenti[i].nome += " - " + data[i].tot_schedeF;

      insegnamenti[i].canale        = data[i].canale;
      insegnamenti[i].id_modulo     = data[i].id_modulo;
      insegnamenti[i].docente       = data[i].docente;
      insegnamenti[i].tot_schedeF   = data[i].tot_schedeF;
        //console.log("tot_schede"+ data[i].tot_schedeF);

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
    let charts = [];
    let ctx = [];

    // Destroy and recreate canvas to clear (need refactoring)
    let canv = [];
    canv.push(document.getElementById(tab_position + "v1"));
    canv.push(document.getElementById(tab_position + "v2"));
    canv.push(document.getElementById(tab_position + "v3"));

    let parents = [];
    parents.push(canv[0].parentElement, canv[1].parentElement, canv[2].parentElement);

    parents[0].removeChild(canv[0]);
    parents[1].removeChild(canv[1]);
    parents[2].removeChild(canv[2]);

    let canv_width = "90vw", canv_height = (insegnamenti.length*25)+"px";

    let canvs = document.createElement('canvas');
    canvs.id = tab_position + "v1";
    canvs.style.width = canv_width;
    canvs.style.height = canv_height;
    parents[0].appendChild(canvs);

    canvs = document.createElement('canvas');
    canvs.id = tab_position + "v2";
    canvs.style.width = canv_width;
    canvs.style.height = canv_height;
    parents[1].appendChild(canvs);

    canvs = document.createElement('canvas');
    canvs.id = tab_position + "v3";
    canvs.style.width = canv_width;
    canvs.style.height = canv_height;
    parents[2].appendChild(canvs);

    canv = [];
    canv.push(document.getElementById(tab_position + "v1"));
    canv.push(document.getElementById(tab_position + "v2"));
    canv.push(document.getElementById(tab_position + "v3"));

    ctx.push(canv[0].getContext("2d"));
    ctx.push(canv[1].getContext("2d"));
    ctx.push(canv[2].getContext("2d"));

    let _options = {
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      responsive: false,
      legend: { display: false }
    };

    let materie = []; // labels chartjs
    let values = []; // data chartjs
    let v1 = [], v2 = [], v3 = [];

    for (let i in insegnamenti) {

      let N = insegnamenti[i].tot_schedeF;
      let d = 0, _v1 = 0, _v2 = 0, _v3 = 0;

      materie.push(insegnamenti[i].nome);

      if (N > 5) {

        for (let j = 0; j < insegnamenti[i].domande.length; j++) {

          d = 0;
          d += insegnamenti[i].domande[j][0] * risposte[0]; // Decisamente no
          d += insegnamenti[i].domande[j][1] * risposte[1]; // Più no che sì
          d += insegnamenti[i].domande[j][2] * risposte[2]; // Più sì che no
          d += insegnamenti[i].domande[j][3] * risposte[3]; // Decisamente sì

          if (j == 0 || j == 1)                           // V1 domande: 1,2
            _v1 += ((d/N) * pesi[j%12]);
          else if (j == 3 || j == 4 || j == 8 || j == 9)  // V2 domande: 4,5,9,10
            _v2 += (d/N) * pesi[j%12];
          else if (j == 2 || j == 5 || j == 6)            // V3 domande: 3,6,7
            _v3 += (d/N) * pesi[j%12];

          // debugging
          // if (insegnamenti[i].nome == "SISTEMI CENTRALI" || insegnamenti[i].nome == "FISICA" || insegnamenti[i].nome == "LINGUA INGLESE") {
          // if (_v1 > 20) {
            // console.log(insegnamenti[i].nome)
            // console.log("d: " + d);
            // console.log("N: " + N);
            // console.log("j%12: " + j%12);
            // console.log("peso: " + pesi[j%12]);
            // console.log(d + "/" + N + " * " + pesi[j%12]);
             //console.log("v1: " + _v1);
             //console.log("######################");
          // }

        }
      }

      v1.push(_v1.toFixed(2));
      v2.push(_v2.toFixed(2));
      v3.push(_v3.toFixed(2));
    }

    if (normalize) {
      let min1 = v1[0], min2 = v2[0], min3 = v3[0];
      let max1 = v1[0], max2 = v2[0], max3 = v3[0];

      for (let i in v1) {
        if (min1 > parseFloat(v1[i]) && v1[i] != 0) min1 = parseFloat(v1[i]);
        if (min2 > parseFloat(v2[i]) && v2[i] != 0) min2 = parseFloat(v2[i]);
        if (min3 > parseFloat(v3[i]) && v3[i] != 0) min3 = parseFloat(v3[i]);

        if (max1 < parseFloat(v1[i])) max1 = parseFloat(v1[i]);
        if (max2 < parseFloat(v2[i])) max2 = parseFloat(v2[i]);
        if (max3 < parseFloat(v3[i])) max3 = parseFloat(v3[i]);
      }

      for (let i in v1) {
        if (v1[i] != 0) v1[i] = (parseFloat(v1[i]) - min1) / (max1 - min1);
        if (v2[i] != 0) v2[i] = (parseFloat(v2[i]) - min2) / (max2 - min2);
        if (v3[i] != 0) v3[i] = (parseFloat(v3[i]) - min3) / (max3 - min3);
      }
    }

    values.push(v1, v2, v3);

    let means = [0, 0, 0];

    for (let x in v1) {
      means[0] += parseFloat(v1[x]);
      means[1] += parseFloat(v2[x]);
      means[2] += parseFloat(v3[x]);
    }

    means[0] = means[0] / v1.length;
    means[1] = means[1] / v2.length;
    means[2] = means[2] / v3.length;

    for (let c in ctx) {
      // chartjs data
      let _data = {
        labels: materie,
        datasets: [{
          label: labels[c],
          data: values[c],
          backgroundColor: '#28a745',
          // borderColor: 'red',
          borderWidth: 1
        }]
      };

      let opt = Object.assign({}, _options);
      opt["lineAtIndex"] = means[c];

      charts.push(new Chart(ctx[c], {
          type: 'horizontalBar',
          data: _data,
          options: opt
      }));
    }
    // select V1 tab
     if(!norm) $('#tabs_' + tab_position + ' a[href="#tab' + tab_position + 'v1"]').tab('show')
     
  });
}

function normalizing() {
 
  console.log("normalizing")
  let norm = $("#tabs li").eq(selectedCDSTabPosition).attr("data-normalized");
  if (norm == "false")  normalize = true
  else normalize = false
  $("#tabs li").eq(selectedCDSTabPosition).attr("data-normalized",normalize);
  let dSelect =  $("#dynamicSelect");
  let idCds =  $("#tabs li").eq(selectedCDSTabPosition).attr("data-idCds");
  loadResults(idCds, selectedCDSTabPosition ,dSelect, true);
  
}





		
