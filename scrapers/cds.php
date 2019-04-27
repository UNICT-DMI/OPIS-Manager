<?php

function oldcds($id_dip) // come cds() ma serve per gli anni accademici prima del 16/17 che usano una struttura HTML diversa

{
    global $link, $mysqli, $year;

    $link = str_replace("index.php", "", $link);
    $query = "INSERT INTO cds (id, nome,classe,tot_moduli,tot_valutati,tot_schedeF,tot_schedeNF,id_dipartimento) VALUES\n";

    $xpath   = new DOMXPath(getDOM($link .'cds_dip.php?id_dip=' . $id_dip));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;

    $e = ($year == "2013/2014" ? 1 : 2); // gestire in modo "semplice" la differenza tra l'html del 13/14 e il 14/15

    for ($j = 2; $j < $lengthN; $j++) {

        $_cod_corso       = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e) . ']')->item(0)->textContent;
        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+1) . ']')->item(0)->attributes->item(0)->textContent;
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+1) . ']')->item(0)->textContent;

        $_classe          = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+2) . ']')->item(0)->textContent;
        $_tot_moduli      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+3) . ']')->item(0)->textContent;
        $_tot_valutati    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+4) . ']')->item(0)->textContent;
        $_tot_schedeF     = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+5) . ']')->item(0)->textContent;
        $_tot_schedeNF    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+6) . ']')->item(0)->textContent;

        if ($_tot_schedeF == '')
            $_tot_schedeF = 0;
 
        if ($_tot_schedeNF == '')
            $_tot_schedeNF = 0;

        $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[10]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS
        if (!$mysqli->query('SELECT id FROM cds WHERE id=' . $_cod_corso . ';')->num_rows) {
            $query .= utf8_decode('("' . addslashes($_cod_corso) . '", "' . addslashes($_nome) . '", "' . addslashes($_classe) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '","' . addslashes($_tot_schedeNF) . '","' . addslashes($id_dip) . '"),');
            $query .= "\n";

        }

        echo "\n\n ###  " . ($j-1) . "/" . ($lengthN-2) . "\t \033[36m"  . $_nome . "\033[0m\n";
        oldinsegnamento($_cod_corso);

    }

    $query = substr($query, 0, -2);
    $query .= ";";
    $endQuery = substr($query, strlen($query) - 6);
    if ($endQuery != 'VALUE;')
        if (!$mysqli->query($query))
            die($mysqli->error);
}

function cds($id_dip)
{
    global $link, $mysqli;

    $link = str_replace("index.php", "", $link);
    $query = "INSERT INTO cds (id, nome,classe,tot_moduli,tot_valutati,tot_schedeF,tot_schedeNF,id_dipartimento) VALUES\n";

    $xpath   = new DOMXPath(getDOM($link .'cds_dip.php?id_dip=' . $id_dip));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;

    for ($j = 2; $j < $lengthN; $j++) {

        $_cod_corso       = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[2]')->item(0)->textContent;
        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[3]/a')->item(0)->attributes->item(0)->textContent;
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[3]')->item(0)->textContent;

        $_classe          = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[4]')->item(0)->textContent;
        $_tot_moduli      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[5]')->item(0)->textContent;
        $_tot_valutati    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[6]')->item(0)->textContent;
        $_tot_schedeF     = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[8]')->item(0)->textContent;
        $_tot_schedeNF    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[9]')->item(0)->textContent;

        $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[10]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS
        if (!$mysqli->query('SELECT id FROM cds WHERE id=' . $_cod_corso . ';')->num_rows) {
            $query .= utf8_decode('("' . addslashes($_cod_corso) . '", "' . addslashes($_nome) . '", "' . addslashes($_classe) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '","' . addslashes($_tot_schedeNF) . '","' . addslashes($id_dip) . '"),');
            $query .= "\n";

        }

        echo "\n\n ###  " . ($j-1) . "/" . ($lengthN-2) . "\t \033[36m"  . $_nome . "\033[0m\n";
        insegnamento($_cod_corso);

    }

    $query = substr($query, 0, -2);
    $query .= ";";
    $endQuery = substr($query, strlen($query) - 6);
    if ($endQuery != 'VALUE;')
        if (!$mysqli->query($query))
            die($mysqli->error);
}

?>
