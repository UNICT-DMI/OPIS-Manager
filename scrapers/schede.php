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

  // questions answers
  $questions = array();
  for ($i = 2; $i < 14; $i++)
    for ($j = 2; $j < 7; $j++)
      $questions[] = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr/td/table[1]/tr[' . $i . ']/td[' . $j . ']')->item(0)->textContent;

  // questions answers (nf)
  $questions_nf = array();
  for ($i = 2; $i < 14; $i++) {
    if ($i == 6)
      $i += 5;

    for ($j = 2; $j < 7; $j++)
      $questions_nf[] = $xpath->query('/html/body/table[1]/tr/td/table[6]/tr/td[2]/table[1]/tr[' . $i . ']/td[' . $j . ']')->item(0)->textContent;
  }

  for ($i = 20; $i < 45; $i++)
    $questions_nf[$i] = "dom. non prevista";

  // reasons nf
  $motivi_nf = array();
  for ($i = 2; $i < 9; $i++)
    $motivi_nf[] = array(
      $xpath->query('/html/body/table[1]/tr/td/table[6]/td[2]/table/tr[' . $i . ']/td[1]')->item(0)->textContent,
      $xpath->query('/html/body/table[1]/tr/td/table[6]/td[2]/table/tr[' . $i . ']/td[2]')->item(0)->textContent
    );

  // suggestions
  $suggestions = array();
  for ($i = 2; $i < 12; $i++)
      $suggestions[] = array(
        $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[1]/table[1]/tr[' . $i . ']/td[1]')->item(0)->textContent,
        $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[1]/table[1]/tr[' . $i . ']/td[2]')->item(0)->textContent
      );

  // suggestions nf
  $suggestions_nf = array();
  for ($i = 2; $i < 12; $i++)
      $suggestions_nf[] = array(
        $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[2]/table[1]/tr[' . $i . ']/td[1]')->item(0)->textContent,
        $xpath->query('/html/body/table[1]/tr/td/table[6]/tr[3]/td[2]/table[1]/tr[' . $i . ']/td[2]')->item(0)->textContent
      );

  // var_dump($suggestions_nf);
}
schede(346, 72442);
?>
