<?php
    include 'cds.php';
    cds(dip());
    function dip() {
      include 'config.php';
      include 'globalVar.php';
      include 'methods.php';
      $arr = array();
      $mysqli = new mysqli($host, $username, $password, $db_name);

      if ($mysqli->connect_error)
        die('Errore di connessione');


      else {
        //$mysqli->select_db($db_name);
        $xpath = new DOMXPath(getDOM($link));
        $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length; // Lunghezza righe

  			$query = "INSERT INTO dipartimento (nome, tot_cds, tot_moduli,tot_valutati,tot_schedeF,tot_schedeNF) VALUES\n";
        $j = 0;
        for ($i = 2; $i < $lengthN; $i++) {

                $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[1]/a')->item(0)->attributes->item(0)->textContent; //Link Dipartimento
                $_nome = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[1]')->item(0)->textContent; // Nome dipartimento

                $_tot_CdS = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[2]')->item(0)->textContent; // Tot CdS

                $_tot_moduli = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[3]')->item(0)->textContent; // Tot Moduli

                $_tot_valutati = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[4]')->item(0)->textContent; // Tot Valutati

                $_tot_schedeF= $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[6]')->item(0)->textContent; // Totale schede frequentanti

                $_tot_schedeNF= $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[7]')->item(0)->textContent; // Totale schede NON frequentanti

                $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[8]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS

                $arr[$j] = $linkDipartimento;
                $aPathOpis_Dipartimento[$j] = $link_opis;

                $j++;

                if (!$mysqli->query('SELECT id FROM dipartimento WHERE id='.$j.';')->num_rows) {
                  $query .= '("' . addslashes($_nome) . '","' . addslashes($_tot_CdS) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '", "' . addslashes($_tot_schedeNF) . '"),';
                  $query .= "\n";
                }

        }

  			$query = substr($query, 0, -2);
  			$query .= ";";

        $endQuery = substr($query,strlen($query)-6);
        if ($endQuery != 'VALUE;')
          if (!$mysqli->query($query))
            die($mysqli->error);
        return $arr;
      }
    }
    function getDOM($link){
        libxml_use_internal_errors(true);
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $link);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $html = curl_exec($ch);
        $dom = new DOMDocument;
        $dom->loadHTML($html);
        curl_close($ch);
        return $dom;
    }
    function cds($aPath) {
      include 'methods.php';
      include 'globalVar.php';
      include 'config.php';
      $mysqli = new mysqli($host, $username, $password, $db_name);
      if ($mysqli->connect_error)
        die('Errore di connessione');

        $query = "INSERT INTO cds (id, nome,classe,tot_moduli,tot_valutati,tot_schedeF,tot_schedeNF,id_dipartimento) VALUES\n";
        for ($i=0; $i<count($aPath); $i++) {
          $xpath = new DOMXPath(getDOM($link.$aPath[$i]));
          $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length;

          for ($j=2; $j<$lengthN; $j++) {

            $_cod_corso =  $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[2]')->item(0)->textContent;
            $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[3]/a')->item(0)->attributes->item(0)->textContent;
            $_nome = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[3]')->item(0)->textContent;

            $_classe = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[4]')->item(0)->textContent;

            $_tot_moduli = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[5]')->item(0)->textContent;

            $_tot_valutati = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[6]')->item(0)->textContent;

            $_tot_schedeF= $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[8]')->item(0)->textContent;

            $_tot_schedeNF= $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[9]')->item(0)->textContent;

            $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$j.']/td[10]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS
            if (!$mysqli->query('SELECT id FROM cds WHERE id='.$_cod_corso.';')->num_rows) {
              $query .= '("' . addslashes($_cod_corso) . '", "' . addslashes($_nome) . '", "' . addslashes($_classe) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '","' . addslashes($_tot_schedeNF) . '","' . addslashes($i+1) . '"),';
              $query .= "\n";

            }
          }

      }
      $query = substr($query, 0, -2);
      $query .= ";";
      $endQuery = substr($query,strlen($query)-6);

      if ($endQuery != 'VALUE;')
        if (!$mysqli->query($query))
          die($mysqli->error);

    }

?>
