// Setup Basic info
expName = 'SoundStair';
expInfo = {
    'participant': '',
    'session': '001'};
var person = prompt("请输入姓名/缩写", "test001");

if (person == null || person == "") {
  person = "test001"; // some default name.
}

document.getElementById('name').innerText = person;
expInfo['participant'] = person;
expInfo['date'] = Date.now(); // add a simple timestamp
expInfo['expName'] = expName;

endExpNow = false; // flag for 'escape' or other condition => quit the exp
var startTime = Date.now();
var context = new AudioContext();


var config = {
    'ref1' : 262,
    'ref2': 392,
    'ref3': 369.99,
    'ref4': 554.37,
    'delta_start': 110.8,
    'start_level': 25,
    'min_level': 1,
    'max_level': 32,
    'rev_max1': 4,
    'rev_max2': 8,
    'step_size1': 2,
    'step_size2': 1
}

// initialization of count and new level flag
var rev_count = 0;
var new_level = 0;
var curr_ans = 0;
var delta_freq = config['delta_start'];
var trialNum = 0;
var level = config['start_level'];
var complex = false;
var block = 1;
var corrAns = 0;
var prev_slope = -1; // Initially assume they will be going down
var slope = -1; // Initially assume they will be going down
var reversal = 0;
var step_size = 0;
var threshold = 0;


var trialData = [];

var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');
button1.disabled = true;
button2.disabled = true;

button1.addEventListener('click', ev => handleResponse(1), false);
button2.addEventListener('click', ev => handleResponse(2), false);


var runStart = Date.now();
var runPrev = Date.now();
var firstRun = 1;
var blockData = Array();

function runTrials() {
    document.querySelector('.controls-main').style.display='none';
    // complex = document.getElementById('complex').checked;

    if (rev_count >= config['rev_max1'] + config['rev_max2']) {
        //End currently running trial and save data.

        addDataToBlock(trialNum);
        trialData.push(blockData);
        // End the trial
        alert("实验结束，请下载csv文件，并记录页面下方的阈值数据。");
        printGoodBye();


        // Start New Block
        block++;
        blockData = new Array();
        document.querySelector('.controls-main').style.display='block';
        document.querySelector('.controls-sub').style.display='none';
        rev_count = 0;
        new_level = 0;
        curr_ans = 0;
        delta_freq = config['delta_start'];
        trialNum = 0;
        level = config['start_level'];
        // document.getElementById('complex').disabled = false;
        button1.disabled = true;
        button2.disabled = true;


    } else {
        trialNum++;
        if (firstRun == 1) {
            //This is the first run of the block;
            runStart = Date.now();
            runPrev = Date.now();
            firstRun = 0;
            prevLevel = level;
        } else {
           // Keep track of running time for each trial
           addDataToBlock(trialNum -1);
           getNewFreq();
        }
        // document.getElementById('complex').disabled = true;
        document.querySelector('.controls-sub').style.display='block';
        var updateText = "Trial: " + trialNum + " Complex: " + complex;
        var updateText = "Trial: " + trialNum;
        document.querySelector('.controls-sub').innerText = updateText;
        runTrial(trialNum);
    }
}

function addDataToBlock(trialNo) {
    runPrev = runStart;
    runStart = Date.now();

    runData = {
        'subject': expInfo['participant'],
        'block': block,
        'trialNum': trialNo,
        'currlevel': delta_freq,
        'corrAns': corrAns,
        'curr_ans': curr_ans,
        'reversal': reversal
    }
    prevLevel = level;
    blockData.push(runData);
}

function playSounds1(f1, f2, f3, f4) {

    const oscillator = new Tone.Oscillator({
        "type": "sine",
        "frequency": f1
    }).toMaster();
    if (complex) {
        oscillator.partials = [0, 0,25, 0,25, 0.25, 0.25];
    }
    /*const ampEnv = new Tone.Envelope({
        "attack": 0.01,
        "decay": 0.02,
        "sustain": 0.5,
        "release": 0.02
    }).toMaster();*/
    oscillator.start("+0.0");
    oscillator.stop("+0.5");

    const oscillator1 = new Tone.Oscillator({
        "type": "sine",
        "frequency": f2}).toMaster();


    if (complex) {
        oscillator1.partials = [0, 0,25, 0,25, 0.25, 0.25];
    }
    oscillator1.start("+1.0");
    oscillator1.stop("+1.5");
    const oscillator3 = new Tone.Oscillator({
        "type": "sine",
        "frequency": f3
    }).toMaster();
    if (complex) {
        oscillator3.partials = [0, 0,25, 0,25, 0.25, 0.25];
    }
    oscillator3.start("+2.0");
    oscillator3.stop("+2.5");
    const oscillator4 = new Tone.Oscillator({
        "type": "sine",
        "frequency": f4
    }).toMaster();
    if (complex) {
        oscillator4.partials = [0, 0,25, 0,25, 0.25, 0.25];
    }
    oscillator4.start("+3.0");
    oscillator4.stop("+3.5");

}

