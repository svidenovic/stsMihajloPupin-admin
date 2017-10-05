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
        $ids = array();
        $nor = (int)$vida->vmysqlSelect( "count(itemid)", "SELECT <> FROM ".$table, $con );
        for( $x=0; $x<$nor; $x++ ){
            $ids[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$x.",1", $con );
        } $ids[] = 0;
        $respond = $vida->genID($ids);
        
        mysql_close( $con );
        echo $respond;
    }

?>