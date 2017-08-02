import consts from './matterConsts.js'
import PhysicsSprite from './physicsSprite.js'
import Particles from './particles.js'

class Enemy extends PhysicsSprite {
  constructor (id, engine, category, events) {
    super(id, engine, category)
    this._health = 10
    this._stage = undefined
    this._start = 0
    this._events = events
  }

  init (x, y, width, height, texture, type) {
    super.init(x, y, width, height, texture, type)
    this._particles = new Particles(this.sprite, this.loader)
    this._particles.position = this.stage.toGlobal(this.sprite.position)
    this._particles.init()
  }

  damage () {
    this._particles.emit = false
    if (this._health > 0) {
      this._health -= 10
      this._particles.emitter.maxLifetime = 1 - (this._health / 100)
    } else {
      this._particles.emit = false
      this.destroy()
    }
    this._events.emit('scoreIncrease', {value: 10})
  }

  get loader () {
    return this._loader
  }

  set loader (newLoader) {
    this._loader = newLoader
  }

  get stage () {
    return this._stage
  }

  set stage (newStage) {
    this._stage = newStage
  }
  update (value) {
    super.update()
    if (this._particles) {
      this._particles.update(value)
    }
    let pos = this.x += 8

    consts.Body.setPosition(this.body, {
      x: pos,
      y: 120
    })
    this.checkBounds()

    // consts.Body.setAngularVelocity(this.body, 0 + (120 / 1000 - this._health / 1000))
  }

  checkBounds () {
    const w = window.innerWidth
    if (this.x + this.width > w) {
      this.x = 0
    }
  }

  destroy () {
    super.destroy()
    this.stage.removeChild(this.sprite)
  }
}
export default Enemy
