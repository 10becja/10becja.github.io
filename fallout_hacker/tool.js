/*
	Fallout Hacker Helper

	This tool should help you pick the correct password for terminals in
	the fallout games.
*/

var _playSounds = false;

var soundBits = 
[
	'sounds/k0.ogg',
	'sounds/k1.ogg',
	'sounds/k2.ogg',
	'sounds/k3.ogg',
	'sounds/k4.ogg',
	'sounds/k5.ogg',
	'sounds/k6.ogg',
	'sounds/k7.ogg',
	'sounds/k8.ogg',
	'sounds/k9.ogg'
];

var words = [];
var wordObjs = [];
var best = {};

var curLine = 0;
var maxLines = 5;
var textSpeed_min = 25;
var textSpeed_max = 60;

var caretSpeed = 500;
var choiceSpeed = 500;

var btnFlashSpeed = 150;

function randomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playSound(sound){
	if(_playSounds){
		var a = new Audio(sound);
		a.play();
	}
}

function playRandomTypeNoise(){
	var s_idx= Math.floor(Math.random() * soundBits.length);
	playSound(soundBits[s_idx]);
}

function writeToScreen(elem, msg, idx, callback){
	if(idx < msg.length){	
		playRandomTypeNoise();
		elem.append(msg[idx++]);
		setTimeout(function(){
			writeToScreen(elem, msg, idx, callback);
		},randomInt(textSpeed_min, textSpeed_max));
	}
	else if(callback){
		callback();
	}
}

function loadWords(){
	var rawWords = $("#wordBox").val();
	if(!words)
		words = rawWords.split('\n');
	convertToObj();
	$("#wordBoxWrapper").hide(100, displayBestChoice("The best choice for you to pick is:"));
	$("#num-grid").show();
}

function convertToObj(){
	words.forEach(function(word){
		obj = {key: word, likeness: {}, maxLike: 0};
		words.forEach(function(other){
			if(word === other)
				return;
			obj.likeness[other] = 0;
			for(var i = 0; i < other.length; i++){
				if(word[i] === other[i])
					obj.likeness[other] += 1;
			}
		});

		obj.maxLike = Math.max(...Object.values(obj.likeness));
		wordObjs.push(obj);
	});
}

function displayBestChoice(msg){
	var fdbk = $("#feedback");

	if((curLine + 1) % maxLines === 0){
		$("#line-0").remove();
	}

	best = getBestChoice();

	for(var i = 1; i <= 9; i++){
		$("#btn-" + i).prop("disabled", !Object.values(best.likeness).includes(i));
	}


	$(".curBest").show().removeClass("curBest");

	var line = $("<p id='line-" + curLine + "' class='line'>&gt;&nbsp;</p>");

	writeToScreen(line, msg, 0, function(){
		setTimeout(function(){
			line.append($("<div class='bestChoice curBest'>"+best.key+"</div>"));
		}, 250);
	});

	fdbk.append(line);
}

function getBestChoice(){
	if(wordObjs.length === 1)
		return wordObjs[0];
	return wordObjs.reduce((a, b) => a.maxLike > b.maxLike ? a : b);
}

function pickNextChoice(curChoice, likeness){
	matching_wordObjs = [];
	matching_words = [];

	wordObjs.forEach(function(wordObj){
		if(curChoice.key != wordObj.key && curChoice.likeness[wordObj.key] == likeness){
			matching_wordObjs.push(wordObj);
			matching_words.push(wordObj.key);
		}
	});

	matching_wordObjs.forEach(function(mw){
		Object.keys(mw.likeness).forEach(function(key){
			if(!matching_words.includes(key))
				delete mw.likeness[key]
		});
		mw.maxLike = mw.likeness ? Math.max(...Object.values(obj.likeness)) : 1000;
	});

	wordObjs = matching_wordObjs;

	return getBestChoice();
}

function pickLikeness(like, btn){
	playSound("sounds/kenter.ogg");

	$(btn).addClass("btn-flash", btnFlashSpeed)
		   .removeClass("btn-flash", btnFlashSpeed)
		   .addClass("btn-flash", btnFlashSpeed)
		   .removeClass("btn-flash", btnFlashSpeed)
		   .addClass("btn-flash", btnFlashSpeed)
		   .removeClass("btn-flash", btnFlashSpeed, function(){
				best = pickNextChoice(best, like);
				if(wordObjs.length > 1)
					displayBestChoice("The next word you should try is:");
				else{
					displayBestChoice("The only word left is:");
					$("#btn-dud").prop("disabled", true);
				}
		   });
}

$(document).ready(function(){

	playSound("sounds/poweron.ogg");

	$('#wordBox').focus();

	var welcome = $("#welcome");

	setTimeout(function(){
		var line = $("<p class='line'>&gt;&nbsp;</p>");
		var msg = "Welcome to IlliniDev's Fallout Terminal Hacker Helper."
		welcome.append(line);
		writeToScreen(line, msg, 0, function(){
			setTimeout(function(){
				var line2 = $("<p class='line'>&gt;&nbsp;</p>");
				var msg2 = "To start, enter all password options seperated by a new line in the gray area below."
				welcome.append(line2);
				writeToScreen(line2, msg2, 0, function(){
					setTimeout(function(){
						var line3 = $("<p class='line'>&gt;&nbsp;</p>");
						var msg3 = "Once you are done, use the 'Load Words' button and you will be given the first word to try."
						welcome.append(line3);
						writeToScreen(line3, msg3, 0);
					}, 250);
				});
			}, 250);
		});
	}, 250);

	$("#wordBox").keyup(function(){
		var keyed = $(this).val().replace(/\n/g, '<br/>');
		$("#fakeWordBox .words").html(keyed);
	});

	setInterval(function(){
		var caret = $("#caret");
		if(caret.is(":visible"))
			caret.hide();
		else
			caret.show();
	}, caretSpeed);

	setInterval(function(){
		var curBest = $(".curBest");
		if(curBest.length){
			if(curBest.is(":visible"))
				curBest.hide();
			else
				curBest.show();
		}
	}, choiceSpeed);
});