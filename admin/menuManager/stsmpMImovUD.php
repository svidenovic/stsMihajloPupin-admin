<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $MIid = $_POST["MIid"];
    $MIname = $_POST["MIname"];
    $MIname = ceEnc($MIname);
    $strUD = $_POST["strUD"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $nor = (int)$vida->vmysqlSelect("count(id)","SELECT <> FROM menu",$con);
        if( $strUD=="U" ){
            if( $nor>1 ){
                $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM menu WHERE name='".$MIname."' AND id=".$MIid, $con);
                if($pos>1){
                    $tmpp = $pos-1;
                    $tmpname = $vida->vmysqlSelect("name","SELECT <> FROM menu WHERE position=".$tmpp, $con);
                    $tmpid = $vida->vmysqlSelect("id","SELECT <> FROM menu WHERE position=".$tmpp, $con);
                    mysql_query("UPDATE menu SET id=".$MIid.", name='".$MIname."' WHERE position=".$tmpp, $con);
                    mysql_query("UPDATE menu SET id=".$tmpid.", name='".$tmpname."' WHERE position=".$pos, $con);
                }
                $respond = "Moved";
            }
        }
        elseif( $strUD=="D" ){
            if( $nor>1 ){
                $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM menu WHERE name='".$MIname."' AND id=".$MIid, $con);
                if($pos<$nor){
                    $tmpp = $pos+1;
                    $tmpname = $vida->vmysqlSelect("name","SELECT <> FROM menu WHERE position=".$tmpp, $con);
                    $tmpid = $vida->vmysqlSelect("id","SELECT <> FROM menu WHERE position=".$tmpp, $con);
                    mysql_query("UPDATE menu SET id=".$MIid.", name='".$MIname."' WHERE position=".$tmpp, $con);
                    mysql_query("UPDATE menu SET id=".$tmpid.", name='".$tmpname."' WHERE position=".$pos, $con);
                }
                $respond = "Moved";
            }
        }
        
        mysql_close( $con );
        echo $respond;
    }

?>