// ptc.js """"""interpreter""""""" by Literal Line
document.getElementById('editScreen').style.display = 'none';

// custom function to insert string at index
String.prototype.insertAt = function(index, insert) {
    return this.slice(0, index) + insert + this.slice(index, this.length);
};

// custom function to delete string character at index
String.prototype.deleteAt = function(index) {
    return this.slice(0, index) + this.slice(index + 1, this.length);
};

// custom function to replace string character at index
String.prototype.replaceAt = function(index, replacement) {
    return this.slice(0, index) + replacement + this.slice(index + replacement.length);
};

// jQuery is for lazy losers haha
function findId(id) {
    return document.getElementById(id);
}


var runMode = (function() {

    // set default canvas resolutions, all being 1024x768 except graphic canvas
    var defaultRes = function() {
        var list, index;

        graphicCanvas.height = 192;
        graphicCanvas.width = 256;

        list = document.getElementsByClassName('runModeCanvas');
        for (index = 0; index < list.length - 1; index++) {
            list[index].setAttribute('height', 768);
            list[index].setAttribute('width', 1024);
        }
    };

    // define variables for canvases and set default resolutions
    var consoleCanvas = findId('console');
    var BGFCanvas = findId('bgFront');
    var spriteCanvas = findId('sprite');
    var BGRCanvas = findId('bgRear');
    var graphicCanvas = findId('graphic');
    defaultRes();

    // set canvas contexts
    var consCtx = consoleCanvas.getContext('2d');
    var BGFCtx = BGFCanvas.getContext('2d');
    var spriteCtx = spriteCanvas.getContext('2d');
    var BGRCtx = BGRCanvas.getContext('2d');
    var graphicCtx = graphicCanvas.getContext('2d');

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
        var canvasData = consCtx.getImageData(0, 0, 1024, 768);
        consCtx.putImageData(canvasData, 0, -32);
        // clear last line
        consCtx.clearRect(0, 736, 1024, 32);
    };

    // directory for sounds used with BEEP function
    var beepDir = './assets/audio/beep/';

    console.log('[PTC.js] runMode controller loaded');


    return { // all methods that can be used in run mode, categorized by their type

        console: {

            acls: function() {
                this.cls();
                // more stuff
            },

            cls: function() {
                consoleData.chrTableDefault();
                consCtx.clearRect(0, 0, 1024, 768);
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

                consCtx.font = '48pt ptc';
                consCtx.fillStyle = consoleData.currentColor;



                // clear space for text, draw text, and add text to CHKCHR() table
                for (var i = 0; i < text.length; i++) {

                    var currentChr = text.charAt(i);

                    if (x > 31) {
                        x = 0;
                        y++;
                    }

                    // if console y position is too large
                    if (y > 22) {
                        consoleData.newLine();
                        // move console y position back up and update y shorthand
                        consoleData.pos.y = 22;
                        y = consoleData.pos.y;
                    }

                    consCtx.clearRect(x * 32, y * 32, 32, 32);
                    consCtx.fillText(currentChr, x * 32, (y + 1) * 32);
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

            getDataObject: function() {
                return consoleData;
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
                this.color(0);
                this.print('PetitComputer ver2.2');
                this.print('SMILEBASIC 1048576 bytes free');
                this.print('(C)2011-2012 SmileBoom Co.Ltd.');
                this.print('');
                this.print('READY');
                this.print('');
                this.color(13);
                this.print('At the moment, commands can');
                this.print('only be inputted using the');
                this.print('cursed');
                this.color(3);
                this.locate(7, 8);
                this.print('Javascript');
                this.locate(18, 8);
                this.color(13);
                this.print('format.');
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
                graphicCtx.clearRect(0, 0, 256, 192);
            },
            
            gline: function(x1, y1, x2, y2, color) {
                graphicCtx.strokeStyle = consoleData.pallete[color];
                graphicCtx.lineWidth = 1;
                graphicCtx.beginPath();
                graphicCtx.moveTo(x1, y1);
                graphicCtx.lineTo(x2, y2);
                graphicCtx.stroke();
            }

        },

        audio: {

            beep: function(id) {
                id = (typeof (id) !== 'undefined') ? id : 0;
                var sound = new Audio(beepDir + 'BEEP' + id + '.mp3');
                console.log(sound);
                sound.play();
            }

        }

    };

})();



var cursor = (function() {

    // set canvas, canvas context, and dimensions
    var cursorCanvas = findId('cursor');
    var cursorCtx = cursorCanvas.getContext('2d');
    cursorCanvas.height = 768;
    cursorCanvas.width = 1024;
    cursorCtx.fillStyle = '#FFFFFF';


    // blinking cursor function (called every 500ms)
    var visible = 1;
    var updateCursor = function() {
        var x, y;
        cursorPos = cursorPos >= 31 ? 31 : cursorPos;
        x = cursorPos * 32;
        y = (runMode.console.getDataObject().pos.y + 1) * 32 - 4;

        cursorCtx.clearRect(0, 0, 1024, 768);
        if (visible === 1) {
            cursorCtx.fillRect(x, y, 28, -8);
        }

        visible = -(visible);
    };
    setInterval(updateCursor, 500);

    // detect typing
    var string = '                                ';
    var cursorPos = 0;
    document.addEventListener('keypress', function(e) {
        var x, y;
        x = runMode.console.getDataObject().pos.x;
        y = runMode.console.getDataObject().pos.y;

        if (e.key !== 'Enter') {
            if (cursorPos <= 31) {
                string = string.insertAt(cursorPos, e.key);
                string = string.slice(0, -1);
                cursorPos++;
             
                runMode.console.print(string);
                runMode.console.locate(0, y);
            }
        } else {
            runMode.console.print();
            eval('runMode.' + string);

            string = '                                ';
            cursorPos = 0;
            runMode.console.print('OK');
        }

        runMode.audio.beep(9);
        visible = 1;
        updateCursor();
    });

    // detect arrow keys, backspace, space, and tab
    document.addEventListener('keydown', function(e) {
        var y, beepKeys;
        y = runMode.console.getDataObject().pos.y;
        beepKeys = ['Backspace', 'ArrowLeft', 'ArrowRight'];

        // backspace and arrow keys
        if (cursorPos < 31 && e.code === 'ArrowRight') {
            cursorPos++;
        } else if (cursorPos > 0) {
            if (e.code === 'ArrowLeft') {
                cursorPos--;
            } else if (e.code === 'Backspace') {
                string = string.deleteAt(cursorPos - 1);
                string = string + ' ';
                cursorPos--;
                runMode.console.print(string);
                runMode.console.locate(0, y);
            }
        }

        // prevent scrolling page with space
        if (e.code === 'Space' || e.code === 'Tab') {
            e.preventDefault();
        }

        for (var i = 0; i <= beepKeys.length; i++) {
            if (e.code === beepKeys[i]) {
                runMode.audio.beep(9);
            }
        }
        
        visible = 1;
        updateCursor();
    });

    console.log('[PTC.js] cursor controller loaded');

})();



runMode.console.welcome();
/// stupid browser cache
