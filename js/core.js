$(document).ready(function() {

  const api_url = "API/public/index.php/api/";

  $.getJSON(api_url + "dipartimento", function(data) {

    var dip = $("#dipartimenti");

    for (var i in data)
      dip.append(new Option(data[i].nome, data[i].id));

  });

});

function showCds(dipartimento) {
  alert(dipartimento);
}
