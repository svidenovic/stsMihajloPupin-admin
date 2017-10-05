<?php

    require( "../../deps/databaseInfo.php" );
    
    $respond = "";
    $pageID = (int)$_POST["pageID"];
    $appr = (int)$_POST["appr"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        
        if($appr==1)
        { mysql_query( "UPDATE submenu SET approved=0 WHERE id=".$pageID, $con ); $respond=0; }
        elseif($appr==0)
        { mysql_query( "UPDATE submenu SET approved=1 WHERE id=".$pageID, $con ); $respond=1; }
        
        mysql_close( $con );
        echo $respond;
    }

?>