$(function () {
  
    $("#alert").hide();
    $("#reason").hide();
    $("#status").hide();
    $("#quiz-result").hide();
    $(".go-home").hide();

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

    $.each(DATA, function(key, quiz){
    
        if (quiz["id"] == exam_id) {
            questions = quiz["questions"];
            $("#title").text(quiz["name"]);
        }
    });

    if (questions.length < 0) {
        window.location.href = "index.html?e=404";
    }


    function load_quiz(id, show_ans, user_ans){

        _selected_id = 0;

        const _quiz = questions[id];

        const _qdesc = _quiz["quiz"];
        const _qchoices = _quiz["choices"];

        $("#quiz-no").text("Question " + (id + 1).toString() + " of " + questions.length.toString());
        $("#question").text(_qdesc);

        var _choices = [];

        $.each(_qchoices, function(k,v){
            const opt_ans = "<div class='form-check @@show@@'>"
            + "<input class='form-check-input opt-ans' @@checked@@  type='radio' data-id='@@did@@' name='opt-ans' id='@@id@@'>"
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

            _choices.push( opt_ans.replace(/@@did@@/gi, k+1 ).replace(/@@id@@/gi, k+1 ).replace(/@@name@@/gi, v).replace(/@@show@@/gi, _show).replace(/@@checked@@/gi, _checked) );

        });

        $("#answers").empty();
        $("#answers").append(_choices);

        if (show_ans){
            $("#reason-text").text(_quiz["reason"]);
            $("#reason").show();

            if (user_ans["correct"] == 1){
                $("#status").removeClass().addClass("badge bg-success").text("Correct").show();
            }else{
                $("#status").removeClass().addClass("badge bg-danger").text("Wrong").show();
            }
        }

    }
  
    load_quiz(current_quiz, false);
  
    $(document).on("click", "input.opt-ans" , function(e) {
        _selected_id = $(this).data("id");

        $("#alert").hide();
        $("#btn-next").prop('disabled', false);
    });


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

        $(".go-home").show();
    }

    function set_user_ans(id, uid){
        const _quiz = questions[id];
        if (_quiz["ans"] == uid){
            current_answers.push({"id": id, "ans": uid, "correct": 1 });
        }else{
            current_answers.push({"id": id, "ans": uid, "correct": 0 });
        }
    }


    $("#btn-next").on('click', function(e){

        if (show_answer_mode){
            
            current_quiz = current_quiz + 1;
            if (current_quiz < questions.length){
                load_quiz(current_quiz, true, current_answers[current_quiz]);
                if (current_quiz == questions.length - 1){
                    $("#btn-next").prop('disabled', true);
                }
            }
            
        }else{
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
        $("#quiz-canvas").show();
        current_quiz = 0;
        load_quiz(current_quiz, true, current_answers[current_quiz]);
    });

    $(".go-home").on('click', function(e){
        window.location.href = "index.html"
    });


});