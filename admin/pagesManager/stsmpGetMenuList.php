<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $menulist = array();
        $nor = (int)$vida->vmysqlSelect( "count(id)", "SELECT <> FROM menu", $con );
        for( $x=0; $x<$nor; $x++ ){
            $tmparr = array();
            $tmparr[0] = $vida->vmysqlSelect( "id", "SELECT <> FROM menu LIMIT ".$x.",1 ", $con );
            $tmparr[1] = $vida->vmysqlSelect( "name", "SELECT <> FROM menu LIMIT ".$x.",1 ", $con );
            $tmparr[1] = ceDec($tmparr[1]);
            $menulist[] = $vida->vConcatStrs( "-<x>-", $tmparr );
        }
        $respond = $vida->vConcatStrs( "([x])", $menulist );
        
        mysql_close( $con );
        echo $respond;
    }

?>