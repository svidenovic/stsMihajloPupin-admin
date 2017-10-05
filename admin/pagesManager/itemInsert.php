<?php

    require( "../../deps/databaseInfo.php" );
    require( "../../deps/vjswebtools.php" );
    require( "SimpleImage.php" );
    $vida = new vida();

    $respond = "";
    $iParams   = $_POST["itemParams"];
    $iID       = (int)$_POST["itemIDn"];
    $icategory = (int)$_POST["icategory"];
    $pageN     = (int)$_POST["pageN"];
    
    $table     = "page".$pageN;
    $valid_formats = array("image/jpg","image/jpeg","image/pjpeg","image/png","image/gif");
    //$maxFsize = 2097152; // 2 MB
    $maxFsize = 536870912; // 512 MB
    $path = "../../uploads/page".$pageN."/";
    
    if( $con )
    {
        mysql_select_db( $dbnm, $con );
        
        $item_exists = false;
        $nor = $vida->vmysqlSelect( "count(itemid)", "SELECT <> FROM ".$table, $con );
        for( $x=0; $x<$nor; $x++ ){
            $xitemid = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$x.",1", $con );
            $item_exists = ($xitemid==$iID)?true:false; if($item_exists){break;}
        }
        
        if( $icategory<=0 ){}
        
        elseif( $icategory == 1 ) /* title */
        {
            $icontent = $_POST["icontent"];
            if($item_exists){
                mysql_query("UPDATE ".$table." SET content='".ceEnc($icontent)."', params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con);
                $respond = "Edited";
            }
            elseif(!$item_exists){   
                $idlist = array();
                for( $i=0; $i<$nor; $i++ )
                { $idlist[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$i.",1", $con ); }
                $idlist[] = 0;
                $newid = $vida->genID($idlist);
                $newpos = $nor+1;
                mysql_query("INSERT INTO ".$table." (submenuid,itemid,category,content,params,position) VALUES (".$pageN.",".$newid.",".$icategory.",'".ceEnc($icontent)."','".ceEnc($iParams)."',".$newpos.") ", $con);
                $respond = "Created";
            }
        } /* $icategory == 1 */
        
        elseif( $icategory == 2 ) /* text */
        {
            $icontent = $_POST["icontent"];
            if($item_exists){
                mysql_query("UPDATE ".$table." SET content='".ceEnc($icontent)."', params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con);
                $respond = "Edited";
            }
            elseif(!$item_exists){   
                $idlist = array();
                for( $i=0; $i<$nor; $i++ )
                { $idlist[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$i.",1", $con ); }
                $idlist[] = 0;
                $newid = $vida->genID($idlist);
                $newpos = $nor+1;
                mysql_query("INSERT INTO ".$table." (submenuid,itemid,category,content,params,position) VALUES (".$pageN.",".$newid.",".$icategory.",'".ceEnc($icontent)."','".ceEnc($iParams)."',".$newpos.") ", $con);
                $respond = "Created";
            }
        } /* $icategory == 2 */
        
        elseif( $icategory == 3 ) /* image */
        {
            $itemmode = $_POST["itemmode"];
            $contentValid = (int)$_POST["contentValid"];
            $content_valid = ($contentValid==1)?true:false;
            if($content_valid){
                $icontent = $_FILES["icontent"];
                $name  = $icontent["name"];
                $type  = $icontent["type"];
                $size  = $icontent["size"];
                $tmpn  = $icontent["tmp_name"];
                $error = $icontent["error"];
                $name_ok = ($name!=""&&$name!=null)?true:false;
                if($name_ok){ $name = "p".$pageN."i".$iID."e_".$name; }
                $name4db = "uploads/page".$pageN."/thumbs/".$name;
                $no_errors = ($error==0)?true:false;
                $valid_format = in_array($type,$valid_formats);
                $valid_size = ($size>$maxFsize)?false:true;
            }
            if( $itemmode=="E" ){
                if( !$item_exists && $name_ok && $no_errors && $valid_format && $valid_size ){
                    move_uploaded_file( $tmpn, $path.$name );
                    $thumb = new SimpleImage();
                    $thumb->load( $path.$name );
                    $thumb->resizeToWidth(200);
                    $thumb->save( $path."thumbs/".$name );
                    $idlist = array();
                    for( $i=0; $i<$nor; $i++ )
                    { $idlist[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$i.",1", $con ); }
                    $idlist[] = 0;
                    $newid = $vida->genID($idlist);
                    $newpos = $nor+1;
                    mysql_query("INSERT INTO ".$table." (submenuid,itemid,category,content,params,position) VALUES (".$pageN.",".$newid.",".$icategory.",'".ceEnc($name4db)."','".ceEnc($iParams)."',".$newpos.") ", $con);
                    $respond = "Created";
                }
            } // E
            elseif( $itemmode=="E2" ){
                $srcex = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $parex = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $srcex = ceDec($srcex);
                $parex = ceDec($parex);
                if($content_valid){
                    if( $item_exists && $name_ok && $no_errors && $valid_format && $valid_size ){
                        if( $name4db != $srcex ){
                            $thumb  = "../../".$srcex;
                            $orgimg = str_replace( "thumbs/", "", $thumb );
                            unlink($orgimg);
                            unlink($thumb);
                            move_uploaded_file( $tmpn, $path.$name );
                            $thumb = new SimpleImage();
                            $thumb->load( $path.$name );
                            $thumb->resizeToWidth(200);
                            $thumb->save( $path."thumbs/".$name );
                            mysql_query( "UPDATE ".$table." SET content='".ceEnc($name4db)."' WHERE itemid=".$iID, $con );
                            $respond = "Edited";
                        }
                        if( $iParams != $parex ){
                            mysql_query( "UPDATE ".$table." SET params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con );
                            $respond = "Edited";
                        }
                    }
                }
                elseif(!$content_valid){
                    if( $iParams != $parex ){
                        mysql_query( "UPDATE ".$table." SET params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con );
                        $respond = "Edited";
                    }
                }
            } // E2
        } /* $icategory == 3 */
        
        elseif( $icategory == 4 ) /* gallery */
        {
            $icontent = $_FILES["icontent"];
            $itemMode = $_POST["itemMode"];
            $strSigs  = $_POST["strSigs"];
            $sigs = $vida->vStrTrans2arr( $strSigs, "<<[-x-]>>" );
            if( $itemMode=="E" ){
                $siz = sizeof($icontent["name"]);
                $names4db = array();
                for( $s=0; $s<$siz; $s++ )
                {
                    $name  = $icontent["name"][$s];
                    $type  = $icontent["type"][$s];
                    $size  = $icontent["size"][$s];
                    $tmpn  = $icontent["tmp_name"][$s];
                    $error = $icontent["error"][$s];
                    $name_ok = ($name!=""&&$name!=null)?true:false;
                    if($name_ok){ $name = "p".$pageN."i".$iID."e_".$name; }
                    $no_errors = ($error==0)?true:false;
                    $valid_format = in_array($type,$valid_formats);
                    $valid_size = ($size>$maxFsize)?false:true;
                    if( $name_ok && $no_errors && $valid_format && $valid_size )
                    {
                        if(!$item_exists){
                            $name4db = "uploads/page".$pageN."/thumbs/".$name;
                            move_uploaded_file( $tmpn, $path.$name );
                            $names4db[] = $name4db;
                            $arrWH = getimagesize( $path.$name );
                            $tarr = $vida->vStrTrans2arr( $iParams, "<x>" );
                            $tarr2 = array();
                            $tarr2[] = $arrWH[0];
                            $tarr2[] = $arrWH[1];
                            $tarr2[] = $sigs[$s];
                            $strtmp = $vida->vConcatStrs( "(x)", $tarr2 );
                            $tarr[] = $strtmp;
                            $iParams = $vida->vConcatStrs( "<x>", $tarr );
                            
                            $thumb = new SimpleImage();
                            $thumb->load( $path.$name );
                            $thumb->resizeToWidth(200);
                            $thumb->save( $path."thumbs/".$name );
                        }
                    }
                } // end: for loop
                $names4dbstr = $vida->vConcatStrs( "<(x)>", $names4db );
                if(!$item_exists){
                    $idlist = array();
                    for( $i=0; $i<$nor; $i++ )
                    { $idlist[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$i.",1", $con ); }
                    $idlist[] = 0;
                    $newid = $vida->genID($idlist);
                    $newpos = $nor+1;
                    mysql_query("INSERT INTO ".$table." (submenuid,itemid,category,content,params,position) VALUES (".$pageN.",".$newid.",".$icategory.",'".ceEnc($names4dbstr)."','".ceEnc($iParams)."',".$newpos.") ", $con);
                    //$respond = "Created";
                }
            }
            elseif( $itemMode=="E2" ){
                $iParamsex = $vida->vmysqlSelect( "params", "SELECT <> FROM ".$table." WHERE itemid=".$iID, $con );
                $imgsarrex = $vida->vmysqlSelect( "content", "SELECT <> FROM ".$table." WHERE itemid=".$iID, $con );
                $iParamsex = ceDec($iParamsex);
                $imgsarrex = ceDec($imgsarrex);
                $imgnames = $vida->vStrTrans2arr( $_POST["imgnames"], "[=|-x-|=]" );
                $imgnames2 = array();
                $imgnamesstr = "";
                for( $a=0; $a<sizeof($imgnames); $a++ ){
                    $imgnames2[] = "uploads/page".$pageN."/thumbs/"."p".$pageN."i".$iID."e_".$imgnames[$a];
                }
                $iParamsexArr = $vida->vStrTrans2arr($iParamsex,"<x>");
                $iParamsArr = $vida->vStrTrans2arr($iParams,"<x>");
                if($iParamsexArr[0] != $iParamsArr[0])
                {  $iParamsexArr[0]  = $iParamsArr[0]; }
                if($iParamsexArr[1] != $iParamsArr[1])
                {  $iParamsexArr[1]  = $iParamsArr[1]; }
                if($iParamsexArr[2] != $iParamsArr[2])
                {  $iParamsexArr[2]  = $iParamsArr[2]; }
                $iParamsexArrEditedStr = $vida->vConcatStrs( "<x>", $iParamsexArr );
                if($iParamsexArrEditedStr != $iParamsex)
                { mysql_query( "UPDATE ".$table." SET params='".ceEnc($iParamsexArrEditedStr)."' WHERE itemid=".$iID, $con ); }
                
                $imgnamesstr = $vida->vConcatStrs( "<(x)>", $imgnames2 );
                //if( $imgsarrex != $imgnamesstr ){
                    $imgsarrexArr = $vida->vStrTrans2arr($imgsarrex,"<(x)>");
                    for( $b=0; $b<sizeof($imgsarrexArr); $b++ ){
                        if(!!!in_array($imgsarrexArr[$b],$imgnames2)){
                            unlink( "../../".str_replace("thumbs/","",$imgsarrexArr[$b]) );
                            unlink( "../../".$imgsarrexArr[$b] );
                        }
                    }
                    if(sizeof($icontent)>0){
                        for( $i=0; $i<sizeof($icontent); $i++ ){
                            $name  = $icontent["name"][$i];
                            $type  = $icontent["type"][$i];
                            $size  = $icontent["size"][$i];
                            $tmpn  = $icontent["tmp_name"][$i];
                            $error = $icontent["error"][$i];
                            $name_ok = ($name!=""&&$name!=null)?true:false;
                            if($name_ok){ $name = "p".$pageN."i".$iID."e_".$name; }
                            $no_errors = ($error==0)?true:false;
                            $valid_format = in_array($type,$valid_formats);
                            $valid_size = ($size>$maxFsize)?false:true;
                            if( $name_ok && $no_errors && $valid_format && $valid_size )
                            {
                                move_uploaded_file( $tmpn, $path.$name );
                                $thumb = new SimpleImage();
                                $thumb->load( $path.$name );
                                $thumb->resizeToWidth(200);
                                $thumb->save( $path."thumbs/".$name );
                            }
                        }
                    }// if(sizeof($icontent)>0)
                    
                    $iw = $vida->vStrSection( 1, $iParams, "<x>" );
                    $ih = $vida->vStrSection( 2, $iParams, "<x>" );
                    $is = $vida->vStrSection( 3, $iParams, "<x>" );
                    $WandHs = array();
                    for( $c=0; $c<sizeof($imgnames2); $c++ ){
                        $arrWH = getimagesize( "../../".$imgnames2[$c] );
                        $WandH = array();
                        $WandH[]=$arrWH[0];
                        $WandH[]=$arrWH[1];
                        $WandH[]=$sigs[$c];
                        $strWandH = $vida->vConcatStrs( "(x)", $WandH );
                        $WandHs[] = $strWandH;
                    }
                    $iPr = array();
                    $iPr[]=$iw; $iPr[]=$ih; $iPr[]=$is;
                    for( $x=0; $x<sizeof($WandHs); $x++ )
                    { $iPr[] = $WandHs[$x]; } 
                    $iParams = $vida->vConcatStrs( "<x>", $iPr );
                    mysql_query( "UPDATE ".$table." SET params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con );
                    mysql_query( "UPDATE ".$table." SET content='".ceEnc($imgnamesstr)."' WHERE itemid=".$iID, $con );
                //}//if( $imgsarrex != $imgnamesstr )
            }//E2
        } /* $icategory == 4 */
        
        elseif( $icategory == 5 ) /* file */
        {
            $itemmode = $_POST["itemmode"];
            $contentValid = (int)$_POST["contentValid"];
            $content_valid = ($contentValid==1)?true:false;
            if($content_valid){
                $icontent = $_FILES["icontent"];
                $name  = $icontent["name"];
                $type  = $icontent["type"];
                $size  = $icontent["size"];
                $tmpn  = $icontent["tmp_name"];
                $error = $icontent["error"];
                $name_ok = ($name!=""&&$name!=null)?true:false;
                if($name_ok){ $name = "p".$pageN."i".$iID."e_".$name; }
                $name4db = "uploads/page".$pageN."/".$name;
                $no_errors = ($error==0)?true:false;
                $valid_size = ($size>$maxFsize)?false:true;
            }
            if( $itemmode=="E" ){
                if( !$item_exists && $name_ok && $no_errors && $valid_size ){
                    move_uploaded_file( $tmpn, $path.$name );
                    $idlist = array();
                    for( $i=0; $i<$nor; $i++ )
                    { $idlist[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$i.",1", $con ); }
                    $idlist[] = 0;
                    $newid = $vida->genID($idlist);
                    $newpos = $nor+1;
                    mysql_query("INSERT INTO ".$table." (submenuid,itemid,category,content,params,position) VALUES (".$pageN.",".$newid.",".$icategory.",'".ceEnc($name4db)."','".ceEnc($iParams)."',".$newpos.") ", $con);
                    $respond = "Created";
                }
            } // E
            elseif( $itemmode=="E2" ){
                $srcex = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $parex = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $srcex = ceDec($srcex);
                $parex = ceDec($parex);
                if($content_valid){
                    if( $item_exists && $name_ok && $no_errors && $valid_size ){
                        if( $name4db != $srcex ){
                            $orgimg = "../../".$srcex;
                            unlink($orgimg);
                            move_uploaded_file( $tmpn, $path.$name );
                            mysql_query( "UPDATE ".$table." SET content='".ceEnc($name4db)."' WHERE itemid=".$iID, $con );
                            $respond = "Edited";
                        }
                        if( $iParams != $parex ){
                            mysql_query( "UPDATE ".$table." SET params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con );
                            $respond = "Edited";
                        }
                    }
                }
                elseif(!$content_valid){
                    if( $iParams != $parex ){
                        mysql_query( "UPDATE ".$table." SET params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con );
                        $respond = "Edited";
                    }
                }
            } // E2
        } /* $icategory == 5 */
            
        elseif( $icategory == 6 ) /* embed */
        {
            $icontent = $_POST["icontent"];
            if($item_exists){
                $srcex = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $parex = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $srcex = ceDec($srcex);
                $parex = ceDec($parex);
                if( $srcex != $icontent ){
                    mysql_query("UPDATE ".$table." SET content='".ceEnc($icontent)."' WHERE itemid=".$iID, $con);
                    $respond = "Edited";
                }
                if( $parex != $iParams ){
                    mysql_query("UPDATE ".$table." SET params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con);
                    $respond = "Edited";
                }
            }
            elseif(!$item_exists){   
                $idlist = array();
                for( $i=0; $i<$nor; $i++ )
                { $idlist[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$i.",1", $con ); }
                $idlist[] = 0;
                $newid = $vida->genID($idlist);
                $newpos = $nor+1;
                mysql_query("INSERT INTO ".$table." (submenuid,itemid,category,content,params,position) VALUES (".$pageN.",".$newid.",".$icategory.",'".ceEnc($icontent)."','".ceEnc($iParams)."',".$newpos.") ", $con);
                $respond = "Created";
            }
        } /* $icategory == 6 */
            
        elseif( $icategory == 7 ) /* link */
        {
            $icontent = $_POST["icontent"];
            if($item_exists){
                $srcex = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $parex = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $srcex = ceDec($srcex);
                $parex = ceDec($parex);
                if( $srcex != $icontent ){
                    mysql_query("UPDATE ".$table." SET content='".ceEnc($icontent)."' WHERE itemid=".$iID, $con);
                    $respond = "Edited";
                }
                if( $parex != $iParams ){
                    mysql_query("UPDATE ".$table." SET params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con);
                    $respond = "Edited";
                }
            }
            elseif(!$item_exists){   
                $idlist = array();
                for( $i=0; $i<$nor; $i++ )
                { $idlist[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$i.",1", $con ); }
                $idlist[] = 0;
                $newid = $vida->genID($idlist);
                $newpos = $nor+1;
                mysql_query("INSERT INTO ".$table." (submenuid,itemid,category,content,params,position) VALUES (".$pageN.",".$newid.",".$icategory.",'".ceEnc($icontent)."','".ceEnc($iParams)."',".$newpos.") ", $con);
                $respond = "Created";
            }
        } /* $icategory == 7 */
        
        elseif( $icategory == 8 ) /* combo */
        {
            $itemmode = $_POST["itemmode"];
            $txt_html = $_POST["txt_html"];
            $contentValid = (int)$_POST["contentValid"];
            $content_valid = ($contentValid==1)?true:false;
            if($content_valid){
                $icontent = $_FILES["icontent"];
                $name  = $icontent["name"];
                $type  = $icontent["type"];
                $size  = $icontent["size"];
                $tmpn  = $icontent["tmp_name"];
                $error = $icontent["error"];
                $name_ok = ($name!=""&&$name!=null)?true:false;
                if($name_ok){ $name = "p".$pageN."i".$iID."e_".$name; }
                $name4db = "<<|1|>>"."uploads/page".$pageN."/thumbs/".$name."<<|2|>>".$txt_html."<<|3|>>";
                $no_errors = ($error==0)?true:false;
                $valid_format = in_array($type,$valid_formats);
                $valid_size = ($size>$maxFsize)?false:true;
            }
            if( $itemmode=="E" ){
                if( !$item_exists && $name_ok && $no_errors && $valid_format && $valid_size ){
                    move_uploaded_file( $tmpn, $path.$name );
                    $thumb = new SimpleImage();
                    $thumb->load( $path.$name );
                    $thumb->resizeToWidth(200);
                    $thumb->save( $path."thumbs/".$name );
                    $idlist = array();
                    for( $i=0; $i<$nor; $i++ )
                    { $idlist[] = (int)$vida->vmysqlSelect( "itemid", "SELECT <> FROM ".$table." LIMIT ".$i.",1", $con ); }
                    $idlist[] = 0;
                    $newid = $vida->genID($idlist);
                    $newpos = $nor+1;
                    mysql_query("INSERT INTO ".$table." (submenuid,itemid,category,content,params,position) VALUES (".$pageN.",".$newid.",".$icategory.",'".ceEnc($name4db)."','".ceEnc($iParams)."',".$newpos.") ", $con);
                    $respond = "Created";
                }
            } // E
            elseif( $itemmode=="E2" ){
                $parex = $vida->vmysqlSelect("params","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $tmp = $vida->vmysqlSelect("content","SELECT <> FROM ".$table." WHERE itemid=".$iID,$con);
                $tmp = ceDec($tmp);
                $tmparr = $vida->vStrTrans2arr( $tmp, "<<|x|>>" );
                $srcex = $tmparr[0];
                $parex = ceDec($parex);
                if($content_valid){
                    if( $item_exists && $name_ok && $no_errors && $valid_format && $valid_size ){
                        //if( $name4db != $tmp ){
                            $thumb  = "../../".$srcex;
                            $orgimg = str_replace( "thumbs/", "", $thumb );
                            unlink($orgimg);
                            unlink($thumb);
                            move_uploaded_file( $tmpn, $path.$name );
                            $thumb = new SimpleImage();
                            $thumb->load( $path.$name );
                            $thumb->resizeToWidth(200);
                            $thumb->save( $path."thumbs/".$name );
                            mysql_query( "UPDATE ".$table." SET content='".ceEnc($name4db)."' WHERE itemid=".$iID, $con );
                            $respond = "Edited";
                        //}
                        if( $iParams != $parex ){
                            mysql_query( "UPDATE ".$table." SET params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con );
                            $respond = "Edited";
                        }
                    }
                }
                elseif(!$content_valid){
                    //if( $iParams != $parex ){
                    $name4db = "<<|1|>>".$srcex."<<|2|>>".$txt_html."<<|3|>>";
                    mysql_query( "UPDATE ".$table." SET content='".ceEnc($name4db)."', params='".ceEnc($iParams)."' WHERE itemid=".$iID, $con );
                    $respond = "Edited";
                    //}
                }
            } // E2
        }
        
        mysql_close( $con );
        echo $respond;
    }

?>