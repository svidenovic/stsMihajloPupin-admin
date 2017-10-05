<?php

class vida
{
    public function vStrSection( $an, $astr, $separator )
    {
        $astr .= " "; $s = $separator;
        $Lstop=0; $left="";
        $Rstart=0; $Rstop=0; $right="";
        $anlen=0; $sepN1=""; $sepN2="";
        $Bsec=0; $Esec=0;
            
        $Lstop = strpos( $s, "x" );
        $left = substr( $s, 0, $Lstop );
        $Rstart = $Lstop+1;
        $Rstop = strlen( $s );
        $right = substr( $s, $Rstart, ($Rstop-$Rstart) );
        $anlen = strlen( $an );
        $anlen = (int)$anlen;
            
        $sepN1 = str_replace( ($left."x".$right), ($left.$an.$right), $s );
        $Bsec = (strpos( $astr, $sepN1 )) + (strlen( $sepN1 ));
        $ann = $an+1;
        $sepN2 = str_replace( ($left."x".$right), ($left.$ann.$right), $s );
        $Esec = strpos( $astr, $sepN2 );
            
        return substr( $astr, $Bsec, ($Esec-$Bsec) );
    }

    public function vConcatStrs( $separator, $arrayOfStrings = array() )
    {
        $s = $separator;
        $sl = strlen( $s );
        $x = strpos( $s, "x", 0 );
        $L = substr( $s, 0, $x );
        $R = substr( $s, ($x+1), ($sl-$x-1) );
        
        $joined = "";
        $arrs = count( $arrayOfStrings );
        $ii = 0;
        for( $i=0; $i<$arrs; $i++ )
        {
            $ii = $i + 1;
            $joined .= $L.$ii.$R . $arrayOfStrings[$i];
        }
        $ii += 1;
        $joined .= $L.$ii.$R;
        
        return $joined;
    }

    public function vSizeOConStr( $concatedString, $separator )
    {
        $consize = strlen( $concatedString );
        $sizeofconcatedstring = 0;
        
        $astr = $concatedString;
        $astr .= " "; $s = $separator;
        $Lstop=0; $left="";
        $Rstart=0; $Rstop=0; $right="";
        $anlen=0; $sepN1=""; $sepN2="";
        $Bsec=0; $Esec=0;
        
        for( $k=1; $k<$consize; $k++ )
        {
            $an = $k;
            $Lstop = strpos( $s, "x" );
            $left = substr( $s, 0, $Lstop );
            $Rstart = $Lstop+1;
            $Rstop = strlen( $s );
            $right = substr( $s, $Rstart, ($Rstop-$Rstart) );
            $anlen = strlen( $an );
            $anlen = (int)$anlen;
            
            $sepN1 = str_replace( ($left."x".$right), ($left.$an.$right), $s );
            $Bsec = (strpos( $astr, $sepN1 )) + (strlen( $sepN1 ));
            $ann = $an+1;
            $sepN2 = str_replace( ($left."x".$right), ($left.$ann.$right), $s );
            $Esec = strpos( $astr, $sepN2 );
            
            $portion = substr( $astr, $Bsec, ($Esec-$Bsec) );
            
            if(( $portion == null )||( $portion == "" )){
            $sizeofconcatedstring = $k-1;  break; }
        }
        return $sizeofconcatedstring;
    }
    
    public function vStrTrans2arr( $str, $separator ){
        $size = $this->vSizeOConStr( $str, $separator );
        $rarr = array();
        $tmp = "";
        for( $d=0; $d<$size; $d++ ){
            $tmp = $this->vStrSection( ($d+1), $str, $separator );
            $rarr[$d] = $tmp;
        }
        return $rarr;
    }
    
    public function vmysqlSelect( $return, $selectquery, $conn ){
        $selectquery = str_replace( "<>", $return, $selectquery );
        $ret = mysql_query( $selectquery, $conn );
        $ret = mysql_fetch_assoc( $ret );
        $ret = $ret[ $return ];
        return $ret;
    }

    // $names = array();
    // $names = getMultInput( "blabla", "name" );
    public function getMultInput( $inputName, $key ){
        $arr = array();
        foreach( $_FILES[ $inputName ][ $key ] as $val ){ $arr[] = $val; }
        return $arr;
    }
    
    public function genID($arr){
        sort($arr, SORT_NUMERIC);
        $newid=max($arr)+1;
        for( $x=0; $x<(sizeof($arr)-1); $x++ )
        { if(($arr[$x+1]-$arr[$x])>1){ $newid=$arr[$x]+1; break; } }
        return $newid;
    }
}

?>