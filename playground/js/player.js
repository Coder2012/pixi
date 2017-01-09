import PhysicsSprite from './physicsSprite.js';

// Matter.js module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Composite = Matter.Composite;

class Player extends PhysicsSprite {
    constructor(category) {
        super(category);
    }

    init(x, y, width, height, texture) {
        super.init(x, y, width, height, texture)
    }

    spawn() {

    }
}

export default Player;