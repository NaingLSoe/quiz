$(function() {
    
    /*
    $(".accordion-button").on("click", function(e){
        const _target_id = $(this).data("bs-target");
        localStorage.setItem("pmp-guide1-last-read",_target_id);
    });
    */

    $(document).on("click", "button.accordion-button" , function(e) {
        const _target_id = $(this).data("bs-target");
        localStorage.setItem("pmp-guide1-last-read",_target_id);
    });


    $("#btn-next").on("click", function(e){
        var n = $("#uxn-605").val();
        var p = $("#prx-243").val();
        var rm = $("#chx-439").is(":checked");
        if(n){n=n.trim();}if(p){p=p.trim();}
        if(n == ""){$("#erx-105").text("Please enter name and password.");$("#alt-206").show()}
        if(p == ""){$("#erx-105").text("Please enter name and password.");$("#alt-206").show()}
        $("#uxn-605").val("");$("#prx-243").val("");
        const req = connect(n,p,rm, connected);
    });

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

    function connected(r){
        if (r == 200) {init(); return true;}
        if (r == 403){$("#erx-105").text("Access has been forbidden. Wait for 10 minutes.");}
        else{$("#erx-105").text("Name or Password is wrong.");}        
        $("#alt-206").show();
        return false;  
    }


});

