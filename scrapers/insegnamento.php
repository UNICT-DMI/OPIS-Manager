<?php

function oldinsegnamento($id_cds) {
    global $link, $mysqli, $year;

    $xpath   = new DOMXPath(getDOM($link .'insegn_cds.php?cod_corso='.$id_cds));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;
    /*$num     = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($lengthN-2) . ']/td[1]')->item(0)->textContent;

    if (intval($num) == 0)
      $num = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($lengthN-3) . ']/td[1]')->item(0)->textContent;*/

    $j = 0;
    for ($i = 2; $i < $lengthN; $i++) {

        $fields = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td')->length;

        if ($fields >= 10) {
            $j++;

            $_id          = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[2]')->item(0)->textContent; //cod GOMP
            $_nome        = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[3]')->item(0)->textContent;
            $_canale      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[4]')->item(0)->textContent;

            if ($year == "2015/2016") {
                $_id_modulo    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[5]')->item(0)->textContent;
                $_ssd    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[6]')->item(0)->textContent;
                $_tipo    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[7]')->item(0)->textContent;
                $_anno    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[8]')->item(0)->textContent;
                $_semestre    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[9]')->item(0)->textContent;
                $_cfu    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]')->item(0)->textContent;
                $_docente    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[11]')->item(0)->textContent;
                $_assegn    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[12]')->item(0)->textContent;
                $_tot_schedeF  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[13]')->item(0)->textContent; // frequentanti
                $_tot_schedeNF = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[14]')->item(0)->textContent; // non frequentanti
            }
            else {
                //$_n_moduli    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[5]')->item(0)->textContent;
                $_anno        = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[6]')->item(0)->textContent;
                $_semestre    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[7]')->item(0)->textContent;
                $_cfu         = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[8]')->item(0)->textContent;
                $_mutuaz      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[9]')->item(0)->textContent;
                $_tot_schede  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]')->item(0)->textContent; // "frequentanti + non frequentanti"

                $_tot_schede_arr = explode('+', $_tot_schede); //dividiamo la stringa
                $_tot_schedeF = $_tot_schede_arr[0];
                $_tot_schedeNF = $_tot_schede_arr[1];
            }

            if ($_tot_schedeF == '') {
                $_tot_schedeF = 0;
            }

            if ($_tot_schedeNF == '') {
                $_tot_schedeNF = 0;
            }

            echo "\033[1m" . ($j) . "\033[0m\t" .  $_nome . " \n";

            if ($_canale == ' ') {
                $_canale = 'no';
            }
            else {
                $_canale = str_replace(" ", "", $_canale);
            }

            // extract link_opis
            $link_opis = "";
            if($year == "2015/2016")
                $emptyOPIS= $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]')->item(0)->firstChild->nodeName;
            else {
                $emptyOPIS= $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]')->item(0)->firstChild->nodeName;
                if ($year == "2014/2015") {
                    $_id = substr($_id, 0, -2);
                }
            }

            if (!$mysqli->query('SELECT id FROM insegnamento '.
                                ' WHERE id=' . $_id .
                                '  AND anno_accademico="'.$year.
                                '" AND canale="' . $_canale .
                                '" AND id_cds="' .$id_cds  .'"')->num_rows) {
                if($year == "2015/2016") {
                    $query  = "INSERT INTO insegnamento (id, nome, id_modulo, canale, anno, semestre, cfu, tot_schedeF, tot_schedeNF, id_cds, ssd, tipo, docente, assegn, anno_accademico) VALUES\n";
                    $query .= utf8_decode('("' . addslashes($_id) . '","' .
                                          addslashes($_nome) . '","' .
                                          '0","' .
                                          addslashes($_canale) . '","' .
                                          addslashes($_anno) . '","' .
                                          addslashes($_semestre) . '","' .
                                          addslashes($_cfu) . '", "' .
                                          addslashes($_tot_schedeF) . '", "' .
                                          addslashes($_tot_schedeNF) . '","' .
                                          addslashes($id_cds) . '", "' .
                                          addslashes($_ssd) . '", "' .
                                          addslashes($_tipo) . '", "' .
                                          addslashes($_docente) . '", "' .
                                          addslashes($_assegn) . '", "' .
                                          $year . '");');
                }
                else {
                    $query  = "INSERT INTO insegnamento (id, nome, id_modulo, canale, anno, semestre, cfu, tot_schedeF, tot_schedeNF, id_cds, anno_accademico) VALUES\n";
                    $query .= utf8_decode('("' . addslashes($_id) . '","' .
                                          addslashes($_nome) . '","' .
                                          '0","' .
                                          addslashes($_canale) . '","' .
                                          addslashes($_anno) . '","' .
                                          addslashes($_semestre) . '","' .
                                          addslashes($_cfu) . '", "' .
                                          addslashes($_tot_schedeF) . '", "' .
                                          addslashes($_tot_schedeNF) . '","' .
                                          addslashes($id_cds) . '", "' .
                                          $year . '");');
                }

                if (!$mysqli->query($query)) {
                    die($mysqli->error);
                }

            }

            if ($emptyOPIS == 'img') {
                $link_opis="Scheda non autorizzata alla pubblicazione";
            }
            else if ($emptyOPIS == '#text') {
                $link_opis="Nessun report perché numero di schede insuff.";
            }
            else if ($emptyOPIS == 'a') {
                $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]/a')->item(0)->attributes->item(0)->textContent;
                $params = $link_opis;
                $params = str_replace("./val_insegn.php?", "", $params);
                $params = str_replace("cod_corso=", "", $params);
                $params = str_replace("cod_gomp=", "", $params);
                $params = str_replace("canale=", "", $params);
                $params = explode("&", $params);

                $params[2] = str_replace(" ", "%20", $params[2]);

                //oldschede(cod_corso, cod_gomp canale);
                //oldschede($params[0], $params[1], $params[2]);
            }

        }

    }

}


