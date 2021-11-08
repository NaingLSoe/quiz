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
    _exam_group = $(this).data("group");
    const _source = $(this).data("source");
    const _icon = $(this).data("icon");

    if (_source && _source !== ""){
      const _data_source = _source + "/source.js";
      require(_data_source, function () {
        render_quiz(_icon);
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

    const default_icon = "emoji_events";
    const opt_tests = '<a href="#" data-id="@@id@@" data-source="@@source@@" data-group="@@group@@" data-icon="@@icon@@" @@active@@ class="opt-test @@active@@">'
                    + '<div class="info-box">'
                    + '<span class="info-box-icon bg-info"><span class="material-icons">@@icon@@</span></span>'
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
          .replace(/@@icon@@/gi,  icon)
          .replace(/@@title@@/gi, title)
          .replace(/@@desc@@/gi, desc)
          .replace(/@@active@@/gi, active)
          .replace(/@@group@@/gi, group) );
        
    });
              
    $("#test-items").append(tests);
    $("#test-main").show();

  }

  function render_quiz(_icon){

    $("#exams").empty();
    $("#test-items").empty();
    $(".main-box").hide();

    _selected_id = -1;

    const opt_test = '<a href="#" data-id="@@did@@" id="@@id@@" class="opt-quiz @@active@@" >'
                        +'<div class="info-box @@bookmark@@">'
                        + '<span class="info-box-icon @@priority@@ "> @@icon@@ </span>'
                        + '<div class="info-box-content">'
                        + '<span class="info-box-text">@@name@@ @@tip@@ </span>'
                        + '<span class="info-box-number">@@desc@@</span>'
                        + '</div>'
                        + '</div></a>';
    var quiz = [];

    $.each(TESTS, function(key,value){
      let opt_icon = '<span class="material-icons">@@icon@@</span>';      
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
        priority = "bg-done"
        opt_bookmark = 'bg-done marked';
        opt_icon = opt_icon.replace(/@@icon@@/gi, 'emoji_events');
        opt_tip = "<label class='badge bg-success' title='You marked this test as done.'>done</label>";
      }else{
        opt_icon = opt_icon.replace(/@@icon@@/gi, _icon !== "" ? _icon : "book");
      }

      quiz.push( opt_test.replace(/@@did@@/gi, did)
              .replace(/@@id@@/gi, id)
              .replace(/@@name@@/gi, name)
              .replace(/@@desc@@/gi, desc)
              .replace(/@@priority@@/gi, priority)
              .replace(/@@active@@/gi, active ? "" : "disabled" )
              .replace(/@@bookmark@@/gi, opt_bookmark)
              .replace(/@@tip@@/gi, opt_tip)
              .replace(/@@icon@@/gi, opt_icon));
      });

      $("#exams").append(quiz);
      $("#main-box").show();
  }

});