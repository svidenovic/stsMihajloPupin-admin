<?php

$host = "127.0.0.1";
$user = "root";
$pass = "localroot";
$dbnm = "stsmihajlopupindb";
$con = mysql_connect( $host, $user, $pass );

function contEnc(){ return true; }
function ceEnc($str){ return (contEnc())?urlencode($str):$str; }
function ceDec($str){ return (contEnc())?urldecode($str):$str; }

?>
