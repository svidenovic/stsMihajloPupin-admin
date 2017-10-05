<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $name = $_POST["name"];
    $pos = 0;
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $idarr = array();
        $nor = (int)$vida->vmysqlSelect("count(id)", "SELECT <> FROM menu", $con);
        for( $i=0; $i<$nor; $i++ ){
            $idarr[] = (int)$vida->vmysqlSelect("id", "SELECT <> FROM menu LIMIT ".$i.",1", $con);
        } $idarr[] = 0;
        $newid = $vida->genID($idarr);
        
        $norw = (int)$vida->vmysqlSelect("count(id)", "SELECT <> FROM menu", $con);
        if($norw<1){ $pos=1; }
        else{ $pos=$norw+1; }
        mysql_query( "INSERT INTO menu (id,name,position) VALUES (".$newid.",'".ceEnc($name)."',".$pos.")", $con );
        $respond = "<<success>>";
        
        mysql_close( $con );
        echo $respond;
    }

?>