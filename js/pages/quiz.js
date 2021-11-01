$(function () {

    $("#alert").hide();
    $("#reason").hide();
    $("#status").hide();
    $("#quiz-result").hide();
    $("#next-back").hide();

    var exam_id = -1;
    var current_quiz = 0;
    var _selected_id = 0;
    var questions = [];
    var current_answers = [];
    var show_answer_mode = false;
    var back_home = false;

    var qparams = new URLSearchParams(window.location.search);

    if (qparams.has('id') == false){
        window.location.href = "index.html?e=404";
    }else{
        exam_id = parseInt(qparams.get("id"));
    }

    if (exam_id < 0){
        window.location.href = "index.html?e=412";
    }

    const _data_source = 'data/quiz-' + exam_id.toString() + '.js';

    require(_data_source, function () {
        console.log("Data source has been loaded.");
        init();
    });

    function load_quiz(id, show_ans, user_ans){

        _selected_id = 0;
        $("#btn-next").prop('disabled', true);

        const _quiz = questions[id];

        const _qtext = _quiz["quiz"];
        const _qchoices = _quiz["choices"];

        $("#quiz-no").text("Question " + (id + 1).toString() + " of " + questions.length.toString());
        $("#question").text(_qtext);

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
        }

    }
  
    function show_result(){

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
    }

    function set_user_ans(id, uid){
        console.log(current_answers);
        const _quiz = questions[id];
        current_answers[id].ans = uid;
        if (_quiz["ans"] == uid){
            current_answers[id].correct = 1;
        }
    }

    function init() {
        $.each(DATA, function(key, quiz){
    
            if (quiz["id"] == exam_id) {
                questions = quiz["questions"];

                questions.sort(() => Math.random() - 0.5);
                
                $("#title").text(quiz["name"]);
                $("#description").text(quiz["description"]);
            }
        });
    
        if (questions.length < 0) {
            window.location.href = "index.html?e=404";
        }

        //preset all user answers as wrong.
        $.each(questions, function(k,v){
            current_answers.push({"id": v["id"], "ans": 0, "correct": 0 });
        });
    
        load_quiz(current_quiz, false);
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

});