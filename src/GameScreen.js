import device;
import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;
import src.MoleHill as MoleHill;


var score = 0,
		high_score = 19,
		hit_value = 1,
		mole_interval = 600,
		game_on = false,
		game_length = 20000, //20 secs
		countdown_secs = game_length / 1000,
		lang = 'zh';

exports = Class(ui.View, function(supr){

	this.init = function(opts){
		opts = merge(opts, {
			x: 0,
		    y: 0,
		    width: 320,
		    height: 480,
		    backgroundColor: '#37B34A'
		  });

		  supr(this, 'init', [opts]);

		  this.build();

	};

	this.build = function(){

		this.on('app:start', bind(this, start_game_flow));

		this._scoreboard = new ui.TextView({
			superview: this,
			x:0,
			y:15,
			width:device.width,
			height:50,
			autoSize:false,
			size:38,
			verticalAlign: 'middle',
    		textAlign: 'center',
    		multiline: false,
    		color: '#fff'
		});

		this._countdown = new ui.TextView({
		    superview: this._scoreboard,
		    visible: false,
		    x: 260,
		    y: -5,
		    width: 50,
		    height: 50,
		    size: 24,
		    color: '#fff',
		    opacity: 0.7
		});

		var x_offset = 5;
		var y_offset = 160;
		var y_pad = 25;
		var layout = [[1, 0, 1], [0, 1, 0], [1, 0, 1]];

		this.style.width = 320;
		this.style.height = 480;

		this._molehills = [];

		for (var row = 0, len = layout.length; row < len; row++) {
			for (var col = 0; col < len; col++) {
				if (layout[row][col] !== 0) {
					var molehill = new MoleHill();
					molehill.style.x = x_offset + col * molehill.style.width;
					molehill.style.y = y_offset + row * (molehill.style.height + y_pad);
					this.addSubview(molehill);
					this._molehills.push(molehill);

					//update score on hit event
					molehill.on('molehill:hit', bind(this, function () {
						if (game_on) {
							score = score + hit_value;
							this._scoreboard.setText(score.toString());
						}
					}));
				}
			}
		}

	};

	


});

function start_game_flow(){
	var that = this;

	animate(that._scoreboard).wait(1000)
		.then(function(){that._scoreboard.setText(text.READY);})
		.wait(1500).then(function(){that._scoreboard.setText(text.SET);})
		.wait(1500).then(function(){
			that._scoreboard.setText(text.GO);

			game_on = true;
			play_game.call(that);
		})
}

function play_game () {
	var i = setInterval(bind(this, update_countdown), 1000);
	var j = setInterval(tick.bind(this), mole_interval); // 定时弹鼹鼠
	//when the game is up reset all timers, flags and countdown
	setTimeout(bind(this, function () {
	    game_on = false;
	    clearInterval(i);
	    clearInterval(j);
	    setTimeout(bind(this, end_game_flow), mole_interval * 2);
	    this._countdown.setText(":00");
	  }), game_length);

	setTimeout(bind(this, function () {
		this._scoreboard.setText(score.toString());
		this._countdown.style.visible = true;
	}), game_length * 0.25); // 每5秒更新一次

	//Running out of time! Set countdown timer red.
	setTimeout(bind(this, function () {
		this._countdown.updateOpts({color: '#CC0066'});
	}), game_length * 0.75);
}

/* Pick a random, non-active, mole from our molehills.
 */
function tick () {
	var len = this._molehills.length,
			molehill = this._molehills[Math.random() * len | 0];

	while (molehill.activeMole) {
		molehill = this._molehills[Math.random() * len | 0];
	}
	molehill.showMole();
}

function update_countdown () {
  countdown_secs -= 1;
  this._countdown.setText(":" + (("00" + countdown_secs).slice(-2)));
}

function emit_endgame_event () {
  this.once('InputSelect', function () {
    this.emit('gamescreen:end');
    reset_game.call(this);
  });
}

function end_game_flow () {
	var isHighScore = (score > high_score),
			end_msg = get_end_message(score, isHighScore);

	this._countdown.setText(''); //clear countdown text
	//resize scoreboard text to fit everything
	this._scoreboard.updateOpts({
		text: '',
		x: 10,
		fontSize: 17,
		verticalAlign: 'top',
		textAlign: 'left',
		multiline: true
	});

	//check for high-score and do appropriate animation
	if (isHighScore) {
		high_score = score;
		this._molehills.forEach(function (molehill) {
			molehill.endAnimation();
		});
	} else {
		var i = (this._molehills.length-1) / 2 | 0; //just center mole
		this._molehills[i].endAnimation(true);
	}

	this._scoreboard.setText(end_msg);

	setTimeout(bind(this, emit_endgame_event), 2000);
}

function get_end_message (score, isHighScore) {
	var moles = (score === 1) ? text.MOLE : text.MOLES,
			end_msg = text.END_MSG_START + ' ' + score + ' ' + moles + '.\n';

	if (isHighScore) {
		end_msg += text.HIGH_SCORE + '\n';
	} else {
		//random taunt
		var i = (Math.random() * text.taunts.length) | 0;
		end_msg += text.taunts[i] + '\n';
	}
	return (end_msg += text.END_MSG_END);
}

/* Reset game counters and assets.
 */
function reset_game () {
	score = 0;
	countdown_secs = game_length / 1000;
	this._scoreboard.setText('');

	//重置鼹鼠
	this._molehills.forEach(function (molehill) {
		molehill.resetMole();
	});

	this._scoreboard.updateOpts({
		x: 0,
		fontSize: 38,
		verticalAlign: 'middle',
		textAlign: 'center',
		multiline: false
	});
	this._countdown.updateOpts({
		visible: false,
		color: '#fff'
	});
	
}


var localized_strings = {
	en: {
		READY: "Ready ...",
		SET: "Set ...",
		GO: "Whack that Mole!",
		MOLE: "mole",
		MOLES: "moles",
		END_MSG_START: "You whacked",
		END_MSG_END: "Tap to play again",
		HIGH_SCORE: "That's a new high score!"
	},
	zh: {
		READY: "准备好了吗 ...",
		SET: "拿好你的武器 ...",
		GO: "小心！怪兽正在来临!",
		MOLE: "怪兽",
		MOLES: "怪兽",
		END_MSG_START: "游戏结束了!",
		END_MSG_END: "点击，重玩",
		HIGH_SCORE: "你是非人类吗!破纪录了"
	}
};

localized_strings['zh'].taunts = [
	"欢迎来到summit的游戏世界.", //max length
	"你太水了!",
	"你永远也不会抓到我!",
	"人类，我们会记住你的.",
	"玩游戏也不要忘记和家人一起吃饭o~.",
	"仅是按一下屏幕，并没有那么难吧.",
	"很不幸，你是我见过最笨的玩家.",
	"你正在浪费我的时间.",
	"不要埋怨这位猪一样的队友，是游戏的问题.",
	"快滚回你的地球!"
];

localized_strings['en'].taunts = [
	"Welcome to Loserville, population: you.", //max length
	"You're an embarrassment!",
	"You'll never catch me!",
	"Your days are numbered, human.",
	"Don't quit your day job.",
	"Just press the screen, it's not hard.",
	"You might be the worst I've seen.",
	"You're just wasting my time.",
	"Don't hate the playa, hate the game.",
	"Make like a tree, and get out of here!"
];

//object of strings used in game
var text = localized_strings[lang.toLowerCase()];