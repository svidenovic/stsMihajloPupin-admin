
$(document).ready(function(){
    ListPages();
    $("#stsmpPcreate").click(function(){ OpenPopUp(); });
    $("#stsmpPedit").click(function(){ EditPage(); });
    $("#stsmpPdelete").click(function(){ DeletePage(); });
    $("#stsmpPmovup").click(function(){ moveUDPage("U"); });
    $("#stsmpPmovdwn").click(function(){ moveUDPage("D"); });
});

var nothingselected = "No page selected.";

function testLog( callfunc ){
    $.post("../../deps/vtestPass.php",function(res){
        res = parseInt(res);
        if(res==1){ callfunc(); }
        else{ window.location="../stsmplog.html"; }
    });
}

function loadBar( start ){
    if(start){ $("#loaderbar").attr("src","../../deps/on-loader.gif"); }
    else{ $("#loaderbar").attr("src","../../deps/no-loader.png"); }
}

var selTcolor = "#937878";
var selFcolor = "#b1b1b1";
var selectedP = new Array(0," ");
function makeSelected( selID, boolTF, enable_deselect )
{
    if(boolTF){
        var Pname = $("#"+selID).html();
        $("div.stsmpPagesField").css("background-color",selFcolor);
        if(( enable_deselect )&&( selectedP[0]==selID )&&( selectedP[1]==Pname )){
            selectedP[0]=0;
            selectedP[1]=" ";
            $("div.stsmpPagesField").css("background-color",selFcolor);
        }
        else{
            selectedP[0]=selID;
            selectedP[1]=Pname;
            $("#"+selID).css("background-color",selTcolor);
        }
    }
    else if(!boolTF){
        selectedP[0]=0;
        selectedP[1]=" ";
        $("div.stsmpPagesField").css("background-color",selFcolor);
    }
}

function OpenPopUp()
{
    $.post( "stsmpGetMenuList.php", function(ree)
    {
        $("#popupboxHolder").html("");
        
        var popupbox = document.createElement("div");
        $(popupbox).attr("id","popupboxSTSmpPC");
        
        var pubTitle = document.createElement("p");
        $(pubTitle).attr("class","pubtitle");
        $(pubTitle).html("Create Page");
        $(popupbox).append(pubTitle);
        
        var pubLabel1 = document.createElement("p");
        $(pubLabel1).attr("class","publabel");
        $(pubLabel1).html("Name:");
        $(popupbox).append(pubLabel1);
        
        var pubInput = document.createElement("input");
        $(pubInput).attr("id","pubPname");
        $(popupbox).append(pubInput);
        
        var pubLabel2 = document.createElement("p");
        $(pubLabel2).attr("class","publabel");
        $(pubLabel2).html("menu:");
        $(popupbox).append(pubLabel2);
        
        var pubSelect = document.createElement("select");
        $(pubSelect).attr("id","pubPmenu");
        
        var menulist = vida.vStrTrans2arr( ree, "([x])" );
        var option = undefined;
        for( m in menulist ){
            option = document.createElement("option");
            $(option).attr("id", vida.vStrSection(1,menulist[m],"-<x>-") );
            $(option).html( vida.vStrSection(2,menulist[m],"-<x>-") );
            $(pubSelect).append(option);
        }
        $(popupbox).append(pubSelect);
        
        var pubGo = document.createElement("button");
        $(pubGo).attr("id","pubPgo");
        $(pubGo).text("GO");
        $(pubGo).click(function(){ CreatePage( $("#pubPname").val(), $("#pubPmenu option:selected").attr("id") ); });
        $(popupbox).append(pubGo);
        
        var pubCancel = document.createElement("button");
        $(pubCancel).attr("id","pubPcancel");
        $(pubCancel).text("CANCEL");
        $(pubCancel).click(function(){ $("#popupboxHolder").html(""); });
        $(popupbox).append(pubCancel);
        
        $("#popupboxHolder").append(popupbox);
        $(pubInput).focus();
        $(pubInput).keypress(function(e){
            if(e.keyCode==13){ CreatePage( $("#pubPname").val(), $("#pubPmenu option:selected").attr("id") ); }    
        });
    });
}
function CreatePage( pagename, menuid )
{
    testLog(function(){
        menuid = parseInt(menuid);
        if( pagename!="" && menuid>0 ){
            var url = "stsmpCreatePage.php";
            var params = {pagename:pagename, menuid:menuid};
            $.post( url, params, function(ree){
                if( ree=="page_exists" ){ alert("Page exists"); }
                else{ ListPages(); window.location="stsmpPageCreator.html?pg="+ree; } 
            });
        }
        else{ alert("Wrong input"); }
    });
}

