<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $pageN = $_POST["pageN"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $table = "page".$pageN;
        $items = array();
        $nor = (int)$vida->vmysqlSelect( "count(itemid)", "SELECT <> FROM ".$table, $con );
        for( $x=0; $x<$nor; $x++ ){
            $item = array();
            $item[0] = $vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$x.",1", $con );
            $item[1] = $vida->vmysqlSelect( "category", "SELECT <> FROM ".$table." LIMIT ".$x.",1", $con );
            $item[2] = $vida->vmysqlSelect( "content", "SELECT <> FROM ".$table." LIMIT ".$x.",1", $con );
            $item[3] = $vida->vmysqlSelect( "params", "SELECT <> FROM ".$table." LIMIT ".$x.",1", $con );
            $item[2] = ceDec($item[2]);
            $item[3] = ceDec($item[3]);
            $item[3] = ($item[3]=="")?"null":$item[3];
            $items[] = $vida->vConcatStrs( "(-:x:-)", $item );
        }
        $respond = $vida->vConcatStrs( "]|-x-|[", $items );
        
        mysql_close( $con );
        echo $respond;
    }

?>