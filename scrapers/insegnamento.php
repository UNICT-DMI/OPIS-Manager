<?php

function get_primary_id_ins(int $codice_gomp, $canale): int {
  global $mysqli, $year;
  
  $result = $mysqli->query("SELECT id FROM insegnamento WHERE codice_gomp = $codice_gomp AND anno_accademico = '$year' AND canale = '$canale'");
  while($row = $result->fetch_array(MYSQLI_ASSOC)) {
    return $row["id"];
  }

  echo "\nSELECT id FROM insegnamento WHERE codice_gomp = $codice_gomp AND anno_accademico = '$year'";
  die("\n\nError getting the primary id of insegnamento");
}

function check_special_chars(&$str) {
    for ($j=0; $j<strlen($str)-1; $j++)
        if (strlen(mb_substr($str, $j, 1, 'utf-8')) == 2) {             //se il carattere della stringa occupa 2 caratteri vuol dire che è un carattere "strano"
            $str = substr($str, 0, $j)."0".substr($str, $j+2);    //togliamo i primi 2 (che sarebbe il primo, ma quello strano) caratteri della stringa e concateniamo lo 0
        }
}

function insegnamento($unict_id_cds, $primary_id_cds) {
    global $link, $mysqli, $year;

    $xpath   = new DOMXPath(getDOM($link .'insegn_cds.php?cod_corso='.$unict_id_cds));
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

            $canale_text = "";
            if ($_canale == ' ') {
                $_canale = 'no';
            }
            else {
                $_canale = str_replace(" ", "", $_canale);
                $_canale = str_replace("Nuovocanale", "", $_canale);
                $canale_text = "(".$_canale.")";
            }

            echo "\033[1m" . ($j) . "/" . $num . "\033[0m\t" .  $_nome . " " . $canale_text . " \n";

            // extract link_opis
            $link_opis = "";
            $emptyOPIS= $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[15]')->item(0)->firstChild->nodeName;

            if ($_cod_modulo == "" || $_cod_modulo == " ") {
                $_cod_modulo = "0";
            } else {
                $_cod_modulo = substr($_cod_modulo, 0, strpos($_cod_modulo, "-")-1);
            }

            $_anno = str_replace("Â", "", $_anno);
            $_anno = str_replace("°", "", $_anno);

            if (!$mysqli->query('SELECT codice_gomp FROM insegnamento '.
                                ' WHERE codice_gomp='   . $_id          .
                                ' AND anno_accademico="'. $year         . '"' .
                                ' AND canale="'         . $_canale      . '"' .
                                ' AND id_cds='          . $unict_id_cds .
                                ' AND id_modulo="'      . $_cod_modulo  . '"')->num_rows) {

                $query  = "INSERT INTO insegnamento (codice_gomp, nome, canale, id_modulo, ssd, tipo, anno, semestre, cfu, docente, assegn, id_cds, anno_accademico) VALUES\n";
                $query .= utf8_decode('(' .
                                      $_id . ',"' .
                                      addslashes($_nome) . '","' .
                                      addslashes($_canale) . '","' .
                                      $_cod_modulo . '", "' .
                                      addslashes($_ssd) . '", "' .
                                      addslashes($_tipo) . '", "' .
                                      addslashes($_anno) . '","' .
                                      addslashes($_semestre) . '", "' .
                                      addslashes($_cfu) . '", "' .
                                      addslashes($_docente) . '", "' .
                                      addslashes($_assegn) . '", ' .
                                      $primary_id_cds . ', "'.
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

                $primary_id = get_primary_id_ins($params[1], $_canale);

                // schede(cod_corso, cod_gomp, id_modulo, canale);
                schede($primary_id, $params[0], $params[1], $params[2], $params[3]);
            }

        }

    }

}


