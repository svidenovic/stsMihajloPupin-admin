<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $pageN = (int)$_POST["pageN"];
    $itemIDn = (int)$_POST["itemIDn"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $table = "page".$pageN;
        $content = $vida->vmysqlSelect( "content", "SELECT <> FROM ".$table." WHERE itemid=".$itemIDn, $con );
        $params = $vida->vmysqlSelect( "params", "SELECT <> FROM ".$table." WHERE itemid=".$itemIDn, $con );
        $content = ceDec($content);
        $params = ceDec($params);
        $respond = "-|<|:-1-:|>|-".$content."-|<|:-2-:|>|-".$params."-|<|:-3-:|>|-";
        
        mysql_close( $con );
        echo $respond;
    }

?>