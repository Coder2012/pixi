import * as PIXI from 'pixi.js';

// Matter.js module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Vector = Matter.Vector,
    Composite = Matter.Composite;

 class PhysicsSprite {
 	constructor(category) {
 		this.category = category; 
 	}

 	init(x, y, width, height, texture) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.texture = texture;

        this.createPhysics();
        this.createSprite();
    }

    createPhysics() {
        let options = {
            frictionAir : 0.1,
            friction : 1,
            restitution : 0,
            inertia : Infinity,
            mass : 1,
            collisionFilter: {
            	category: this.category
            }
        }

        this._body = Bodies.rectangle(this.x, this.y, this.width, this.height, options);
    }

    createSprite() {
        this._sprite = new PIXI.Sprite(this.texture);
    
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;
    }

    get body() {
        return this._body;
    }

    set body(newBody) {
        this._body = newBody;
    }

    get sprite() {
        return this._sprite;
    }

    set sprite(newSprite) {
        this._sprite = newSprite;
    }
 
    update() {
        this._sprite.position = this._body.position;
    }
 }

 export default PhysicsSprite;