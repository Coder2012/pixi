import consts from './matterConsts.js';
import PhysicsSprite from './physicsSprite.js';
import Particles from './particles.js';

class Enemy extends PhysicsSprite {
	constructor(id, engine, category) {
		super(id, engine, category);

		this._health = 120;
		this._stage = undefined;
	}

	init(x, y, width, height, texture, type) {
		super.init(x, y, width, height, texture, type);

		this._particles = new Particles(this.sprite, this.loader);
		this._particles.position = this.stage.toGlobal(this.sprite.position);
		this._particles.init();
	}

	damage() {
		this._particles.emit = true;
		
		if(this._health > 0) {
			this._health -= 10;

			let tint = (parseInt(this.sprite.tint) - parseInt(0x001100)).toString(16);
			this.sprite.tint = '0x' + tint;

			this._particles.emitter.maxLifetime = 1 - (this._health / 100);
		}else{
			this.sprite.tint = 0xff00ff;
			this._particles.emit = false;
			this.destroy();   
		}
	}

	get loader() {
		return this._loader;
	}

	set loader(newLoader) {
		this._loader = newLoader;
	}

	get stage() {
		return this._stage;
	}

	set stage(newStage) {
		this._stage = newStage;
	}

	update(value) {
		super.update();

		if(this._particles) {
			this._particles.update(value);
		}
	}

	destroy() {
		super.destroy();
		this.stage.removeChild(this.sprite);
	}

}

export default Enemy;