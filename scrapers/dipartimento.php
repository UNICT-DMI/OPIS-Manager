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

function dip()
{
    global $link, $mysqli, $year, $debug;

    $arr      = array();

    $xpath    = new DOMXPath(getDOM($link));
    $lengthN  = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length; // Lunghezza righe

    $query    = "INSERT INTO dipartimento (id,nome, tot_cds, tot_moduli,tot_valutati,tot_schedeF,tot_schedeNF) VALUES\n";

    for ($i = 2; $i < $lengthN; $i++) {

        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[1]/a')->item(0)->attributes->item(0)->textContent; //Link Dipartimento
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[1]')->item(0)->textContent; // Nome dipartimento
        $_id = parseID($linkDipartimento);

        $_tot_CdS       = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[2]')->item(0)->textContent; // Tot CdS
        $_tot_moduli    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[3]')->item(0)->textContent; // Tot Moduli
        $_tot_valutati  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[4]')->item(0)->textContent; // Tot Valutati
        $_tot_schedeF   = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[6]')->item(0)->textContent; // Totale schede frequentanti
        $_tot_schedeNF  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[7]')->item(0)->textContent; // Totale schede NON frequentanti
        $link_opis      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[8]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS

        //$aPathOpis_Dipartimento[$] = $link_opis;
        echo "\n  ## \033[1m" . ($i-1) . "/" . ($lengthN-2) . "\033[33m\t " . $_nome . "\033[0m";
        echo "";

        // debugging
        if ($debug && $_id == 1) {   
           cds($_id);
        }
        else if(!$debug) {
            //cds($_id);
        }

        if (!$mysqli->query('SELECT id FROM dipartimento WHERE id=' . $_id . ';')->num_rows) {
            $query .= '("' . addslashes($_id) . '","' . addslashes($_nome) . '","' . addslashes($_tot_CdS) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '", "' . addslashes($_tot_schedeNF) . '"),';
            $query .= "\n";
        }

    }

    $query = substr($query, 0, -2);
    $query .= ";";

    $endQuery = substr($query, strlen($query) - 6);
    if ($endQuery != 'VALUE;')
        if (!$mysqli->query($query))
            die($mysqli->error);
    return $arr;
}

// $link = "http://nucleo.unict.it/val_did/anno_1314/index.php";
// $year = "2013/2014";
// dip();

// $link = "http://nucleo.unict.it/val_did/anno_1415/index.php";
// $year = "2014/2015";
// dip();

// $link = "http://nucleo.unict.it/val_did/anno_1516/index.php";
// $year = "2015/2016";
// dip();

$link = "http://nucleo.unict.it/val_did/anno_1617/index.php";
$year = "1617";
dip();

$link = "http://nucleo.unict.it/val_did/anno_1718/index.php";
$year = "1718";
dip();

echo "\n";

mysqli_close($mysqli);
?>
