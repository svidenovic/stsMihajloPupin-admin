<?php

    $cMode = $_POST["cMode"];
    $txt = $_POST["txt"];
    $respond = "";
    switch($cMode){
        case "cE": $respond = urlencode($txt);         break;
        case "cD": $respond = urldecode($txt);         break;
        case "cC": $respond = ($txt!="")?md5($txt):""; break;
        default: break;
    }
    echo $respond;

?>