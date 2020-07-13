// ptc.js """"""interpreter""""""" by Literal Line
document.getElementById('editScreen').style.display = 'none';


// custom function to replace string character at index
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}


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

    var defaultConsoleChrTable = function() {
        consoleChrTable = [ // dimensions x: 0-31, y: 0-23
            '                                ', // 0
            '                                ', // 1
            '                                ', // 2
            '                                ', // 3
            '                                ', // 4
            '                                ', // 5
            '                                ', // 6
            '                                ', // 7
            '                                ', // 8
            '                                ', // 9
            '                                ', // 10
            '                                ', // 11
            '                                ', // 12
            '                                ', // 13
            '                                ', // 14
            '                                ', // 15
            '                                ', // 16
            '                                ', // 17
            '                                ', // 18
            '                                ', // 19
            '                                ', // 20
            '                                ', // 21
            '                                ', // 22
            '                                '  // 23
        ];
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

    // set default console variables
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
    var consoleChrIDs = [ // 16x16 list of all console characters in order (most are unused unicode)
        ' ','','','','','','','','','','','','','','','',
        '','','','','','','','','','','','','','','','',
        ' ','!','"','#','$','%','&','\'','(',')','*','+',',','-','.','/',
        '0','1','2','3','4','5','6','7','8','9',':',';','<','=','>','?',
        '@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O',
        'P','Q','R','S','T','U','V','W','X','Y','Z','[','¥',']','^','_',
        '`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
        'p','q','r','s','t','u','v','w','x','y','z','{','|','}','~','\\',
        '','','','','','','','','','','','','','','','',
        '','','','','','','','','','','','','','','','',
        '~','。','「','」','、','・','ヲ','ァ','ィ','ゥ','ェ','ォ','ャ','ュ','ョ','ッ',
        'ー','ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ',
        'タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ',
        'ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ン','゛','゜',
        '','','','','','','','','','','','','','','','',
        '','','','','','','','','','','','','','','',''
    ];


    var consoleColor = consolePallete[0];
    var consolePos = {
        x: 0,
        y: 0
    };
    var consoleChrTable = [];
    defaultConsoleChrTable();


    console.log('runMode controller loaded');


    return { // all methods that can be used in run mode, categorized by their type

        console: {

            acls: function() {
                this.cls();
                // more stuff
            },

            cls: function() {
                defaultConsoleChrTable();
                ctxCons.clearRect(0, 0, 1024, 768);
                consolePos.x = 0;
                consolePos.y = 0;
            },

            locate: function(x, y) {
                if ((x >= 0 && x <= 31) || (y >= 0 && y <= 23)) {
                    consolePos.x = x;
                    consolePos.y = y;
                } else {
                    consolePos.x = 0;
                    consolePos.y = 0;
                }
            },

            color: function(color) {
                consoleColor = consolePallete[color];
            },

            print: function(text) { // print text on console layer
                var x, y;
                // consolePos shorthand
                x = consolePos.x;
                y = consolePos.y;

                ctxCons.font = '48pt ptc';
                ctxCons.fillStyle = consoleColor;

                // if console y position is too large
                if (y > 22) {
                    // shift CHKCHR() table up
                    consoleChrTable.shift();
                    consoleChrTable.push('                                ');
                    // shift canvas up
                    var canvasData = ctxCons.getImageData(0, 0, 1024, 768);
                    ctxCons.putImageData(canvasData, 0, -32);
                    // clear last line
                    ctxCons.clearRect(0, 736, 1024, 32);
                    // move console y position back up and update y shorthand
                    consolePos.y = 22;
                    y = consolePos.y;
                }

                // clear space for text, draw text, and add text to CHKCHR() table
                for (i = 0; i < String(text).length; i++) {

                    var currentChr = String(text).charAt(i);

                    if (x > 31) {
                        x = 0;
                        y++;
                    }


                    ctxCons.clearRect(x * 32, y * 32, 32, 32);
                    ctxCons.fillText(currentChr, x * 32, (y + 1) * 32);
                    consoleChrTable[y] = consoleChrTable[y].replaceAt(x, currentChr);

                    x++;
                }


                // next line
                consolePos.x = 0;
                consolePos.y = y + 1;
            },

            chkChr: function(x, y) {
                var selectedChr = consoleChrTable[y].charAt(x);
                return consoleChrIDs.indexOf(selectedChr);
            },

            getConsoleChrTable: function() {
                return consoleChrTable;
            },

            getConsoleChrIDs: function() {
                return consoleChrIDs;
            },

            printConsoleChrIDs: function() {
                this.print(' ');
                this.print('');
                this.print(' !"#$%&\'()*+,-./');
                this.print('0123456789:;<=>?');
                this.print('@ABCDEFGHIJKLMNO');
                this.print('PQRSTUVWXYZ[¥]^_');
                this.print('`abcdefghijklmno');
                this.print('pqrstuvwxyz{|}~/');
                this.print('');
                this.print('');
                this.print('~。「」、・ヲァィゥェォャュョッ');
                this.print('ーアイウエオカキクケコサシスセソ');
                this.print('タチツテトナニヌネノハヒフヘホマ');
                this.print('ミムメモヤユヨラリルレロワン゛゜');
                this.print('');
                this.print('');
            },

            default: function() { // default text on start
                this.cls();
                this.print('PetitComputer ver2.2');
                this.print('SMILEBASIC 1048576 bytes free');
                this.print('(C)2011-2012 SmileBoom Co.Ltd.');
                this.print('');
                this.print('READY');
                this.color(13);
                this.print('At the moment, commands can');
                this.print('only be inputted using the');
                this.color(3);
                this.print('Javascript');
                this.locate(11,7);
                this.color(13);
                this.print('console.');
                this.color(0);
            }

        },

        bg: {
            //
        },

        sprite: { // sprite will stay in between BGF and BGR for now...
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



runMode.console.default();
///