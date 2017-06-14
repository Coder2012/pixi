import * as PIXI from 'pixi.js'
import consts from './matterConsts.js'

class PhysicsSprite {
  constructor (id, engine, category) {
    this._id = id
    this._engine = engine
    this.category = category
    this.isAlive = true
  }
  init (x, y, width, height, texture, type) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.texture = texture
    this.type = type
    this.createPhysics()
    this.createSprite()
  }
  createPhysics () {
    let options = {
      frictionAir: 0.2,
      friction: 1,
      inertia: Infinity,
      isSensor: true,
      label: this._id,
      mass: 1,
      restitution: 0,
      collisionFilter: {
        mask: this.category
      }
    }
    if (this.type === 'circle') {
      this._body = consts.Bodies.circle(this.x, this.y, this.width, options)
    } else {
      this._body = consts.Bodies.rectangle(this.x, this.y, this.width, this.height, options)
    }
  }
  createSprite () {
    this._sprite = new PIXI.Sprite(this.texture)
    this._sprite.anchor.x = 0.5
    this._sprite.anchor.y = 0.5
  }
  get body () {
    return this._body
  }
  set body (newBody) {
    this._body = newBody
  }
  get sprite () {
    return this._sprite
  }
  set sprite (newSprite) {
    this._sprite = newSprite
  }
  get id () {
    return this._id
  }
  set id (id) {
    this._id = id
  }
  update () {
    if (this._body) {
      this._sprite.position = this._body.position
      this._sprite.rotation = this._body.angle
    }
  }
  destroy () {
    this.isAlive = false
    consts.World.remove(this._engine.world, this._body)
  }
}
export default PhysicsSprite
