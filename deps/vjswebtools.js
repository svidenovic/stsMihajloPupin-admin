
var vida = {
    
    gid: function( id )
    { return document.getElementById( id ); },
    
    getUrlVars: function()
    {    
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
     
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
     
        return vars;
    },
    
    vStrSection: function( an, astr, separator )
    {
        astr += " "; var s = separator;
        var Lstop=0; var left="";
        var Rstart=0; var Rstop=0; var right="";
        var anlen=0; var sepN1=""; var sepN2="";
        var Bsec=0; var Esec=0;
        
        Lstop = s.indexOf("x");
        left = s.slice( 0, Lstop );
        Rstart = Lstop+1;
        Rstop = s.length;
        right = s.slice( Rstart, Rstop );
        anlen = an.toString().length;
        
        sepN1 = s.replace( (left+"x"+right), (left+an+right) );
        Bsec = (astr.indexOf( sepN1 )) + (sepN1.length);
        sepN2 = s.replace( (left+"x"+right), (left+(an+1)+right) );
        Esec = astr.indexOf( sepN2 );
        if ( Esec < 0 ) { Esec = astr.length-1; }
        
        return astr.slice( Bsec, Esec );
    },
    
    vConcatStrs: function( separator, arrayOfStrings )
    {
        var s = separator;
        var sl = s.length;
        var x = s.indexOf( "x", 0 );
        var L = s.substr( 0, x );
        var R = s.substr( (x+1), (sl-x-1) );
        
        var joined = "";
        var arrs = arrayOfStrings.length;
        var i=0; var ii=0;
        for( i=0; i<arrs; i++ )
        {
            ii = i + 1;
            joined += L+ii+R + arrayOfStrings[i];
        }
        ii += 1;
        joined += L+ii+R;
        
        return joined;
    },
    
    vSizeOConStr: function( concatedString, separator )
    {
        var consize = concatedString.length;
        var sizeofconcatedstring = 0;
        
        var astr = concatedString;
        astr += " "; var s = separator;
        var Lstop=0; var left="";
        var Rstart=0; var Rstop=0; var right="";
        var anlen=0; var sepN1=""; var sepN2="";
        var Bsec=0; var Esec=0;
        var portion = "";
        
        var k = 0;
        for( k=1; k<consize; k++ )
        {
            an = k;
            Lstop = s.indexOf("x");
            left = s.slice( 0, Lstop );
            Rstart = Lstop+1;
            Rstop = s.length;
            right = s.slice( Rstart, Rstop );
            anlen = an.toString().length;
            
            sepN1 = s.replace( (left+"x"+right), (left+an+right) );
            Bsec = (astr.indexOf( sepN1 )) + (sepN1.length);
            sepN2 = s.replace( (left+"x"+right), (left+(an+1)+right) );
            Esec = astr.indexOf( sepN2 );
            if ( Esec < 0 ) { Esec = astr.length-1; }
            
            portion = astr.slice( Bsec, Esec );
            
            if(( portion == null )||( portion == "" )){
            sizeofconcatedstring = k-1; break; }
        }
        return sizeofconcatedstring;
    },
    
    vStrTrans2arr: function( str, separator )
    {
        var size = this.vSizeOConStr( str, separator );
        var rarr = new Array();
        for( var i=0; i<size; i++ )
        {
            rarr[i] = this.vStrSection( (i+1), str, separator );
        }
        return rarr;
    },
    
    vLogIn: function( inputID, phpfile, url4logInTrue )
    {
        var passval = document.getElementById( inputID ).value;
        if( passval != "" ){
            $.post( phpfile, {passval:passval}, function(echopass){
		echopass = parseInt(echopass);
                if( echopass != 1 )
                { alert( "Wrong password!" );
                  document.getElementById( inputID ).value = ""; }
                else if( echopass == 1 )
                { window.location = url4logInTrue; }
            } );
        }
    },
    
    vtestlog: function( phpfile, onFalseGo2url )
    {
        $.post( phpfile, function( passallowed ){
	    passallowed = parseInt(passallowed);
            if( passallowed != 1 )
	    { window.location = onFalseGo2url; }
	});
    },
    
    vLogOut: function( phpfile, afterLOgo2url )
    {
        $.post( phpfile, function(ree){
            if( ree == "lo" )
            { window.location = afterLOgo2url; }
        } );
    },
    
    /* MarkUp:
    <input type="text" id="dayin" />
    <select id="monthsel" >
        <option> 01 January </option>
        <option> 02 February </option>
        <option> 03 March </option>
        <option> 04 April </option>
        <option> 05 May </option>
        <option> 06 June </option>
        <option> 07 July </option>
        <option> 08 August </option>
        <option> 09 September </option>
        <option> 10 October </option>
        <option> 11 November </option>
        <option> 12 December </option>
    </select>
    <input type="text" id="yearin" />
    */
    
    vmakeDateStrFromInput: function( dayIDin, monthIDsel, yearIDin )
    {
        var date = ""; var temp = ""; var M=0;
        var day = 0; var month = ""; var year = 0;
        var day_is_ok = false;
        var month_is_ok = false;
        var year_is_ok = false;
        
        temp = document.getElementById( dayIDin ).value;
        day = parseInt( temp );
        month = document.getElementById( monthIDsel );
        month = month.options[ month.selectedIndex ].value;
        month = month.replace( month.substr( 0, 3 ), "" );
        switch( month.selectedIndex ){
            case 0:  month_is_ok=true; M=31; break;
            case 1:  month_is_ok=true; M=29; break;
            case 2:  month_is_ok=true; M=31; break;
            case 3:  month_is_ok=true; M=30; break;
            case 4:  month_is_ok=true; M=31; break;
            case 5:  month_is_ok=true; M=30; break;
            case 6:  month_is_ok=true; M=31; break;
            case 7:  month_is_ok=true; M=31; break;
            case 8:  month_is_ok=true; M=30; break;
            case 9:  month_is_ok=true; M=31; break;
            case 10: month_is_ok=true; M=30; break;
            case 11: month_is_ok=true; M=31; break;
            default: month_is_ok=false; M=31; break;
        }
        if(( day >= 1 )&&( day <= M ))
        { day_is_ok = true; }
        else{ day_is_ok = false; }
        
        temp = document.getElementById( yearIDin ).value;
        year = parseInt( temp );
        if(( year>0 )&&( year<10000 ))
        { year_is_ok = true; }
        else{ year_is_ok = false; }
        
        if(( day_is_ok )&&( month_is_ok )&&( year_is_ok ))
        { date = (day.toString())+"."+month+"."+(year.toString()); }
        else{ date = "invalid_input"; }
        
        return date;
    },
    
    vsetDefaultDate: function( dayIDin, monthIDsel, yearIDin )
    {
        var d = new Date();
        var idNnEDday = document.getElementById( dayIDinput );
        idNnEDday.value = d.getDate();
        
        var idNnEDMonth = document.getElementById( monthIDsel );
        var month = d.getMonth(); // int
        idNnEDMonth.selectedIndex = month;
        
        var idNnEDyear = document.getElementById( yearIDin );
        idNnEDyear.value = d.getFullYear();
    },
    
    vsetDateFromString: function( DD_MM_YYYY, dayIDin, monthIDsel, yearIDin, montharray )
    {
        if( montharray == null )
        { montharray = ["January","February","March","April","May","June","July","August","September","October","November","December"]; }
        
        var s = 0;
        var e = ddd.indexOf( ".", s );
        var tday = ddd.slice( s, e );
            s = e+1;
            e = ddd.indexOf( ".", s );
        var tmonth = ddd.slice( s, e );
            s = e+1;
            e = ddd.length;
        var tyear = ddd.slice( s, e );
        var m = 0;
        
        switch( tmonth )
        {
            case montharray[0]:  m = 0;  break;
            case montharray[1]:  m = 1;  break;
            case montharray[2]:  m = 2;  break;
            case montharray[3]:  m = 3;  break;
            case montharray[4]:  m = 4;  break;
            case montharray[5]:  m = 5;  break;
            case montharray[6]:  m = 6;  break;
            case montharray[7]:  m = 7;  break;
            case montharray[8]:  m = 8;  break;
            case montharray[9]:  m = 9;  break;
            case montharray[10]: m = 10; break;
            case montharray[11]: m = 11; break;
            default: m = 0; break;
        }
        
        gid( dayIDin ).value = tday;
        gid( monthIDsel ).options.selectedIndex = m;
        gid( yearIDin ).value = tyear;
    },
    
    vActivate_jScrollPane: function( jQdivID, arrows, autoReinit, aRdelay )
    {
        $( jQdivID ).jScrollPane({ showArrows:arrows, autoReinitialise:autoReinit, autoReinitialiseDelay:aRdelay });
    },
    
    
    vArrseparator: function( arr, elementsPerSlide, Tslides_Fnum )
    {
        //   0   1   2   3   4   5   6   7   8
        // ['a','s','d','f','g','h','j','k','l']
        var eps = elementsPerSlide;     // 4
        var asize = arr.length;         // 9
        var spare = asize%eps;          // 9%4=1
        var wholes = (asize-spare)/eps; // (9-1)/4=2
        var numberOslides = wholes+((spare==0)?0:1); 
        if( !Tslides_Fnum ){ return numberOslides; }
        else{
            var slides = new Array();
            var moveps=0, a=0, b=0, c=0;
            for( a=0; a<numberOslides; a++ ){
                slides[a] = [];
                for( b=0; b<eps; b++ ){
                    c = b+moveps;
                    if( c<asize ){ slides[a][b] = arr[c]; }
                    else{ break; }
                } moveps+=eps;
            }
            return slides;
        }
    },
    
    vturnRows2array: function( astr )
    {
        var startp = 0;
        var endp = 0;
        var tmp = "";
        var arr = new Array();
        while( endp != -1 )
        {
            endp = astr.indexOf( "\n", startp );
            if( endp == -1 ){
                endp = astr.length;
                tmp = astr.slice( startp, endp );
                arr.push( tmp );
                startp = endp+1;
                break;
            }
            else{
                tmp = astr.slice( startp, endp );
                arr.push( tmp );
                startp = endp+1;
            }
        }
        return arr;
    },
    
    vopenImg: function( nOimg2open, imgarr, addDir, separator )
    {
        nOimg2open = parseInt( nOimg2open );
        var sep = separator;
        var ias = imgarr.length;
        var str = "", imgs = "";
        var backloc = encodeURIComponent( window.location );
        //var backloc = this.str2hex( window.location );
        var iurl = "";
        if( ias <= 1 ){
            str = imgarr[0];
            imgs = encodeURIComponent( str );
            //imgs = this.str2hex( str );
            iurl = addDir+"imgOpen/imgViewer.html?ias="+ias+"&imgs="+imgs+"&nOimg2open="+nOimg2open+"&backloc="+backloc;
        }
        else if( ias > 1 ){
            str = this.vConcatStrs( sep, imgarr );
            imgs = encodeURIComponent( str );
            //sep = encodeURIComponent( sep );
            //imgs = this.str2hex( str );
            sep = this.str2hex( sep );
            iurl = addDir+"imgOpen/imgViewer.html?ias="+ias+"&sep="+sep+"&imgs="+imgs+"&nOimg2open="+nOimg2open+"&backloc="+backloc;
        }
        window.location = iurl;
    },
    
    str2hex: function( strin )
    {
        var hexout = "";
        for ( var i=0, s=strin.length; i<s; i++ )
	{ hexout += "u"+(strin.charCodeAt(i).toString(16).toUpperCase()); }
        return hexout;
    },
    
    hex2str: function( hexin )
    {
        var strout = "";
	var uarr = new Array();
	var us=0; var a=0; var b=0; var cca=0;
	for( var x=0; x<(hexin.length); x++ )
	{ if(hexin[x]=="u"){ uarr.push(x); } }
	us = uarr.length;
	uarr.push(hexin.length); // phantom u at the end
	for( var i=0; i<us; i++ ){
	    a = uarr[i]+1;
	    b = uarr[i+1];
	    cca = parseInt(( hexin.slice(a,b) ),16);
            strout += String.fromCharCode(cca);
	}
	return strout;
    }
    
}


