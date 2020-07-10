// ptc.js """"""interpreter""""""" by Literal Line
document.getElementById('editScreen').style.display = 'none';



var runMode = (function() {

    // getElementById but shorter (this is bad??)
    var findId = function(id) {
        return document.getElementById(id);
    }

    // set default canvas resolutions, all being 1024x768 except graphic canvas
    var defaultRes = function() {
        var list, index;

        runGraphic.height = 192;
        runGraphic.width = 256;

        list = document.getElementsByClassName('runModeCanvas');
        for (index = 0; index < list.length - 1; index++) {
            list[index].setAttribute('height', 768);
            list[index].setAttribute('width', 1024);
        }
    }


    // define variables for canvases and set default resolutions
    var runConsole = findId('console');
    var runBGF = findId('bgFront');
    var runSprite = findId('sprite');
    var runBGR = findId('bgRear');
    var runGraphic = findId('graphic');
    defaultRes();

    // set canvas contexts (this looks bad but oh well)
    var ctxCons, ctxBGF, ctxSprite, ctxBGR, ctxGraphic;
    ctxCons = runConsole.getContext('2d');
    ctxBGF = runBGF.getContext('2d');
    ctxSprite = runSprite.getContext('2d');
    ctxBGR = runBGR.getContext('2d');
    ctxGraphic = runGraphic.getContext('2d');

    // set default variables
    var consolePallete = [ // regular color pallete for console, bg, and sprites
        '#FFFFFF',
        '#000000',
        '#BFBFBF',
        '#FFE000',
        '#00F01F',
        '#007F00',
        '#FFCBA7',
        '#FFA000',
        '#975E2E',
        '#00BFFF',
        '#7F3FFF',
        '#003FF0',
        '#FF5FC0',
        '#FF1F00',
        '#3F3F3F',
        '#EBEBEB'
    ];
    var consoleColor = consolePallete[0];
    var consolePos = {
        x: 0,
        y: 0
    };


    console.log('runMode controller loaded');


    return { // all commands that can be used in run mode, categorized by their layer

        console: {

            cls: function() {
                ctxCons.clearRect(0, 0, 1024, 768);
                consolePos.x = 0;
                consolePos.y = 0;
            },

            locate: function(x, y) {
                consolePos.x = x;
                consolePos.y = y;
            },

            color: function(color) {
                consoleColor = consolePallete[color];
            },

            print: function(text) { // print text on console layer with at x,y and color from palette
                var x, y;
                x = consolePos.x;
                y = consolePos.y;

                ctxCons.clearRect(x * 32, y * 32, text.length * 32, 32);
                ctxCons.font = '48pt petitcomputer';
                ctxCons.fillStyle = consoleColor;
                ctxCons.fillText(text, x * 32, (y + 1) * 32);

                consolePos.y++;
            },

            default: function() { // default text on start
                this.cls();
                this.print('PetitComputer ver2.2');
                this.print('SMILEBASIC 1048576 bytes free');
                this.print('(C)2011-2012 SmileBoom Co.Ltd.');
                this.print('');
                this.print('READY');
                this.print('');
                this.color(13);
                this.print('At the moment, commands can');
                this.print('only be inputted using the');
                this.color(3);
                this.print('Javascript');
                this.locate(11,8);
                this.color(13);
                this.print('console.');
            }

        },

        bgFront: {
            //
        },

        sprite: { // sprite will stay in between BGF and BGR for now...
            //
        },

        bgRear: {
            //
        },

        graphic: {

            gcls: function() {
                ctxGraphic.clearRect(0, 0, 256, 192);
            },
            
            gline: function(x1, y1, x2, y2, color) {
                ctxGraphic.strokeStyle = consolePallete[color];
                ctxGraphic.lineWidth = 1;
                ctxGraphic.beginPath();
                ctxGraphic.moveTo(x1, y1);
                ctxGraphic.lineTo(x2, y2);
                ctxGraphic.stroke();
            }

        }

    };

})();


var pnlScreen = (function() { // does nothing yet

    var canvas = document.getElementById('pnlScreen');
    var ctx = canvas.getContext('2d');
    canvas.height = 768;
    canvas.width = 1024;

    console.log('pnlScreen controller loaded');

})();



runMode.console.default();
