
$(document).ready(function(){
    listMI();
    $("#stsmpMIcreate").click(function(){ createMI(); });
    $("#stsmpMIedit").click(function(){ editMI(); });
    $("#stsmpMIdelete").click(function(){ deleteMI(); });
    $("#stsmpMImovup").click(function(){ moveUD("U"); });
    $("#stsmpMImovdwn").click(function(){ moveUD("D"); });
});

var nothingselected = "No menu-item selected.";

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
var selectedMI = new Array(0," ");
function makeSelected( selID, boolTF, enable_deselect )
{
    if(boolTF){
        var MIname = $("#"+selID).html();
        $("div.stsmpMenuItems").css("background-color",selFcolor);
        if( enable_deselect && selectedMI[0]==selID ){
            selectedMI[0]=0;
            selectedMI[1]="";
            $("div.stsmpMenuItems").css("background-color",selFcolor);
        }
        else{
            selectedMI[0]=selID;
            selectedMI[1]=MIname;
            $("#"+selID).css("background-color",selTcolor);
        }
    }
    else if(!boolTF){
        selectedMI[0]=0;
        selectedMI[1]="";
        $("div.stsmpMenuItems").css("background-color",selFcolor);
    }
    return boolTF;
}

function createMI()
{
    testLog(function(){
        var MIname = "";
        MIname = prompt("Menu-item name: ");
        if(MIname!="" && MIname!=null && MIname!="null"){
            var name = MIname;
            loadBar(true);
            $.post( "stsmpMIcreate.php", {name:name}, function(ree){
                if(ree=="<<success>>"){ listMI(); }
                loadBar(false);
            });
        }
    });
}

function listMI()
{
    testLog(function(){
        var url = "stsmpMIlist.php";
        loadBar(true);
        $.post( url, function(ree){
            loadBar(false);
            var MIlist=new Array(); var tmparr=new Array(); var arr3=new Array();
            tmparr = vida.vStrTrans2arr(ree,"|::[x]::|");
            for( t in tmparr){
                arr3 = new Array();
                arr3.push( vida.vStrSection(1,tmparr[t],"<-[x]->") );
                arr3.push( vida.vStrSection(2,tmparr[t],"<-[x]->") );
                arr3.push( vida.vStrSection(3,tmparr[t],"<-[x]->") );
                MIlist.push(arr3);
            }
            $("#stsmpMenuItem").html("");
            for( m in MIlist ){
                var menuItem = document.createElement("div");
                $(menuItem).attr("class","stsmpMenuItems");
                $(menuItem).attr("id",MIlist[m][0]);
                $(menuItem).html(MIlist[m][1]);
                $(menuItem).click(function(){ makeSelected(this.id,true,true); });
                $("#stsmpMenuItem").append(menuItem);
            }
            makeSelected(selectedMI[0],true,false);
        });
    });
}

function editMI()
{
    testLog(function(){
        var MIid = selectedMI[0];
        var MIname = selectedMI[1];
        if( MIid!=0 ){
            var name = prompt("Edit name: ", MIname);
            if(name!="" && name!=null && name!="null"){
                var url = "stsmpMIedit.php";
                var params = {MIid:MIid,name:name};
                loadBar(true);
                $.post( url, params, function(ree){
                    listMI();
                    loadBar(false);
                });
            }
        }
        else{ alert(nothingselected); }
    });
}

function deleteMI()
{
    testLog(function(){
        var MIid = selectedMI[0];
        var MIname = selectedMI[1];
        if( MIid!=0 ){
            var conf = confirm("There are some pages under \""+MIname+"\", \n Are you sure you want to delete them all?");
            if(conf){
                var url = "stsmpMIdelete.php";
                var params = {MIid:MIid,MIname:MIname};
                loadBar(true);
                $.post( url, params, function(ree){
                    listMI();
                    makeSelected(MIid,false,false);
                    loadBar(false);
                });
            }
        }
        else{ alert(nothingselected); }
    });
}

function moveUD( strUD )
{
    testLog(function(){
        var MIid = selectedMI[0];
        var MIname = selectedMI[1];
        if( MIid!=0 )
        {
            var url = "stsmpMImovUD.php";
            var params = {MIid:MIid,MIname:MIname,strUD:strUD};
            loadBar(true);
            $.post( url, params, function(ree){
                listMI();
                loadBar(false);
            });
        }
        else{ alert(nothingselected); }
    });
}


