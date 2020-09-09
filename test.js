///////////////////////////////////////
// PTC.js build 9/8/2020 program test /
///////////////////////////////////////

var prgInterval;
var testPrg = function() {
    inputMode.isEnabled(false);

    runMode.cls();
    runMode.color(11);
    runMode.print('ptc.js BUTTON() test');

    var loopFunc = function() {
        prgInterval = setInterval(function() {
            runMode.print(runMode.button());
        }, 1000 / 60);
    };

    setTimeout(loopFunc, 1000);
};
