import device;
import ui.StackView as StackView;

import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;

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

	    titlescreen.on('titlescreen:start', function () {
		  //...
		  rootView.push(gamescreen);
		  gamescreen.emit('app:start');
		});

		gamescreen.on('gamescreen:end', function () {
	      rootView.pop();
	    });


	};
	
	this.launchUI = function () {};
});
