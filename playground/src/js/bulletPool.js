import * as PIXI from 'pixi.js'
import consts from './matterConsts.js'
import PlayerBullet from './playerBullet.js'

class BulletPool {
  constructor (engine, container) {
    this.engine = engine
    this.container = container
    this.size = 8
    this.pool = []
    this._bullet
    this.texture = PIXI.loader.resources['images/data.json'].textures['player_bullet.png']
  }

  init (id, category) {
    for (var i = 0; i < this.size; i++) {
      const bullet = new PlayerBullet('bullet_' + i, this.engine, category)
      bullet.init(0, 0, 16, 32, this.texture)
      this.pool[i] = bullet
      consts.World.addBody(this.engine.world, bullet.body)
      this.container.addChild(bullet.sprite)
    }
  }

  getBullet (position) {
    if (!this.pool[this.size - 1].alive) {
      this.pool[this.size - 1].spawn(position)
      this.pool.unshift(this.pool.pop())
    }
  }

  remove (id) {
    this.pool.forEach((bullet) => {
      if (bullet.alive && bullet.id === id) {
        bullet.alive = false
        bullet.update()
      }
    })
  }

  update () {
    this.pool.forEach((bullet, i) => {
      if (bullet.alive === true) {
        bullet.update()
      }
    })
  }
}
export default BulletPool
