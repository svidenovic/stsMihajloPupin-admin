<?php

    require( "databaseInfo.php" );
    require( "vjswebtools.php" );
    $vida = new vida();
    
    $passval = md5($_POST["passval"]);
    $respond = 0;
    $truepass = "";
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $truepass = $vida->vmysqlSelect( "mainkey", "SELECT <> FROM mplog ", $con );
        
        if( $passval == $truepass )
        {
            mysql_query( "UPDATE mplog SET status=1", $con );
            $respond = 1;
        }
        elseif( $passval != $truepass )
        {
            mysql_query( "UPDATE mplog SET status=0", $con );
            $respond = 0;
        }
        
        mysql_close( $con );
        echo $respond;
    }

?>