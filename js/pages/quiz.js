$(function () {

    $("#alert").hide();
    $("#reason").hide();
    $("#status").hide();
    $("#quiz-result").hide();
    $("#next-back").hide();

    var exam_id = -1;
    var current_quiz = 0;
    var _selected_id = 0;
    var test_id = 0;
    var questions = [];
    var current_answers = [];
    var show_answer_mode = false;
    var quiz_group = "";
    var current_test = null;
    var test_timer = 0;
    let XsT;

    var qparams = new URLSearchParams(window.location.search);

    if (qparams.has('id') == false){
        window.location.href = "../index.html?e=404";
    }else{
        exam_id = parseInt(qparams.get("id"));
    }

    if (exam_id < 0){
        window.location.href = "../index.html?e=412";
    }

    if (qparams.has('t') == false){
        window.location.href = "../index.html?e=404";
    }else{
        test_id = parseInt(qparams.get("t"));
    }

    let _source = "";
    let _data_source = "";

    $.each(EXAMS, function(k,v){
        if (v["id"] == test_id){
            _source = v["source"];
            quiz_group = v["group"] ? v["group"] : "";
            return true;
        }
    });

    if (_source == ""){
        window.location.href = "../index.html?e=400";
    }

    _data_source = '../' + _source + "/source.js";

    require(_data_source, function () {
        load_source();
    });

    function load_quiz(id, show_ans, user_ans){

        _selected_id = 0;
        $("#btn-next").prop('disabled', true);

        const _quiz = questions[id];

        const _qtext = _quiz["quiz"];
        const _qchoices = _quiz["choices"];

        $("#quiz-no").text("Question " + (id + 1).toString() + " of " + questions.length.toString());
        $("#question").text(_qtext);

        $("#extra-items-canvas").empty();
        $("#extra-items").show();
        if (_quiz.hasOwnProperty('extra')) {
           const _extra = _quiz["extra"];
           let _items = "";
           if (_extra){
               $.each(_extra, function(k, item){
                   _items += item;
               });
               $("#extra-items-canvas").append(_items);
               $("#extra-items").show();
           }
        }

        var _choices = [];

        $.each(_qchoices, function(k,v){
            const opt_ans = "<div class='form-check @@show@@'>"
            + "<input class='form-check-input opt-ans' @@checked@@ @@disabled@@ type='radio' data-id='@@did@@' name='opt-ans' id='@@id@@'>"
            + "<label class='form-check-label' for='@@id@@'>"
            + "@@name@@</label></div>";

            var _show = "";
            if(show_ans && _quiz["ans"] == (k+1)){
                _show = "correct-ans";
            }

            var _checked = "";
            if(show_ans && (k+1) == user_ans["ans"]){
                _checked = "checked";
            }

            var _disabled = "";
            if(show_ans){
                _disabled = "disabled";
            }

            _choices.push( opt_ans.replace(/@@did@@/gi, k+1 )
                .replace(/@@id@@/gi, k+1 )
                .replace(/@@name@@/gi, v)
                .replace(/@@show@@/gi, _show)
                .replace(/@@checked@@/gi, _checked)
                .replace(/@@disabled@@/gi, _disabled) );

        });

        $("#answers").empty();
        $("#answers").append(_choices);

        if (show_ans){

            var _reason = _quiz["reason"];
            _reason = _reason.trim();

            if (_reason != "") {
                $("#reason-text").text(_reason);
                $("#reason").show();
            }else{
                $("#reason").hide();
            }

            if (user_ans["correct"] == 1){
                $("#status").removeClass().addClass("badge bg-success").text("Correct").show();
            }else{
                $("#status").removeClass().addClass("badge bg-danger").text("Wrong").show();
            }

            $("#btn-next").prop('disabled', true).hide();

            $("#btn-ans-back").prop("disabled", false);
            $("#btn-ans-next").prop("disabled", false);
            if (id == 0 ){
                $("#btn-ans-back").prop("disabled", true);
            }
            if (id == questions.length -1){
                $("#btn-ans-next").prop("disabled", true);
            }
        }

    }
  
    function show_result(){

        if (test_timer > 0){
            clearInterval(XsT);
            $("#quiz-timer").text("").hide();
        }

        current_quiz = 0;

        const _total = questions.length;
        var count = 0;
        $.each(current_answers, function(k,v){
            if (v["correct"] == 1){
                count +=1;
            }
        });

        $("#quiz-canvas").hide();

        $("#result").text( count.toString() + " of " + _total.toString() + " are correct." );
        $("#quiz-result").show();

        $("#btn-exit").hide();
        $("#btn-next").hide();
        $("#next-back").show();

        check_read_bookmark();
    }

    function set_user_ans(id, uid){
        console.log(current_answers);
        const _quiz = questions[id];
        current_answers[id].ans = uid;
        if (_quiz["ans"] == uid){
            current_answers[id].correct = 1;
        }
    }

    function load_source(){
        _data_source = "";

        if (TESTS){
            let xxx = 0;
            for(i = 0; i < TESTS.length; i ++){
                const test = TESTS[i];
                xxx = i;
                if (test["id"] == exam_id ){
                    _data_source = '../' + _source + "/" + test["source"];
                    if (test["time"]){ 
                        if (isNaN(test["time"]) == false){
                            test_timer = test["time"];
                        }            
                    }
                    break;
                }
            }
            console.log("looped : " + xxx.toString());
        }

        if (_data_source){
            require(_data_source, function () {
                init();
            });
        }
    }

    function init() {

        $.each(DATA, function(key, quiz){
    
            //if (quiz["id"] == exam_id) {            
            current_test = quiz;
            return true;
            //}
        });

        if (!(current_test)){
            window.location.href = "../index.html?e=404";
        }

        questions = current_test["questions"];
        questions.sort(() => Math.random() - 0.5);
                
        $("#title").text("E" +  format4d(exam_id) + " : " +  current_test["name"]);
        $("#description").text(current_test["description"]);
    
        if (questions.length < 0) {
            window.location.href = "index.html?e=404";
        }

        //preset all user answers as wrong.
        $.each(questions, function(k,v){
            current_answers.push({"id": v["id"], "ans": 0, "correct": 0 });
        });

        if (test_timer > 0){
            start_timer(test_timer);
        }
    
        load_quiz(current_quiz, false);
    }

    function start_timer(T){
        $("#quiz-timer").text("00:00:00").show();
        let cxM = "m";
        if (test_timer > 60) {cxM = "h"; }
        const cxT = (new Date(2000,1,1,0,0,0).getTime()) + (T * 60000);
        let vxT = (new Date(2000,1,1,0,0,0).getTime());
        XsT = setInterval(function() {
            vxT = vxT + 1000;
            let distance = cxT - vxT;
            var dhours = 0;
            var dminutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var dseconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (cxM == "h"){
                dhours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            }
            $("#quiz-timer").text(format2d(dhours) + ":" + format2d(dminutes) + ":" + format2d(dseconds)).show();
    
            if(distance < 30001){
                if ($("#quiz-timer").hasClass("active")) {
                    $("#quiz-timer").removeClass("active");
                }else{
                    $("#quiz-timer").addClass("active");
                }
            }

            if (distance < 0){
                show_result();
            }
        }, 1000);        
    }

    function check_read_bookmark(){
        if (check_bookmark(quiz_group, exam_id)){
            $("#btn-mark").hide();
        }else{
            $("#btn-mark").show();
        }        
    }

    $(document).on("click", "input.opt-ans" , function(e) {
        _selected_id = $(this).data("id");

        $("#alert").hide();
        $("#btn-next").prop('disabled', false);
    });

    $("#btn-next").on('click', function(e){

        if (show_answer_mode == false){
            if (_selected_id < 1){
                $("#alert").show();
                return;
              }
          
              set_user_ans(current_quiz, _selected_id);
      
              current_quiz = current_quiz + 1;
              if (current_quiz < questions.length){
                load_quiz(current_quiz, false);
              }else{
                show_result();
              }
        }     
    
    });

    $("#btn-view").on('click', function(e){
        show_answer_mode = true;
        $("#quiz-result").hide();
        $("#btn-exit").hide();
        $("#quiz-canvas").show();
        
        current_quiz = 0;        
        load_quiz(current_quiz, true, current_answers[current_quiz]);
    });   

    $("#btn-proceed").on("click", function(e){

        var myModalEl = document.getElementById('exitModal');
        var myModal = bootstrap.Modal.getInstance(myModalEl);
        myModal.hide();

        show_result();
    });

    $("#btn-ans-next").on("click", function(e){
        if(show_answer_mode){
            current_quiz = current_quiz + 1;
            if (current_quiz < questions.length){
                load_quiz(current_quiz, true, current_answers[current_quiz]);
            }else{
                current_quiz = questions.length -1;
            }
        }
    });

    $("#btn-ans-back").on("click", function(e){
        if(show_answer_mode){
            current_quiz = current_quiz -1;
            if (current_quiz > -1){
                load_quiz(current_quiz, true, current_answers[current_quiz]);
            }else{
                current_quiz = 0;
            }
        }
    });

    $("#btn-mark").on("click", function(e){
        
        if (set_bookmark(quiz_group, exam_id )) {
            $(this).text("Marked as done.").attr("disabled", true).removeClass("btn-warning").addClass("btn-outline-warning");
        }else{
            alert("Sorry, some problem happened and cannot mark as read.");
        }
        
    });

});