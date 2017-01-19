import * as PIXI from 'pixi.js';
import consts from './matterConsts.js';
import Player from './player';
import PlayerBullet from './playerBullet.js';
import BulletPool from './bulletPool.js';
import Enemy from './enemy.js';
import Steering from './steering';
const particles = require('pixi-particles');

const canvas = document.getElementById('canvas'),
    innerWidth = window.innerWidth,
    innerHeight = window.innerHeight;

const engine = consts.Engine.create({
        render: {
            element: document.body,
            canvas: canvas,
            options: {
                width: innerWidth,
                height: innerHeight
            }
        }
    });

const config = {
        "alpha": {
            "start": 0.8,
            "end": 0.1
        },
        "scale": {
            "start": 1,
            "end": 0.3
        },
        "color": {
            "start": "fb1010",
            "end": "f5b830"
        },
        "speed": {
            "start": 200,
            "end": 100
        },
        "startRotation": {
            "min": 0,
            "max": 360
        },
        "rotationSpeed": {
            "min": 0,
            "max": 0
        },
        "lifetime": {
            "min": 0.5,
            "max": 0.5
        },
        "frequency": 0.008,
        "emitterLifetime": 0.31,
        "maxParticles": 1000,
        "pos": {
            "x": 0,
            "y": 0
        },
        "addAtBack": false,
        "spawnType": "circle",
        "spawnCircle": {
            "x": 0,
            "y": 0,
            "r": 10
        }
    }

const bodies = [];

const renderer = PIXI.autoDetectRenderer(innerWidth, innerHeight,{backgroundColor : 0x000000});
const stage = new PIXI.Container();
document.body.appendChild(renderer.view);

let enemy, ship, bullet, fire, pool, texture, emitter;
const colCategory = 0x001;
const colCategory2 = 0x002;
const loader = PIXI.loader;
loader.add("images/particle.png");
loader.add("images/data.json").load(setup);

var elapsed = Date.now();

function setup(){
    texture = loader.resources["images/data.json"].textures["spacestation.png"];
    enemy = new Enemy('enemy', engine, colCategory);
    enemy.init(800, 200, 80, 0, texture, 'circle');

    texture = loader.resources["images/data.json"].textures["wship-4.png"];
    // texture = loader.resources["images/particle.png"].texture;
    ship = new Player('player', engine, colCategory2); 
    ship.init(800, window.innerHeight - 100, 34, 72, texture);

    pool = new BulletPool(engine, stage);
    pool.init('bullet', colCategory);
    
    consts.World.addBody(engine.world, enemy.body);
    consts.World.addBody(engine.world, ship.body);

    stage.addChild(enemy.sprite);
    stage.addChild(ship.sprite);

    var emitterContainer;
    emitterContainer = new PIXI.ParticleContainer();
    emitterContainer.setProperties({
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true
    });

    stage.addChild(emitterContainer);
    emitter = new PIXI.particles.Emitter(
        emitterContainer,
        [loader.resources["images/particle.png"].texture],
        config
    );

    emitter.particleConstructor = PIXI.particles.PathParticle;
    emitter.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2);

    animate();
}


function animate() {
    consts.Body.setAngularVelocity(enemy.body, 0.02);

    emitter.emit = true;

    var now = Date.now();
    if (emitter)
        emitter.update((now - elapsed) * 0.001);
    
    elapsed = now;

    if (leftKey.isDown) {
        consts.Body.applyForce(ship.body, ship.body.position, {x: -0.003, y: 0});
    }

    if (rightKey.isDown) {
        consts.Body.applyForce(ship.body, ship.body.position, {x: 0.003, y: 0});
    }

    ship.update();
    enemy.update();
    pool.update();

    renderer.render(stage);
    requestAnimationFrame(animate);
}

consts.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs;

    pairs.forEach((collision) => {
        const bodyA = collision.bodyA;
        const bodyB = collision.bodyB;

        if(bodyA.label == 'enemy' && collision.bodyB.label.indexOf('bullet') != -1) {
            pool.remove(bodyB.label);

            if(enemy.body === bodyA ) {
                enemy.damage();
            }
        }
    }) 
})

const leftKey = keyboard(37);
const rightKey = keyboard(39);
const spaceKey = keyboard(32);

spaceKey.release = function() {
    pool.get(ship.body.position);
}

function keyboard(keyCode) {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

// engine.world.bounds.max.x = 1000;
// engine.world.bounds.max.y = 800;
engine.world.gravity.y = 0;

// add all of the bodies to the world
consts.World.add(engine.world, bodies);

// run the engine
consts.Engine.run(engine);