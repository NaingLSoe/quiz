$(function() {
    
    const auth_api = new $.napi();
    auth_api.init();
    let user_auth_key = null;

    $(document).on("click", "button.accordion-button" , function(e) {
        const _target_id = $(this).data("bs-target");
        localStorage.setItem("pmp-guide1-last-read",_target_id);
    });


    $("#btn-next").on("click", function(e){
        var n = $("#uxn-605").val();
        var p = $("#prx-243").val();
        var rm = $("#chx-439").is(":checked");
        user_auth_key = auth_api.signin(n,p, auth_callback);
        if (user_auth_key && rm){ auth_api.remember(user_auth_key)};
    });

    $("#btn-locked").on("click", function(e){
        auth_api.signout(user_auth_key);
    });

    function auth_callback(r){
        if (r == 200) {init(); return true;}
        if (r == 403){$("#erx-105").text("Access has been forbidden. Wait awhile and retry.");}
        else{$("#erx-105").text("Name or Password is wrong.");}        
        $("#alt-206").show();
        return false;  
    }

    const _notes = $("#notes");
    $("#note-contents").empty();

    if(rdc("localhost")){
        init();
    }

    function init(){
        $("#lgx-406").hide();
        $("#exc-title").show();
        $("#note-contents").append(_notes);

        var _last_read = localStorage.getItem("pmp-guide1-last-read");

        if (!(_last_read)){
            _last_read = "collapse0";
        }
        $.each($('button[data-bs-target="' + _last_read + '"]'), function(k,v){
            $(v).trigger( "click" );
        });

    }

});

