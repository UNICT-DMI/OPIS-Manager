<?php

function oldcds($unict_id_dip, $primary_id_dip) // come cds() ma serve per gli anni accademici prima del 16/17 che usano una struttura HTML diversa
{
    global $link, $mysqli, $year;

    $link = str_replace("index.php", "", $link);

    $xpath   = new DOMXPath(getDOM($link .'cds_dip.php?id_dip=' . $unict_id_dip));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;

    $e = ($year == "2013/2014" ? 1 : 2); // gestire in modo "semplice" la differenza tra l'html del 13/14 e il 14/15

    for ($j = 2; $j < $lengthN; $j++) {

        $unict_id_cds       = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e)   . ']')->item(0)->textContent;
        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+1) . ']')->item(0)->attributes->item(0)->textContent;
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+1) . ']')->item(0)->textContent;
        $_classe          = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+2) . ']')->item(0)->textContent;

        if ($year == "2015/2016") {
            $_tot_report = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[' . ($e+5) . ']')->item(0)->textContent;
        }

        $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[10]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS

        if (!$mysqli->query('SELECT id FROM corso_di_studi WHERE unict_id=' . $unict_id_cds . ' AND anno_accademico="' . $year . '" AND id_dipartimento=' . $unict_id_dip . ';')->num_rows) {
            $query  = "INSERT INTO corso_di_studi (unict_id, anno_accademico, nome, classe, id_dipartimento) VALUES\n";
            $query .= utf8_decode('("' . addslashes($unict_id_cds) . '","' . $year . '", "' . addslashes($_nome) . '", "' . addslashes($_classe) . '","' . addslashes($primary_id_dip) . '");');

            if (!$mysqli->query($query)) {
                die($mysqli->error);
            }
        }

        $id = get_primary_id($unict_id_cds, 'corso_di_studi');

        echo "\n\n ###  " . ($j-1) . "/" . ($lengthN-2) . "\t \033[36m"  . $_nome . " ". $_classe ."\033[0m\n";
        oldinsegnamento($unict_id_cds, $id);
    }
}

function cds($unict_id_dip, $primary_id_dip)
{
    global $link, $mysqli, $year;

    $link = str_replace("index.php", "", $link);

    $xpath   = new DOMXPath(getDOM($link .'cds_dip.php?id_dip=' . $unict_id_dip));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;

    for ($j = 2; $j < $lengthN; $j++) {

        $unict_id_cds       = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[2]')->item(0)->textContent;
        $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[3]/a')->item(0)->attributes->item(0)->textContent;
        $_nome            = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[3]')->item(0)->textContent;
        $_classe          = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[4]')->item(0)->textContent;

        $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $j . ']/td[10]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS

        $_nome = html_entity_decode(utf8_decode($_nome)); // fix accents

        if (!$mysqli->query('SELECT id FROM corso_di_studi WHERE unict_id=' . $unict_id_cds . ' AND anno_accademico="' . $year . '" AND id_dipartimento=' . $unict_id_dip . ';')->num_rows) {
            $query = "INSERT INTO corso_di_studi (unict_id, anno_accademico, nome, classe, id_dipartimento) VALUES\n";
            $query .= utf8_decode('("' . addslashes($unict_id_cds) . '","' . $year . '", "' . addslashes($_nome) . '", "' . addslashes($_classe) . '", "' . addslashes($primary_id_dip) . '");');

            if (!$mysqli->query($query)) {
                die($mysqli->error);
            }
        }

        $id = get_primary_id($unict_id_cds, 'corso_di_studi');

        echo "\n\n ###  " . ($j-1) . "/" . ($lengthN-2) . "\t \033[36m"  . $_nome . "\033[0m\n";
        insegnamento($unict_id_cds, $id);

    }
}

?>
