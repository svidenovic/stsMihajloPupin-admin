


$.fn.imgSlider=function(maxW,maxH,imgsPerSlide,slideN,imgarr,sliderID,Tnew_Fupdate){
    if(Tnew_Fupdate){
        createIMGslider( maxW, maxH, imgsPerSlide, sliderID, this.attr("id") );
        fillIMGslider( slideN, imgarr, sliderID );
    }else if(!Tnew_Fupdate){
        fillIMGslider( slideN, imgarr, sliderID );
    }
}

function arrowSlide( direction, slideID )
{
    var imgarrSTR = $("#"+slideID).attr("images");
    var imgarr = new Array();
    var ta=[], ta2=[];
    ta = vida.vStrTrans2arr(imgarrSTR,"[x]");
    for( t in ta ){
        ta2 = vida.vStrTrans2arr(ta[t],"<x>");
        ta2[0] = vida.hex2str( ta2[0] );
        ta2[3] = vida.hex2str( ta2[3] );
        imgarr.push(ta2);
    }
    var slidepos = $("#"+slideID).attr("slideposition");
    var sp  = parseInt(slidepos.slice( 0, slidepos.indexOf("/") ));
    var spn = parseInt(slidepos.slice( slidepos.indexOf("/")+1  ));
    var newpos = 0;
    if(direction=="L"){ newpos=sp-1; }
    else if(direction=="R"){ newpos=sp+1; }
    fillIMGslider( newpos, imgarr, slideID );
}

function fillIMGslider( sliden, imgarr, sliderID )
{
    var slidewidth = parseInt($("#"+sliderID).attr("slidewidth"));
    var imgsarrWhole = imgarr;
    // slideposition = sp/spn
    var spn = vida.vArrseparator( imgsarrWhole, slidewidth, false );
    sliden=(sliden<1)?1:sliden; sliden=(sliden>spn)?spn:sliden;
    var sp = sliden;
    // imgsize = WxH
    var imgsize  = $("#"+sliderID).attr("imgsize");
    var w = imgsize.slice( 0, imgsize.indexOf("x") );
    var h = imgsize.slice( imgsize.indexOf("x")+1 );
    // images
    var imgsarr=vida.vArrseparator(imgsarrWhole,slidewidth,true)[sp-1];
    var img=undefined, tmpsrc="", ht=0, mt=0;
    $("#"+sliderID+"IH").html("");
    for( i in imgsarr ){
        tmpsrc = imgsarr[i][0];
        ht = Math.ceil(w/(imgsarr[i][1]/imgsarr[i][2]));
        mt = Math.ceil((h-((ht>=h)?h:ht))/2);
        title = imgsarr[i][3];
        title = (title==" "||title==""||title==null)?"":title;
        img = document.createElement("img");
        $(img).attr("class","oneIMGslide");
        $(img).css("display","none");
        $(img).attr("title",title);
        $(img).attr("src",tmpsrc);
          img.style.maxHeight=h+"px";
        $(img).css({width:w, height:ht});
        $(img).css("margin-top",mt);
        $("#"+sliderID+"IH").append(img);
        $(img).show(500);
    }
    // parametar updating
    var tmparr = new Array("",0,0,"");
    var tmparr2 = new Array();
    var vSTRimgsarr = "";
    for(x in imgsarrWhole){
        tmparr[0] = vida.str2hex(imgsarrWhole[x][0]); // src
        tmparr[1] = imgsarrWhole[x][1]; // w
        tmparr[2] = imgsarrWhole[x][2]; // h
        tmparr[3] = vida.str2hex(imgsarrWhole[x][3]); // desc
        tmparr2.push( vida.vConcatStrs("<x>",tmparr) );
    }
    vSTRimgsarr = vida.vConcatStrs("[x]",tmparr2);
    $("#"+sliderID).attr("slideposition",sp+"/"+spn);
    $("#"+sliderID).attr("images",vSTRimgsarr);
    if(sp==1){ /* disable left */
        $("#"+sliderID+"LA").attr("class","LSlideArrow_off");
        $("#"+sliderID+"LA").attr("disabled",true);
    }else if(sp>1){ /* enable left */
        $("#"+sliderID+"LA").attr("class","LSlideArrow_on");
        $("#"+sliderID+"LA").attr("disabled",false);
    }
    if(sp==spn){ /* disable right */
        $("#"+sliderID+"RA").attr("class","RSlideArrow_off");
        $("#"+sliderID+"RA").attr("disabled",true);
    }else if(sp<spn){ /* enable right */
        $("#"+sliderID+"RA").attr("class","RSlideArrow_on");
        $("#"+sliderID+"RA").attr("disabled",false);
    }
}

function createIMGslider( imgW, imgH, imgsPerSlide, newID, id2append2 )
{
    imgW = (imgW<50)?50:imgW;        // image width
    imgH = (imgH<50)?50:imgH;        // image height
    var ihW = imgsPerSlide*(imgW+5); // image holder width
    var ihH = imgH;                  // image holder height
    var btnW = 30;                   // button width
    var btnH = imgH+10;              // button height
    var shW = 2*btnW+ihW+5;          // slider Holder width
    var shH = imgH+10;               // slider Holder height
    
    var sliderHolder = document.createElement("div");
    $(sliderHolder).attr("class","sliderHolder");
    $(sliderHolder).attr("id",newID);
    $(sliderHolder).css({ width:shW, height:shH });
    var slidewidth = document.createAttribute("slidewidth");
    sliderHolder.setAttributeNode(slidewidth);
    sliderHolder.setAttribute("slidewidth",imgsPerSlide);
    var slidepos = document.createAttribute("slideposition");
    sliderHolder.setAttributeNode(slidepos);
    sliderHolder.setAttribute("slideposition","1/1");
    var imgsize = document.createAttribute("imgsize");
    sliderHolder.setAttributeNode(imgsize);
    sliderHolder.setAttribute("imgsize",imgW+"x"+imgH);
    var images = document.createAttribute("images");
    sliderHolder.setAttributeNode(images);
    $(sliderHolder).attr("images","...");
    // Left Arrow
    var LSlideArrow = document.createElement("button");
    $(LSlideArrow).attr("class","LSlideArrow_on");
    $(LSlideArrow).attr("id",newID+"LA");
    $(LSlideArrow).css({ width:btnW, height:btnH });
    $(LSlideArrow).text("◄");
    $(LSlideArrow).click(function(){ arrowSlide("L",newID); });
    // Imgs holder
    var imagesHolder = document.createElement("div");
    $(imagesHolder).attr("class","imagesHolder");
    $(imagesHolder).attr("id",newID+"IH");
    $(imagesHolder).css({ width:ihW, height:ihH });
    // Right Arrow
    var RSlideArrow = document.createElement("button");
    $(RSlideArrow).attr("class","RSlideArrow_on");
    $(RSlideArrow).attr("id",newID+"RA");
    $(RSlideArrow).css({ width:btnW, height:btnH });
    $(RSlideArrow).text("►");
    $(RSlideArrow).click(function(){ arrowSlide("R",newID); });
    // appending...
    $(sliderHolder).append(LSlideArrow);
    $(sliderHolder).append(imagesHolder);
    $(sliderHolder).append(RSlideArrow);
    $("#"+id2append2).append(sliderHolder);
}



