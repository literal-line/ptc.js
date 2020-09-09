///////////////////////////////////////////////////
//ptc.js """"""interpreter""""""" by Literal Line//
//             _____________________             //
//            Build September 8, 2020            //
///////////////////////////////////////////////////
'use strict';



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
function fId(id) {
    return document.getElementById(id);
}


fId('editScreen').style.display = 'none';




var runMode = (function() {

    // set default canvas resolutions, all being 1024x768 except graphic canvas
    var defaultRes = function() {
        var list, index;

        graphicCanvas.setAttribute('height', 192);
        graphicCanvas.setAttribute('width', 256);

        list = document.getElementsByClassName('runModeCanvas');
        for (index = 0; index < list.length - 1; index++) {
            list[index].setAttribute('height', 768);
            list[index].setAttribute('width', 1024);
        }
    };

    // define variables for canvases and set default resolutions
    var consoleCanvas = fId('console');
    var BGFCanvas = fId('bgFront');
    var spriteCanvas = fId('sprite');
    var BGRCanvas = fId('bgRear');
    var graphicCanvas = fId('graphic');
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

        chrTable: {
            text: [ // dimensions x: 0-31, y: 0-23
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
            color: [ // dimensions x: 0-31, y: 0-23
                '00000000000000000000000000000000', // 0
                '00000000000000000000000000000000', // 1
                '00000000000000000000000000000000', // 2
                '00000000000000000000000000000000', // 3
                '00000000000000000000000000000000', // 4
                '00000000000000000000000000000000', // 5
                '00000000000000000000000000000000', // 6
                '00000000000000000000000000000000', // 7
                '00000000000000000000000000000000', // 8
                '00000000000000000000000000000000', // 9
                '00000000000000000000000000000000', // 10
                '00000000000000000000000000000000', // 11
                '00000000000000000000000000000000', // 12
                '00000000000000000000000000000000', // 13
                '00000000000000000000000000000000', // 14
                '00000000000000000000000000000000', // 15
                '00000000000000000000000000000000', // 16
                '00000000000000000000000000000000', // 17
                '00000000000000000000000000000000', // 18
                '00000000000000000000000000000000', // 19
                '00000000000000000000000000000000', // 20
                '00000000000000000000000000000000', // 21
                '00000000000000000000000000000000', // 22
                '00000000000000000000000000000000'  // 23
            ]
        },

        palette: [ // default color palette for console, bg, and sprites
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
    consoleData.currentColor = consoleData.palette[0];
    consoleData.chrTableDefault = function() {
        this.chrTable.text = [
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
        consoleData.chrTable.text.shift();
        consoleData.chrTable.color.shift();
        consoleData.chrTable.text.push('                                ');
        consoleData.chrTable.color.push('00000000000000000000000000000000');
        // shift canvas up
        var canvasData = consCtx.getImageData(0, 0, 1024, 768);
        consCtx.putImageData(canvasData, 0, -32);
        // clear last line
        consCtx.clearRect(0, 736, 1024, 32);
    };

    // directory for sounds used with BEEP function
    var beepDir = './assets/audio/beep/';


    console.log('[PTC.js] runMode controller loaded');


    return {

        // console/input commands
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
            consoleData.currentColor = consoleData.palette[Math.floor(color)];
        },

        print: function(text) { // print text on console layer
            // text = String(text);
            text = (typeof (text) !== 'undefined') ? String(text) : '';

            // consoleData shorthand
            var x, y;
            x = Math.floor(consoleData.pos.x);
            y = Math.floor(consoleData.pos.y);

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
                consoleData.chrTable.text[y] = consoleData.chrTable.text[y].replaceAt(x, currentChr);
                consoleData.chrTable.color[y] = consoleData.chrTable.color[y].replaceAt(x, consoleData.palette.indexOf(consoleData.currentColor).toString(16));

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
            var selectedChr = consoleData.chrTable.text[y].charAt(x);
            return consoleData.chrIDs.indexOf(selectedChr);
        },

        // dev stuff
        clearLine: function(y) {
            consCtx.clearRect(0, y * 32, 1024, 32);
            consoleData.chrTable.text[y] = '                                ';
        },

        getConsoleDataObject: function() {
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
            this.print('Build September 8, 2020');
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
        },

        button: function() {
            return inputHandler.getButtons();
        },
        

        // graphic commands
        gcls: function() {
            graphicCtx.clearRect(0, 0, 256, 192);
        },
        
        gline: function(x1, y1, x2, y2, color) {
            graphicCtx.strokeStyle = consoleData.palette[color];
            graphicCtx.lineWidth = 1;
            graphicCtx.beginPath();
            graphicCtx.moveTo(x1, y1);
            graphicCtx.lineTo(x2, y2);
            graphicCtx.stroke();
        },


        // audio commands
        beep: function(id, vol) {
            id = id || 0;
            vol = (typeof vol === 'undefined') ? 0.5 : vol / 127 * 0.5;

            if (vol >= 0 && vol <= 0.5) {
                var sound = new Audio(beepDir + 'BEEP' + id + '.mp3');

                sound.volume = vol;
                sound.play();
            }
        },

        
        // other
        init: function() {
            this.welcome();
            this.gcls();
        }

    };

})();



var inputMode = (function() {

    // set default canvas resolutions, all being 1024x768
    var defaultRes = function() {
        var list, index;

        list = document.getElementsByClassName('inputCanvas');
        for (index = 0; index < list.length; index++) {
            list[index].setAttribute('height', 768);
            list[index].setAttribute('width', 1024);
        }
    };

    // define variables for canvases and set default resolution
    var cursor = fId('inputCursor');
    var text = fId('inputText');
    defaultRes();

    // set canvas contexts
    var cursorCtx = cursor.getContext('2d');
    var textCtx = text.getContext('2d');

    var inputData = {
        cursorPos: {
            x: 0,
            y: 0
        },
        textInput: {
            string: '                                ',
            color: '00000000000000000000000000000000'
        },
        history: [], // later...
        historyCurrent : 0,
        currentColor: 0,
        enabled: true
    };
    inputData.update = function() {
        var consoleData = runMode.getConsoleDataObject();
        inputData.cursorPos.y = consoleData.pos.y;
        inputData.currentColor = consoleData.currentColor;
    };


    // text input / blinking cursor function (called every 500ms / on text input)
    var updateInput = (function() {
        var visible = 1;

        return function(bool) {
            var x, y, text, color;
            inputData.update();
            x = inputData.cursorPos.x * 32;
            y = (inputData.cursorPos.y + 1) * 32;
            text = inputData.textInput.string;
            color = inputData.currentColor;

            cursorCtx.clearRect(0, 0, 1024, 768);
            textCtx.clearRect(0, 0, 1024, 768);

            if (bool) visible = bool;

            // draw cursor to cursor canvas if visible variable === 1
            cursorCtx.fillStyle = '#FFFFFF';
            if (visible === 1) cursorCtx.fillRect(x, y - 4, 28, -8);

            visible = -(visible);

            // draw text to text canvas
            textCtx.font = '48pt ptc';
            var consoleData = runMode.getConsoleDataObject();
            for (var i = 0; i <= 31; i++) {
                textCtx.fillStyle = consoleData.currentColor;
                textCtx.fillText(text[i], i * 32, y);
            }
        }
    })();

    // enable/disable input
    var isEnabled = (function() {
        var inputInterval;

        return function(bool) {
            if (bool) {
                inputData.enabled = true;
                clearInterval(inputInterval);
                document.removeEventListener('keydown', keydownEventNoInput);
                document.addEventListener('keypress', keypressEvent);
                document.addEventListener('keydown', keydownEvent);
                inputInterval = setInterval(updateInput, 500);
                updateInput(1);
            } else {
                inputData.enabled = false;
                clearInterval(inputInterval);
                document.removeEventListener('keypress', keypressEvent);
                document.removeEventListener('keydown', keydownEvent);
                document.addEventListener('keydown', keydownEventNoInput);
                cursorCtx.clearRect(0, 0, 1024, 768);
                textCtx.clearRect(0, 0, 1024, 768);
            }
        }
    })();

    var keypressEvent = function(e) { // detect typing
        e.preventDefault();
        var key = e.key;

        if (key !== 'Enter') {
            inputData.textInput.string = inputData.textInput.string.insertAt(inputData.cursorPos.x, key);
            inputData.textInput.color = inputData.textInput.color.insertAt(inputData.cursorPos.x, runMode.getConsoleDataObject().palette.indexOf(inputData.currentColor));
            inputData.textInput.string = inputData.textInput.string.slice(0, -1);
            inputData.textInput.color = inputData.textInput.color.slice(0, -1);

            if (inputData.cursorPos.x < 31) {
                inputData.cursorPos.x++;
            }

            updateInput(1);
        }
    };

    var keydownEvent = function(e) { // detect special keys
        var key = e.key;

        switch(key) {
            case 'Enter':
                var input, consoleData, consoleY;
                input = inputData.textInput.string;
                consoleData = runMode.getConsoleDataObject();
    
                inputData.history.push(input);
    
                try {
                    runMode.print(input);
                    var result = eval(input);
                    runMode.locate(0, consoleData.pos.y);
    
                    if (input !== '                                ') { // print "OK" unless input field is empty
                        runMode.print('OK');
                        runMode.clearLine(consoleData.pos.y);
                    }
                } catch(err) {
                    runMode.print(err.message);
                    runMode.print('OK');
                    runMode.clearLine(consoleData.pos.y);
                    runMode.beep(2);
                }

                // get next console line and copy to input field
                consoleY = consoleData.pos.y;
                inputData.textInput.string = consoleData.chrTable.text[consoleY];
                inputData.textInput.color = consoleData.chrTable.color[consoleY];
                runMode.clearLine(consoleY);
                inputData.cursorPos.x = 0;
                break;

            case 'Backspace':
                if (inputData.cursorPos.x > 0) {
                    inputData.textInput.string = inputData.textInput.string.deleteAt(inputData.cursorPos.x - 1) + ' ';
                    inputData.textInput.color = inputData.textInput.color.deleteAt(inputData.cursorPos.x - 1) + '0';
                    inputData.cursorPos.x--;
                }
                break;

            case 'ArrowLeft':
                if (inputData.cursorPos.x > 0) {
                    inputData.cursorPos.x--;
                }
                break;

            case 'ArrowRight':
                if (inputData.cursorPos.x < 31) {
                    inputData.cursorPos.x++;
                }
                break;

            case 'ArrowUp':
                //
                break;

            case 'ArrowDown':
                //
                break;
        }
        
        if (inputData.enabled) updateInput(1);
    };

    var keydownEventNoInput = function(e) {
        if (e.key === 'Shift') {
            clearInterval(prgInterval);
            isEnabled(1);
        }
    };

    // preventDefault()
    document.addEventListener('keydown', function(e) {
        var key = e.key;

        if (key === 'Backspace' || key === 'ArrowUp' || key === 'ArrowDown') e.preventDefault();
    });


    console.log('[PTC.js] inputMode controller loaded');


    return {

        getDataObject: function() {
            return inputData;
        },

        isEnabled: isEnabled,
        
        init: function() {
            isEnabled(true);
        }

    };

})();



var pnl = (function() {

    // pnlScreen div
    var div = fId('pnlScreen');
    var kbDiv = fId('kbScreen');
    var btnDiv = fId('btnScreen');

    var keyDir = './assets/pnl/keys/';
    var btnDir = './assets/pnl/buttons/';


    var imageCache = function() {
        var cacheDiv, images;

        cacheDiv = fId('imageCache');
        images = keys.kya['uc'].concat(keys.kya['lc'], keys.kym['uc'], keys.kym['lc'], keys.kyk['uc']);
        images.forEach(function(cur) {
            var image = document.createElement('img');
            image.src = keyDir + cur[0] + '.png';
            cacheDiv.appendChild(image);
        });
    };


    // Keyboard data
    var keys = {
        kya: {
            uc: [
                ['1', '1', 25, 49], // image name, keypress id, x from left, y from top
                ['2', '2', 41, 49],
                ['3', '3', 57, 49],
                ['4', '4', 73, 49],
                ['5', '5', 89, 49],
                ['6', '6', 105, 49],
                ['7', '7', 121, 49],
                ['8', '8', 137, 49],
                ['9', '9', 153, 49],
                ['0', '0', 169, 49],
                ['hyphen', '-', 185, 49],
                ['plus', '+', 201, 49],
                ['equal', '=', 217, 49],
                ['dollar', '$', 1, 73],
                ['quot', '"', 17, 73],
                ['ucQ', 'Q', 33, 73],
                ['ucW', 'W', 49, 73],
                ['ucE', 'E', 65, 73],
                ['ucR', 'R', 81, 73],
                ['ucT', 'T', 97, 73],
                ['ucY', 'Y', 113, 73],
                ['ucU', 'U', 129, 73],
                ['ucI', 'I', 145, 73],
                ['ucO', 'O', 161, 73],
                ['ucP', 'P', 177, 73],
                ['at', '@', 193, 73],
                ['asterisk', '*', 209, 73],
                ['oparen', '(', 225, 73],
                ['cparen', ')', 241, 73],
                ['exclamation', '!', 25, 97],
                ['ucA', 'A', 41, 97],
                ['ucS', 'S', 57, 97],
                ['ucD', 'D', 73, 97],
                ['ucF', 'F', 89, 97],
                ['ucG', 'G', 105, 97],
                ['ucH', 'H', 121, 97],
                ['ucJ', 'J', 137, 97],
                ['ucK', 'K', 153, 97],
                ['ucL', 'L', 169, 97],
                ['scolon', ';', 185, 97],
                ['colon', ':', 201, 97],
                ['lessthan', '<', 217, 97],
                ['greaterthan', '>', 233, 97],
                ['apostrophe', '\'', 33, 121],
                ['ucZ', 'Z', 49, 121],
                ['ucX', 'X', 65, 121],
                ['ucC', 'C', 81, 121],
                ['ucV', 'V', 97, 121],
                ['ucB', 'B', 113, 121],
                ['ucN', 'N', 129, 121],
                ['ucM', 'M', 145, 121],
                ['comma', ',', 161, 121],
                ['period', '.', 177, 121],
                ['fslash', '/', 193, 121],
                ['percent', '%', 209, 121],
                ['SPACE', ' ', 81, 145, 109, 13]
            ],
            lc: [
                ['NONE', 'NONE', 25, 49],
                ['NONE', 'NONE', 41, 49],
                ['hash', '#', 57, 49],
                ['NONE', 'NONE', 73, 49],
                ['NONE', 'NONE', 89, 49],
                ['ampersand', '&', 105, 49],
                ['NONE', 'NONE', 121, 49],
                ['caret', '^', 137, 49],
                ['yen', '￥', 153, 49],
                ['tilde', '~', 169, 49],
                ['NONE', 'NONE', 185, 49],
                ['bslash', '\\', 201, 49],
                ['bar', '|', 217, 49],
                ['NONE', 'NONE', 1, 73],
                ['NONE', 'NONE', 17, 73],
                ['lcQ', 'q', 33, 73],
                ['lcW', 'w', 49, 73],
                ['lcE', 'e', 65, 73],
                ['lcR', 'r', 81, 73],
                ['lcT', 't', 97, 73],
                ['lcY', 'y', 113, 73],
                ['lcU', 'u', 129, 73],
                ['lcI', 'i', 145, 73],
                ['lcO', 'o', 161, 73],
                ['lcP', 'p', 177, 73],
                ['grave', '`', 193, 73],
                ['NONE', 'NONE', 209, 73],
                ['obracket', '[', 225, 73],
                ['cbracket', ']', 241, 73],
                ['NONE', 'NONE', 25, 97],
                ['lcA', 'a', 41, 97],
                ['lcS', 's', 57, 97],
                ['lcD', 'd', 73, 97],
                ['lcF', 'f', 89, 97],
                ['lcG', 'g', 105, 97],
                ['lcH', 'h', 121, 97],
                ['lcJ', 'j', 137, 97],
                ['lcK', 'k', 153, 97],
                ['lcL', 'l', 169, 97],
                ['NONE', 'NONE', 185, 97],
                ['NONE', 'NONE', 201, 97],
                ['ocbracket', '{', 217, 97],
                ['ccbracket', '}', 233, 97],
                ['NONE', 'NONE', 33, 121],
                ['lcZ', 'z', 49, 121],
                ['lcX', 'x', 65, 121],
                ['lcC', 'c', 81, 121],
                ['lcV', 'v', 97, 121],
                ['lcB', 'b', 113, 121],
                ['lcN', 'n', 129, 121],
                ['lcM', 'm', 145, 121],
                ['NONE', 'NONE', 161, 121],
                ['NONE', 'NONE', 177, 121],
                ['question', '?', 193, 121],
                ['underscore', '_', 209, 121],
                ['SPACE', ' ', 81, 145, 109, 13]
            ]
        },
        kym: {
            uc: [
                ['heart', '', 25, 49],
                ['diamondfilled', '', 41, 49],
                ['spade', '', 57, 49],
                ['club', '', 73, 49],
                ['star', '', 89, 49],
                ['circleoutline', '', 105, 49],
                ['coin', '', 121, 49],
                ['squareoutline', '', 137, 49],
                ['triangleupoutline', '', 153, 49],
                ['triangledownoutline', '', 169, 49],
                ['eighthnote', '', 185, 49],
                ['smileoutline', '', 201, 49],
                ['clock', '', 217, 49],
                ['brick', '', 1, 73],
                ['pipev', '', 17, 73],
                ['pipetopleft', '', 33, 73],
                ['pipetopmid', '', 49, 73],
                ['pipetopright', '', 65, 73],
                ['carup', '', 81, 73],
                ['cardown', '', 97, 73],
                ['carleft', '', 113, 73],
                ['carright', '', 129, 73],
                ['ufo', '', 145, 73],
                ['mothership', '', 161, 73],
                ['fighterjet', '', 177, 73],
                ['alien', '', 193, 73],
                ['rocket', '', 209, 73],
                ['fingerpoint', '', 225, 73],
                ['snake', '', 241, 73],
                ['pipeh', '', 25, 97],
                ['pipeleftmid', '', 41, 97],
                ['pipemid', '', 57, 97],
                ['piperightmid', '', 73, 97],
                ['dottedcorner', '', 89, 97],
                ['dottedlinev', '', 105, 97],
                ['dottedlineh', '', 121, 97],
                ['personup', '', 137, 97],
                ['persondown', '', 153, 97],
                ['personleft', '', 169, 97],
                ['personright', '', 185, 97],
                ['key', '', 201, 97],
                ['door', '', 217, 97],
                ['house', '', 233, 97],
                ['squarefullshaded', '', 33, 121],
                ['pipebottomleft', '', 49, 121],
                ['pipebottommid', '', 65, 121],
                ['pipebottomright', '', 81, 121],
                ['linefslash', '', 97, 121],
                ['linebslash', '', 113, 121],
                ['linex', '', 129, 121],
                ['squarefull', '', 145, 121],
                ['triangleright1', '', 161, 121],
                ['triangleright2', '', 177, 121],
                ['triangleright3', '', 193, 121],
                ['triangleright4', '', 209, 121],
                ['SPACE', ' ', 81, 145, 109, 13]
            ],
            lc: [
                ['NONE', 'NONE', 25, 49],
                ['diamondoutline', '', 41, 49],
                ['NONE', 'NONE', 57, 49],
                ['NONE', 'NONE', 73, 49],
                ['NONE', 'NONE', 89, 49],
                ['circlefilled', '', 105, 49],
                ['NONE', 'NONE', 121, 49],
                ['squarefilled', '', 137, 49],
                ['triangleupfilled', '', 153, 49],
                ['triangledownfilled', '', 169, 49],
                ['eighthnotes', '', 185, 49],
                ['smilefilled', '', 201, 49],
                ['NONE', 'NONE', 217, 49],
                ['NONE', 'NONE', 1, 73],
                ['NONE', 'NONE', 17, 73],
                ['linetop', '', 33, 73],
                ['arrowup', '', 49, 73],
                ['lineright', '', 65, 73],
                ['btna', '', 81, 73],
                ['btnb', '', 97, 73],
                ['btnx', '', 113, 73],
                ['btny', '', 129, 73],
                ['btnl', '', 145, 73],
                ['btnr', '', 161, 73],
                ['btndpad', '', 177, 73],
                ['NONE', 'NONE', 193, 73],
                ['NONE', 'NONE', 209, 73],
                ['apple', '', 225, 73],
                ['NONE', 'NONE', 241, 73],
                ['NONE', 'NONE', 25, 97],
                ['arrowleft', '', 41, 97],
                ['NONE', 'NONE', 57, 97],
                ['arrowright', '', 73, 97],
                ['NONE', 'NONE', 89, 97],
                ['gridtopleft', '', 105, 97],
                ['gridtopright', '', 121, 97],
                ['gridtop', '', 137, 97],
                ['gridbottomleft', '', 153, 97],
                ['gridleft', '', 169, 97],
                ['gridtoprightbottomleft', '', 185, 97],
                ['gridnotbottomright', '', 201, 97],
                ['NONE', 'NONE', 217, 97],
                ['NONE', 'NONE', 233, 97],
                ['NONE', 'NONE', 33, 121],
                ['lineleft', '', 49, 121],
                ['arrowdown', '', 65, 121],
                ['linebottom', '', 81, 121],
                ['gridbottomright', '', 97, 121],
                ['gridtopleftbottomright', '', 113, 121],
                ['gridright', '', 129, 121],
                ['gridnotbottomleft', '', 145, 121],
                ['gridbottom', '', 161, 121],
                ['gridnottopright', '', 177, 121],
                ['gridnottopleft', '', 193, 121],
                ['grid', '', 209, 121],
                ['SPACE', ' ', 81, 145, 109, 13]
            ]
        },
        kyk: {
            uc: [
                ['kanaucA', 'ア', 25, 49], // image name, keypress id, x from left, y from top
                ['kanaucI', 'イ', 41, 49],
                ['kanaucU', 'ウ', 57, 49],
                ['kanaucE', 'エ', 73, 49],
                ['kanaucO', 'オ', 89, 49],
                ['kanaucNa', 'ナ', 105, 49],
                ['kanaucNi', 'ニ', 121, 49],
                ['kanaucNu', 'ヌ', 137, 49],
                ['kanaucNe', 'ネ', 153, 49],
                ['kanaucNo', 'ノ', 169, 49],
                ['kanaucHyphen', '-', 185, 49],
                ['kanaucPlus', '+', 201, 49],
                ['kanaucEquals', '=', 217, 49],
                ['kanaucFulltilde', '〜', 1, 73],
                ['kanaucPoint', '・', 17, 73],
                ['kanaucKa', 'カ', 33, 73],
                ['kanaucKi', 'キ', 49, 73],
                ['kanaucKu', 'ク', 65, 73],
                ['kanaucKe', 'ケ', 81, 73],
                ['kanaucKo', 'コ', 97, 73],
                ['kanaucHa', 'ハ', 113, 73],
                ['kanaucHi', 'ヒ', 129, 73],
                ['kanaucFu', 'フ', 145, 73],
                ['kanaucHe', 'ヘ', 161, 73],
                ['kanaucHo', 'ホ', 177, 73],
                ['kanaucObracket', '「', 193, 73],
                ['kanaucCbracket', '」', 209, 73],
                ['kanaucN', 'ン', 225, 73],
                ['kanaucPeriod', '。', 241, 73],
                ['kanaucSa', 'サ', 25, 97],
                ['kanaucShi', 'シ', 41, 97],
                ['kanaucSu', 'ス', 57, 97],
                ['kanaucSe', 'セ', 73, 97],
                ['kanaucSo', 'ソ', 89, 97],
                ['kanaucMa', 'マ', 105, 97],
                ['kanaucMi', 'ミ', 121, 97],
                ['kanaucMu', 'ム', 137, 97],
                ['kanaucMe', 'メ', 153, 97],
                ['kanaucMo', 'モ', 169, 97],
                ['kanaucYa', 'ヤ', 185, 97],
                ['kanaucYu', 'ユ', 201, 97],
                ['kanaucYo', 'ヨ', 217, 97],
                ['kanaucComma', '、', 233, 97],
                ['kanaucTa', 'タ', 33, 121],
                ['kanaucChi', 'チ', 49, 121],
                ['kanaucTsu', 'ツ', 65, 121],
                ['kanaucTe', 'テ', 81, 121],
                ['kanaucTo', 'ト', 97, 121],
                ['kanaucRa', 'ラ', 113, 121],
                ['kanaucRi', 'リ', 129, 121],
                ['kanaucRu', 'ル', 145, 121],
                ['kanaucRe', 'レ', 161, 121],
                ['kanaucRo', 'ロ', 177, 121],
                ['kanaucWa', 'ワ', 193, 121],
                ['kanaucWo', 'ヲ', 209, 121],
                ['SPACE', ' ', 81, 145, 109, 13]
            ],
            lc: []
        },
        currentKb: 'kya',
        currentCase: 'uc',
        invertCase: false
    };

    // Fixed keys
    keys.fixed = [
        ['ESCAPE', 'Escape', 1, 49, 21, 21],
        ['BACKSPACE', 'Backspace', 233, 49, 21, 21],
        ['ENTER', 'Enter', 225, 121, 29, 21],
        ['Shiftfalse', 'Shift', 1, 121, 29, 21],
        [keys.currentCase + 'Caps', 'CapsLock', 1, 145, 13, 13],
        ['kya' + (keys.currentKb === 'kya' ? (keys.invertCase ? ((keys.currentCase === uc) ? 'lc' : 'uc') : keys.currentCase) : ''), 'kya', 25, 145, 13, 13],
        ['kym' + (keys.currentKb === 'kym' ? (keys.invertCase ? ((keys.currentCase === uc) ? 'lc' : 'uc') : keys.currentCase) : ''), 'kym', 41, 145, 13, 13],
        ['kyk' + (keys.currentKb === 'kyk' ? (keys.invertCase ? ((keys.currentCase === uc) ? 'lc' : 'uc') : keys.currentCase) : ''), 'kyk', 57, 145, 13, 13]
    ];

    // PNL keys
    var buttons = [
        ['ARROWUP', 'ArrowUp', 161, 169, 21, 21], // image name, keydown id, x from left, y from top, width, height
        ['ARROWDOWN', 'ArrowDown', 185, 169, 21, 21],
        ['ARROWLEFT', 'ArrowLeft', 209, 169, 21, 21],
        ['ARROWRIGHT', 'ArrowRight', 233, 169, 21, 21],
        ['HELP', 'helpBtn', 1, 170, 30, 19],
    ];


    // Display selected keyboard/case
    var drawKeys = function(kb, kbcase) {
        var key, keyId, img, x, y, width, height;

        // delete old keys
        kbDiv.textContent = '';

        // draw selected keys (keypress)
        keys[kb][kbcase].forEach(function(cur) {
            key = document.createElement('button');
            img = 'url(' + keyDir + cur[0] + '.png)';
            keyId = cur[1];
            x = cur[2] + 'px';
            y = cur[3] + 'px';
            width = cur[4] + 'px';
            height = cur[5] + 'px';

            key.classList.add('pnlKey');
            key.setAttribute('keyId', keyId);
            key.style.backgroundImage = img;
            key.style.left = x;
            key.style.top = y;
            key.style.width = width;
            key.style.height = height;

            kbDiv.appendChild(key);
        });

        // draw fixed keys (keydown)
        keys.fixed[5][0] = 'kya' + (keys.currentKb === 'kya' ? (keys.invertCase ? ((keys.currentCase === 'uc') ? 'lc' : 'uc') : keys.currentCase) : '');
        keys.fixed[6][0] = 'kym' + (keys.currentKb === 'kym' ? (keys.invertCase ? ((keys.currentCase === 'uc') ? 'lc' : 'uc') : keys.currentCase) : '');
        keys.fixed[7][0] = 'kyk' + (keys.currentKb === 'kyk' ? (keys.invertCase ? ((keys.currentCase === 'uc') ? 'lc' : 'uc') : keys.currentCase) : '');
        keys.fixed.forEach(function(cur) {
            key = document.createElement('button');
            img = 'url(' + keyDir + cur[0] + '.png)';
            keyId = cur[1];
            x = cur[2] + 'px';
            y = cur[3] + 'px';
            width = cur[4] + 'px';
            height = cur[5] + 'px';

            key.classList.add('pnlKeyFixed');
            key.setAttribute('keyId', keyId);
            key.style.backgroundImage = img;
            key.style.left = x;
            key.style.top = y;
            key.style.width = width;
            key.style.height = height;

            kbDiv.appendChild(key);
        });
    };

    // Display PNL buttons
    var drawBtn = function() {
        var btn, btnId, img, x, y, width, height;

        buttons.forEach(function(cur) {
            btn = document.createElement('button');
            img = 'url(' + btnDir + cur[0] + '.png)';
            btnId = cur[1];
            x = cur[2] + 'px';
            y = cur[3] + 'px';
            width = cur[4] + 'px';
            height = cur[5] + 'px';

            btn.classList.add('pnlBtn');
            btn.setAttribute('btnId', btnId);
            btn.style.backgroundImage = img;
            btn.style.left = x;
            btn.style.top = y;
            btn.style.width = width;
            btn.style.height = height;

            btnDiv.appendChild(btn);
        });
    };

    // Toggle upper/lowercase
    var switchCase = function() {
        if (!keys.invertCase) {
            switch(keys.currentCase) {
                case 'uc':
                    keys.currentCase = 'lc';
                    break;
                case 'lc':
                    keys.currentCase = 'uc';
                    break;
            }
        } else {
            keys.invertCase = false;
            keys.fixed[3][0] = 'Shift' + keys.invertCase;
        }

        keys.fixed[4][0] = keys.currentCase + 'Caps';
        drawKeys(keys.currentKb, keys.currentCase);
    };

    // Toggle shift key
    var shiftCase = function() {
        var tempCase;

        keys.invertCase = !keys.invertCase;

        if (keys.invertCase) {
            switch(keys.currentCase) {
                case 'uc':
                    tempCase = 'lc';
                    break;
                case 'lc':
                    tempCase = 'uc';
                    break;
            }
        } else {
            tempCase = keys.currentCase;
        }

        keys.fixed[3][0] = 'Shift' + keys.invertCase;
        keys.fixed[4][0] = tempCase + 'Caps';
        drawKeys(keys.currentKb, tempCase);
    };


    // A very poggers PNL key/button handler :)
    div.addEventListener('mousedown', function(e) {
        event.preventDefault();
        var clickedElement = e.target;

        var keyId, keyEvent;
        switch(clickedElement.getAttribute('class')) {
            case 'pnlKey':
                keyId = clickedElement.getAttribute('keyId');

                if (keyId !== 'NONE') {
                    keyEvent = new KeyboardEvent('keypress', {key: keyId});
                    document.dispatchEvent(keyEvent);

                    if (keys.invertCase) {
                        shiftCase();
                    }
                }
                runMode.beep(9);
                break;

            case 'pnlKeyFixed':
                keyId = clickedElement.getAttribute('keyId');

                switch(keyId) {
                    case 'Escape':
                        //
                        break;

                    case 'CapsLock':
                        switchCase();
                        break;

                    case 'Shift':
                        shiftCase();
                        break;

                    case 'kya':
                        keys.currentKb = 'kya';
                        keys.currentCase = 'uc';
                        keys.invertCase = false;
                        keys.fixed[3][0] = 'Shiftfalse';
                        keys.fixed[4][0] = 'ucCaps';
                        drawKeys('kya', 'uc');
                        break;

                    case 'kym':
                        keys.currentKb = 'kym';
                        keys.currentCase = 'uc';
                        keys.invertCase = false;
                        keys.fixed[3][0] = 'Shiftfalse';
                        keys.fixed[4][0] = 'ucCaps';
                        drawKeys('kym', 'uc');
                        break;

                    case 'kyk':
                        keys.currentKb = 'kyk';
                        keys.currentCase = 'uc';
                        keys.invertCase = false;
                        keys.fixed[3][0] = 'Shiftfalse';
                        keys.fixed[4][0] = 'ucCaps';
                        drawKeys('kyk', keys.currentCase);
                        break;

                    default:
                        keyEvent = new KeyboardEvent('keydown', {key: keyId});
                        document.dispatchEvent(keyEvent);

                        if (keys.invertCase) {
                            shiftCase();
                        }
                }
                runMode.beep(9);
                break;

            case 'pnlBtn':
                var btnId = clickedElement.getAttribute('btnId');

                switch(btnId) {
                    case 'helpBtn':
                        open('./commands.html');
                        break;

                    default:
                        keyEvent = new KeyboardEvent('keydown', {key: btnId});
                        document.dispatchEvent(keyEvent);
                }
                break;
        }

        clickedElement.blur();
    });

    document.addEventListener('mouseup', function(e) {
        var keysDown = ['','','','','','','','','','','','','','','',
        '','','','','','','','','','','','','','','','',
        'Space','!','"','#','$','%','&','\'','(',')','*','+',',','-','.','/',
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
        '','','','','','','','','','','','','','','','',
        'Enter','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab','Shift','CapsLock'];

        keysDown.forEach(function(cur) {
            var keyEvent = new KeyboardEvent('keyup', {key: cur});
            document.dispatchEvent(keyEvent);
        });
    });


    console.log('[PTC.js] PNL controller loaded');


    return {

        imageCache: imageCache,

        getKeys: function() {
            return keys;
        },

        drawKeys: drawKeys,
        drawBtn: drawBtn,
        switchCase: switchCase,

        init: function() {
            pnl.imageCache();
            pnl.drawKeys(pnl.getKeys().currentKb, pnl.getKeys().currentCase);
            pnl.drawBtn();
        }

    };
    
})();



var inputHandler = (function() { // unused for now...

    window.onblur = function() { // clear pressed buttons/keys when away from page
        pressedButtons = 0;
    };

    var buttonCodes = {
        ArrowUp: [1, false],
        ArrowDown: [2, false],
        ArrowLeft: [4, false],
        ArrowRight: [8, false],
        Z: [16, false],
        X: [32, false],
        A: [64, false],
        S: [128, false],
        Q: [256, false],
        W: [512, false],
        Enter: [1024, false]
    };
    var pressedButtons = 0;

    var checkPressedButtons = function() {
        pressedButtons = 0;
        for (var prop in buttonCodes) {
            if (buttonCodes[prop][1]) pressedButtons += buttonCodes[prop][0];
        }
    };


    document.addEventListener('keydown', function(e) {
        var key = e.key.length < 2 ? e.key.toUpperCase() : e.key;

        if (buttonCodes[key]) {
            buttonCodes[key][1] = true;
            checkPressedButtons();
        }
    });

    document.addEventListener('keyup', function(e) {
        var key = e.key.length < 2 ? e.key.toUpperCase() : e.key;

        if (buttonCodes[key]) {
            buttonCodes[key][1] = false;
            checkPressedButtons();
        }
    });


    console.log('[PTC.js] inputHandler loaded');

    
    return {

        getButtons: function() {
            return pressedButtons;
        },

        mapButton: function(btnId, key) {
            key = key.length < 2 ? key.toUpperCase() : key;
            if (buttonCodes[key]) return 'Key is already mapped to another button ID!';
            for (var prop in buttonCodes) {
                if (buttonCodes[prop][0] === btnId) {
                    buttonCodes[key] = buttonCodes[prop];
                    delete buttonCodes[prop];
                    return 'Successfully mapped key "' + key + '" to button ID ' + btnId;
                }
            }
            return 'Button ID does not exist!';
        },

        getButtonMap: function() {
            return buttonCodes;
        }

    }

})();



setTimeout(function() {
    pnl.init(); // default keyboard
}, 250);

setTimeout(function() {
    runMode.init(); // console welcome screen
    inputMode.init();
}, 750)


// 1300 lines. Of which 300 are arrays for the PNL keyboard :/
