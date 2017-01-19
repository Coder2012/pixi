import PhysicsSprite from './physicsSprite.js';

class Player extends PhysicsSprite {
    constructor(id, engine, category) {
        super(id, engine, category);
    }

    init(x, y, width, height, texture) {
        super.init(x, y, width, height, texture)
    }

    spawn() {

    }
}

export default Player;