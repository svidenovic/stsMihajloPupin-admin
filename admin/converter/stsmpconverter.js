
$(document).ready(function(){
    $("#stsmpEncode").click(function(){ cmEncode(); });
    $("#stsmpDecode").click(function(){ cmDecode(); });
    $("#stsmpConvert").click(function(){ cmConvert(); });
    $("#cInput").bind("keypress",function(e){if(e.keyCode==13){ $("#stsmpConvert").click(); }});
});

function testLog( callfunc ){
    $.post("../../deps/vtestPass.php",function(res){
        res = parseInt(res);
        if(res==1){ callfunc(); }
        else{ window.location="../stsmplog.html"; }
    });
}

function cmEncode(){ ajax_call("cE"); }
function cmDecode(){ ajax_call("cD"); }
function cmConvert(){ ajax_call("cC"); }

function ajax_call(cMode){
    testLog(function(){
        var inID = "";
        switch(cMode){
            case "cE": inID="cTXTarea"; break;
            case "cD": inID="cTXTarea"; break;
            case "cC": inID="cInput";   break;
            default: break;
        }
        var txt = $("#"+inID).val();
        var url = "stsmpconverter.php";
        var par = {cMode:cMode,txt:txt};
        $.post( url, par, function(ree){ $("#"+inID).val(ree); });
    });
}