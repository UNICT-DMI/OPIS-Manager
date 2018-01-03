<?php
  function insegnamento($id_cds) {
    global $link, $mysqli;

    $xpath   = new DOMXPath(getDOM($link .'insegn_cds.php?cod_corso='.$id_cds));
    $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;

    $query    = "INSERT INTO insegnamento (id,nome,canale,id_modulo, ssd,tipo,anno,semestre,cfu,docente,assegn,tot_schedeF,tot_schedeNF,id_cds) VALUES\n";
      for ($i=2; $i<$lengthN; $i++) {

        $fields = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td')->length;

          if ($fields>=15) {

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

            echo "\033[1m" . ($i-1) . "/" . ($lengthN-1) . "\033[0m\t" .  $_nome . " \n";

            if ($_tot_schedeF == '')
              $_tot_schedeF = 0;

            $_tot_schedeNF = $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[14]')->item(0)->textContent;
            if ($_tot_schedeNF == '')
              $_tot_schedeNF = 0;

            if ($_canale == ' ')
              $_canale = 'nd';

            // extract link_opis
            $link_opis = "";
            $emptyOPIS= $xpath->query('/html/body/table[2]/tr/td/table/tr[' . $i . ']/td[15]')->item(0)->firstChild->nodeName;

            if ($emptyOPIS == 'img')
              $link_opis="Scheda non autorizzata alla pubblicazione";
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

              // schede(cod_corso, cod_gomp, cod_modulo, canale);
              schede($params[0], $params[1], $params[2], $params[3]);
            }

            if (!$mysqli->query('SELECT id FROM insegnamento WHERE id=' . $_id . ';')->num_rows) {
                  $query .= '("' . addslashes($_id) . '","' . addslashes($_nome) . '","' . addslashes($_canale) . '","' . addslashes($_cod_modulo) . '", "'
                   . addslashes($_ssd) . '", "' . addslashes($_tipo) . '", "' . addslashes($_anno) . '","' . addslashes($_semestre) . '",
                   "' . addslashes($_cfu) . '", "' . addslashes($_docente) . '", "' . addslashes($_assegn) . '", "' . addslashes($_tot_schedeF) . '", "' . addslashes($_tot_schedeNF) . '",
                    "' . addslashes($id_cds) . '"),';
                  $query .= "\n";

            }

        }

  }
    $query = substr($query, 0, -2);
    $query .= ";";
    // echo $query;
    $endQuery = substr($query, strlen($query) - 6);
    if ($endQuery != 'VALUE;')
        if (!$mysqli->query($query))
            die($mysqli->error);

  }

?>
