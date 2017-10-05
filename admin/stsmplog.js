
$(document).ready(function(){
    $("#stsmplogbtnlogin").click(function(){ login(); });
    $("#stsmploginputpass").bind("keypress", function(e){
        if( e.keyCode==13 ){ login(); }
    });
    $("#stsmplogbtnlogOut").click(function(){ logout(); });
});

function login() { vida.vLogIn("stsmploginputpass","../deps/vlogIn.php","stsmpManagers.html"); }
function logout(){ vida.vLogOut("../deps/vlogOut.php","stsmplog.html"); }

