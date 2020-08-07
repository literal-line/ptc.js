// ptc.js """"""interpreter""""""" by Literal Line
document.getElementById('editScreen').style.display = 'none';


// custom function to replace string character at index
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};



var runMode = (function() {

    // getElementById but shorter (this is bad??)
    var findId = function(id) {
        return document.getElementById(id);
    };

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
    };

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

    // object for all console data
    var consoleData = {
        pos: {
            x: 0,
            y: 0
        },

        chrTable: [ // dimensions x: 0-31, y: 0-23
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
        ],

        pallete: [ // default color pallete for console, bg, and sprites
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
        ],

        chrIDs: [ // 16x16 list of all console characters in order (most are unused unicode)
            '','','','','','','','','','','','','','','','',
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
        ]
    };
    consoleData.currentColor = consoleData.pallete[0];
    consoleData.chrTableDefault = function() {
        this.chrTable = [
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
    };
    consoleData.newLine = function() {
        // shift CHKCHR() table up
        consoleData.chrTable.shift();
        consoleData.chrTable.push('                                ');
        // shift canvas up
        var canvasData = ctxCons.getImageData(0, 0, 1024, 768);
        ctxCons.putImageData(canvasData, 0, -32);
        // clear last line
        ctxCons.clearRect(0, 736, 1024, 32);
    };

    // directory for sounds used with BEEP function
    var beepDir = './assets/audio/beep/';


    console.log('runMode controller loaded');


    return { // all methods that can be used in run mode, categorized by their type

        console: {

            acls: function() {
                this.cls();
                // more stuff
            },

            cls: function() {
                consoleData.chrTableDefault();
                ctxCons.clearRect(0, 0, 1024, 768);
                consoleData.pos.x = 0;
                consoleData.pos.y = 0;
            },

            locate: function(x, y) {
                if ((x >= 0 && x <= 31) || (y >= 0 && y <= 23)) {
                    consoleData.pos.x = x;
                    consoleData.pos.y = y;
                } else {
                    consoleData.pos.x = 0;
                    consoleData.pos.y = 0;
                }
            },

            color: function(color) {
                consoleData.currentColor = consoleData.pallete[color];
            },

            print: function(text) { // print text on console layer
                // text = String(text);
                text = (typeof (text) !== 'undefined') ? String(text) : '';

                // consoleData shorthand
                var x, y;
                x = consoleData.pos.x;
                y = consoleData.pos.y;

                ctxCons.font = '48pt ptc';
                ctxCons.fillStyle = consoleData.currentColor;



                // clear space for text, draw text, and add text to CHKCHR() table
                for (var i = 0; i < text.length; i++) {

                    var currentChr = text.charAt(i);

                    if (x > 31) {
                        x = 0;
                        y++;
                        // if console y position is too large
                        if (y > 22) {
                            consoleData.newLine();
                            // move console y position back up and update y shorthand
                            consoleData.pos.y = 22;
                            y = consoleData.pos.y;
                        }
                    }


                    ctxCons.clearRect(x * 32, y * 32, 32, 32);
                    ctxCons.fillText(currentChr, x * 32, (y + 1) * 32);
                    consoleData.chrTable[y] = consoleData.chrTable[y].replaceAt(x, currentChr);

                    x++;
                }

                // next line
                consoleData.pos.x = 0;
                consoleData.pos.y = y + 1;
            },

            asc: function(chr) {
                chr = chr.charAt(0);
                chrIndex = consoleData.chrIDs.indexOf(chr)
                if (chrIndex !== 0 && chrIndex !== -1) {
                    return chrIndex;
                }
            },

            chr$: function(id) {
                return consoleData.chrIDs[id];
            },

            chkChr: function(x, y) {
                var selectedChr = consoleData.chrTable[y].charAt(x);
                return consoleData.chrIDs.indexOf(selectedChr);
            },

            getChrTable: function() {
                return consoleData.chrTable;
            },

            getChrIDs: function() {
                return consoleData.chrIDs;
            },

            printChrIDs: function() {
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

            welcome: function() { // default text on start
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
                ctxGraphic.strokeStyle = consoleData.pallete[color];
                ctxGraphic.lineWidth = 1;
                ctxGraphic.beginPath();
                ctxGraphic.moveTo(x1, y1);
                ctxGraphic.lineTo(x2, y2);
                ctxGraphic.stroke();
            }

        },

        audio: {

            beep: function(id) {
                id = (typeof (id) !== 'undefined') ? id : 0;
                var sound = new Audio(beepDir + 'BEEP' + id + '.mp3')                                   ;
                console.log(sound);
                sound.play();
            }

        }

    };

})();



runMode.console.welcome();
/// stupid browser cache
