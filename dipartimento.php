<?php
    include 'methods.php';
    include 'config.php';

    $link = "http://www.rett.unict.it/nucleo/val_did/anno_1617/";
    $doc = getDOM($link);

    $mysqli = new mysqli($db_server, $name, $password, $db_name);

    if ($mysqli->connect_error)
      die('Errore di connessione');

    else {
      //$mysqli->select_db($db_name);
      $xpath = new DOMXPath($doc);
      $lengthN = $xpath->query('/html/body/table[2]/tr/td/table/tr')->length; // Lunghezza righe
      for ($i=2; $i<$lengthN; $i++) {

              $linkDipartimento = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[1]/a')->item(0)->attributes->item(0)->textContent."<br>"; //Link Dipartimento
              $_name = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[1]')->item(0)->textContent; // Nome dipartimento

              $_tot_moduli = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[3]')->item(0)->textContent; // Tot Moduli

              $_tot_valutati = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[4]')->item(0)->textContent; // Tot Valutati

              $_tot_schedeF= $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[6]')->item(0)->textContent; // Totale schede frequentanti

              $_tot_schedeNF= $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[7]')->item(0)->textContent; // Totale schede NON frequentanti

              $link_opis = $xpath->query('/html/body/table[2]/tr/td/table/tr['.$i.']/td[8]/a')->item(0)->attributes->item(0)->textContent; // Link OPIS


              $query = "INSERT INTO dipartimento (name, tot_moduli,tot_valutati,tot_schedeF,tot_schedeNF) VALUES ('$_name','$_tot_moduli','$_tot_valutati',
                 '$_tot_schedeF','$_tot_schedeNF');";

              if (!$mysqli->query($query)) {
                die($mysqli->error);
              }
      }
    }
?>
