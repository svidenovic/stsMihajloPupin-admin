
var hrefBack;
var insertBTN;
var editBTN;
var delBTN;
var movuBTN;
var movdBTN;
var menuCTRLopen;
var insertBoxOpen;
var selectedItem;
var selFcolor;
var selTcolor;
var pageN;
// gallery specific
var gallArr;
var gallFarr;
var imgMaxW;
var imgMaxH;
var imgsPerSlide;
var gallArrNames;
var gallArrSigs;
// embed specific
var embedCode;
var embedWidth;
var embedHeight;
var max_file_size;
// combo global vars:
var img_class;
var img_width;
var img_title;
var img_file;
var txt_html;

$(document).ready(function(){
    onload();
    pageGet_nameandmenu();
    LoadItems(function(){});
    $("#CTRLmenuLauncher").click(function(){ menuCTRLopen_F(true); });
    $("#BTNpageNameAndMenuSave").click(function(){ pageSave_nameandmenu(); });
});

function onload(){
    hrefBack = "stsmppagesmanager.html";
    $("#goBackBTN").attr("href",hrefBack);
    if( !!document.URL.match("pg=") ){
        pageN = parseInt(vida.getUrlVars()["pg"]);
        if(!!!pageN){ window.location = hrefBack; }
    }else{ window.location = hrefBack; }
    //max_file_size = 2097152; // 2MB
    max_file_size = 536870912; // 512MB
    insertBTN = undefined;
    editBTN = undefined;
    delBTN = undefined;
    movuBTN = undefined;
    movdBTN = undefined;
    menuCTRLopen = false;
    insertBoxOpen = false;
    selectedItem = "";
    selTcolor = "#b1b1b1";
    selFcolor = "#d7d7d7";
    gallArr = new Array();
    gallFarr = new Array();
    imgMaxW = 100;
    imgMaxH = 100;
    imgsPerSlide = 5;
    gallArrNames = new Array();
    gallArrSigs = new Array();
    embedCode = "";
    embedWidth = 0;
    embedHeight = 0;
    // combo:
    img_class = "htmlImgClass";
    img_width = 0;
    img_title = "";
    img_file = undefined;
    txt_html = "";
}

function testLog( callfunc ){
    $.post("../../deps/vtestPass.php",function(res){
        res = parseInt(res);
        if(res==1){ callfunc(); }
        else{ window.location="../stsmplog.html"; }
    });
}

function page_menu_load( funconload ){
    var url = "../menuManager/stsmpMIlist.php";
    $.post( url, function(ree){
        var MIlist=new Array(); var tmparr=new Array(); var arr3=new Array();
        tmparr = vida.vStrTrans2arr(ree,"|::[x]::|");
        for( t in tmparr){
            arr3 = new Array();
            arr3.push( vida.vStrSection(1,tmparr[t],"<-[x]->") );
            arr3.push( vida.vStrSection(2,tmparr[t],"<-[x]->") );
            arr3.push( vida.vStrSection(3,tmparr[t],"<-[x]->") );
            MIlist.push(arr3);
        }
        $("#SELmenu").html("");
        for( m in MIlist ){
            var menuOpt = document.createElement("option");
            $(menuOpt).attr("id","SELmenuOpt"+MIlist[m][0]);
            $(menuOpt).html(MIlist[m][1]);
            $("#SELmenu").append(menuOpt);
        }
        funconload();
    });
}

function pageGet_nameandmenu(){
    var gsdo = "GET";
    $.post( "pageGetOrSaveNameAndMenu.php", {gsdo:gsdo,pageN:pageN}, function(ree){
        var name = vida.vStrSection(2,ree,"<|x|>");
        $("#INpagename").val(name);
        page_menu_load(function(){
            var menuid = parseInt(vida.vStrSection(1,ree,"<|x|>"));
            var opttxt = $("#SELmenuOpt"+menuid).html();
            opttxt = (opttxt==null)?"":opttxt;
            if(opttxt!=""){ $("#SELmenu").val(opttxt); }
        });
    });
    
}

function pageSave_nameandmenu(){
    testLog(function(){
        var gsdo = "SAVE";
        var name = $("#INpagename").val(); // SELmenuOpt
        var menuid = parseInt($("#SELmenu option:selected").attr("id").slice(10));
        if(name!=""){
            var params = {gsdo:gsdo,pageN:pageN,name:name,menuid:menuid};
            $.post( "pageGetOrSaveNameAndMenu.php", params, function(ree){
                if(ree=="saved"){
                    pageGet_nameandmenu();
                    LoadItems(function(){});
                }
            });
        }else{ alert("Page-name input is empty."); }
    });
}

function menuCTRLopen_F( boolTF ){
    if(boolTF){
        if(!menuCTRLopen){
            // open
            $("div.sideDiv").animate({height:140}, 100, function(){
                $("div#CTRLmenu_holder").show(1);
                $("div#CTRLmenu_holder").animate({height:125}, 100, function(){
                    $("button#CTRLmenuLauncher").text("▲");
                    $("div#CTRLmenu_holder").html("");
                    // insert
                    insertBTN = document.createElement("button");
                    $(insertBTN).attr("class","CTRLmenuBTNs");
                    $(insertBTN).text("INSERT");
                    $(insertBTN).click(function(){ insertBoxOpen_F(true); });
                    $("div#CTRLmenu_holder").append(insertBTN);
                    // edit
                    editBTN = document.createElement("button");
                    $(editBTN).attr("class","CTRLmenuBTNs");
                    $(editBTN).text("EDIT");
                    $(editBTN).click(function(){ editItem(); });
                    $("div#CTRLmenu_holder").append(editBTN);
                    // delete
                    delBTN = document.createElement("button");
                    $(delBTN).attr("class","CTRLmenuBTNs");
                    $(delBTN).text("DELETE");
                    $(delBTN).click(function(){ deleteItem(); });
                    $("div#CTRLmenu_holder").append(delBTN);
                    // move UP
                    movuBTN = document.createElement("button");
                    $(movuBTN).attr("class","CTRLmenuBTNs");
                    $(movuBTN).text("MOVE ▲");
                    $(movuBTN).click(function(){ moveUDitem("U"); });
                    $("div#CTRLmenu_holder").append(movuBTN);
                    // move DOWN
                    movdBTN = document.createElement("button");
                    $(movdBTN).attr("class","CTRLmenuBTNs");
                    $(movdBTN).text("MOVE ▼");
                    $(movdBTN).click(function(){ moveUDitem("D"); });
                    $("div#CTRLmenu_holder").append(movdBTN);
                    menuCTRLopen = true; 
                });
            });
        }
        else if(menuCTRLopen){
            // close
            insertBoxOpen_F(false);
            $("div#CTRLmenu_holder").animate({height:0}, 100, function(){
                $("div#CTRLmenu_holder").hide(1);
                $("button#CTRLmenuLauncher").text("▼");
                $("div#CTRLmenu_holder").html("");
                $("div.sideDiv").animate({height:15}, 100);
                menuCTRLopen = false;
            });
        }
    }
    else if(!boolTF){
        // close
        insertBoxOpen_F(false);
        $("div#CTRLmenu_holder").animate({height:0}, 100, function(){
            $("div#CTRLmenu_holder").hide(1);
            $("button#CTRLmenuLauncher").text("▼");
            $("div#CTRLmenu_holder").html("");
            $("div.sideDiv").animate({height:15}, 100);
            menuCTRLopen = false;
        });
    }
}

function scrollDwn(){ $("body").animate({ scrollTop: $(document).height() },800); }
function insertBoxOpen_F( boolTF ){
    if(boolTF){
        if(!insertBoxOpen){
            // open
            $("div.sideDiv").animate({width:165}, 100, function(){
                $("div#insertBox").animate({width:80}, 100, function(){
                    function ItemMaker( typeN ){
                        $.post( "itemgetNumber.php", {pageN:pageN}, function(ree){
                            ItemHolder_Creation( typeN, "item"+ree, false );
                            ItemHolder_Fill( typeN, "item"+ree, "", null, "E", false );
                            scrollDwn();
                        });
                    }
                    // text
                    var inText = document.createElement("button");
                    $(inText).attr("class","insertBTNs");
                    $(inText).text("TEXT");
                    $(inText).click(function(){ ItemMaker(2); });
                    $("div#insertBox").append(inText);
                    // picture
                    var inPicture = document.createElement("button");
                    $(inPicture).attr("class","insertBTNs");
                    $(inPicture).text("PICTURE");
                    $(inPicture).click(function(){ ItemMaker(3); });
                    $("div#insertBox").append(inPicture);
                    // gallery
                    var inGall = document.createElement("button");
                    $(inGall).attr("class","insertBTNs");
                    $(inGall).text("GALLERY");
                    $(inGall).click(function(){ ItemMaker(4); });
                    $("div#insertBox").append(inGall);
                    // file
                    var inFile = document.createElement("button");
                    $(inFile).attr("class","insertBTNs");
                    $(inFile).text("FILE");
                    $(inFile).click(function(){ ItemMaker(5); });
                    $("div#insertBox").append(inFile);
                    // embed
                    var inEmbed = document.createElement("button");
                    $(inEmbed).attr("class","insertBTNs");
                    $(inEmbed).text("EMBED");
                    $(inEmbed).click(function(){ ItemMaker(6); });
                    $("div#insertBox").append(inEmbed);
                    // link
                    var inLink = document.createElement("button");
                    $(inLink).attr("class","insertBTNs");
                    $(inLink).text("LINK");
                    $(inLink).click(function(){ ItemMaker(7); });
                    $("div#insertBox").append(inLink);
                    // combo
                    var inComb = document.createElement("button");
                    $(inComb).attr("class","insertBTNs");
                    $(inComb).text("COMBO");
                    $(inComb).click(function(){ ItemMaker(8); });
                    $("div#insertBox").append(inComb);
                    
                    $("div#insertBox").fadeIn(100);
                    insertBoxOpen = true;
                });
            });
        }
        else if(insertBoxOpen){
            // close
            $("div#insertBox").fadeOut(200, function(){
                $("div#insertBox").html("");
                $("div#insertBox").animate({width:0}, 100, function(){
                    $("div.sideDiv").animate({width:80}, 100, function(){
                        insertBoxOpen = false;
                    });
                });
            });
        }
    }
    else if(!boolTF){
        // close
        $("div#insertBox").fadeOut(200, function(){
            $("div#insertBox").html("");
            $("div#insertBox").animate({width:0}, 100, function(){
                $("div.sideDiv").animate({width:80}, 100, function(){
                    insertBoxOpen = false;
                });
            });
        });
    }
}

