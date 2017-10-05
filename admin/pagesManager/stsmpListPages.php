<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $Plist = array();
        $inp = array();
        $nor = (int)$vida->vmysqlSelect("count(id)", "SELECT <> FROM submenu", $con);
        for( $x=0; $x<$nor; $x++ ){
            $inp = array();
            $inp[0] = $vida->vmysqlSelect("id", "SELECT <> FROM submenu LIMIT ".$x.", 1", $con);
            $inp[1] = $vida->vmysqlSelect("name", "SELECT <> FROM submenu LIMIT ".$x.", 1", $con);
            $inp[1] = ceDec($inp[1]);
            $tmpmid = $vida->vmysqlSelect("menuid", "SELECT <> FROM submenu LIMIT ".$x.", 1", $con);
            $inp[2] = $vida->vmysqlSelect("name", "SELECT <> FROM menu WHERE id=".$tmpmid, $con);
            $inp[2] = ceDec($inp[2]);
            $inp[3] = $vida->vmysqlSelect("approved", "SELECT <> FROM submenu LIMIT ".$x.", 1", $con);
            $Plist[] = $inp;
        }
        $outterarr = array();
        foreach( $Plist as $val ){
            $innerstr = ""; $innerstr = $vida->vConcatStrs("<[x]>",$val);
            $outterarr[] = $innerstr;
        }
        $respond = $vida->vConcatStrs("|:[x]:|",$outterarr);
        
        mysql_close( $con );
        echo $respond;
    }

?>