<?php

    require( "databaseInfo.php" );
    require( "vjswebtools.php" );
    $vida = new vida();
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $sta2s = $vida->vmysqlSelect( "status", "SELECT <> FROM mplog", $con );
        $sta2s = (int)$sta2s;
        
        mysql_close( $con );
        echo $sta2s;
    }

?>