function ItemHolder_Creation( ihtype, ihid, boolDelete ){
    var itemHolder = undefined;
    if(boolDelete){
        itemHolder = document.getElementById(ihid);
        $(itemHolder).remove();
    }
    else{
        itemHolder = document.createElement("div");
        $(itemHolder).attr("class","itemHolderDiv");
        $(itemHolder).attr("id",ihid);
        var imode = document.createAttribute("itemmode");
        itemHolder.setAttributeNode(imode);
        itemHolder.setAttribute("itemmode","D");
        var tipeattr = document.createAttribute("itemtype");
        itemHolder.setAttributeNode(tipeattr);
        itemHolder.setAttribute("itemtype",ihtype);
        if(ihtype==1){ $(itemHolder).attr("class","itemHolderDiv4Title"); }
        else if(ihtype!=1){ $(itemHolder).click(function(){ makeSelected( ihid, true, true ); }); }
        $("#pageMainDiv").append(itemHolder);
        if(selectedItem!=""){ makeSelected( selectedItem, true, false ); }
    }
}

function validate_type( fileDOTtype ){
    var retVal = false;
    var valid_types=["image/jpg","image/jpeg","image/pjpeg","image/png","image/gif"];
    for( v in valid_types ){
        if( fileDOTtype.match(valid_types[v])==valid_types[v] ){ retVal=true; break; }
        else{ retVal=false; }
    }
    return retVal;
}

