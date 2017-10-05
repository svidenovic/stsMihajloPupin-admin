<?php

    require( "databaseInfo.php" );
    require( "vjswebtools.php" );
    $vida = new vida();
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        mysql_query( "UPDATE mplog SET status=0", $con );
        
        mysql_close( $con );
        echo "lo";
    }

?>