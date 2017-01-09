let Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Composite = Matter.Composite;

class Steering {
	constructor(entity) {
		this.entity = entity;
	}

	seek(desiredVelocity, velocity) {
	    let steering = Vector.mult(Vector.sub(desiredVelocity, velocity), 2);

	    Body.setVelocity(this.entity.body, steering);

	    let angle = Math.atan2(this.entity.body.velocity.y, this.entity.body.velocity.x);
	    Body.setAngle(this.entity.body, angle);
	}
}

export default Steering;