function ItemHolder_Fill( itype, iid, icontent, iparams, modeDE, editTF )
{
    var itemHolder = document.getElementById(iid);
    var itemIDn = parseInt(iid.slice(4));
    switch(itype)
    {
        case 1: function case1_title(){
            $(itemHolder).html("");
            $(itemHolder).attr("itemmode","D");
            var pgtitle = document.createElement("p");
            $(pgtitle).attr("class","pgitemTitle");
            $(pgtitle).attr("id",iid+"title");
            $(pgtitle).html(icontent);
            $(itemHolder).append(pgtitle);
        }
        case1_title(); break;
        
        case 2: function case2_text(){
            if(modeDE=="D"){
                $(itemHolder).html(icontent);
                $(itemHolder).attr("itemmode","D");
            }
            else if(modeDE=="E"){
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","E");
                var txtarea = document.createElement("textarea");
                $(txtarea).attr("class","textitemTxtarea");
                $(txtarea).attr("id",iid+"text");
                // save & cancel
                var saveBTN = document.createElement("button");
                $(saveBTN).attr("class","itemSCbtn");
                $(saveBTN).text("DONE");
                $(saveBTN).click(function(){ saveItem(itype,iid); });
                var cancBTN = document.createElement("button");
                $(cancBTN).attr("class","itemSCbtn");
                $(cancBTN).text("CANCEL");
                $(cancBTN).click(function(){ LoadItems(function(){}); });
                $(itemHolder).append(txtarea);
                $(itemHolder).append(saveBTN);
                $(itemHolder).append(cancBTN);
                var RTEctrls = { autoGrow:true, controls:{
                    bold                 : { visible : true },
                    italic               : { visible : true },
                    strikeThrough        : { visible : true },
                    underline            : { visible : true },
                    justifyLeft          : { visible : true },
                    justifyCenter        : { visible : true },
                    justifyRight         : { visible : true },
                    justifyFull          : { visible : true },
                    subscript            : { visible : true },
                    superscript          : { visible : true },
                    undo                 : { visible : true },
                    redo                 : { visible : true },
                    createLink           : { visible : true },
                    removeFormat         : { visible : true },
                    increaseFontSize     : { visible : true },
                    decreaseFontSize     : { visible : true },
                    insertHorizontalRule : { visible : false },
                    h1                   : { visible : false },
                    h2                   : { visible : false },
                    h3                   : { visible : false },
                    h4                   : { visible : false },
                    h5                   : { visible : false },
                    h6                   : { visible : false },
                    cut                  : { visible : false },
                    copy                 : { visible : false },
                    paste                : { visible : false },
                    html                 : { visible : false },
                    insertTable          : { visible : false },
                    insertImage          : { visible : false },
                    paragraph            : { visible : false },
                    indent               : { visible : false },
                    outdent              : { visible : false },
                    insertOrderedList    : { visible : false },
                    insertUnorderedList  : { visible : false },
                }};
                $(txtarea).wysiwyg(RTEctrls);
                $(txtarea).wysiwyg("clear");
                if(editTF){
                    $(itemHolder).attr("itemmode","E2");
                    $(txtarea).wysiwyg("setContent",icontent);
                }
            }
        }
        case2_text(); break;
        
        case 3: function case3_picture(){
            if(modeDE=="D"){ /* display */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","D");
                var imgw = parseInt(iparams[0]);
                var imgsrc = (imgw>200)? icontent.replace("thumbs/","") : icontent;
                var ipic = document.createElement("img");
                $(ipic).attr("class","imgDisplayMode");
                $(ipic).attr("src","../../"+imgsrc);
                $(ipic).css("width",imgw);
                $(ipic).css("margin-left", Math.ceil((800-iparams[0])/2));
                $(ipic).attr("title",iparams[1]);
                $(itemHolder).append(ipic);
            }
            else if(modeDE=="E"){ /* edit */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","E");
                var picInput = document.createElement("input");
                $(picInput).attr("class","picture_uploadField");
                $(picInput).attr("id","icontent");
                $(picInput).attr("name","icontent");
                $(picInput).attr("type","file");
                var label = document.createElement("p");
                $(label).attr("class","piclabel");
                $(label).html("Scale image:");
                var whinput = document.createElement("input");
                $(whinput).attr("class","numberInField");
                $(whinput).attr("id",iid+"imgWidth");
                $(whinput).attr("type","number");
                $(whinput).val(500);
                var preview = document.createElement("img");
                $(preview).attr("class","pictureUFpreview");
                $(preview).attr("id",iid+"imgPrev");
                $(preview).attr("src","noimage.png");
                var sig = document.createElement("textarea");
                $(sig).attr("class","imgsigTXTa");
                $(sig).attr("id",iid+"imgsig");
                $(picInput).change(function(){
                    var file = picInput.files[0];
                    if(window.FileReader){
                        var type_ok = false;
                        var size_ok = false;
                        var maxFsize = max_file_size;
                        type_ok = validate_type( file.type );
                        size_ok = (file.size<maxFsize)?true:false;
                        if(type_ok && size_ok){
                            var rdr = new FileReader();
                            rdr.onload = function(e)
                            { $(preview).attr("src",e.target.result); };
                            rdr.readAsDataURL(file);
                        }
                        else{
                            if(!window.FileReader){ alert("FileReader not supported."); }
                            $(picInput).val("");
                            //$(preview).attr("src","noimage.png");
                            var alstr = file.name;
                            var over = (maxFsize/1000000).toString();
                                over = over.slice( 0, over.indexOf(".")+2 );
                            if(!type_ok){ alstr += "\n - wrong file type."; }
                            if(!size_ok){ alstr += "\n - file over "+over+"MB."; }
                            alert(alstr);
                        }
                    }
                    else{ alert("FileReader not supported."); }
                });
                $(whinput).change(function(){
                    var maxW=800, minW=100;
                    var w=parseInt($(whinput).val());
                    w=(w<minW)?minW:w; w=(w>maxW)?maxW:w;
                    $(whinput).val(w);
                    $(preview).css("width",w);
                    $(preview).css("margin-left",Math.ceil((maxW-w)/2));
                });
                var lineBRdiv = document.createElement("div");
                $(lineBRdiv).attr("class","lineBRdiv");
                var loadBarimg = document.createElement("img");
                $(loadBarimg).attr("class","loadBarimgGIF");
                $(loadBarimg).css("display","none");
                $(loadBarimg).attr("id",iid+"loadBar");
                $(loadBarimg).attr("src","on-loader.gif");
                // save & cancel
                var saveBTN = document.createElement("button");
                $(saveBTN).attr("class","itemSCbtn");
                $(saveBTN).text("DONE");
                $(saveBTN).click(function(){ saveItem(itype,iid); });
                var cancBTN = document.createElement("button");
                $(cancBTN).attr("class","itemSCbtn");
                $(cancBTN).text("CANCEL");
                $(cancBTN).click(function(){ LoadItems(function(){}); });
                // appending...
                $(itemHolder).append(picInput);
                $(itemHolder).append(label);
                $(itemHolder).append(whinput);
                $(itemHolder).append(saveBTN);
                $(itemHolder).append(cancBTN);
                $(itemHolder).append(lineBRdiv);
                $(itemHolder).append(loadBarimg);
                $(itemHolder).append(preview);
                $(itemHolder).append(sig);
                
                if(editTF){
                    $(itemHolder).attr("itemmode","E2");
                    var imgw = parseInt(iparams[0]);
                    var imgsrc = (imgw>200)? icontent.replace("thumbs/","") : icontent;
                    $(preview).attr("src","../../"+imgsrc);
                    $(preview).css("width",imgw);
                    $(preview).css("margin-left", Math.ceil((800-imgw)/2));
                    $(whinput).val(imgw);
                    $(sig).val(iparams[1]);
                }
            }
        }
        case3_picture(); break;
        
        case 4: function case4_gallery(){
            if(modeDE=="D"){ /* display */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","D");
                // itype, itemIDn, icontent, iparams
                var simgarr = new Array();
                var thumb = "";
                var foo = new Array();
                var imgdim = iparams.splice(3);
                icontent = vida.vStrTrans2arr( icontent, "<(x)>" );
                for( c in icontent ){
                    foo = vida.vStrTrans2arr( imgdim[c], "(x)" );
                    thumb = "../../"+icontent[c];
                    simgarr.push([ thumb, foo[0], foo[1], foo[2] ]);
                }
                var ipw = parseInt(iparams[0]);
                var iph = parseInt(iparams[1]);
                var ips = parseInt(iparams[2]);
                var diW = (ips*(ipw+5))+65;
                var diH = iph+10;
                var ml = Math.ceil( (800-diW)/2 );
                var gallDiv = document.createElement("div");
                $(gallDiv).attr("class","sliderHolderDIVd");
                $(gallDiv).attr("id",iid+"sliderHolder");
                $(gallDiv).css("width",diW);
                $(gallDiv).css("height",diH);
                $(gallDiv).css("margin-left",ml);
                $(itemHolder).append(gallDiv);
                $(gallDiv).imgSlider( ipw,iph,ips,1,simgarr,iid+"slider",true );
            }
            else if(modeDE=="E"){ /* edit */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","E");
                var itemmode = $(itemHolder).attr("itemmode");
                gallArr = new Array();
                gallFarr = new Array();
                gallArrNames = new Array();
                gallArrSigs = new Array();
                var selectedIMGid = "";
                imgMaxW = 100;
                imgMaxH = 100;
                imgsPerSlide = 5;
                tmpn = 0;
                function imgMaxW_F(inputOBJ){
                    imgMaxW = parseInt($(inputOBJ).val());
                    imgMaxW = (imgMaxW<50)?50:imgMaxW;
                    imgMaxW = (imgMaxW>150)?150:imgMaxW;
                    $(inputOBJ).val(imgMaxW);
                }
                function imgMaxH_F(inputOBJ){
                    imgMaxH = parseInt($(inputOBJ).val());
                    imgMaxH = (imgMaxH<50)?50:imgMaxH;
                    imgMaxH = (imgMaxH>200)?200:imgMaxH;
                    $(inputOBJ).val(imgMaxH);
                }
                function imgsPerSlide_F(inputOBJ){
                    imgsPerSlide = parseInt($(inputOBJ).val());
                    imgsPerSlide = (imgsPerSlide<1)?1:imgsPerSlide;
                    imgsPerSlide = parseInt($(inputOBJ).val());
                    do{ tmpn = imgsPerSlide*(imgMaxW+5)+65;
                        if(tmpn<=800){ break; }
                        else{ imgsPerSlide-=1; }
                    }while(tmpn>800);
                    imgsPerSlide = (imgsPerSlide<1)?1:imgsPerSlide;
                    $(inputOBJ).val(imgsPerSlide);
                }
                function gallArr_F(inputOBJ, holderOBJ, BOOLappend){
                    makeIMGselected("",false,false);
                    if(!BOOLappend){
                        gallArr = new Array();
                        gallFarr = new Array();
                        gallArrNames = new Array();
                        gallArrSigs = new Array();
                        show_gallArr(holderOBJ,gallArr);
                        show_sigs(false,selectedIMGid);
                    }
                    var files = inputOBJ.files;
                    if(window.FileReader){
                        var reader = new FileReader();
                        var type_ok=false, size_ok=false;
                        var maxfsize = max_file_size;
                        var alertstr = "";
                        var x=0;
                        for( x=0; x<files.length; x++ ){
                            type_ok = validate_type( files[x].type );
                            size_ok = (files[x].size <= maxfsize)?true:false;
                            if(type_ok && size_ok){
                                itemmode = $(itemHolder).attr("itemmode");
                                reader = new FileReader();
                                reader.readAsDataURL(files[x]);
                                var iex = false, iex2 = false;
                                for( b in gallFarr ){
                                    iex = (gallFarr[b].name==files[x].name)?true:false;
                                    if(iex){ break;}
                                }
                                for( c in gallArrNames ){
                                    iex2 = (gallArrNames[c]==files[x].name)?true:false;
                                    if(iex2){ break;}
                                }
                                //iex2 = (itemmode=="E2")?iex2:false;
                                if(!iex && !iex2){
                                    gallFarr.push(files[x]);
                                    gallArrNames.push(files[x].name);
                                }
                                reader.onload = function(e){
                                    var res = e.target.result;
                                    var iexists = false;
                                    for( a in gallArr ){
                                        iexists = (gallArr[a]==res)?true:false;
                                        if(iexists){ break; }
                                    }
                                    if(!iexists && !iex && !iex2){
                                        gallArr.push(res);
                                        gallArrSigs.push( $("#"+iid+"imgsig").val() );
                                        show_gallArr(holderOBJ,gallArr);
                                    }
                                };
                            }
                            else{
                                alertstr += "\n"+files[x].name;
                                if(!type_ok){ alertstr += "\n - wrong file type."; }
                                var over = (maxfsize/1000000).toString();
                                over = over.slice( 0, over.indexOf(".")+2 );
                                if(!size_ok){ alertstr += "\n - file over "+over+"MB"; }
                            }
                        }/* for */
                        if(alertstr!=""){ alert(alertstr); alertstr=""; }
                    }
                    else{ alert("FileReader not supported."); }
                }
                function makeIMGselected( selID, boolTF, enable_deselect ){
                    var selTcolor = "#15cf68";
                    var selFcolor = "#ffffff";
                    if(boolTF){
                        var MIname = $("p#"+selID).html();
                        $("img.gallimg").css("background-color",selFcolor);
                        if(( enable_deselect )&&( selectedIMGid==selID )){
                            selectedIMGid = "";
                            $("img.gallimg").css("background-color",selFcolor);
                            show_sigs(false,selID);
                        }
                        else{
                            selectedIMGid = selID;
                            $("img#"+selID).css("background-color",selTcolor);
                            show_sigs(true,selID);
                        }
                    }
                    else if(!boolTF){
                        selectedIMGid = "";
                        $("img.gallimg").css("background-color",selFcolor);
                        show_sigs(false,selID);
                    }
                }
                function removeIMG(imgID,holderOBJ){
                    var src = $("#"+imgID).attr("src");
                    var index = -1;
                    for( x in gallArr ){if(src==gallArr[x]){ index=x; break; }}
                    itemmode = $(itemHolder).attr("itemmode");
                    if(itemmode=="E"){
                        gallArr.splice(index,1);
                        gallFarr.splice(index,1);
                        gallArrNames.splice(index,1);
                        gallArrSigs.splice(index,1);
                    }else if(itemmode=="E2"){
                        var name = gallArrNames[index];
                        var idx=-1;
                        for( i in gallFarr ){if(gallFarr[i].name==name){ idx=i; break; }}
                        if(idx>=0){ gallFarr.splice(idx,1); }
                        gallArr.splice(index,1);
                        gallArrNames.splice(index,1);
                        gallArrSigs.splice(index,1);
                    }
                    show_gallArr(holderOBJ,gallArr);
                }
                function moveIMG(imgID,strLF,holderOBJ){
                    itemmode = $(itemHolder).attr("itemmode");
                    var index = parseInt(imgID.slice(4));
                    var newID = imgID.slice(0,4);
                    var tmp="", tmp2="", tmp3="", tmp4="";
                    if(strLF=="L"&&index>0){
                        tmp = gallArr[index-1];
                        gallArr[index-1] = gallArr[index];
                        gallArr[index] = tmp;
                        if(itemmode=="E"){
                            tmp2 = gallFarr[index-1];
                            gallFarr[index-1] = gallFarr[index];
                            gallFarr[index] = tmp2;
                            tmp3 = gallArrNames[index-1];
                            gallArrNames[index-1] = gallArrNames[index];
                            gallArrNames[index] = tmp3;
                            tmp4 = gallArrSigs[index-1];
                            gallArrSigs[index-1] = gallArrSigs[index];
                            gallArrSigs[index] = tmp4;
                        }else if(itemmode=="E2"){
                            tmp3 = gallArrNames[index-1];
                            gallArrNames[index-1] = gallArrNames[index];
                            gallArrNames[index] = tmp3;
                            tmp4 = gallArrSigs[index-1];
                            gallArrSigs[index-1] = gallArrSigs[index];
                            gallArrSigs[index] = tmp4;
                        }
                        newID += index-1;
                        show_gallArr(holderOBJ,gallArr);
                        makeIMGselected(newID,true,true);
                    }
                    else if(strLF=="R"&&index<(gallArr.length-1)){
                        tmp = gallArr[index+1];
                        gallArr[index+1] = gallArr[index];
                        gallArr[index] = tmp;
                        if(itemmode=="E"){
                            tmp2 = gallFarr[index+1];
                            gallFarr[index+1] = gallFarr[index];
                            gallFarr[index] = tmp2;
                            tmp3 = gallArrNames[index+1];
                            gallArrNames[index+1] = gallArrNames[index];
                            gallArrNames[index] = tmp3;
                            tmp4 = gallArrSigs[index+1];
                            gallArrSigs[index+1] = gallArrSigs[index];
                            gallArrSigs[index] = tmp4;
                        }else if(itemmode=="E2"){
                            tmp3 = gallArrNames[index+1];
                            gallArrNames[index+1] = gallArrNames[index];
                            gallArrNames[index] = tmp3;
                            tmp4 = gallArrSigs[index+1];
                            gallArrSigs[index+1] = gallArrSigs[index];
                            gallArrSigs[index] = tmp4;
                        }
                        newID += index+1;
                        show_gallArr(holderOBJ,gallArr);
                        makeIMGselected(newID,true,true);
                    }
                }
                function show_gallArr(holderOBJ,gA){
                    $(holderOBJ).html("");
                    var img = undefined;
                    for( a in gA ){
                        img = document.createElement("img");
                        $(img).attr("class","gallimg");
                        $(img).attr("id","gimg"+a);
                        $(img).click(function(){ makeIMGselected(this.id,true,true); });
                        $(img).attr("src",gA[a]);
                        $(holderOBJ).append(img);
                    }
                    show_sigs(false,selectedIMGid);
                }
                function show_sigs(boolTF,imgID){
                    // gallArrSigs
                    if(boolTF){
                        var src = $("#"+imgID).attr("src");
                        var ind=-1; ind=gallArr.indexOf(src);
                        if(ind!=-1){
                            var val = gallArrSigs[ind];
                            val = (val=="defined")?"":val;
                            $("#"+iid+"imgsig").val( val );
                        }else{
                            $("#"+iid+"imgsig").val("");
                        }
                    }else{
                        $("#"+iid+"imgsig").val("");
                    }
                }
                // itype, itemIDn, icontent, iparams
                var oiLbl = document.createElement("p");
                $(oiLbl).attr("class","piclabel");
                $(oiLbl).html(" Select images:");
                var omniInput = document.createElement("input");
                $(omniInput).attr("class","imgs_uploadField");
                $(omniInput).attr("type","file");
                $(omniInput).attr("multiple","multiple");
                var br1 = document.createElement("br");
                var br2 = document.createElement("br");
                var aiLbl = document.createElement("p");
                $(aiLbl).attr("class","piclabel");
                $(aiLbl).html(" Append images:");
                var addInput = document.createElement("input");
                $(addInput).attr("class","imgs_uploadField");
                $(addInput).attr("type","file");
                $(addInput).attr("multiple","multiple");
                var delBtn = document.createElement("button");
                $(delBtn).attr("class","itemDUDbtn");
                $(delBtn).text("REMOVE");
                $(delBtn).css("visibility","hidden");
                var space = document.createElement("p");
                $(space).attr("class","piclabel");
                $(space).text("    ");
                $(space).css("visibility","hidden");
                var movUBtn = document.createElement("button");
                $(movUBtn).attr("class","itemDUDbtn");
                $(movUBtn).text("◄");
                $(movUBtn).css("visibility","hidden");
                var movLbl = document.createElement("p");
                $(movLbl).attr("class","piclabel");
                $(movLbl).html("MOVE");
                $(movLbl).css("visibility","hidden");
                var movDBtn = document.createElement("button");
                $(movDBtn).attr("class","itemDUDbtn");
                $(movDBtn).text("►");
                $(movDBtn).css("visibility","hidden");
                var lineBR = new Array();
                lineBR[0] = document.createElement("div");
                $(lineBR[0]).attr("class","lineBRdiv");
                var imgHolder = document.createElement("div");
                $(imgHolder).attr("class","imgHolder");
                $(imgHolder).attr("id",iid+"imgHolder");
                lineBR[1] = document.createElement("div");
                $(lineBR[1]).attr("class","lineBRdiv");
                var sig = document.createElement("textarea");
                $(sig).attr("class","imgsigTXTa");
                $(sig).attr("id",iid+"imgsig");
                $(sig).css("visibility","hidden");
                $(sig).css("height",0);
                lineBR[3] = document.createElement("div");
                $(lineBR[3]).attr("class","lineBRdiv");
                $(lineBR[3]).css("display","none");
                var sliderlabels = new Array();
                sliderlabels[0] = document.createElement("p");
                $(sliderlabels[0]).attr("class","piclabel");
                $(sliderlabels[0]).html("img max-Width:");
                var imwInput = document.createElement("input");
                $(imwInput).attr("class","numberInputField");
                $(imwInput).attr("type","number");
                $(imwInput).attr("id","imwInput");
                $(imwInput).val(imgMaxW);
                sliderlabels[1] = document.createElement("p");
                $(sliderlabels[1]).attr("class","piclabel");
                $(sliderlabels[1]).html("img max-Height:");
                var imhInput = document.createElement("input");
                $(imhInput).attr("class","numberInputField");
                $(imhInput).attr("type","number");
                $(imhInput).attr("id","imhInput");
                $(imhInput).val(imgMaxH);
                sliderlabels[2] = document.createElement("p");
                $(sliderlabels[2]).attr("class","piclabel");
                $(sliderlabels[2]).html("imgs per slide:");
                var ipsInput = document.createElement("input");
                $(ipsInput).attr("class","numberInputField");
                $(ipsInput).attr("type","number");
                $(ipsInput).val(imgsPerSlide);
                var refSlider = document.createElement("button");
                $(refSlider).attr("class","refSlider");
                $(refSlider).text("PREVIEW slider");
                lineBR[2] = document.createElement("div");
                $(lineBR[2]).attr("class","lineBRdiv");
                // validators
                $(imwInput).change(function(){
                    imgMaxW_F(imwInput);
                    imgMaxH_F(imhInput);
                    imgsPerSlide_F(ipsInput);
                });
                $(imhInput).change(function(){
                    imgMaxW_F(imwInput);
                    imgMaxH_F(imhInput);
                    imgsPerSlide_F(ipsInput);
                });
                $(ipsInput).change(function(){
                    imgMaxW_F(imwInput);
                    imgMaxH_F(imhInput);
                    imgsPerSlide_F(ipsInput);
                });
                // gallArr handlers
                $(omniInput).change(function(){
                    gallArr_F(omniInput, imgHolder, false);
                });
                $(addInput).change(function(){
                    gallArr_F(addInput, imgHolder, true);
                });
                $(delBtn).click(function(){
                    if(selectedIMGid!=""){
                        removeIMG(selectedIMGid,imgHolder);
                        makeIMGselected("",false,false);
                    }else{alert("Nothing selected.");}
                });
                $(movUBtn).click(function(){
                    if(selectedIMGid!=""){
                        moveIMG(selectedIMGid,"L",imgHolder);
                    }else{alert("Nothing selected.");}
                });
                $(movDBtn).click(function(){
                    if(selectedIMGid!=""){
                        moveIMG(selectedIMGid,"R",imgHolder);
                    }else{alert("Nothing selected.");}
                });
                $(sig).change(function(){
                    if(selectedIMGid != ""){
                        // gallArrSigs
                        var src = $("#"+selectedIMGid).attr("src");
                        var ind=-1; ind=gallArr.indexOf(src);
                        if( ind!=-1 ){ gallArrSigs[ind] = $("#"+iid+"imgsig").val(); }
                    }
                });
                // appending
                $(itemHolder).append(oiLbl);
                $(itemHolder).append(omniInput);
                $(itemHolder).append(delBtn);
                $(itemHolder).append(space);
                $(itemHolder).append(movUBtn);
                $(itemHolder).append(movLbl);
                $(itemHolder).append(movDBtn);
                $(itemHolder).append(br1);
                $(itemHolder).append(br2);
                $(itemHolder).append(aiLbl);
                $(itemHolder).append(addInput);
                $(itemHolder).append(lineBR[0]);
                $(itemHolder).append(imgHolder);
                $(itemHolder).append(lineBR[1]);
                $(itemHolder).append(sig);
                $(itemHolder).append(lineBR[3]);
                $(itemHolder).append(sliderlabels[0]);
                $(itemHolder).append(imwInput);
                $(itemHolder).append(sliderlabels[1]);
                $(itemHolder).append(imhInput);
                $(itemHolder).append(sliderlabels[2]);
                $(itemHolder).append(ipsInput);
                //$(itemHolder).append(refSlider);
                $(itemHolder).append(lineBR[2]);
                var sliderHolderDIV = document.createElement("div");
                $(sliderHolderDIV).attr("class","sliderHolderDIV");
                $(sliderHolderDIV).attr("id","sliderHolderDIVid");
                $(itemHolder).append(sliderHolderDIV);
                lineBR[4] = document.createElement("div");
                $(lineBR[4]).attr("class","lineBRdiv");
                $(itemHolder).append(lineBR[4]);
                var loadBarimg = document.createElement("img");
                $(loadBarimg).attr("class","loadBarimgGIFgall");
                $(loadBarimg).css("display","none");
                $(loadBarimg).attr("id",iid+"loadBar");
                $(loadBarimg).attr("src","on-loader.gif");
                var saveBtn = document.createElement("button");
                $(saveBtn).attr("class","SaveCancelBTN");
                $(saveBtn).text("SAVE");
                var cancBtn = document.createElement("button");
                $(cancBtn).attr("class","SaveCancelBTN");
                $(cancBtn).text("CANCEL");
                $(itemHolder).append(loadBarimg);
                $(itemHolder).append(cancBtn);
                $(itemHolder).append(saveBtn);
                var sliderID = "itemSlider";
                $(refSlider).click(function(){
                    if(gallArr.length>0){
                        var wi = imgsPerSlide*(imgMaxW+5)+65;
                        var hi = imgMaxH+10;
                        var ml = (800-wi)/2;
                        $(sliderHolderDIV).css("width",wi);
                        $(sliderHolderDIV).css("height",hi);
                        $(sliderHolderDIV).css("margin-left",ml);
                        $(sliderHolderDIV).html("");
                        var imgarr = new Array();
                        for( x in gallArr ){
                            imgarr.push([gallArr[x],imgMaxW,imgMaxH]);
                        }
                        $(sliderHolderDIV).imgSlider( imgMaxW,imgMaxH,imgsPerSlide,1,imgarr,sliderID,true );
                        $(sliderHolderDIV).show(1);
                    }else{
                        $(sliderHolderDIV).hide(1);
                        $(sliderHolderDIV).html("");
                    }
                });
                $(cancBtn).click(function(){ LoadItems(function(){}); });
                $(saveBtn).click(function(){ saveItem(itype,iid); });
                
                if(editTF){
                    $(itemHolder).attr("itemmode","E2");
                    $(delBtn).css("visibility","visible");
                    $(space).css("visibility","visible");
                    $(movUBtn).css("visibility","visible");
                    $(movLbl).css("visibility","visible");
                    $(movDBtn).css("visibility","visible");
                    $(sig).css("visibility","visible");
                    $(sig).css("height",50);
                    $(lineBR[3]).css("display","block");
                    function gallery_edit( Gcontent, Gparams ){
                        var imgarr = vida.vStrTrans2arr( Gcontent, "<(x)>" );
                        var isW = Gparams[0]; // general img width
                        var isH = Gparams[1]; // general img height
                        var ips = Gparams[2]; // imgs per slide
                        $(imwInput).val(isW); $(imwInput).change();
                        $(imhInput).val(isH); $(imhInput).change();
                        $(ipsInput).val(ips); $(ipsInput).change();
                        for( x in imgarr ){
                            gallArr.push("../../"+imgarr[x]);
                            gallArrNames.push( imgarr[x].slice(imgarr[x].indexOf("e_")+2) );
                        }
                        gallArrSigs = new Array();
                        for( var y=0; y<Gparams.length; y++ ){
                            gallArrSigs.push( vida.vStrSection(3,Gparams[y+3],"(x)") );
                        }
                        show_gallArr(imgHolder,gallArr);
                    } gallery_edit( icontent, iparams );
                }// editTF
            }
        }
        case4_gallery(); break;
        
        case 5: function case5_file(){
            if(modeDE=="D"){ /* display */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","D");
                var dwnldIco = document.createElement("div");
                $(dwnldIco).attr("class","dwnldIco");
                var ifile = document.createElement("a");
                $(ifile).attr("class","dwnldLink");
                $(ifile).attr("target","_blank");
                $(ifile).attr("href","../../"+icontent);
                $(ifile).html( iparams[0] );
                $(itemHolder).append(dwnldIco);
                $(itemHolder).append(ifile);
            }
            else if(modeDE=="E"){ /* edit */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","E");
                var inputname = document.createElement("input");
                $(inputname).attr("class","filenameInput");
                $(inputname).attr("type","text");
                $(inputname).attr("id",iid+"fileName");
                var inputfile = document.createElement("input");
                $(inputfile).attr("class","file_uploadField");
                $(inputfile).attr("type","file");
                $(inputfile).attr("id",iid+"file");
                var loadBar = document.createElement("img");
                $(loadBar).attr("class","loadBarimgGIF");
                $(loadBar).css("display","none");
                $(loadBar).attr("id",iid+"loadBar4file");
                $(loadBar).attr("src","on-loader.gif");
                var saveBtn = document.createElement("button");
                $(saveBtn).attr("class","SaveCancelBTNfile");
                $(saveBtn).text("SAVE");
                $(saveBtn).click(function(){ saveItem(itype,iid); });
                var cancBtn = document.createElement("button");
                $(cancBtn).attr("class","SaveCancelBTNfile");
                $(cancBtn).text("CANCEL");
                $(cancBtn).click(function(){ LoadItems(function(){}); });
                $(itemHolder).append(inputname);
                $(itemHolder).append(inputfile);
                $(itemHolder).append(saveBtn);
                $(itemHolder).append(cancBtn);
                $(itemHolder).append(loadBar);
                $(inputfile).change(function(){
                    var file = this.files[0];
                    var maxFileSize = max_file_size;
                    var size_ok = (file.size<=maxFileSize)?true:false;
                    if(window.FileReader && size_ok){
                        var rdr = new FileReader();
                        rdr.onload = function(e){
                            $(inputname).val( file.name );
                        };
                        rdr.readAsDataURL(file);
                    }
                    else{
                        if(!window.FileReader)
                        { alert("FileReader not supported."); }
                        if(!size_ok){
                            $(inputfile).val("");
                            $(inputname).val("");
                            var over = (maxFileSize/1000000).toString();
                            over = over.slice( 0, over.indexOf(".")+2 );
                            alert( "File over "+over+"MB" );
                        }
                    }
                });
                
                if(editTF){
                    $(itemHolder).attr("itemmode","E2");
                    var fileName = iparams[0];
                    $(inputname).val(fileName);
                }
            }
        }
        case5_file(); break;
        
        case 6: function case6_embed(){
            if(modeDE=="D"){ /* display */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","D");
                var w = parseInt( iparams[0] );
                var h = parseInt( iparams[1] );
                var iembedItem = document.createElement("div");
                $(iembedItem).attr("class","embedItem");
                $(iembedItem).css("width",w);
                $(iembedItem).css("height",h);
                var margL = Math.ceil((800-w)/2);
                var margR = margL-5; margR = (margR<0)?0:margR;
                $(iembedItem).css("margin-left",margL);
                $(iembedItem).css("margin-right",margR);
                $(iembedItem).html(icontent);
                $(itemHolder).append(iembedItem);
            }
            else if(modeDE=="E"){ /* edit */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","E");
                var maxW=720, minW=120, maxH=720, minH=120;
                var hrline = document.createElement("div");
                $(hrline).attr("class","hrline");
                var srcLabel = document.createElement("p");
                $(srcLabel).attr("class","embedlabel");
                $(srcLabel).html("Embed code: ");
                var inputSrc = document.createElement("input");
                $(inputSrc).attr("class","embedsrcin");
                $(inputSrc).attr("type","text");
                $(inputSrc).attr("id",iid+"embedsrc");
                var divspace = document.createElement("div");
                $(divspace).attr("class","divspace");
                var sizeLabel = document.createElement("p");
                $(sizeLabel).attr("class","embedlabel");
                $(sizeLabel).html("Size: ");
                var sizeSelect = document.createElement("select");
                $(sizeSelect).attr("class","embedsizeSelect");
                $(sizeSelect).attr("id",iid+"sizeSelect");
                var saveBtn = document.createElement("button");
                $(saveBtn).attr("class","SaveCancelBTNfile");
                $(saveBtn).text("SAVE");
                $(saveBtn).click(function(){ saveItem(itype,iid); });
                var cancBtn = document.createElement("button");
                $(cancBtn).attr("class","SaveCancelBTNfile");
                $(cancBtn).text("CANCEL");
                $(cancBtn).click(function(){ LoadItems(function(){}); });
                var embedPreview = document.createElement("div");
                $(embedPreview).attr("class","embedIF");
                $(embedPreview).attr("id",iid+"embedPrev");
                $(itemHolder).append(srcLabel);
                $(itemHolder).append(inputSrc);
                $(itemHolder).append(divspace);
                $(itemHolder).append(sizeLabel);
                $(itemHolder).append(sizeSelect);
                $(itemHolder).append(saveBtn);
                $(itemHolder).append(cancBtn);
                $(itemHolder).append(hrline);
                $(itemHolder).append(embedPreview);
                $(inputSrc).change(function(){
                    var tmptxt = ""+$(this).val()+"";
                    if( tmptxt!="" && !!tmptxt.match("iframe") ){
                        var ttb = tmptxt.indexOf("<iframe");
                        var tte = tmptxt.indexOf("</iframe>")+9;
                        tmptxt = tmptxt.slice( ttb, tte );
                        $(this).val(tmptxt);
                        var wb = tmptxt.indexOf(" width=")+8;
                        var we = tmptxt.indexOf( "\"", wb );
                        var width = tmptxt.slice( wb, we );
                        var hb = tmptxt.indexOf(" height=")+9;
                        var he = tmptxt.indexOf( "\"", hb );
                        var height = tmptxt.slice( hb, he );
                        if( width!="" && height!="" ){
                            var ww = [720,640,560,480,360,240];
                            var w = parseInt(width);
                            var minw = Math.min.apply(null,ww); w=(w<minw)?minw:w;
                            var maxw = Math.max.apply(null,ww); w=(w>maxw)?maxw:w;
                            var h = parseInt(height);
                            var r = w/h;
                            var hh = []; for( v in ww ){ hh[v]=Math.ceil(ww[v]/r); }
                            function getClosestVal( wid, widarr ){
                                var difarr = new Array(); var i = 0;
                                for( x in widarr ){ difarr.push(Math.abs( wid-widarr[x] )); }
                                for( y in difarr ){ if(Math.min.apply(null,difarr)==difarr[y]){ i=y; break; } }
                                return widarr[i];
                            }
                            var closestval = getClosestVal(w,ww);
                            var sizeSelOpt = new Array();
                            var mtvs = "";  // make this value selected
                            var sSstr = ""; // sizeSel str
                            $(sizeSelect).html("");
                            for( x in ww ){
                                sSstr = ww[x]+" x "+hh[x];
                                sizeSelOpt[x] = document.createElement("option");
                                $(sizeSelOpt[x]).html(sSstr);
                                $(sizeSelect).append( sizeSelOpt[x] );
                                if( closestval==ww[x] ){ mtvs=sSstr; }
                            }
                            $(sizeSelect).val(mtvs); $(sizeSelect).change();
                            $(embedPreview).html(tmptxt);
                        }
                    }
                    else{
                        $(embedPreview).html("");
                        $(embedPreview).css("width",minW);
                        $(embedPreview).css("height",minH);
                        $(embedPreview).css("margin-left",Math.ceil((800-minW)/2));
                        $(embedPreview).css("margin-right",Math.ceil((800-minW)/2));
                        $(sizeSelect).html("");
                    }
                    $(sizeSelect).change();
                });
                $(sizeSelect).change(function(){
                    if( $(this).html()!="" ){
                        var size = $("#"+this.id+" option:selected").text();
                        var w = parseInt( size.slice( 0, size.indexOf("x")-1 ) );
                        var h = parseInt( size.slice( size.indexOf("x")+2 ) );
                        $(embedPreview).css("width",w);
                        $(embedPreview).css("height",h);
                        var marg = Math.ceil((800-w)/2);
                        $(embedPreview).css("margin-left",marg);
                        $(embedPreview).css("margin-right",marg);
                        $(embedPreview).children(":first").attr("width",w);
                        $(embedPreview).children(":first").attr("height",h);
                    }
                });
                
                if(editTF){
                    $(itemHolder).attr("itemmode","E2");
                    $(inputSrc).val(icontent);
                    $(inputSrc).change();
                    $(sizeSelect).val( iparams[0]+" x "+iparams[1] );
                }
            }
        }
        case6_embed(); break;
        
        case 7: function case7_link(){
            if(modeDE=="D"){ /* display */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","D");
                var ilink = document.createElement("a");
                $(ilink).attr("class","linkitem");
                $(ilink).attr("href",icontent);
                $(ilink).html( iparams[0] );
                $(itemHolder).append(ilink);
            }
            else if(modeDE=="E"){ /* edit */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","E");
                var linkLabel_url = document.createElement("p");
                $(linkLabel_url).attr("class","linklabel");
                $(linkLabel_url).html("Link URL: ");
                var linkLabel_name = document.createElement("p");
                $(linkLabel_name).attr("class","linklabel");
                $(linkLabel_name).html("Link name: ");
                var inputURL = document.createElement("input");
                $(inputURL).attr("class","linkInput");
                $(inputURL).attr("type","text");
                $(inputURL).attr("id",iid+"linkURL");
                var inputName = document.createElement("input");
                $(inputName).attr("class","linkInput");
                $(inputName).attr("type","text");
                $(inputName).attr("id",iid+"linkName");
                var divspace = document.createElement("div");
                $(divspace).attr("class","divspaceLink");
                var saveBtn = document.createElement("button");
                $(saveBtn).attr("class","SaveCancelBTNfile");
                $(saveBtn).text("SAVE");
                $(saveBtn).click(function(){ saveItem(itype,iid); });
                var cancBtn = document.createElement("button");
                $(cancBtn).attr("class","SaveCancelBTNfile");
                $(cancBtn).text("CANCEL");
                $(cancBtn).click(function(){ LoadItems(function(){}); });
                $(itemHolder).append(linkLabel_url);
                $(itemHolder).append(inputURL);
                $(itemHolder).append(linkLabel_name);
                $(itemHolder).append(inputName);
                $(itemHolder).append(divspace);
                $(itemHolder).append(saveBtn);
                $(itemHolder).append(cancBtn);
                
                if(editTF){
                    $(itemHolder).attr("itemmode","E2");
                    $(inputURL).val(icontent);
                    $(inputURL).change();
                    $(inputName).val( iparams[0] );
                }
            }
        }
        case7_link(); break;
        
        case 8: function case8_combo(){
            var arrIcontent = vida.vStrTrans2arr( icontent, "<<|x|>>" );
            if(modeDE=="D"){ /* display */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","D");
                var imgSrc = arrIcontent[0];
                var txtHtm = arrIcontent[1];
                function fillitmHolder( fimgsrc, fimgsize, fimgtitle, fimgclass, ftxthtml ){
                    isize = parseInt(fimgsize);
                    fimgsrc = "../../"+ ((isize<=200)? fimgsrc : fimgsrc.replace("thumbs/",""));
                    fimgtitle = (fimgtitle==undefined)?"":fimgtitle;
                    var imgparts = ["","","","","",""];
                    imgparts[0] = "<img ";
                    imgparts[1] = "class=\""+fimgclass+"\" ";
                    imgparts[2] = "src=\""+fimgsrc+"\" ";
                    imgparts[3] = "width=\""+fimgsize+"\" ";
                    imgparts[4] = "title=\""+fimgtitle+"\" ";
                    imgparts[5] = "/>";
                    var htmlimg = "";
                    for( i in imgparts ){ htmlimg+=imgparts[i]; }
                    $(itemHolder).html("");
                    $(itemHolder).html( htmlimg+ftxthtml );
                }
                fillitmHolder( imgSrc, iparams[0], iparams[1], img_class, txtHtm );
            }
            else if(modeDE=="E"){ /* edit */
                $(itemHolder).html("");
                $(itemHolder).attr("itemmode","E");
                // image part:
                var picInput = document.createElement("input");
                $(picInput).attr("class","Combpicture_uploadField");
                $(picInput).attr("id","icontent");
                $(picInput).attr("name","icontent");
                $(picInput).attr("type","file");
                var label = document.createElement("p");
                $(label).attr("class","piclabel");
                $(label).html("Scale image:");
                var whinput = document.createElement("input");
                $(whinput).attr("class","numberInField");
                $(whinput).attr("id",iid+"imgWidth");
                $(whinput).attr("type","number");
                $(whinput).val(400);
                img_width = $(whinput).val();
                var lineBRdiv = document.createElement("div");
                $(lineBRdiv).attr("class","lineBRdiv");
                var loadBarimg = document.createElement("img");
                $(loadBarimg).attr("class","loadBarimgGIF");
                $(loadBarimg).css("display","none");
                $(loadBarimg).attr("id",iid+"loadBar");
                $(loadBarimg).attr("src","on-loader.gif");
                var sig = document.createElement("textarea");
                $(sig).attr("class","imgsigTXTa");
                $(sig).attr("id",iid+"imgsig");
                $(sig).change(function(){
                    img_title = $(sig).val();
                });
                img_title = $(sig).val();
                $(itemHolder).append(picInput);
                $(itemHolder).append(label);
                $(itemHolder).append(whinput);
                $(itemHolder).append(loadBarimg);
                $(itemHolder).append(sig);
                $(itemHolder).append(lineBRdiv);
                // text part:
                var txtarea = document.createElement("textarea");
                $(txtarea).attr("class","textitemTxtarea");
                $(txtarea).attr("id",iid+"text");
                $(itemHolder).append(txtarea);
                var RTEctrls = { autoGrow:true, controls:{
                    bold                 : { visible : true },
                    italic               : { visible : true },
                    strikeThrough        : { visible : true },
                    underline            : { visible : true },
                    justifyLeft          : { visible : true },
                    justifyCenter        : { visible : true },
                    justifyRight         : { visible : true },
                    justifyFull          : { visible : true },
                    subscript            : { visible : true },
                    superscript          : { visible : true },
                    undo                 : { visible : true },
                    redo                 : { visible : true },
                    createLink           : { visible : true },
                    removeFormat         : { visible : true },
                    increaseFontSize     : { visible : true },
                    decreaseFontSize     : { visible : true },
                    insertHorizontalRule : { visible : false },
                    h1                   : { visible : false },
                    h2                   : { visible : false },
                    h3                   : { visible : false },
                    h4                   : { visible : false },
                    h5                   : { visible : false },
                    h6                   : { visible : false },
                    cut                  : { visible : false },
                    copy                 : { visible : false },
                    paste                : { visible : false },
                    html                 : { visible : false },
                    insertTable          : { visible : false },
                    insertImage          : { visible : false },
                    paragraph            : { visible : false },
                    indent               : { visible : false },
                    outdent              : { visible : false },
                    insertOrderedList    : { visible : false },
                    insertUnorderedList  : { visible : false },
                }};
                $(txtarea).wysiwyg(RTEctrls);
                $(txtarea).wysiwyg("clear");
                $(txtarea).change(function(){
                    txt_html = $(txtarea).wysiwyg("getContent");
                });
                txt_html = $(txtarea).wysiwyg("getContent");
                // preview part:
                var prevLabel = document.createElement("div");
                $(prevLabel).attr("class","prevLabel");
                $(prevLabel).html(" - Preview - ");
                var ComboHolderDiv = document.createElement("div");
                $(ComboHolderDiv).attr("class","ComboHolderDiv");
                $(ComboHolderDiv).attr("id",iid+"comboHolder");
                $(itemHolder).append(prevLabel);
                $(itemHolder).append(ComboHolderDiv);
                // compile html
                function fillHtmlHolder( fimgsrc, fimgsize, fimgtitle, ftxthtml ){
                    var imgparts = ["","","","","",""];
                    imgparts[0] = "<img ";
                    imgparts[1] = "class=\""+img_class+"\" ";
                    imgparts[2] = "src=\""+fimgsrc+"\" ";
                    imgparts[3] = "width=\""+fimgsize+"\" ";
                    imgparts[4] = "title=\""+fimgtitle+"\" ";
                    imgparts[5] = "/>";
                    var htmlimg = "";
                    for( i in imgparts ){ htmlimg+=imgparts[i]; }
                    $(ComboHolderDiv).html("");
                    $(ComboHolderDiv).html( htmlimg+ftxthtml );
                }
                // img input checker:
                img_file = undefined;
                $(picInput).change(function(){
                    var file = picInput.files[0];
                    if(window.FileReader){
                        var type_ok = false;
                        var size_ok = false;
                        var maxFsize = max_file_size;
                        type_ok = validate_type( file.type );
                        size_ok = (file.size<maxFsize)?true:false;
                        if(!type_ok || !size_ok){
                            img_file = undefined;
                            if(!window.FileReader){ alert("FileReader not supported."); }
                            $(picInput).val("");
                            var alstr = file.name;
                            var over = (maxFsize/1000000).toString();
                                over = over.slice( 0, over.indexOf(".")+2 );
                            if(!type_ok){ alstr += "\n - wrong file type."; }
                            if(!size_ok){ alstr += "\n - file over "+over+"MB."; }
                            alert(alstr);
                        }
                        else{ img_file = file; }
                    }
                    else{ alert("FileReader not supported."); }
                });
                // width input checker:
                $(whinput).change(function(){
                    var maxW=500, minW=100;
                    var val = $(whinput).val();
                    $(whinput).val( (val=="")?maxW:val );
                    var w=parseInt($(whinput).val());
                    w=(w<minW)?minW:w; w=(w>maxW)?maxW:w;
                    $(whinput).val(w);
                    img_width = w;
                });
                // preview click:
                $(prevLabel).click(function(){
                    var imgsrc = undefined;
                    var imgsize = parseInt($(whinput).val());
                        imgsize = (imgsize=="NaN")?400:imgsize;
                    var imgtitle = $(sig).val();
                    var htmltext = $(txtarea).wysiwyg("getContent");
                    var htmltext_valid = false;
                    var file_selected = false;
                    var alstr2 = "";
                    // text
                    if(htmltext != "" &&
                       htmltext != "<br>" &&
                       htmltext != "<div style=\"text-align: justify;\"><br></div>" )
                    { htmltext_valid=true; }
                    else{ htmltext_valid=false; alstr2+="\n - No text inserted."; }
                    // file
                    var file = picInput.files[0];
                    if(editTF){ file_selected=true; }
                    else{
                        if(file!=undefined && picInput.files.length==1){ file_selected=true; }
                        else{ file_selected=false; alstr2+="\n - No image selected."; }
                    }
                    if( htmltext_valid && file_selected ){
                        if(!editTF){
                            if(window.FileReader){
                                var type_ok = false;
                                var size_ok = false;
                                var maxFsize = max_file_size;
                                type_ok = validate_type( file.type );
                                size_ok = (file.size<maxFsize)?true:false;
                                if(type_ok && size_ok){
                                    var rdr = new FileReader();
                                    rdr.onload = function(e){
                                        imgsrc = e.target.result;
                                        fillHtmlHolder( imgsrc, imgsize, imgtitle, htmltext );
                                    };
                                    rdr.readAsDataURL(file);
                                }
                                else{
                                    $(picInput).val("");
                                    var alstr = file.name;
                                    var over = (maxFsize/1000000).toString();
                                        over = over.slice( 0, over.indexOf(".")+2 );
                                    if(!type_ok){ alstr += "\n - wrong file type."; }
                                    if(!size_ok){ alstr += "\n - file over "+over+"MB."; }
                                    alert(alstr);
                                }
                            }
                            else{ alert("FileReader not supported."); }
                        }
                        else if(editTF){
                            file = picInput.files[0];
                            file_selected = (file!=undefined && picInput.files.length==1)?true:false;
                            if(file_selected){
                                if(window.FileReader){
                                    var type_ok = false;
                                    var size_ok = false;
                                    var maxFsize = max_file_size;
                                    type_ok = validate_type( file.type );
                                    size_ok = (file.size<maxFsize)?true:false;
                                    if(type_ok && size_ok){
                                        var rdr = new FileReader();
                                        rdr.onload = function(e){
                                            imgsrc = e.target.result;
                                            fillHtmlHolder( imgsrc, imgsize, imgtitle, htmltext );
                                        };
                                        rdr.readAsDataURL(file);
                                    }
                                    else{
                                        $(picInput).val("");
                                        var alstr = file.name;
                                        var over = (maxFsize/1000000).toString();
                                            over = over.slice( 0, over.indexOf(".")+2 );
                                        if(!type_ok){ alstr += "\n - wrong file type."; }
                                        if(!size_ok){ alstr += "\n - file over "+over+"MB."; }
                                        alert(alstr);
                                    }
                                }
                                else{ alert("FileReader not supported."); }
                            }
                            else{
                                imgsrc = "../../"+arrIcontent[0];
                                imgsrc = (imgsize>200)? imgsrc.replace("thumbs/","") : imgsrc;
                                fillHtmlHolder( imgsrc, imgsize, imgtitle, htmltext );
                            }
                        }
                    }
                    else{ $(ComboHolderDiv).html(""); alert(alstr2); }
                }); // $(prevLabel).click()
                // save and cancel:
                var spacediv = document.createElement("div");
                $(spacediv).attr("class","divspaceC");
                var saveBtn = document.createElement("button");
                $(saveBtn).attr("class","SaveCancelBTNfile");
                $(saveBtn).text("SAVE");
                $(saveBtn).click(function(){ saveItem(itype,iid); });
                var cancBtn = document.createElement("button");
                $(cancBtn).attr("class","SaveCancelBTNfile");
                $(cancBtn).text("CANCEL");
                $(cancBtn).click(function(){ LoadItems(function(){}); });
                $(itemHolder).append(spacediv);
                $(itemHolder).append(saveBtn);
                $(itemHolder).append(cancBtn);
                
                if(editTF){
                    $(itemHolder).attr("itemmode","E2");
                    var imgw = parseInt(iparams[0]);
                    var titl = (iparams[1]==undefined)?"":iparams[1];
                    var iSrc = "../../"+arrIcontent[0];
                    var imgsrc = (imgw>200)? iSrc.replace("thumbs/","") : iSrc;
                    var iHtm = arrIcontent[1];
                    img_width = imgw;
                    img_title = titl;
                    txt_html = iHtm;
                    $(txtarea).wysiwyg("setContent",iHtm);
                    $(whinput).val(imgw);
                    $(sig).val(titl);
                    fillHtmlHolder( imgsrc, imgw, titl, iHtm );
                }
            }
        }
        case8_combo(); break;
        
        default: break;
    }
    insertBoxOpen_F(false);
    if(modeDE=="E"){
        absoluteDeselect();
        insertBTNenable(false);
    }
}

