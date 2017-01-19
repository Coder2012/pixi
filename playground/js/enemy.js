import PhysicsSprite from './physicsSprite.js';
import consts from './matterConsts.js';

class Enemy extends PhysicsSprite {
	constructor(id, engine, category) {
		super(id, engine, category);

		this._health = 120;
	}

	init(x, y, width, height, texture, type) {
		super.init(x, y, width, height, texture, type)
	}

	damage() {
		if(this._health > 0) {
			this._health -= 10;
			let tint = (parseInt(this.sprite.tint) - parseInt(0x001111)).toString(16);
			this.sprite.tint = '0x' + tint;
			console.log(this.sprite.tint);
		}else{
			console.log('enemy destroyed');
			this.sprite.tint = 0xff0000;
			this.destroy();
		}
	}

	update() {
		super.update();
	}

	destroy() {
		super.destroy();
	}

}

export default Enemy;