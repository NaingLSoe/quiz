

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

const _con1 = [5733, 2604, 3255, 5320, 2184, 4620];
const _con2 = [6489, 2548, 3465, 5824, 2289, 4536];

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRT(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (result.length > length){result = result.substring(0,length);}
    return result;
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
