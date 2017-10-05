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
    $Pid = $_POST["Pid"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $nor = (int)$vida->vmysqlSelect("count(id)","SELECT <> FROM submenu",$con);
        $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM submenu WHERE id=".$Pid,$con);
        // delete from submenu
        mysql_query("DELETE FROM submenu WHERE id=".$Pid,$con);
        for( $i=$pos; $i<$nor; $i++ ){
            mysql_query("UPDATE submenu SET position=".$i." WHERE position=".($i+1),$con);
        }
        mysql_query("DROP TABLE page".$Pid, $con);
        deleteDir("../../uploads/page".$Pid);
        
        $respond = "Deleted";
        
        mysql_close( $con );
        echo $respond;
    }

?>