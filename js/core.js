const api_url = "API/public/index.php/api/";

$(document).ready(function() {

  $.getJSON(api_url + "dipartimento", function(data) {

    var dip = $("#dipartimenti");

    for (var i in data)
      dip.append(new Option(data[i].nome, data[i].id));

  });

});

function showCds(dipartimento) {

    $.getJSON(api_url + "cds/" + dipartimento , function(data) {


      var tmp = "", tmp2 = "";
      for (var x = 0; x < data.length; x++){
        // tmp += '<li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#tab' + x + '" role="tab" aria-controls="tab' + x + '" aria-selected="true">Tab' + x + '</a></li>';
        tmp += '<li class="nav-item"><a class="nav-link" id="profile' + x + '-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile' + x + '" aria-selected="false">Profile</a></li>';
        // tmp2 = '<div class="tab-pane fade show active" id="tab' + x + '" role="tabpanel" aria-labelledby="tab' + x + '-tab">tab' + x + '</div>';
        tmp2 = '<div class="tab-pane fade show active" id="profile' + x + '" role="tabpanel" aria-labelledby="profile' + x + '-tab">' + x + '</div>';
      }

      document.getElementById("myTab").innerHTML = tmp;
      document.getElementById("myTabContent").innerHTML = tmp2;


    });
}
