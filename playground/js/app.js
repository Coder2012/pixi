import * as PIXI from 'pixi.js';
import Steering from './steering';

// Matter.js module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Composite = Matter.Composite;

var canvas = document.getElementById('canvas'),
    innerWidth = window.innerWidth,
    innerHeight = window.innerHeight;

var engine = Engine.create({
        render: {
            element: document.body,
            canvas: canvas,
            options: {
                width: innerWidth,
                height: innerHeight
            }
        }
    });

var velocity = {x: 0, y: -2};
var desiredVelocity;
var steering;
var bodies = [];

var id = 0, 
    hit,
    prevId = id;

var renderer = PIXI.autoDetectRenderer(innerWidth, innerHeight,{backgroundColor : 0x1099bb});
var stage = new PIXI.Container();
document.body.appendChild(renderer.view);

var items = [];
var positions = [{x: 100, y: 100}, {x: 100, y: 500}, {x: 500, y: 700}, {x: 700, y: 300}, {x: 900, y: 750}, {x: 900, y: 50}];
var length = positions.length;

function SpriteObject(texture) {
    // create a new Sprite using the texture
    var sprite = new PIXI.Sprite(texture);
    
    // center the sprite's anchor point
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    
    stage.addChild(sprite);
    return sprite;
};

var redColor = '#C44D58',
    greenColor = '#C7F464';

function PhysicsObject(index) {
    // create two boxes and a ground
    var x = positions[index].x, 
        y = positions[index].y, 
        size = 50;

    var options = {
        isSensor: true,
        isStatic: true,
        render: {
            strokeStyle: '#ff0000',
            lineWidth: 5,
            fillStyle: 'transparent'
        }
    }

    if(index == length - 1){
        options.isSensor = false;
        options.isStatic = false;
        options.render.strokeStyle = greenColor;
    }

    var box = Bodies.rectangle(x, y, size, size, options);
        
    bodies.push(box);
    return box;
};

var createItem = function(i) {
    return {
        body: new PhysicsObject(i)
    };
};

for(var i=0; i < length; i++) {
    items.push(createItem(i));
}

var player = items[length - 1];

// steering behaviours
var playerSteering = new Steering(player);

var createArrow = function() {
    return {
        body: Bodies.rectangle(100, 700, 50, 1)
    }
}

var createEnemy = function(texture) {
    return {
        body: Bodies.rectangle(256, 0, 256, 256),
        sprite: SpriteObject(texture)
    }
}

var createShip = function(texture) {
    return {
        body: Bodies.rectangle(800, window.innerHeight - 50, 34, 72, {
    frictionAir : 0.1,
    friction : 1,
    restitution : 0,
    inertia : Infinity,
    mass : 1
  }),
        sprite: SpriteObject(texture)
    }
}

// var arrow = createArrow();
// Body.setMass(arrow.body, 10);
// Body.setVelocity(arrow.body, {x: 10, y: -19});
// World.addBody(engine.world, arrow.body);

// function setTarget(id) {
//     return Vector.mult(Vector.normalise(Vector.sub(items[id].body.position, player.body.position)), 4);
// }

let enemy, ship;
let loader = PIXI.loader;
loader.add("images/data.json").load(setup);

function setup(){
    let u = new SpriteUtilities(PIXI);  

    enemy = createEnemy(loader.resources["images/data.json"].textures["spacestation.png"]);
    // Body.scale(enemy.body, 0.25, 0.25);
    // enemy.sprite.scale.set(0.25, 0.25);
    World.addBody(engine.world, enemy.body);

    ship = createShip(loader.resources["images/data.json"].textures["wship-4.png"]);
    World.addBody(engine.world, ship.body);


    // start animating
    animate();
}


function animate() {
    requestAnimationFrame(animate);

    // var angle = Math.atan2(arrow.body.velocity.y, arrow.body.velocity.x);
    // Body.setAngle(arrow.body, angle);


    if (leftKey.isDown) {
        Body.applyForce(ship.body, ship.body.position, {x: -0.003, y: 0});
    }



    if (rightKey.isDown) {
        Body.applyForce(ship.body, ship.body.position, {x: 0.003, y: 0});
    }

    // Body.setVelocity(ship.body, {x: 0, y: 0});

    ship.sprite.position = ship.body.position;
    enemy.sprite.position = enemy.body.position;

    // for(var b in items) {
    //     items[b].sprite.position = items[b].body.position;
    //     items[b].sprite.rotation = items[b].body.angle;
    // }

    // render the container
    renderer.render(stage);
}

Events.on(engine, 'collisionStart', function(event) {
    while((id = getRandomInt(0, length-2)) == prevId);

    prevId = id;

    hit = true;
    velocity = Vector.clone(Vector.normalise(player.body.velocity));

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

})

var leftKey = keyboard(37);
var rightKey = keyboard(39);

function keyboard(keyCode) {
  var key = {};
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
World.add(engine.world, bodies);

// run the engine
Engine.run(engine);