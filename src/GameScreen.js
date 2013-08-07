import device;
import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;

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
	//when the game is up reset all timers, flags and countdown
	setTimeout(bind(this, function () {
	    game_on = false;
	    clearInterval(i);
	    setTimeout(bind(this, end_game_flow), mole_interval * 2);
	    this._countdown.setText(":00");
	  }), game_length);
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
	setTimeout(bind(this, emit_endgame_event), 2000);
}

/* Reset game counters and assets.
 */
function reset_game () {
	score = 0;
	countdown_secs = game_length / 1000;
	this._scoreboard.setText('');
	
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
		MOLE: "mole",
		MOLES: "moles",
		END_MSG_START: "You whacked",
		END_MSG_END: "Tap to play again",
		HIGH_SCORE: "That's a new high score!"
	}
};

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