function insegnamento($id_cds) {
    global $link, $mysqli, $year;

    $xpath   = new DOMXPath(getDOM($link .'insegn_cds.php?cod_corso='.$id_cds));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;
    $num     = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($lengthN-2) . ']/td[1]')->item(0)->textContent;

    if (intval($num) == 0) {
        $num = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($lengthN-3) . ']/td[1]')->item(0)->textContent;
    }

    $j = 0;
    for ($i = 2; $i < $lengthN; $i++) {

        $fields = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td')->length;

        if ($fields >= 15) {
            $j++;

            $_id          = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[2]')->item(0)->textContent;
            $_nome        = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[3]')->item(0)->textContent;
            $_canale      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[4]')->item(0)->textContent;
            $_cod_modulo  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[5]')->item(0)->textContent;
            $_ssd         = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[6]')->item(0)->textContent;
            $_tipo        = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[7]')->item(0)->textContent;
            $_anno        = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[8]')->item(0)->textContent;
            $_semestre    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[9]')->item(0)->textContent;
            $_cfu         = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]')->item(0)->textContent;
            $_docente     = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[11]')->item(0)->textContent;
            $_assegn      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[12]')->item(0)->textContent;
            $_tot_schedeF = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[13]')->item(0)->textContent;

            echo "\033[1m" . ($j) . "/" . $num . "\033[0m\t" .  $_nome . " \n";

            if ($_tot_schedeF == '')
                $_tot_schedeF = 0;

            if ($_tot_schedeNF == '')
                $_tot_schedeNF = 0;

            if ($_canale == ' ') {
                $_canale = 'no';
            }
            else {
                $_canale = str_replace(" ", "", $_canale);
            }

            // extract link_opis
            $link_opis = "";
            $emptyOPIS= $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[15]')->item(0)->firstChild->nodeName;

            if ($_cod_modulo == "" || $_cod_modulo == " ") {
                $_cod_modulo = "0";
            }

            if (!$mysqli->query('SELECT id FROM insegnamento '.
                                ' WHERE id=' . $_id .
                                ' AND anno_accademico="'. $year        . '"' .
                                ' AND canale="'         . $_canale     . '"' .
                                ' AND id_cds="'         . $id_cds      . '"' .
                                ' AND id_modulo="'      . $_cod_modulo . '"')->num_rows) {

                $query  = "INSERT INTO insegnamento (id, nome, canale, id_modulo, ssd, tipo, anno, semestre, cfu, docente, assegn, tot_schedeF, tot_schedeNF, id_cds, anno_accademico) VALUES\n";
                $query .= utf8_decode('("' .
                                      addslashes($_id) . '","' .
                                      addslashes($_nome) . '","' .
                                      addslashes($_canale) . '","' .
                                      $_cod_modulo . '", "' .
                                      addslashes($_ssd) . '", "' .
                                      addslashes($_tipo) . '", "' .
                                      addslashes($_anno) . '","' .
                                      addslashes($_semestre) . '", "' .
                                      addslashes($_cfu) . '", "' .
                                      addslashes($_docente) . '", "' .
                                      addslashes($_assegn) . '", "' .
                                      addslashes($_tot_schedeF) . '", "' .
                                      addslashes($_tot_schedeNF) . '", "' .
                                      addslashes($id_cds) . '", "'.
                                      $year . '");');

                if (!$mysqli->query($query)) {
                    die($mysqli->error);
                }

            }

            if ($emptyOPIS == 'img') {
                $link_opis = "Scheda non autorizzata alla pubblicazione";
            }
            else if ($emptyOPIS == 'a') {
                $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[15]/a')->item(0)->attributes->item(0)->textContent;

                $params = $link_opis;
                $params = str_replace("./val_insegn.php?", "", $params);
                $params = str_replace("cod_corso=", "", $params);
                $params = str_replace("cod_gomp=", "", $params);
                $params = str_replace("cod_modulo=", "", $params);
                $params = str_replace("canale=", "", $params);
                $params = explode("&", $params);

                $params[3] = str_replace(" ", "%20", $params[3]);

                // schede(cod_corso, cod_gomp, id_modulo, canale);
                schede($params[0], $params[1], $params[2], $params[3]);
            }

        }

    }

}

?>
