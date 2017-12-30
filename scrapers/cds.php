<?php
$x=379;
insegnamento($x);
function cds($id_dip)
{
    include 'methods.php';
    include 'globalVar.php';
    include 'config.php';
    $mysqli = new mysqli($host, $username, $password, $db_name);
    if ($mysqli->connect_error)
        die('Errore di connessione');

    $query = "INSERT INTO cds (id, nome,classe,tot_moduli,tot_valutati,tot_schedeF,tot_schedeNF,id_dipartimento) VALUES\n";

    $xpath   = new DOMXPath(getDOM($link .'cds_dip.php?id_dip='.$id_dip));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;

    for ($j = 2; $j < $lengthN; $j++) {

        $_cod_corso       = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[2]')->item(0)->textContent;
        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[3]/a')->item(0)->attributes->item(0)->textContent;
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[3]')->item(0)->textContent;

        $_classe = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[4]')->item(0)->textContent;

        $_tot_moduli = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[5]')->item(0)->textContent;

        $_tot_valutati = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[6]')->item(0)->textContent;

        $_tot_schedeF = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[8]')->item(0)->textContent;

        $_tot_schedeNF = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[9]')->item(0)->textContent;

        $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[10]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS
        if (!$mysqli->query('SELECT id FROM cds WHERE id=' . $_cod_corso . ';')->num_rows) {
            $query .= '("' . addslashes($_cod_corso) . '", "' . addslashes($_nome) . '", "' . addslashes($_classe) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '","' . addslashes($_tot_schedeNF) . '","' . addslashes($id_dip) . '"),';
            $query .= "\n";

        }
    }


    $query = substr($query, 0, -2);
    $query .= ";";
    $endQuery = substr($query, strlen($query) - 6);

    if ($endQuery != 'VALUE;')
        if (!$mysqli->query($query))
            die($mysqli->error);

}

function insegnamento($id_cds) {
  include 'methods.php';
  include 'globalVar.php';
  include 'config.php';

  $mysqli = new mysqli($host, $username, $password, $db_name);
  if ($mysqli->connect_error)
      die('Errore di connessione');

  else {

        $xpath   = new DOMXPath(getDOM($link .'insegn_cds.php?cod_corso='.$id_cds));
        $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;
        echo $lengthN;
  }
}
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
 ?>
