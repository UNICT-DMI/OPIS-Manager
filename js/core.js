$(document).ready(function() {

  const api_url = "API/public/index.php/api/";

  $.getJSON(api_url + "dipartimento", function(data) {

    var dip = $("#dipartimenti");

    $.each(data, function(key, val) {
      dip.append(new Option(data[key].nome, data[key].id));
    });

  });

});
