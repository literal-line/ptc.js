// ptc.js interpreter
console.log('PetitComputer ver2.2');

document.getElementById('editScreen').style.display = 'none';



var runScreen = (function() {

    var findId = function(id) {
        return document.getElementById(id);
    }

    var runConsole = findId('console');
    var runBGF = findId('bgFront');
    var runSprite = findId('sprite');
    var runBGR = findId('bgR');
    var runGraphic = findId('graphic');
    var ctxCons, ctxBGF, ctxSprite, ctxBGR, ctxGraphic;

    runConsole.height = 768;
    runConsole.width = 1024;
    ctxCons = runConsole.getContext('2d');

    console.log('runScreenController loaded');


    return {

        console: {

            placeText: function(text, x, y) {
                ctxCons.font = '48pt petitcomputer';
                ctxCons.fillStyle = '#000000';
                ctxCons.fillRect(x * 32, y * 32, text.length * 32, 32);
                ctxCons.fillStyle = '#FFFFFF';
                ctxCons.fillText(text, x * 32, (y + 1) * 32);
            },
            default: function() {
                this.placeText('PetitComputer ver2.2', 0, 0);
                this.placeText('SMILEBASIC 1048576 bytes free', 0, 1);
                this.placeText('(C)2011-2012 SmileBoom Co.Ltd.', 0, 2);
                this.placeText('READY', 0, 4);
                this.placeText('(not really this is a test)', 0, 6);
            }

        }

    };

})();


var pnlScreen = (function() {

    var canvas = document.getElementById('pnlScreen');
    var ctx = canvas.getContext('2d');
    canvas.height = 768;
    canvas.width = 1024;

    console.log('pnlScreenController loaded');

})();


runScreen.console.default();
