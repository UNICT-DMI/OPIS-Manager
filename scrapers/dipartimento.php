<?php
    include 'methods.php';
    include 'config.php';

    
    $mysqli = new mysqli($host, $username, $password, $db_name);

    if ($mysqli->connect_error)
      die('Errore di connessione');

    else {
      //$mysqli->select_db($db_name);
      $xpath = new DOMXPath(getDOM($link));
      $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length; // Lunghezza righe

			$query = "INSERT INTO dipartimento (name, tot_moduli,tot_valutati,tot_schedeF,tot_schedeNF) VALUES\n";

      for ($i = 2; $i < $lengthN; $i++) {

              $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[1]/a')->item(0)->attributes->item(0)->textContent."<br>"; //Link Dipartimento
              $_name = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[1]')->item(0)->textContent; // Nome dipartimento

              $_tot_CdS = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[2]')->item(0)->textContent; // Tot CdS

              $_tot_moduli = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[3]')->item(0)->textContent; // Tot Moduli

              $_tot_valutati = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[4]')->item(0)->textContent; // Tot Valutati

              $_tot_schedeF= $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[6]')->item(0)->textContent; // Totale schede frequentanti

              $_tot_schedeNF= $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[7]')->item(0)->textContent; // Totale schede NON frequentanti

              $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[8]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS


              $query .= '("' . addslashes($_name) . '", "' . addslashes($_tot_moduli) . '", "' . addslashes($_tot_valutati) . '", "' . addslashes($_tot_schedeF) . '", "' . addslashes($_tot_schedeNF) . '"),';
              $query .= "\n";
      }
 
			$query = substr($query, 0, -2);
			$query .= ";";

//			echo "\n" . $query . "\n";
      
			if (!$mysqli->query($query))
				die($mysqli->error);

    }
?>