function ListPages(){ testLog(function(){ ListPagesF(); }); }
function ListPagesF()
{
    var url = "stsmpListPages.php";
    loadBar(true);
    $.post( url, function(ree){
        loadBar(false);
        var Plist=new Array(); var tmparr=new Array(); var arr4=new Array();
        tmparr = vida.vStrTrans2arr(ree,"|:[x]:|");
        for( t in tmparr){
            arr4 = new Array();
            arr4.push( vida.vStrSection(1,tmparr[t],"<[x]>") ); // id
            arr4.push( vida.vStrSection(2,tmparr[t],"<[x]>") ); // name
            arr4.push( vida.vStrSection(3,tmparr[t],"<[x]>") ); // menu-name
            arr4.push( vida.vStrSection(4,tmparr[t],"<[x]>") ); // approved
            Plist.push(arr4);
        }
        $("#stsmpPages").html("");
        for( p in Plist ){
            var pagei = document.createElement("div");
            $(pagei).attr("class","stsmpPagesField");
            $(pagei).attr("id",Plist[p][0]);
            var appdot = document.createElement("div");
            $(appdot).attr("class","appdot");
            $(appdot).attr("id","appdot"+Plist[p][0]);
            var apprd = document.createAttribute("approved");
            appdot.setAttributeNode(apprd);
            $(appdot).attr("approved","0");
            var ptxt = document.createElement("p");
            $(ptxt).attr("class","stsmpPagesTxt");
            $(ptxt).html( Plist[p][2]+" | <b>"+Plist[p][1]+"</b>" );
            $(pagei).html("");
            $(pagei).append(appdot);
            $(pagei).append(ptxt);
            $(appdot).click(function(){
                var obj = this;
                testLog(function(){
                    var pageID = parseInt($(obj).attr("id").slice(6));
                    var appr = parseInt($(obj).attr("approved"));
                    $.post("pageApprover.php",{pageID:pageID,appr:appr},function(ree){ ListPagesF(); });
                });
            });
            function approveDot(boolTF, appdotObj){
                var adgreen = "#58f135";
                var adred = "#ec3939";
                if(boolTF){
                    $(appdotObj).css("background-color",adgreen);
                    $(appdotObj).attr("title","click to disapprove this page");
                    $(appdotObj).attr("approved","1");
                }else{
                    $(appdotObj).css("background-color",adred);
                    $(appdotObj).attr("title","click to approve this page");
                    $(appdotObj).attr("approved","0");
                }
            }
            if(Plist[p][3]==1){ approveDot(true,appdot); }
            else{ approveDot(false,appdot); }
            $(pagei).click(function(){ makeSelected(this.id,true,true); });
            $("#stsmpPages").append(pagei);
        }
        makeSelected(selectedP[0],true,false);
    });
}

function EditPage()
{
    testLog(function(){
        var Pid = selectedP[0];
        var Pname = selectedP[1];
        if( Pid!=0 && Pname!=" " ){
            window.location="stsmpPageCreator.html?pg="+Pid;
        }
        else{ alert(nothingselected); }
    });
}

function DeletePage()
{
    testLog(function(){
        var Pid = selectedP[0];
        if( Pid!=0 ){
            var url = "stsmpPageDelete.php";
            loadBar(true);
            $.post( url, {Pid:Pid}, function(ree){
                ListPages();
                makeSelected(Pid,false,false);
                loadBar(false);
            });
        }
        else{ alert(nothingselected); }
    });
}

function moveUDPage( strUD )
{
    testLog(function(){
        var Pid = selectedP[0];
        if( Pid!=0 )
        {
            var url = "stsmpPageMovUD.php";
            var params = {Pid:Pid,strUD:strUD};
            loadBar(true);
            $.post( url, params, function(ree){
                ListPages();
                loadBar(false);
            });
        }
        else{ alert(nothingselected); }
    });
}



