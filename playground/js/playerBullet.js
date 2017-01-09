import PhysicsSprite from './physicsSprite.js';

// Matter.js module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Composite = Matter.Composite;

class PlayerBullet extends PhysicsSprite {
	constructor(category) {
		super(category);
	}

    init(x, y, width, height, texture) {
        super.init(x, y, width, height, texture)
    	this.alive = false;
    }

    spawn(position) {
    	this.alive = true;
    	Body.setPosition(this.body, position);
    	console.log('spawn');
    }

    update() {
    	super.update();
    	Body.applyForce(this.body, this.body.position, {x: 0, y: -0.008});
    }
}

export default PlayerBullet;