function makeSelected( selID, boolTF, enable_deselect ){
    if( $("#"+selID).attr("itemmode")=="D" ){
        if(selectedItem!=""){ $("#"+selectedItem).css("background-color",selTcolor); }
        if(boolTF){
            $("div.itemHolderDiv").css("background-color",selFcolor);
            if( enable_deselect && selectedItem==selID ){
                selectedItem="";
                $("div.itemHolderDiv").css("background-color",selFcolor);
            }
            else{
                selectedItem=selID;
                $("#"+selID).css("background-color",selTcolor);
            }
        }
        else if(!boolTF){
            selectedItem="";
            $("div.itemHolderDiv").css("background-color",selFcolor);
        }
    }
}
function absoluteDeselect(){ selectedItem=""; $("div.itemHolderDiv").css("background-color",selFcolor); }

function saveItem( itemTYPE, itemID ){ testLog(function(){ saveItemFunc(itemTYPE,itemID); }); }
function saveItemFunc( itemTYPE, itemID ){
    itemIDn = parseInt(itemID.slice(4));
    var itemParams = undefined;
    var icategory = itemTYPE;
    var icontent = undefined;
    var params = undefined;
    var itemMode = $("#"+itemID).attr("itemmode");
    switch(itemTYPE)
    {
        case 1: function case1_title(){
            icontent = $("#"+itemID+"title").html();
            params = {icategory:icategory, icontent:icontent, itemParams:itemParams, itemIDn:itemIDn, pageN:pageN};
            $.post( "itemInsert.php", params, function(ree){ LoadItems(function(){}); });
        }
        case1_title(); break;
        
        case 2: function case2_text(){
            icontent = $("#"+itemID+"text").wysiwyg("getContent");
            if( icontent!="" ){
                params = {icategory:icategory, icontent:icontent, itemParams:itemParams, itemIDn:itemIDn, pageN:pageN};
                $.post( "itemInsert.php", params, function(ree){ LoadItems(function(){}); });
            }else{ alert("Nothing inserted."); }
        }
        case2_text(); break;
        
        case 3: function case3_image(){
            icontent = document.getElementById("icontent");
            var content_valid = ( icontent.value!="" && icontent.files.length==1 )?true:false;
            var contentValid = (content_valid)?1:0;
            var itemmode = $("#"+itemID).attr("itemmode");
            var imgWidth = $("#"+itemID+"imgWidth").val();
            var imgsig = $("#"+itemID+"imgsig").val();
            var alstr = "";
            if( itemmode=="E2" ){
                if(content_valid){ img_ajaxCall( true ); }
                else{ img_ajaxCall( false ); }
            }
            else if( itemmode=="E" ){
                if(content_valid){ img_ajaxCall( true ); }
                else{ alstr += "No image selected. \n"; }
            }
            if(alstr!=""){ alert(alstr); }
            function img_ajaxCall( fullTF ){
                if( fullTF ){
                    if(window.FormData && window.FileReader){
                        loadBarTrig(itemID+"loadBar",true);
                        icategory = itemTYPE;
                        itemParams = "<1>"+imgWidth+"<2>"+imgsig+"<3>";
                        var formdata = new FormData();
                        var reader = new FileReader();
                        var file = icontent.files[0];
                        reader = new FileReader();
                        reader.readAsDataURL(file);
                        formdata.append("itemmode", itemmode);
                        formdata.append("contentValid", contentValid);
                        formdata.append("icontent", file);
                        formdata.append("icategory", icategory);
                        formdata.append("itemParams", itemParams);
                        formdata.append("itemIDn", itemIDn);
                        formdata.append("pageN", pageN);
                        $.ajax({
                            url: "itemInsert.php",
                            type: "POST",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function(res)
                            { loadBarTrig(itemID+"loadBar",false); LoadItems(function(){}); }
                        });
                    }else{
                        if(!window.FormData){ alstr += "FormData not supported. \n"; }
                        if(!window.FileReader){ alstr += "FileReader not supported. \n"; }
                    }
                }
                else if( !fullTF ){
                    loadBarTrig(itemID+"loadBar",true);
                    icategory = itemTYPE;
                    itemParams = "<1>"+imgWidth+"<2>"+imgsig+"<3>";
                    var pars = {itemmode:itemmode, contentValid:contentValid,
                                icategory:icategory, itemParams:itemParams,
                                itemIDn:itemIDn, pageN:pageN};
                    $.post("itemInsert.php",pars,function(ree)
                    { loadBarTrig(itemID+"loadBar",false); LoadItems(function(){}); });
                }
            } // img_ajaxCall
        
        }
        case3_image(); break;
        
        case 4: function case4_gallery(){
            for( x in gallArrSigs ){
                var gx = gallArrSigs[x];
                gallArrSigs[x] = (gx==null || gx=="" || gx=="defined" || gx==undefined)?" ":gx;
            }
            var strSigs = vida.vConcatStrs("<<[-x-]>>",gallArrSigs);
            function case4_gallery_E(){
                // gallArr, maxW, maxH, imgsPerSlide
                var arrnotNull = ((gallArr.length==gallFarr.length) &&
                                  (gallArr.length>0))?true:false;
                if(window.FormData && window.FileReader && arrnotNull){
                    loadBarTrig(itemID+"loadBar",true);
                    var fdata = new FormData();
                    var tmpar = new Array();
                    icategory = itemTYPE;
                    itemParams = vida.vConcatStrs("<x>",[imgMaxW,imgMaxH,imgsPerSlide]);
                    for( b in gallFarr )
                    { fdata.append("icontent[]",gallFarr[b]); }
                    fdata.append("itemParams",itemParams);
                    fdata.append("icategory",icategory);
                    fdata.append("itemIDn",itemIDn);
                    fdata.append("pageN",pageN);
                    fdata.append("itemMode",itemMode);
                    fdata.append("strSigs",strSigs);
                    $.ajax({
                        url: "itemInsert.php",
                        type: "POST",
                        data: fdata,
                        processData: false,
                        contentType: false,
                        success: function(res){
                            loadBarTrig(itemID+"loadBar",false);
                            LoadItems( function(){
                                makeSelected(itemID,true,true);
                                $(editBTN).click();
                                scrollDwn();
                            });
                        }
                    });
                }
                else{
                    var alstr = "";
                    if(!window.FormData){ alstr += "FormData not supported. \n"; }
                    if(!window.FileReader){ alstr += "FileReader not supported. \n"; }
                    if(!arrnotNull){ alstr += "No images selected. \n"; }
                    alert(alstr);
                }
            }//case4_gallery_E
            
            function case4_gallery_E2(){
                var arrNotNull = (gallArrNames.length>0)?true:false;
                if(window.FormData && window.FileReader && arrNotNull){
                    loadBarTrig(itemID+"loadBar",true);
                    var imgnames = vida.vConcatStrs( "[=|-x-|=]", gallArrNames );
                    var fdata = new FormData();
                    var tmpar = new Array();
                    icategory = itemTYPE;
                    itemParams = vida.vConcatStrs("<x>",[imgMaxW,imgMaxH,imgsPerSlide]);
                    fdata.append("itemMode",itemMode);
                    for( b in gallFarr )
                    { fdata.append("icontent[]",gallFarr[b]); }
                    fdata.append("imgnames",imgnames);
                    fdata.append("itemParams",itemParams);
                    fdata.append("icategory",icategory);
                    fdata.append("itemIDn",itemIDn);
                    fdata.append("pageN",pageN);
                    fdata.append("strSigs",strSigs);
                    $.ajax({
                        url: "itemInsert.php",
                        type: "POST",
                        data: fdata,
                        processData: false,
                        contentType: false,
                        success: function(res)
                        { loadBarTrig(itemID+"loadBar",false); LoadItems(function(){}); }
                    });
                }
                else{
                    var alstr = "";
                    if(!window.FormData){ alstr += "FormData not supported. \n"; }
                    if(!window.FileReader){ alstr += "FileReader not supported. \n"; }
                    if(!arrNotNull){ alstr += "No images selected. \n"; }
                    alert(alstr);
                }
            }//case4_gallery_E2
            
                 if( itemMode=="E" ) { case4_gallery_E(); }
            else if( itemMode=="E2" ){ case4_gallery_E2(); }
        }//case4_gallery
        case4_gallery(); break;
        
        case 5: function case5_file(){
            icontent = new Array();
            icontent[0] = document.getElementById( itemID+"file" ); // file holder
            icontent[1] = (icontent[0].files.length==1)? icontent[0].files[0].name : ""; // real name
            var content_valid = (icontent[1]!="" && icontent[0].files.length==1)?true:false;
            var contentValid = (content_valid)?1:0;
            var itemmode = $("#"+itemID).attr("itemmode");
            
            var alstr = "";
            if( itemmode=="E2" ){
                if(content_valid){ file_ajaxCall( true ); }
                else{ file_ajaxCall( false ); }
            }
            else if( itemmode=="E" ){
                if(content_valid){ file_ajaxCall( true ); }
                else{ alstr += "No file selected. \n"; }
            }
            if(alstr!=""){ alert(alstr); }
            function file_ajaxCall( fullTF ){
                if( fullTF ){
                    if(window.FormData && window.FileReader){
                        loadBarTrig(itemID+"loadBar4file",true);
                        icategory = itemTYPE;
                        itemParams = ""+$("#"+itemID+"fileName").val()+"";
                        itemParams = (itemParams=="")?icontent[1]:itemParams;
                        itemParams = "<1>"+itemParams+"<2>";
                        var formdata = new FormData();
                        var reader = new FileReader();
                        var file = icontent[0].files[0];
                        reader = new FileReader();
                        reader.readAsDataURL(file);
                        formdata.append("itemmode", itemmode);
                        formdata.append("contentValid", contentValid);
                        formdata.append("icontent", file);
                        formdata.append("icategory", icategory);
                        formdata.append("itemParams", itemParams);
                        formdata.append("itemIDn", itemIDn);
                        formdata.append("pageN", pageN);
                        $.ajax({
                            url: "itemInsert.php",
                            type: "POST",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function(res)
                            { loadBarTrig(itemID+"loadBar4file",false); LoadItems(function(){}); }
                        });
                    }else{
                        if(!window.FormData){ alstr += "FormData not supported. \n"; }
                        if(!window.FileReader){ alstr += "FileReader not supported. \n"; }
                    }
                }
                else if( !fullTF ){
                    loadBarTrig(itemID+"loadBar4file",true);
                    icategory = itemTYPE;
                    itemParams = ""+$("#"+itemID+"fileName").val()+"";
                    itemParams = (itemParams=="")?icontent[1]:itemParams;
                    itemParams = "<1>"+itemParams+"<2>";
                    var pars = {itemmode:itemmode, contentValid:contentValid,
                                icategory:icategory, itemParams:itemParams,
                                itemIDn:itemIDn, pageN:pageN};
                    $.post("itemInsert.php",pars,function(ree)
                    { loadBarTrig(itemID+"loadBar4file",false); LoadItems(function(){}); });
                }
            } // file_ajaxCall
        }
        case5_file(); break;
        
        case 6: function case6_embed(){
            var embedCode = ""+$("#"+itemID+"embedPrev").html();
            var size = $("#"+itemID+"sizeSelect option:selected").text();
            var embedW = parseInt( size.slice( 0, size.indexOf("x")-1 ) );
            var embedH = parseInt( size.slice( size.indexOf("x")+2 ) );
            if(embedCode!="" && !!embedCode.match("iframe")){
                icontent = embedCode;
                itemParams = "<1>"+embedW+"<2>"+embedH+"<3>";
                params = {icategory:icategory, icontent:icontent, itemParams:itemParams, itemIDn:itemIDn, pageN:pageN};
                $.post( "itemInsert.php", params, function(ree){ LoadItems(function(){}); });
            }else{ alert("Invalid input."); }
        }
        case6_embed(); break;
        
        case 7: function case7_link(){
            icontent = $("#"+itemID+"linkURL").val();
            itemParams = $("#"+itemID+"linkName").val();
            if( icontent.slice(0,7)=="http://" && icontent.length>7 ){
                itemParams = (itemParams=="")?icontent:itemParams;
                itemParams = "<1>"+itemParams+"<2>";
                params = {icategory:icategory, icontent:icontent, itemParams:itemParams, itemIDn:itemIDn, pageN:pageN};
                $.post( "itemInsert.php", params, function(ree){ LoadItems(function(){}); });
            }
            else{ alert("Invalid link."); }
        }
        case7_link(); break;
        
        case 8: function case8_combo(){
            var txt_valid = (txt_html=="" ||
                             txt_html=="<br>" ||
                             txt_html=="<div style=\"text-align: justify;\"><br></div>") ?false:true;
            icontent = img_file;
            var content_valid = ( icontent!=undefined )?true:false;
            var contentValid = (content_valid)?1:0;
            var itemmode = $("#"+itemID).attr("itemmode");
            var imgWidth = img_width;
            var imgsig = img_title;
            var alstr = "";
            if( itemmode=="E2" ){
                if(content_valid && txt_valid){ img_ajaxCall( true ); }
                else{
                    if(!content_valid && txt_valid){ img_ajaxCall( false ); }
                    if(!txt_valid){ alstr += "No text inserted. \n"; }
                }
            }
            else if( itemmode=="E" ){
                if(content_valid && txt_valid){ img_ajaxCall( true ); }
                else{
                    if(!content_valid){ alstr += "No image selected. \n"; }
                    if(!txt_valid){ alstr += "No text inserted. \n"; }
                }
            }
            if(alstr!=""){ alert(alstr); }
            function img_ajaxCall( fullTF ){
                if( fullTF ){
                    if(window.FormData && window.FileReader){
                        //loadBarTrig(itemID+"loadBar",true);
                        icategory = itemTYPE;
                        itemParams = "<1>"+imgWidth+"<2>"+imgsig+"<3>";
                        var formdata = new FormData();
                        var reader = new FileReader();
                        var file = icontent;
                        reader = new FileReader();
                        reader.readAsDataURL(file);
                        formdata.append("itemmode", itemmode);
                        formdata.append("contentValid", contentValid);
                        formdata.append("icontent", file);
                        formdata.append("icategory", icategory);
                        formdata.append("itemParams", itemParams);
                        formdata.append("itemIDn", itemIDn);
                        formdata.append("pageN", pageN);
                        formdata.append("txt_html", txt_html);
                        $.ajax({
                            url: "itemInsert.php",
                            type: "POST",
                            data: formdata,
                            processData: false,
                            contentType: false,
                            success: function(res){
                                /*loadBarTrig(itemID+"loadBar",false);*/
                                LoadItems(function(){
                                    img_class = "htmlImgClass";
                                    img_width = 0;
                                    img_title = "";
                                    img_file = undefined;
                                    txt_html = "";
                                });
                            }
                        });
                    }else{
                        if(!window.FormData){ alstr += "FormData not supported. \n"; }
                        if(!window.FileReader){ alstr += "FileReader not supported. \n"; }
                    }
                }
                else if( !fullTF ){
                    //loadBarTrig(itemID+"loadBar",true);
                    icategory = itemTYPE;
                    imgsig = img_title;
                    itemParams = "<1>"+imgWidth+"<2>"+imgsig+"<3>";
                    var pars = {itemmode:itemmode, contentValid:contentValid,
                                icategory:icategory, itemParams:itemParams,
                                itemIDn:itemIDn, pageN:pageN, txt_html:txt_html};
                    $.post("itemInsert.php",pars,function(ree){
                        /*loadBarTrig(itemID+"loadBar",false);*/
                        LoadItems(function(){
                            img_class = "htmlImgClass";
                            img_width = 0;
                            img_title = "";
                            img_file = undefined;
                            txt_html = "";
                        });
                    });
                }
            } // img_ajaxCall
        }
        case8_combo(); break;
        
        default: break;
    }
}

