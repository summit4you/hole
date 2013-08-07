import device;
import ui.StackView as StackView;

import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;
import src.soundcontroller as soundcontroller;

exports = Class(GC.Application, function () {

	this.initUI = function () {
		
		this.view.style.backgroundColor = '#30B040';

		var titlescreen = new TitleScreen();
		var gamescreen = new GameScreen();

		var rootView = new StackView({
	      superview: this,
	      x: device.width / 2 - 160,
	      y: device.height / 2 - 240,
	      width: 320,
	      height: 480,
	      clip: true,
	      backgroundColor: '#37B34A'
	    });
	
	    rootView.push(titlescreen);

	    var sound = soundcontroller.getSound();

	    titlescreen.on('titlescreen:start', function () {
		  //...
		  sound.play('levelmusic');
		  console.log(sound);
		  rootView.push(gamescreen);
		  gamescreen.emit('app:start');
		});

		gamescreen.on('gamescreen:end', function () {
		  sound.stop('levelmusic');
	      rootView.pop();
	    });


	};
	
	this.launchUI = function () {};
});
