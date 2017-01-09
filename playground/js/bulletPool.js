import * as PIXI from 'pixi.js';
import PlayerBullet from './playerBullet.js';

// Matter.js module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Composite = Matter.Composite;

class BulletPool {
	constructor(engine, container) {
		this.engine = engine;
		this.container = container;
		this.size = 8;
		this.pool = [];
		this._bullet;
		this.texture = PIXI.loader.resources["images/data.json"].textures["player_bullet.png"];
	}

	init() {
		for(var i = 0; i < this.size; i++) {
			let bullet = new PlayerBullet();
			bullet.init(0, 0, 16, 32, this.texture);
			this.pool[i] = bullet;

			World.addBody(this.engine.world, bullet.body);
    		this.container.addChild(bullet.sprite);
		}
	}

	get(position) {
		if(!this.pool[this.size - 1].alive) {
			this.pool[this.size - 1].spawn(position);
			this.pool.unshift(this.pool.pop());
		}
	}

	update() {
		this.pool.forEach((bullet)=>{
			if(bullet.alive) {
				bullet.update();
			}
		})
	}
}

export default BulletPool;