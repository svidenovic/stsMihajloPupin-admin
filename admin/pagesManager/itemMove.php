<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $mdir    = $_POST["mdir"];
    $itemIDn = (int)$_POST["itemIDn"];
    $pageN   = (int)$_POST["pageN"];
    $table   = "page".$pageN;
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $nor = (int)$vida->vmysqlSelect("count(itemid)", "SELECT <> FROM ".$table,$con);
        if( $mdir=="U" ){
            if( $nor>2 ){
                $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn, $con);
                if($pos>2){
		    $tmpp = $pos-1;
                    $submenuid = $vida->vmysqlSelect("submenuid","SELECT <> FROM ".$table." WHERE position=".$pos, $con);
		    $category = $vida->vmysqlSelect("category","SELECT <> FROM ".$table." WHERE position=".$pos, $con);
		    $content = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE position=".$pos, $con);
		    $params = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE position=".$pos, $con);
                    
                    $tmpitemid = $vida->vmysqlSelect("itemid","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
		    $tmpsubmenuid = $vida->vmysqlSelect("submenuid","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
		    $tmpcategory = $vida->vmysqlSelect("category","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
                    $tmpcontent = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
		    $tmpparams = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
                    
                    mysql_query("UPDATE ".$table." SET submenuid=".$submenuid.",    itemid=".$itemIDn.",   category=".$category.",    content='".$content."',    params='".$params."'    WHERE position=".$tmpp, $con);
                    mysql_query("UPDATE ".$table." SET submenuid=".$tmpsubmenuid.", itemid=".$tmpitemid.", category=".$tmpcategory.", content='".$tmpcontent."', params='".$tmpparams."' WHERE position=".$pos, $con);
                    $respond = "Moved up";
                }
            }
        }
        elseif( $mdir=="D" ){
            if( $nor>2 ){
                $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn, $con);
                if($pos<$nor){
                    $tmpp = $pos+1;
		    $submenuid = $vida->vmysqlSelect("submenuid","SELECT <> FROM ".$table." WHERE position=".$pos, $con);
		    $category = $vida->vmysqlSelect("category","SELECT <> FROM ".$table." WHERE position=".$pos, $con);
		    $content = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE position=".$pos, $con);
		    $params = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE position=".$pos, $con);
                    
                    $tmpitemid = $vida->vmysqlSelect("itemid","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
		    $tmpsubmenuid = $vida->vmysqlSelect("submenuid","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
		    $tmpcategory = $vida->vmysqlSelect("category","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
                    $tmpcontent = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
		    $tmpparams = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE position=".$tmpp, $con);
                    
		    mysql_query("UPDATE ".$table." SET submenuid=".$submenuid.",    itemid=".$itemIDn.",   category=".$category.",    content='".$content."',    params='".$params."'    WHERE position=".$tmpp, $con);
                    mysql_query("UPDATE ".$table." SET submenuid=".$tmpsubmenuid.", itemid=".$tmpitemid.", category=".$tmpcategory.", content='".$tmpcontent."', params='".$tmpparams."' WHERE position=".$pos, $con);
                    $respond = "Moved down";
                }
            }
        }
        
        mysql_close( $con );
        echo $respond;
    }

?>