<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();
    
    function deleteDir($path){
        return !empty($path) && is_file($path) ?
            @unlink($path) :
            (array_reduce(glob($path.'/*'), function ($r, $i) { return $r && deleteDir($i); }, TRUE)) && @rmdir($path);
    }

    $respond = "";
    $MIid = $_POST["MIid"];
    $MIname = $_POST["MIname"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        // delete pages
        $nopg = (int)$vida->vmysqlSelect("count(id)","SELECT <> FROM submenu WHERE menuid=".$MIid, $con);
        $norpg = (int)$vida->vmysqlSelect("count(id)","SELECT <> FROM submenu", $con);
        if( $nopg>0 ){
            for( $x=0; $x<$nopg; $x++ ){
                $fstid = (int)$vida->vmysqlSelect("id","SELECT <> FROM submenu WHERE menuid=".$MIid, $con);
                $fstpos = (int)$vida->vmysqlSelect("position","SELECT <> FROM submenu WHERE menuid=".$MIid, $con);
                $table = "page".$fstid;
                mysql_query("DROP TABLE ".$table, $con);
                deleteDir("../../uploads/".$table);
                mysql_query("DELETE FROM submenu WHERE id=".$fstid, $con);
                for( $n=$fstpos; $n<$norpg; $n++ )
                { mysql_query("UPDATE submenu SET position=".$n." WHERE position=".($n+1), $con); }
            }
        }
        $nor = (int)$vida->vmysqlSelect("count(id)","SELECT <> FROM menu", $con);
        $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM menu WHERE id=".$MIid, $con);
        mysql_query("DELETE FROM menu WHERE id=".$MIid, $con);
        for( $i=$pos; $i<$nor; $i++ ){
            mysql_query("UPDATE menu SET position=".$i." WHERE position=".($i+1), $con);
        }
        
        $respond = "Deleted";
        
        mysql_close( $con );
        echo $respond;
    }

?>