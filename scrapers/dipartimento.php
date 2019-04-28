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

function olddip() // come dip() ma serve per gli anni accademici prima del 16/17 che usano una struttura HTML diversa
{
    global $link, $mysqli, $year, $debug;

    $arr      = array();

    $xpath    = new DOMXPath(getDOM($link)); // permette di gestire il DOM come se fosse un percorso
    $lengthN  = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length; // Lunghezza righe (numero di dipartimenti)

    for ($i = 2; $i < $lengthN; $i++) { //prendiamo le info di ogni dipartimento

        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[1]/a')->item(0)->attributes->item(0)->textContent; //Link Dipartimento
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[1]')->item(0)->textContent; // Nome dipartimento
        $_id = parseID($linkDipartimento);

        $_tot_CdS       = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[2]')->item(0)->textContent; // Tot CdS (Corsi di Studio)
        $_tot_moduli    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[3]')->item(0)->textContent; // Tot Moduli
        $_tot_valutati  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[5]')->item(0)->textContent; // Tot Valutati
        $_tot_schedeF   = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[7]')->item(0)->textContent; // Totale schede frequentanti
        $_tot_schedeNF  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[8]')->item(0)->textContent; // Totale schede NON frequentanti
        $link_opis      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[9]/a');//->item(0)->attributes->item(0)->textContent; // Link OPIS

        if ($_tot_schedeF == '')
            $_tot_schedeF = 0;
 
        if ($_tot_schedeNF == '')
            $_tot_schedeNF = 0;

        echo "\n  ## \033[1m" . ($i-1) . "/" . ($lengthN-2) . "\033[33m\t " . $_nome . "\033[0m";
        echo "";

        if (!$mysqli->query('SELECT id '.
        'FROM dipartimento ' .
        'WHERE ' .
        'id=' . $_id . 
        ' AND anno_accademico="' . $year .
        '";')->num_rows) { // se il dipartimento NON ESISTE

            $query  = "INSERT INTO dipartimento (id, anno_accademico, nome, tot_cds, tot_moduli, tot_valutati, tot_schedeF, tot_schedeNF) VALUES\n";
            $query .= '("' . addslashes($_id) . '","' . $year . '","' . addslashes($_nome) . '","' . addslashes($_tot_CdS) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '", "' . addslashes($_tot_schedeNF) . '");';

            if (!$mysqli->query($query)) {
                die($mysqli->error);
            }
        }

        // debugging
        if ($debug && $_id == 1) {
           oldcds($_id);
        }
        else if (!$debug) {
            oldcds($_id); // funzione che per ogni dipartimento scorre i suoi corsi di studio
        }
    }

    return $arr;
}


function dip()
{
    global $link, $mysqli, $year, $debug;

    $arr      = array();

    $xpath    = new DOMXPath(getDOM($link)); // permette di gestire il DOM come se fosse un percorso
    $lengthN  = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length; // Lunghezza righe (numero di dipartimenti)

    for ($i = 2; $i < $lengthN; $i++) { //prendiamo le info di ogni dipartimento

        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[1]/a')->item(0)->attributes->item(0)->textContent; //Link Dipartimento
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[1]')->item(0)->textContent; // Nome dipartimento
        $_id = parseID($linkDipartimento);

        $_tot_CdS       = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[2]')->item(0)->textContent; // Tot CdS (Corsi di Studio)
        $_tot_moduli    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[3]')->item(0)->textContent; // Tot Moduli
        $_tot_valutati  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[4]')->item(0)->textContent; // Tot Valutati
        $_tot_schedeF   = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[6]')->item(0)->textContent; // Totale schede frequentanti
        $_tot_schedeNF  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[7]')->item(0)->textContent; // Totale schede NON frequentanti
        $link_opis      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[8]/a');//->item(0)->attributes->item(0)->textContent; // Link OPIS
        //$aPathOpis_Dipartimento[$] = $link_opis;
        echo "\n  ## \033[1m" . ($i-1) . "/" . ($lengthN-2) . "\033[33m\t " . $_nome . "\033[0m";
        echo "";

        if (!$mysqli->query('SELECT id FROM dipartimento WHERE id=' . $_id . ' AND anno_accademico="' . $year . '";')->num_rows) { // se il dipartimento NON ESISTE
            $query  = "INSERT INTO dipartimento (id, anno_accademico, nome, tot_cds, tot_moduli, tot_valutati, tot_schedeF, tot_schedeNF) VALUES\n";
            $query .= '("' . addslashes($_id) . '","' . $year . '","' . addslashes($_nome) . '","' . addslashes($_tot_CdS) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '", "' . addslashes($_tot_schedeNF) . '");';

            if (!$mysqli->query($query)) {
                die($mysqli->error);
            }
        }

        // debugging
        if ($debug && $_id == 1) {   
            cds($_id);
        }
        else if(!$debug) {
            cds($_id);
        }

    }

    return $arr;
}

// $link = "http://nucleo.unict.it/val_did/anno_1314/index.php";
// $year = "2013/2014";
// olddip();

//  $link = "http://nucleo.unict.it/val_did/anno_1415/index.php";
//  $year = "2014/2015";
//  olddip();

$link = "http://nucleo.unict.it/val_did/anno_1516/index.php";
$year = "2015/2016";
olddip();

// $link = "http://nucleo.unict.it/val_did/anno_1617/index.php";
// $year = "2016/2017";
// dip();

// $link = "http://nucleo.unict.it/val_did/anno_1718/index.php";
// $year = "2017/2018";
// dip();

echo "\n";

mysqli_close($mysqli);
?>