function loadBarTrig( loadBarID, boolTF ){
    var disp = (boolTF)?"block":"none";
    $("#"+loadBarID).css("display",disp);
}

function insertBTNenable( boolTF ){
    if(boolTF){ // enable
        $(insertBTN).attr("disabled",false);
        $(insertBTN).css("color","#ededed");
        $(editBTN).attr("disabled",false);
        $(editBTN).css("color","#ededed");
        $(delBTN).attr("disabled",false);
        $(delBTN).css("color","#ededed");
        $(movuBTN).attr("disabled",false);
        $(movuBTN).css("color","#ededed");
        $(movdBTN).attr("disabled",false);
        $(movdBTN).css("color","#ededed");
        $("button#CTRLmenuLauncher").attr("disabled",false);
        $("button#CTRLmenuLauncher").css("color","#ededed");
    }
    else{ // disable
        $(insertBTN).attr("disabled",true);
        $(insertBTN).css("color","#c1bfbf");
        $(editBTN).attr("disabled",true);
        $(editBTN).css("color","#c1bfbf");
        $(delBTN).attr("disabled",true);
        $(delBTN).css("color","#c1bfbf");
        $(movuBTN).attr("disabled",true);
        $(movuBTN).css("color","#c1bfbf");
        $(movdBTN).attr("disabled",true);
        $(movdBTN).css("color","#c1bfbf");
        $("button#CTRLmenuLauncher").attr("disabled",true);
        $("button#CTRLmenuLauncher").css("color","#c1bfbf");
    }
}