function oldinsegnamento($unict_id_cds, $primary_id_cds) {
    global $link, $mysqli, $year;

    $xpath   = new DOMXPath(getDOM($link .'insegn_cds.php?cod_corso='.$unict_id_cds));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;

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

                if ($xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($i+1) . ']/td')->item(0)->getAttribute("colspan") == 6) {
                    $_tipo2 = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($i+1) . ']/td[2]')->item(0)->textContent;
                    $_anno2 = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($i+1) . ']/td[3]')->item(0)->textContent;
                    $_semestre2 = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($i+1) . ']/td[4]')->item(0)->textContent;
                    $_cfu2 = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($i+1) . ']/td[5]')->item(0)->textContent;
                    $_docente2 = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($i+1) . ']/td[6]')->item(0)->textContent;
                    $_assegn2 = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . ($i+1) . ']/td[7]')->item(0)->textContent;
                }

            }
            else {
                //$_n_moduli    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[5]')->item(0)->textContent;
                $_anno        = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[6]')->item(0)->textContent;
                $_semestre    = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[7]')->item(0)->textContent;
                $_cfu         = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[8]')->item(0)->textContent;
                $_mutuaz      = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[9]')->item(0)->textContent;
                $_tot_schede  = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]')->item(0)->textContent; // "frequentanti + non frequentanti"
                $_docente     = "";
				
                $_tot_schede_arr = explode('+', $_tot_schede); //dividiamo la stringa
            }

            $canale_text = "";
            if ($_canale == ' ') {
                $_canale = 'no';
            }
            else {
                $_canale = str_replace(" ", "", $_canale);
                $canale_text = "(".$_canale.")";
            }

            echo "\033[1m" . ($j) . "\033[0m\t" .  $_nome . " " . $canale_text . "\n";

            // extract link_opis
            $link_opis = "";
            if($year == "2015/2016"){
                $emptyOPIS = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[15]')->item(0)->firstChild->nodeName; // non frequentanti
            }
            else {
                $emptyOPIS= $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]')->item(0)->firstChild->nodeName;
                if ($year == "2014/2015") {
                    $_id = substr($_id, 0, -2);
                }
            }

            check_special_chars($_id_modulo);
            if($_id_modulo == "" || $_id_modulo == " ")
                $_id_modulo = "0";
    
            $_anno = str_replace("°", "", $_anno);
            $_anno = str_replace(" ", "", $_anno);
            $_anno = str_replace("Â", "", $_anno);

            $_anno2 = str_replace("°", "", $_anno);
            $_anno2 = str_replace(" ", "", $_anno);
            $_anno2 = str_replace("Â", "", $_anno);


            if (strlen($_anno) > 1) {
                $_anno = substr($_anno, 1, 2);
            }

            if (!$mysqli->query('SELECT codice_gomp FROM insegnamento '.
                                ' WHERE codice_gomp=' . $_id .
                                '  AND anno_accademico="'.$year.
                                '" AND canale="' . $_canale .
                                '" AND id_cds=' . $unict_id_cds .
                                '  AND id_modulo="' . $_id_modulo .
                                '" AND docente="' . $_docente .'"')->num_rows) {
                if($year == "2015/2016") {
                    $query  = "INSERT INTO insegnamento (codice_gomp, nome, id_modulo, canale, anno, semestre, cfu, id_cds, ssd, tipo, docente, assegn, anno_accademico) VALUES\n";
                    $query .= utf8_decode('(' . $_id . ',"' .
                                          addslashes($_nome) . '","' .
                                          addslashes($_id_modulo) . '","' .
                                          addslashes($_canale) . '","' .
                                          addslashes($_anno) . '","' .
                                          addslashes($_semestre) . '","' .
                                          addslashes($_cfu) . '", ' .
                                          $primary_id_cds . ', "' .
                                          addslashes($_ssd) . '", "' .
                                          addslashes($_tipo) . '", "' .
                                          addslashes($_docente) . '", "' .
                                          addslashes($_assegn) . '", "' .
                                          $year . '");' . "\n");
                }
                else {
                    $query  = "INSERT INTO insegnamento (codice_gomp, nome, id_modulo, canale, anno, semestre, cfu, id_cds, anno_accademico) VALUES\n";
                    $query .= utf8_decode('(' . $_id . ',"' .
                                          addslashes($_nome) . '","' .
                                          '0","' .
                                          addslashes($_canale) . '","' .
                                          addslashes($_anno) . '","' .
                                          addslashes($_semestre) . '","' .
                                          addslashes($_cfu) . '", ' .
                                          $primary_id_cds . ', "' .
                                          $year . '");');
                }

                if (!$mysqli->query($query)) {
                    die($mysqli->error);
                }

            }

            if(!empty($_docente2) && (!$mysqli->query('SELECT codice_gomp FROM insegnamento '.
                                ' WHERE codice_gomp=' . $_id .
                                '  AND anno_accademico="'.$year.
                                '" AND canale="' . $_canale .
                                '" AND id_cds="' . $unict_id_cds .
                                '" AND id_modulo="' . $_id_modulo .
                                '" AND docente="' . $_docente2 .'"')->num_rows) ) {
                $query  = "INSERT INTO insegnamento (codice_gomp, nome, id_modulo, canale, anno, semestre, cfu, id_cds, ssd, tipo, docente, assegn, anno_accademico) VALUES\n";
                $query .= utf8_decode('(' . $_id . ',"' .
                                      addslashes($_nome) . '","' .
                                      addslashes($_id_modulo) . '","' .
                                      addslashes($_canale) . '","' .
                                      addslashes($_anno2) . '","' .
                                      addslashes($_semestre2) . '","' .
                                      addslashes($_cfu2) . '", ' .
                                      $primary_id_cds . ', "' .
                                      addslashes($_ssd) . '", "' .
                                      addslashes($_tipo2) . '", "' .
                                      addslashes($_docente2) . '", "' .
                                      addslashes($_assegn2) . '", "' .
                                      $year . '");');

                if (!$mysqli->query($query)) {
                    die($mysqli->error);
                }
            }

            $_docente2 = "";

            if ($emptyOPIS == 'img') {
                $link_opis="Scheda non autorizzata alla pubblicazione";
            }
            else if ($emptyOPIS == '#text') {
                $link_opis="Nessun report perché numero di schede insuff.";
            }
            else if ($emptyOPIS == 'a') {
                if($year != "2015/2016")
                    $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[10]/a')->item(0)->attributes->item(0)->textContent;
                else{
                    $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[15]/a')->item(0)->attributes->getNamedItem("href")->textContent;
                }                

                $params = $link_opis;
                $params = str_replace("./val_insegn.php?", "", $params);
                $params = str_replace("cod_corso=", "", $params);
                $params = str_replace("cod_gomp=", "", $params);
                $params = str_replace("cod_modulo=", "", $params);
                $params = str_replace("canale=", "", $params);
                $params = explode("&", $params);

                $params[2] = str_replace(" ", "%20", $params[2]);

                $primary_id = get_primary_id_ins($params[1], $_canale);

                //oldschede(cod_corso, cod_gomp canale);
                if($year != "2015/2016")
                    oldschede($primary_id, $params[0], $params[1], $params[2]);
                else
                    schede($primary_id, $params[0], $params[1], $params[2], $params[3]);
            }

        }

    }

}

?>
