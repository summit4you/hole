import animate;
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var mole_normal_img = new Image({url: "resources/images/mole_normal.png"}),
		mole_hit_img = new Image({url: "resources/images/mole_hit.png"}),
		hole_back_img = new Image({url: "resources/images/hole_back.png"}),
		hole_front_img = new Image({url: "resources/images/hole_front.png"}),
		mole_up = 5,
		mole_down = 35;

exports = Class(ui.View, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			width:	hole_back_img.getWidth(),
			height: hole_back_img.getHeight() + mole_normal_img.getHeight()
		});

		supr(this, 'init', [opts]);

		this.activeMole = false;
		this.activeInput = false;

		this.build();
	};

	this.build = function () {

		var hole_back = new ui.ImageView({
			superview: this,
			image: hole_back_img,
			x: 0,
			y: 25,
			width: hole_back_img.getWidth(),
			height: hole_back_img.getHeight()
		});

		this._inputview = new ui.View({
			superview: this,
			clip: true,
			x: hole_back_img.getWidth()/2 - mole_normal_img.getWidth()/2,
			y: 0,
			width: mole_normal_img.getWidth(),
			height: 40
		});

		this._moleview = new ui.ImageView({
			superview: this._inputview,
			image: mole_normal_img,
			x: 0,
			y: mole_down,
			width: mole_normal_img.getWidth(),
			height: mole_normal_img.getHeight()
		});

		var hole_front = new ui.ImageView({
			superview: this,
			canHandleEvents: false,
			image: hole_front_img,
			x: 0,
			y: 25,
			width: hole_front_img.getWidth(),
			height: hole_front_img.getHeight()
		});
	};

});