function calculate_threshold() {
    var data = trialData[block-1];
    var rev = 0;
    var ans = 1.0;
    var i = 1.0;
    data.forEach(function(row) {
        if (row['reversal']==1) {
            rev++;
            if (rev > config['rev_max1']) {
                ans *= row['currlevel'];
                i++;
                console.log("answer:" + row['currlevel']);
            }
        }
    });

    threshold = Math.pow(ans, 1/(i-1)); // Since we started with i = 1;

}

function getNewFreq() {
    if (new_level == 0 ) {
        // Calculate new level.
        if (slope == 1) {
            level += step_size;
            if ( level > config['max_level']) {
                level = config['max_level'];
            }
        }
        if (slope == -1) {
            level -= step_size;
            if ( level < config['min_level']) {
                level = config['min_level'];
            }
        }
    }
}

function printGoodBye()  {
    var endDate = Date.now();
    var time_taken = endDate - startTime;
    calculate_threshold();
    var updateText = "<tr>\n";
    updateText += "<td>" + block + "</td>\n";
    updateText += "<td>" + expInfo['participant'] + "</td>\n";
    // updateText += "<td>" + complex + "</td>\n";
    updateText += "<td>" + threshold + "</td>\n";
    updateText += "<td>" + trialNum + "</td>\n";
    // updateText += "<td><button onclick='download_csv("
    //     + block + "," + complex + ")'>Download CSV</button></td>\n";
    updateText += "<td><button onclick='download_csv("
            + block + ")'>Download CSV</button></td>\n";
    updateText += "</tr>\n";
    document.getElementById('results').innerHTML += updateText;
}


function runTrial(trialNum) {
    // Determine the frequency delta
    button1.disabled = true;
    button2.disabled = true;
    ref1 = 262;
    ref2 = 392;
    ref3 = 370;
    ref4 = 554;

    //getNewFreq();
    delta_freq = config['delta_start'] / Math.pow(Math.sqrt(2),(25-level));
    freq1 = ref1;
    freq2 = ref2;
    freq3= ref3;
    freq4 = ref4 + delta_freq;
    // curr_ans = 2;
    // if (Math.random() > 0.5) {
    //     freq1 = ref;
    //     freq2 = ref + delta_freq;
    //     curr_ans = 2;
    // } else {
    //     freq2 = ref;
    //     freq1 = ref + delta_freq;
    //     curr_ans = 1;
    // }
    // curr_ans = 2;
    if (Math.random() > 0.5) {
        playSounds1(freq1, freq2, freq3, freq4);
        // freq4 = ref4 + delta_freq;
        curr_ans = 2;

    } else {
        playSounds1(freq3, freq4, freq1, freq2);
        curr_ans = 1;
    }
    // playSounds1(freq1, freq2);
    // After the sound is played, enable the buttons;
    button1.disabled = false;
    button2.disabled = false;
}


/*

Initial slope     CorrAnswerNew      Slope      Reversal
down                yes             zero            no
down                no              up              yes
up                  yes             down            yes
up                  no              up              n
zero                no              up


*/
function handleResponse(answer) {
    if (curr_ans == 0) {
        alert('inCorrect ');
        return;
    }
    prev_slope = slope;
    if (answer == curr_ans) {
        corrAns = 1;
        // They were right apply the two down one up
        if (new_level == 0) { // First time they are right
            new_level = 1;
        } else {
            new_level = 0; // Second time they are right
            slope = -1;
        }
    } else {
        corrAns = 0;
        // They were wrong so reverse the direction
        slope = 1;
        new_level = 0;

    }

    if (prev_slope != slope) {
        reversal = 1;
        rev_count ++;
    } else {
        reversal = 0;
    }
    if (rev_count < config['rev_max1']) {
        step_size = config['step_size1'];
    } else {
        step_size = config['step_size2'];
    }

    runTrials();
}

function download_csv(num, cmplx) {
    var csv = 'Subject,Block,Trial No,Delta-f,Correct?,Answer,Reverse?\n';
    trialData[num-1].forEach( function(row) {
            csv += [
            row['subject'],
            row['block'],
            row['trialNum'],
            row['currlevel'],
            row['corrAns'],
            row['curr_ans'],
            row['reversal']].join(',');
            csv += "\n";
    });
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    filename = expInfo['participant'] + '_' + num;
    filename += (cmplx) ? '_complex' : '_pure';
    hiddenElement.download = filename + '.csv';
    hiddenElement.click();
}
