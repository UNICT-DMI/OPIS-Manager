<?php
include "config.php";
include "schede.php";
include "insegnamento.php";
include "cds.php";

function parseID($str)
{
    $x = substr($str, strlen($str) - 3);
    $x = str_replace("=", "", $x);
    $x = str_replace("p", "", $x);

    return $x;
}

function dip(): void 
{
    global $link, $mysqli, $year, $debug;

    $xpath    = new DOMXPath(getDOM($link)); // permette di gestire il DOM come se fosse un percorso
    $lengthN  = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length; // Lunghezza righe (numero di dipartimenti)

    for ($i = 2; $i < $lengthN; $i++) { //prendiamo le info di ogni dipartimento

        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[1]/a')->item(0)->attributes->item(0)->textContent; //Link Dipartimento
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[1]')->item(0)->textContent; // Nome dipartimento

        $unict_id = parseID($linkDipartimento);
        
        if ($year == "2013/2014" || $year == "2014/2015") {
          $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[9]/a');
        } else {
          $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[8]/a');
        }

        echo "\n  ## \033[1m" . ($i-1) . "/" . ($lengthN-2) . "\033[33m\t " . $_nome . "\033[0m\n";

        $query  = "INSERT INTO dipartimento (unict_id, anno_accademico, nome) VALUES\n";
        $query .= '("' . $unict_id . '","' . $year . '","' . addslashes($_nome) . '");';
        if (!$mysqli->query($query))
          die($mysqli->error);
        
        
        $id = get_primary_id($unict_id, 'dipartimento');

        
        if ($year == "2013/2014" || $year == "2014/2015" || $year == "2015/2016") {
          // debugging
          if ($debug && $unict_id == 1) {
            oldcds($unict_id, $id);
          } else if (!$debug) {
              oldcds($unict_id, $id); // funzione che per ogni dipartimento scorre i suoi corsi di studio
          }
        } else {
          // debugging
          if ($debug && $unict_id == 1) {
            cds($unict_id, $id);
          } else if (!$debug) {
              cds($unict_id, $id); // funzione che per ogni dipartimento scorre i suoi corsi di studio
          }
        }
    }
}

$link = "http://nucleo.unict.it/val_did/anno_1314/index.php";
$year = "2013/2014";
dip();

$link = "http://nucleo.unict.it/val_did/anno_1415/index.php";
$year = "2014/2015";
dip();

$link = "http://nucleo.unict.it/val_did/anno_1516/index.php";
$year = "2015/2016";
dip();

$link = "http://nucleo.unict.it/val_did/anno_1617/index.php";
$year = "2016/2017";
dip();

$link = "http://nucleo.unict.it/val_did/anno_1718/index.php";
$year = "2017/2018";
dip();

$link = "http://nucleo.unict.it/val_did/anno_1819/index.php";
$year = "2018/2019";
dip();

echo "\n";

mysqli_close($mysqli);
?>
