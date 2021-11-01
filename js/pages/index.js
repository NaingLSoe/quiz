$(function () {
  
  $("#alert").hide();
  $("#page-error").hide();

  var qparams = new URLSearchParams(window.location.search);

  if (qparams.has('e') == true){
    var ecode = qparams.get('e');
    switch (ecode){
      case "404":
        $("#error-text").text("Exam ID not found. Please select an exam.");
        $("#page-error").show();
        break;
      case "412":
        $("#error-text").text("Invalid Exam ID. Please select an exam.");
        $("#page-error").show();
        break;
    }
  }


  const opt_quiz = "<div class='form-check'><input class='form-check-input opt-quiz' type='radio' data-id='@@did@@' name='opt-quiz' id='@@id@@'>"
                 + "<label class='form-check-label' for='@@id@@'>"
                 + "@@name@@</label> <small>@@desc@@</small> </div>";
  var quiz = [];

  $.each(EXAMS, function(key,value){
    var did = value["id"];
    var id = "quiz-" + did;
    var name = "E" +  format4d(did) + " : " +  value["name"];
    var desc = value["description"];

    quiz.push( opt_quiz.replace(/@@did@@/gi, did).replace(/@@id@@/gi, id).replace(/@@name@@/gi, name).replace(/@@desc@@/gi, desc) );

  });

  $("#exams").empty();
  $("#exams").append(quiz);
  

  var _selected_id = -1;

  $(".opt-quiz").on('click', function(e){
    _selected_id = $(this).data("id");

    $("#alert").hide();
    $("#start").prop('disabled', false);
  });

  $("#start").on('click', function(e){

    if (_selected_id < 1){
      $("#alert").show();
      return;
    }

     const _exam_url = "quiz.html?id=" + _selected_id;

     window.location.href = _exam_url;

  });

});