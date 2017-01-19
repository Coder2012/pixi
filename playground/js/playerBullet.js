import PhysicsSprite from './physicsSprite.js';
import consts from './matterConsts.js';

class PlayerBullet extends PhysicsSprite {
	constructor(id, engine, category) {
		super(id, engine, category);
	}

    init(x, y, width, height, texture) {
        super.init(x, y, width, height, texture)
    	this._alive = false;
    }

    spawn(position) {
    	this._alive = true;
    	consts.Body.setPosition(this.body, position);
    }

    get alive() {
        return this._alive;
    }

    set alive(value) {   
        this._alive = value;
    }

    update() {
        if(this.body.position.y < -50) {
            this.alive = false; 
        }

        if(this.alive == true) {
            consts.Body.applyForce(this.body, this.body.position, {x: 0, y: -0.008});
        } else {
            consts.Body.setPosition(this.body, {x: 50, y: 50});
        }

    	super.update();
    }
}

export default PlayerBullet;