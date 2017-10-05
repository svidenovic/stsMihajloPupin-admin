<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $MIlist = array();
        $inp = array();
        $nor = (int)$vida->vmysqlSelect("count(id)", "SELECT <> FROM menu", $con);
        for( $x=0; $x<$nor; $x++ ){
            $inp = array();
            $inp[0] = $vida->vmysqlSelect("id", "SELECT <> FROM menu LIMIT ".$x.", 1", $con);
            $inp[1] = $vida->vmysqlSelect("name", "SELECT <> FROM menu LIMIT ".$x.", 1", $con);
            $inp[1] = ceDec($inp[1]);
            $inp[2] = $vida->vmysqlSelect("position", "SELECT <> FROM menu LIMIT ".$x.", 1", $con);
            $MIlist[] = $inp;
        }
        $outterarr = array();
        foreach( $MIlist as $val ){
            $innerstr = ""; $innerstr = $vida->vConcatStrs("<-[x]->",$val);
            $outterarr[] = $innerstr;
        }
        $respond = $vida->vConcatStrs("|::[x]::|",$outterarr);
        
        mysql_close( $con );
        echo $respond;
    }

?>