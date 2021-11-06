$(function () {
  
  $("#alert").hide();
  $("#page-error").hide();

  var _selected_test = -1;
  var _selected_id = -1;
  var _exam_group = "";

  var qparams = new URLSearchParams(window.location.search);

  if (qparams.has('e') == true){
    var ecode = qparams.get('e');
    switch (ecode){
      case "404":
        $("#error-text").text("Test not found. Please try again.");
        $("#page-error").show();
        break;
      case "412":
        $("#error-text").text("Invalid Test. Please try again.");
        $("#page-error").show();
        break;
        case "400":
          $("#error-text").text("Selected test cannot be loaded. Please try again or select another test.");
          $("#page-error").show();
          break;        
    }
  }

  $(document).on("click", "a.opt-quiz",function(e){

    if ($(this).hasClass("disabled")){
      e.preventDefault();
      return;
    }
    
    _selected_id = $(this).data("id");

    $("#alert").hide();

    if (_selected_id < 1 || _selected_test < 1){
      $("#alert").show();
      return;
    }

     const _exam_url = "pages/quiz.html?id=" + _selected_id.toString() + "&t=" + _selected_test.toString();

     window.location.href = _exam_url;

  });

  $(document).on("click", "a.opt-test",function(e){

    if ($(this).hasClass("disabled")){
      e.preventDefault();
      return;
    }
    _selected_test = $(this).data("id");
    const _source = $(this).data("source");
    _exam_group = $(this).data("group");

    if (_source && _source !== ""){
      const _data_source = _source + "/source.js";
      require(_data_source, function () {
        render_quiz();
      });
    }
  });


  if (EXAMS && EXAMS.length > 0){
    render_tests();
  }else{
    $("#no-options").show();
  }


  function render_tests(){
    _selected_test = -1;
    $("#exams").empty();
    $("#test-items").empty();
    $(".main-box").hide();

    const opt_icon = '<span class="material-icons-outlined">@@icon@@</span>';
    const default_icon = "emoji_events";
    const opt_tests = '<a href="#" data-id="@@id@@" data-source="@@source@@" data-group="@@group@@" @@active@@ class="opt-test @@active@@">'
                    + '<div class="info-box">'
                    + '<span class="info-box-icon bg-info">@@icon@@</span>'
                    + '<div class="info-box-content">'
                    + '<span class="info-box-text">@@title@@</span>'
                    + '<span class="info-box-number">@@desc@@</span>'
                    + '</div>'
                    + '</div></a>';

    var tests = [];

    $.each(EXAMS, function(key,value){
        const id = value["id"];
        const source = value["source"] ? value["source"] : "";
        const title = value["name"] ? value["name"] : "Test " + format4d(id);
        const desc = value["description"] ? value["description"] : "";
        const icon = value["icon"] ? value["icon"] : default_icon;
        const active = value["active"] ? "" : "disabled";
        const group = value["group"] ? value["group"] : "";
        
        tests.push( opt_tests.replace(/@@id@@/gi, id)
          .replace(/@@source@@/gi, source)
          .replace(/@@icon@@/gi, opt_icon.replace(/@@icon@@/gi, icon))
          .replace(/@@title@@/gi, title)
          .replace(/@@desc@@/gi, desc)
          .replace(/@@active@@/gi, active)
          .replace(/@@group@@/gi, group) );
        
    });
              
    $("#test-items").append(tests);
    $("#test-main").show();

  }

  function render_quiz(){

      $("#exams").empty();
      $("#test-items").empty();
      $(".main-box").hide();

      _selected_id = -1;

      const opt_icon = '<span class="material-icons-outlined">emoji_events</span>';
      const opt_test = '<a href="#" data-id="@@did@@" id="@@id@@" class="opt-quiz @@active@@ @@bookmark@@" title="@@tip@@" ><div class="info-box">'
                                    + '<span class="info-box-icon @@priority@@">' + opt_icon + '</span>'
                                    + '<div class="info-box-content">'
                                    + '<span class="info-box-text">@@name@@</span>'
                                    + '<span class="info-box-number">@@desc@@</span>'
                                    + '</div>'
                                    + '</div></a>';
      var quiz = [];

      $.each(TESTS, function(key,value){
      var did = value["id"];
      var id = "quiz-" + did;
      var name = "E" +  format4d(did) + " : " +  value["name"];
      var desc = value["description"];
      var active = value["active"] == undefined ? true: value["active"]; 

      var priority = "bg-info";
      if (value["priority"] == "h"){
        priority = "bg-orange";
      }

      let opt_bookmark = "";
      let opt_tip = "";
      if (check_bookmark(_exam_group, did)){
        opt_bookmark = 'marked-bookmark';
        priority = "bg-success";
        opt_tip = "You marked this test has been done.";
      }

      

      

      quiz.push( opt_test.replace(/@@did@@/gi, did)
              .replace(/@@id@@/gi, id)
              .replace(/@@name@@/gi, name)
              .replace(/@@desc@@/gi, desc)
              .replace(/@@priority@@/gi, priority)
              .replace(/@@active@@/gi, active ? "" : "disabled" )
              .replace(/@@bookmark@@/gi, opt_bookmark)
              .replace(/@@tip@@/gi, opt_tip) );
      });

      $("#exams").append(quiz);
      $("#main-box").show();
  }

});