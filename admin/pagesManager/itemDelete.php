<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    $vida = new vida();

    $respond = "";
    $itemIDn = (int)$_POST["itemIDn"];
    $itemtype = (int)$_POST["itemtype"];
    $pageN     = (int)$_POST["pageN"];
    $table     = "page".$pageN;
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        if( $itemtype<=1 ){}
        
        elseif( $itemtype == 2 ) /* text */ {
            $nor = (int)$vida->vmysqlSelect("count(itemid)","SELECT <> FROM ".$table,$con);
            $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            mysql_query( "DELETE FROM ".$table." WHERE itemid=".$itemIDn, $con );
            for( $i=$pos; $i<$nor; $i++ ){
                mysql_query("UPDATE ".$table." SET position=".$i." WHERE position=".($i+1),$con);
            }
            $respond = "Deleted";
        } /* 2 */
        
        elseif( $itemtype == 3 ) /* image */ {
            $imgsrcThumb = "../../".$vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            $imgsrcThumb = ceDec($imgsrcThumb);
            $imgsrcOrig  = str_replace("thumbs/","",$imgsrcThumb);
            $imgthumb_exists = file_exists($imgsrcThumb);
            $imgOrig_exists = file_exists($imgsrcOrig);
            if($imgthumb_exists){ unlink($imgsrcThumb); }
            if($imgOrig_exists){ unlink($imgsrcOrig); }
            $nor = (int)$vida->vmysqlSelect("count(itemid)","SELECT <> FROM ".$table,$con);
            $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            mysql_query( "DELETE FROM ".$table." WHERE itemid=".$itemIDn, $con );
            for( $i=$pos; $i<$nor; $i++ )
            { mysql_query("UPDATE ".$table." SET position=".$i." WHERE position=".($i+1),$con); }
            $respond = "Deleted";
        } /* 3 */
        
        elseif( $itemtype == 4 ) /* gallery */ {
            $dbcont = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            $dbcont = ceDec($dbcont);
            $imgarr = $vida->vStrTrans2arr($dbcont,"<(x)>");
            for( $x=0; $x<sizeof($imgarr); $x++ ){
                $imgsrcThumb = "../../".$imgarr[$x];
                $imgsrcOrig  = str_replace("thumbs/","",$imgsrcThumb);
                $imgthumb_exists = file_exists($imgsrcThumb);
                $imgOrig_exists = file_exists($imgsrcOrig);
                if($imgthumb_exists){ unlink($imgsrcThumb); }
                if($imgOrig_exists){ unlink($imgsrcOrig); }
            }
            $nor = (int)$vida->vmysqlSelect("count(itemid)","SELECT <> FROM ".$table,$con);
            $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            mysql_query( "DELETE FROM ".$table." WHERE itemid=".$itemIDn, $con );
            for( $i=$pos; $i<$nor; $i++ )
            { mysql_query("UPDATE ".$table." SET position=".$i." WHERE position=".($i+1),$con); }
            $respond = "Deleted";
        } /* 4 */
        
        elseif( $itemtype == 5 ) /* file */ {
            $filesrc = "../../".$vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            $filesrc = ceDec($filesrc);
            $filesrc_exists = file_exists($filesrc);
            if($filesrc_exists){ unlink($filesrc); }
            $nor = (int)$vida->vmysqlSelect("count(itemid)","SELECT <> FROM ".$table,$con);
            $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            mysql_query( "DELETE FROM ".$table." WHERE itemid=".$itemIDn, $con );
            for( $i=$pos; $i<$nor; $i++ )
            { mysql_query("UPDATE ".$table." SET position=".$i." WHERE position=".($i+1),$con); }
            $respond = "Deleted";
        } /* 5 */
            
        elseif( $itemtype == 6 ) /* embed */ {
            $nor = (int)$vida->vmysqlSelect("count(itemid)","SELECT <> FROM ".$table,$con);
            $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            mysql_query( "DELETE FROM ".$table." WHERE itemid=".$itemIDn, $con );
            for( $i=$pos; $i<$nor; $i++ ){
                mysql_query("UPDATE ".$table." SET position=".$i." WHERE position=".($i+1),$con);
            }
            $respond = "Deleted";
        } /* 6 */
            
        elseif( $itemtype == 7 ) /* link */ {
            $nor = (int)$vida->vmysqlSelect("count(itemid)","SELECT <> FROM ".$table,$con);
            $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            mysql_query( "DELETE FROM ".$table." WHERE itemid=".$itemIDn, $con );
            for( $i=$pos; $i<$nor; $i++ ){
                mysql_query("UPDATE ".$table." SET position=".$i." WHERE position=".($i+1),$con);
            }
            $respond = "Deleted";
        } /* 7 */
        elseif( $itemtype == 8 ) /* combo */ {
            $imgsrcThumb = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            $imgsrcThumb = ceDec($imgsrcThumb);
            $imgsrcThumb = "../../".$vida->vStrSection(1, $imgsrcThumb, "<<|x|>>");
            $imgsrcOrig  = str_replace("thumbs/","",$imgsrcThumb);
            $imgthumb_exists = file_exists($imgsrcThumb);
            $imgOrig_exists = file_exists($imgsrcOrig);
            if($imgthumb_exists){ unlink($imgsrcThumb); }
            if($imgOrig_exists){ unlink($imgsrcOrig); }
            $nor = (int)$vida->vmysqlSelect("count(itemid)","SELECT <> FROM ".$table,$con);
            $pos = (int)$vida->vmysqlSelect("position","SELECT <> FROM ".$table." WHERE itemid=".$itemIDn,$con);
            mysql_query( "DELETE FROM ".$table." WHERE itemid=".$itemIDn, $con );
            for( $i=$pos; $i<$nor; $i++ )
            { mysql_query("UPDATE ".$table." SET position=".$i." WHERE position=".($i+1),$con); }
            $respond = "Deleted";
        } /* 8 */
        
        else{}
        
        mysql_close( $con );
        echo $respond;
    }

?>