var sound1 = 'A';//sound_1 = sound.Sound('A', secs=0.2, stereo=True)
var level = 25; // be careful to set this - it's not 66 Hz. It's a level index where every number differs frequency by a factor of sqrt(2) 
var level_min = 1;
var level_max = 37;
//the number of reversal (1)
var rev_count_max1 = 4;
//the number of reversal (2)
var rev_count_max2 = 8;
//step_size (1)
var step_size1 = 2;// because files are made for steps by a factor of sqrt(2), 2 step jump is factor of 2
//step_size (2)
var step_size2 = 1;

// initialization of count and new level flag
var rev_count = 0;
var prev_corr = 0;
var new_level = 1;
var slope = -1;

var trial_end = False;


function startTest() {
	//alert("hello");
	/*var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

	gainNode.gain.value = 1.0;
	oscillator.connect(gainNode);
	gainNode.connect(audioCtx.destination);
	oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
	//oscillator.start();
    oscillator.frequency.setValueAtTime(840, audioCtx.currentTime+0.5);*/


	//oscillator.stop(audioCtx.currentTime + 0.75); 
	count = 1;

	var osc = new Tone.Oscillator(600, "sine").toMaster().start();
	osc.partials = [1, 0.2, 0.2, 0.1];
	osc.start();
	osc.stop(+0.5);
	console.log('here2');

	var osc1 = new Tone.Oscillator(600, "sine").toMaster().start();
	//osc.partials = [1, 0.5, 0.2, 0.1];
	osc1.start(+5.0);
	osc1.stop(+5.5);
	console.log('here1');
	//updateText();
}