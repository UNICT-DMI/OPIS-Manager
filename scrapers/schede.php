<?php
function getDOM($link)
{
    libxml_use_internal_errors(true);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $link);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $html = curl_exec($ch);
    $dom  = new DOMDocument;
    $dom->loadHTML($html);
    curl_close($ch);
    return $dom;
}

function schede($id_cds, $id_gomp) {
  $link = "http://www.rett.unict.it/nucleo/val_did/anno_1617/"; // const

  $url = $link . "val_insegn.php?cod_corso=" . $id_cds . "&cod_gomp=" . $id_gomp . "&cod_modulo=0&canale=no";
  $xpath = new DOMXPath(getDOM($url));

  $totaleSchede     = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[2]/td[2]')->item(0)->textContent;
  $femmine          = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[2]/td[3]')->item(0)->textContent;
  $fuoriCorso       = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[2]/td[4]')->item(0)->textContent;
  $inattivi         = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[2]/td[5]')->item(0)->textContent;

  $totaleSchede_nf  = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[3]/td[2]')->item(0)->textContent;
  $femmine_nf       = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[3]/td[3]')->item(0)->textContent; // non prevista
  $fuoriCorso_nf    = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[3]/td[4]')->item(0)->textContent;
  $inattivi_nf      = $xpath->query('/html/body/table[1]/tr/td/table[4]/tr[3]/td[5]')->item(0)->textContent;

  // Extract questions answers
  $questions = array();
  for ($i = 1; $i <= 12; $i++)
    for ($j = 1; $j <= 5; $j++)
      $questions[] = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr/td/table[1]/tr[' . ($i+1) . ']/td[' . ($j+1) . ']')->item(0)->textContent;

  // Extract questions answers (nf)
  $questions_nf = array();
  for ($i = 1; $i <= 12; $i++)
    for ($j = 1; $j <= 5; $j++)
      $questions_nf[] = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr/td[2]/table[1]/tr[' . ($i+1) . ']/td[' . ($j+1) . ']')->item(0)->textContent;

  for ($i = 20; $i < 45; $i++)
    $questions_nf[$i] = "dom. non prevista";

  var_dump($questions_nf);
}
schede(346, 72442);
?>
