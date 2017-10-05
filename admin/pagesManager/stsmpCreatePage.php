<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $pgname = $_POST["pagename"];
    $menuid = $_POST["menuid"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $pg_exists = false;
        $nor = (int)$vida->vmysqlSelect( "count(id)", "SELECT <> FROM submenu", $con );
        for( $n=0; $n<$nor; $n++ ){
            $nameindb = $vida->vmysqlSelect( "name", "SELECT <> FROM submenu LIMIT ".$n.",1", $con );
            $nameindb = ceDec($nameindb);
            if( $nameindb==$pgname ){ $pg_exists=true; break; }
            else{ $pg_exists=false; }
        }
        if($pg_exists){ $respond = "page_exists"; }
        elseif(!$pg_exists){
            $idarr = array();
            $nori = (int)$vida->vmysqlSelect("count(id)", "SELECT <> FROM submenu", $con);
            for( $i=0; $i<$nori; $i++ ){
                $idarr[] = (int)$vida->vmysqlSelect("id", "SELECT <> FROM submenu LIMIT ".$i.",1", $con);
            } $idarr[] = 0;
            $newid = $vida->genID($idarr);
            $pos = 0;
            if($nor<1){ $pos=1; }
            else{ $pos=$nor+1; }
            mysql_query( "INSERT INTO submenu (id,menuid,name,position,approved) VALUES (".$newid.",".$menuid.",'".ceEnc($pgname)."',".$pos.",0)", $con );
            
            $newtable = "page".$newid;
            mysql_query( "CREATE TABLE ".$newtable." ( submenuid int, itemid int, category int, content longtext, params text, position int ) CHARACTER SET utf8 COLLATE utf8_unicode_ci", $con );
            mysql_query( "INSERT INTO ".$newtable." (submenuid,itemid,category,content,params,position) VALUES (".$newid.",1,1,'".ceEnc($pgname)."','',1)", $con );
            mkdir("../../uploads/".$newtable);
            mkdir("../../uploads/".$newtable."/thumbs/");
            
            $respond = $newid;
        }
        
        mysql_close( $con );
        echo $respond;
    }

?>