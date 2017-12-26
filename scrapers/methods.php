<?php

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

?>
