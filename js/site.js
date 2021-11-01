function require(file, callback) {
  
    var script = document.createElement("script");
    script.src = file;

    // monitor script loading
    // IE < 7, does not support onload
    if (callback) {
    script.onreadystatechange = function () {
        if (script.readyState === "loaded" || script.readyState === "complete") {
        // no need to be notified again
        script.onreadystatechange = null;
        // notify user
        callback();
        }
    };

  // other browsers
  script.onload = function () {
    callback();
  };
}
    document.documentElement.firstChild.appendChild(script);
}


function format4d(n){
  if (n < 10){
    return "000" + n.toString();
  }

  if (n >= 10 && n < 100){
    return "00" + n.toString();
  }

  if (n >= 100 && n < 999){
    return "0" + n.toString();
  }

  return n.toString();

}