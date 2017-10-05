<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $MIid = $_POST["MIid"];
    $name = $_POST["name"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        mysql_query( "UPDATE menu SET name='".ceEnc($name)."' WHERE id=".$MIid, $con );
        $respond = "Edited";
        
        mysql_close( $con );
        echo $respond;
    }

?>