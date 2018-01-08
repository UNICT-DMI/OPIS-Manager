<?php
function filter_graph($url, $fileName, $fieldName) {

  $url = str_replace("./" . $fileName . ".php?", "", $url);
  $url = str_replace($fieldName, "", $url);

  $url = str_replace("1=", "", $url);
  $url = str_replace("2=", "", $url);
  $url = str_replace("3=", "", $url);
  $url = str_replace("4=", "", $url);
  $url = str_replace("5=", "", $url);
  $url = str_replace("6=", "", $url);
  $url = str_replace("7=", "", $url);
  $url = str_replace("8=", "", $url);
  $url = str_replace("9=", "", $url);
  $url = str_replace("10=", "", $url);
  $url = str_replace("FC=", "", $url);

  $url = explode("&", $url);

  return $url;
}

function fill_arr($arr, $elements) {
  foreach ($arr as $key=>$value)
    $arr[$key] = array(@$elements[$key], $arr[$key]);

  return $arr;
}

function schede($id_cds, $id_gomp, $cod_modulo, $canale) {
  global $link, $mysqli;

  $url = $link . "val_insegn.php?cod_corso=" . $id_cds . "&cod_gomp=" . $id_gomp . "&cod_modulo=" . $cod_modulo . "&canale=" . $canale;

  $xpath = new DOMXPath(getDOM($url));

  $totaleSchede     = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[2]/td[2]')->item(0)->textContent;
  $femmine          = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[2]/td[3]')->item(0)->textContent;
  $fuoriCorso       = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[2]/td[4]')->item(0)->textContent;
  $inattivi         = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[2]/td[5]')->item(0)->textContent;

  $totaleSchede_nf  = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[3]/td[2]')->item(0)->textContent;
  // $femmine_nf       = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[3]/td[3]')->item(0)->textContent; // "non prevista"
  $femmine_nf       = 0; // "non prevista"
  //$fuoriCorso_nf    = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[3]/td[4]')->item(0)->textContent;
  $fuoriCorso_nf    = 0;
  $inattivi_nf      = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[3]/td[5]')->item(0)->textContent;
  if ($inattivi_nf=='')
    $inattivi_nf = 0;

  /* data from graphs */
  $eta = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[5]/tr/td//img')->item(0);
  if ($el) {
    $eta = $el->getAttribute("src");
    $eta = filter_graph($eta, "graph_eta", "eta");
    $eta = fill_arr($eta, array("18-19","20-21","22-23","24-25","26-27","28-29","30 e oltre"));
  }

  $anno_iscr = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[5]/tr/td[2]//img')->item(0);
  if ($el) {
    $anno_iscr = $el->getAttribute("src");
    $anno_iscr = filter_graph($anno_iscr, "graph_annoiscr", "iscr");
    $anno_iscr = fill_arr($anno_iscr, array("1", "2", "3", "4", "5", "6", "FC"));
  }

  $n_studenti = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[5]/tr[2]/td[1]//img')->item(0);
  if ($el) {
    $n_studenti = $el->getAttribute("src");
    $n_studenti = filter_graph($n_studenti, "graph_stud_freq", "stud");
    $n_studenti = fill_arr($n_studenti, array("fino 25", "26-50", "51-75", "76-100", "101-151", "151-200", "oltre 200"));
  }

  $ragg_uni = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[5]/tr[2]/td[2]//img')->item(0);
  if ($el) {
    $ragg_uni = $el->getAttribute("src");
    $ragg_uni = filter_graph($ragg_uni, "graph_tempo_univ", "tmp");
    $ragg_uni = fill_arr($ragg_uni, array("fino 0.5", "0.5-1", "1-2", "2-3", "oltre 3"));
  }

  $studio_gg = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[5]/tr[3]/td[1]//img')->item(0);
  if ($el) {
    $studio_gg = $el->getAttribute("src");
    $studio_gg = filter_graph($studio_gg, "graph_ore_studio_gg", "ore");
    $studio_gg = fill_arr($studio_gg, array("1", "2", "3", "4", "5", "6", "7", "8", "9", "10"));
  }

  $studio_tot = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[5]/tr[3]/td[2]//img')->item(0);
  if ($el) {
    $studio_tot = $el->getAttribute("src");
    $studio_tot = str_replace("&ore8=0", "", $studio_tot);
    $studio_tot = filter_graph($studio_tot, "graph_ore_studio_tot", "ore");
    $studio_tot = fill_arr($studio_tot, array("fino 50", "51-100", "101-150", "201-250", "251-300", "301-350", "oltre 300"));
  }

  // questions answers
  $domande = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr/td[1]')->item(0);
  if ($el && !strpos($el->textContent, "schede insuff.")) {
    $domande = array();
    for ($i = 2; $i < 14; $i++)
      for ($j = 2; $j < 7; $j++)
        $domande[] = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr/td/table[1]/tr[' . $i . ']/td[' . $j . ']')->item(0)->textContent;
  }

  // questions answers (nf)
  $domande_nf = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr/td[2]')->item(0);
  if ($el && !strpos($el->textContent, "schede insuff.")) {
    $domande_nf = array();
    for ($i = 2; $i < 14; $i++) {
      if ($i == 6)
        $i += 5;

      for ($j = 2; $j < 7; $j++)
        $domande_nf[] = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr/td[2]/table[1]/tr[' . $i . ']/td[' . $j . ']')->item(0)->textContent;
    }

    for ($i = 20; $i < 45; $i++)
      $domande_nf[$i] = "dom. non prevista";
  }

  // reasons nf
  $motivi_nf = "";
  if ($xpath->query('/html/body/table[1]/tr/td/table[6]/td[2]/table/tr[2]/td[1]')->item(0) != NULL && !strpos($xpath->query('/html/body/table[1]/tr/td/table[6]/td[2]')->item(0)->textContent, "schede insuff.")) {
    $motivi_nf = array();
    for ($i = 2; $i < 9; $i++)
      $motivi_nf[] = array(
        $xpath->query('/html/body/table[1]/tr/td/table[6]/td[2]/table/tr[' . $i . ']/td[1]')->item(0)->textContent,
        $xpath->query('/html/body/table[1]/tr/td/table[6]/td[2]/table/tr[' . $i . ']/td[2]')->item(0)->textContent
      );
  }

  // suggestions
  $sugg = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[1]/table[1]/tr[2]/td[1]')->item(0);
  if ($el && !strpos($el->textContent, "schede insuff.")) {
    $sugg = array();
    for ($i = 2; $i < 12; $i++)
      $sugg[] = array(
        $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[1]/table[1]/tr[' . $i . ']/td[1]')->item(0)->textContent,
        $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[1]/table[1]/tr[' . $i . ']/td[2]')->item(0)->textContent
      );
  }

  // suggestions nf
  $sugg_nf = "";
  $el = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[2]/table[1]/tr[2]/td[1]')->item(0);
  if ($el && !strpos($el->textContent, "schede insuff.")) {
    $sugg_nf = array();
    for ($i = 2; $i < 12; $i++)
      $sugg_nf[] = array(
        $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[2]/table[1]/tr[' . $i . ']/td[1]')->item(0)->textContent,
        $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[2]/table[1]/tr[' . $i . ']/td[2]')->item(0)->textContent
      );
  }

  /* Serializing data */

  // graphs
  $eta = serialize($eta);
  $anno_iscr = serialize($anno_iscr);
  $n_studenti = serialize($n_studenti);
  $ragg_uni = serialize($ragg_uni);
  $studio_gg = serialize($studio_gg);
  $studio_tot = serialize($studio_tot);

  // questions
  $domande = serialize($domande);
  $domande_nf = serialize($domande_nf);
  $motivi_nf = serialize($motivi_nf);
  $sugg = serialize($sugg);
  $sugg_nf = serialize($sugg_nf);
  if ($mysqli->query('SELECT * FROM schede WHERE id_insegnamento=\'' . $id_gomp . '\' AND  id_modulo=\''. $cod_modulo . '\' AND canale=\''. $canale .'\';')->num_rows <= 0) {
    $query = "INSERT INTO `schede` (`totale_schede`, `totale_schede_nf`, `femmine`, `femmine_nf`, `fc`, `inatt`, `inatt_nf`, `eta`, `anno_iscr`, `num_studenti`, `ragg_uni`, `studio_gg`, `studio_tot`, `domande`, `domande_nf`, `motivo_nf`, `sugg`, `sugg_nf`, `id_insegnamento`,`id_modulo`, `canale`) VALUES";
    $query .= "\n";
    $query .= '("' . addslashes($totaleSchede) . '", "' . addslashes($totaleSchede_nf) . '", ' .
                '"' . addslashes($femmine) . '", "' . addslashes($femmine_nf) . '", ' .
                '"' . addslashes($fuoriCorso) . '", ' .
                '"' . addslashes($inattivi) . '", "' . addslashes($inattivi_nf) . '", ' .
                '"' . addslashes($eta) . '", ' .
                '"' . addslashes($anno_iscr) . '", ' .
                '"' . addslashes($n_studenti) . '", ' .
                '"' . addslashes($ragg_uni) . '", ' .
                '"' . addslashes($studio_gg) . '", ' .
                '"' . addslashes($studio_tot) . '", ' .
                '"' . addslashes($domande) . '", ' .
                '"' . addslashes($domande_nf) . '", ' .
                '"' . addslashes($motivi_nf) . '", ' .
                '"' . addslashes($sugg) . '", ' .
                '"' . addslashes($sugg_nf) . '", ' .
                '"' . $id_gomp . '", ' .
                '"' . $cod_modulo . '", ' .
                '"' . $canale . '");';

  if (!$mysqli->query($query))
    die($mysqli->error);
  }


  // echo $query;

}
?>
