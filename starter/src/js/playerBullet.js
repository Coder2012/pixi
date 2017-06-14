import PhysicsSprite from './physicsSprite.js'
import consts from './matterConsts.js'

class PlayerBullet extends PhysicsSprite {
  init (x, y, width, height, texture) {
    super.init(x, y, width, height, texture)
    this._alive = false
    this.sprite.scale.set(0.5, 0.5)
  }
  spawn (position) {
    this._alive = true
    consts.Body.setPosition(this.body, {x: position.x, y: position.y -40})
  }
  get alive () {
    return this._alive
  }
  set alive (value) {
    this._alive = value
  }
  update () {
    if (this.body.position.y < -50) {
      this.alive = false
    }
    if (this.alive === true) {
      consts.Body.applyForce(this.body, this.body.position, {
        x: 0,
        y: -0.010
      })
    } else {
      consts.Body.setPosition(this.body, {
        x: 0,
        y: 0
      })
    }
    super.update()
  }
}
export default PlayerBullet
