import consts from './matterConsts.js';

class Steering {
	constructor(entity) {
		this.entity = entity;
	}

	seek(desiredVelocity, velocity) {
	    let steering = consts.Vector.mult(Vector.sub(desiredVelocity, velocity), 2);

	    consts.Body.setVelocity(this.entity.body, steering);

	    let angle = Math.atan2(this.entity.body.velocity.y, this.entity.body.velocity.x);
	    consts.Body.setAngle(this.entity.body, angle);
	}
}

export default Steering;