function deleteItem(){ testLog(function(){ deleteItemfunc(); }); }
function deleteItemfunc(){
    if( selectedItem!="" && selectedItem.length>0 ){
        if(confirm("Delete this?")){
            var itemIDn = parseInt(selectedItem.slice(4));
            var itemtype = parseInt($("#"+selectedItem).attr("itemtype"));
            var params = {itemIDn:itemIDn,itemtype:itemtype,pageN:pageN};
            $.post("itemDelete.php",params,function(ree){
                absoluteDeselect();
                LoadItems(function(){});
            });
        }
    }else{ alert("Nothing selected."); }
}

function moveUDitem( MOVdirection ){ testLog(function(){ moveUDitemfunc(MOVdirection); }); }
function moveUDitemfunc(MOVdirection){
    if( selectedItem!="" && selectedItem.length>0 ){
        var itemIDn = parseInt(selectedItem.slice(4));
        var mdir = MOVdirection;
        var params = {itemIDn:itemIDn,mdir:mdir,pageN:pageN};
        $.post("itemMove.php",params,function(ree){
            LoadItems(function(){});
        });
    }else{ alert("Nothing selected."); }
}

function editItem(){ testLog(function(){ editItemfunc(); }); }
function editItemfunc(){
    if( selectedItem!="" && selectedItem.length>0 ){
        var itemmode = $("#"+selectedItem).attr("itemmode");
        var itemtype = $("#"+selectedItem).attr("itemtype"); itemtype = parseInt(itemtype);
        if( itemmode=="D" ){
            var itemIDn = parseInt(selectedItem.slice(4));
            var params = { pageN:pageN, itemIDn:itemIDn };
            $.post( "itemGetEditInfo.php", params, function(ree){
                var content = vida.vStrSection( 1, ree, "-|<|:-x-:|>|-" );
                var params  = vida.vStrSection( 2, ree, "-|<|:-x-:|>|-" );
                var ipar = (params==""||params==null)?[]:vida.vStrTrans2arr( params, "<x>" );
                $("#"+selectedItem).html("");
                ItemHolder_Fill( itemtype, selectedItem, content, ipar, "E", true );
            });
        }
        
    }else{ alert("Nothing selected."); }
}

function LoadItems( onEndFunc ){
    function loadF( onEndFunc ){
        $("#pageMainDiv").html("");
        $.post( "itemLoad.php", {pageN:pageN}, function(ree){
            gallArr = new Array();
            gallFarr = new Array();
            gallArrNames = new Array();
            var items = new Array();
            var initems = new Array();
            var itemid = 0;
            var category = 0;
            var content = "";
            var params = [];
            items = vida.vStrTrans2arr( ree, "]|-x-|[" );
            for( i in items ){
                initems = vida.vStrTrans2arr( items[i], "(-:x:-)" );
                itemid = parseInt(initems[0]);
                category = parseInt(initems[1]);
                content = initems[2];
                params = (initems[3]=="null"||initems[3]=="")? new Array() : vida.vStrTrans2arr(initems[3],"<x>");
                ItemHolder_Creation( category, "item"+itemid, false );
                ItemHolder_Fill( category, "item"+itemid, content, params, "D", false );
            }
            insertBTNenable(true);
            onEndFunc();
        });
    }
    testLog(function(){ loadF(onEndFunc); });
}



