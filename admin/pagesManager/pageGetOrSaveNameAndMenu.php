<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    require( "SimpleImage.php" );
    $vida = new vida();

    $respond = "";
    $pageN = (int)$_POST["pageN"];
    $gsdo = $_POST["gsdo"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        if($gsdo=="GET"){
            $menuid = (int)$vida->vmysqlSelect( "menuid", "SELECT <> FROM submenu WHERE id=".$pageN, $con );
            $name = $vida->vmysqlSelect( "name", "SELECT <> FROM submenu WHERE id=".$pageN, $con );
            $name = ceDec($name);
            $respond = "<|1|>".$menuid."<|2|>".$name."<|3|>";
        }
        elseif($gsdo=="SAVE"){
            $nameex = $vida->vmysqlSelect( "name", "SELECT <> FROM submenu WHERE id=".$pageN, $con );
            $nameex = ceDec($nameex);
            $menuidex = (int)$vida->vmysqlSelect( "menuid", "SELECT <> FROM submenu WHERE id=".$pageN, $con );
            $name = $_POST["name"];
            $menuid = (int)$_POST["menuid"];
            $table = "page".$pageN;
            if( $nameex!=$name ){
                mysql_query( "UPDATE submenu SET name='".ceEnc($name)."' WHERE id=".$pageN, $con );
                mysql_query( "UPDATE ".$table." SET content='".ceEnc($name)."' WHERE category=1", $con );
                $respond = "saved";
            }
            if( $menuidex!=$menuid ){
                mysql_query( "UPDATE submenu SET menuid=".$menuid." WHERE id=".$pageN, $con );
                $respond = "saved";
            }
        }
        
        mysql_close( $con );
        echo $respond;
    }

?>