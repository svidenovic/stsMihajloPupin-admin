<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $Pid = $_POST["Pid"];
    $strUD = $_POST["strUD"];
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $nor = (int)$vida->vmysqlSelect("count(id)","SELECT <> FROM submenu",$con);
        if( $strUD=="U" ){
            if( $nor>1 ){
                $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM submenu WHERE id=".$Pid, $con);
                if($pos>1){
		    $tmpp = $pos-1;
		    $Pid = (int)$Pid;
		    $menuid = $vida->vmysqlSelect("menuid","SELECT <> FROM submenu WHERE position=".$pos, $con);
		    $name = $vida->vmysqlSelect("name","SELECT <> FROM submenu WHERE position=".$pos, $con);
		    $appr = $vida->vmysqlSelect("approved","SELECT <> FROM submenu WHERE position=".$pos, $con);
		    
                    $tmpid = $vida->vmysqlSelect("id","SELECT <> FROM submenu WHERE position=".$tmpp, $con);
		    $tmpmenuid = $vida->vmysqlSelect("menuid","SELECT <> FROM submenu WHERE position=".$tmpp, $con);
		    $tmpname = $vida->vmysqlSelect("name","SELECT <> FROM submenu WHERE position=".$tmpp, $con);
                    $tmpappr = $vida->vmysqlSelect("approved","SELECT <> FROM submenu WHERE position=".$tmpp, $con);
		    
		    mysql_query("UPDATE submenu SET id=".$Pid.", menuid=".$menuid.", name='".$name."', approved=".$appr." WHERE position=".$tmpp, $con);
                    mysql_query("UPDATE submenu SET id=".$tmpid.", menuid=".$tmpmenuid.", name='".$tmpname."', approved=".$tmpappr." WHERE position=".$pos, $con);
                }
                $respond = "Moved";
            }
        }
        elseif( $strUD=="D" ){
            if( $nor>1 ){
                $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM submenu WHERE id=".$Pid, $con);
                if($pos<$nor){
                    $tmpp = $pos+1;
		    $Pid = (int)$Pid;
		    $menuid = $vida->vmysqlSelect("menuid","SELECT <> FROM submenu WHERE position=".$pos, $con);
		    $name = $vida->vmysqlSelect("name","SELECT <> FROM submenu WHERE position=".$pos, $con);
		    $appr = $vida->vmysqlSelect("approved","SELECT <> FROM submenu WHERE position=".$pos, $con);
		    
                    $tmpid = $vida->vmysqlSelect("id","SELECT <> FROM submenu WHERE position=".$tmpp, $con);
		    $tmpmenuid = $vida->vmysqlSelect("menuid","SELECT <> FROM submenu WHERE position=".$tmpp, $con);
		    $tmpname = $vida->vmysqlSelect("name","SELECT <> FROM submenu WHERE position=".$tmpp, $con);
                    $tmpappr = $vida->vmysqlSelect("approved","SELECT <> FROM submenu WHERE position=".$tmpp, $con);
		    
		    mysql_query("UPDATE submenu SET id=".$Pid.", menuid=".$menuid.", name='".$name."', approved=".$appr." WHERE position=".$tmpp, $con);
                    mysql_query("UPDATE submenu SET id=".$tmpid.", menuid=".$tmpmenuid.", name='".$tmpname."', approved=".$tmpappr." WHERE position=".$pos, $con);
                }
                $respond = "Moved";
            }
        }
        
        mysql_close( $con );
        echo $respond;
    }

?>