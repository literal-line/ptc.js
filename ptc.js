// ptc.js interpreter
console.log('PetitComputer ver2.2');

document.getElementById('editScreen').style.display = 'none';


var runScreenController = (function() {

    var canvas = document.getElementById('runScreen');
    var ctx = canvas.getContext('2d');
    canvas.height = 768;
    canvas.width = 1024;

    console.log('runScreenController loaded');

    return {
        screen: ctx,
        placeText: function(text, x, y) {
            ctx.font = '48pt petitcomputer';
            ctx.fillStyle = '#000000';
            ctx.fillRect(x * 32, y * 32, text.length * 32, 32);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(text, x * 32, (y + 1) * 32);
        },
        testing: function() {
            runScreenController.placeText('PetitComputer ver2.2', 0, 0);
            runScreenController.placeText('SMILEBASIC 1048576 bytes free', 0, 1);
            runScreenController.placeText('(C)2011-2012 SmileBoom Co.Ltd.', 0, 2);
            runScreenController.placeText('READY', 0, 4);
            runScreenController.placeText('(not really this is a test)', 0, 6);
        }
    };

})();


var pnlScreenController = (function() {

    var canvas = document.getElementById('pnlScreen');
    var ctx = canvas.getContext('2d');
    canvas.height = 768;
    canvas.width = 1024;

    console.log('pnlScreenController loaded');

})();


runScreenController.testing();
