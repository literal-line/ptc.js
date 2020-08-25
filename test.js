///////////////////////////////////////
//PTC.js build 8/15/2020 program test /
///////////////////////////////////////


var programTest = (function() {

    var c = 0;

    var prg = function() {
        runMode.console.cls();

        runMode.console.print(c);

        c++;
        setTimeout(prg, 0);
    };
    prg();
    //var prgLoop = setInterval(prg, 1000 / 60);

})();
