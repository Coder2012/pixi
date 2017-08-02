import consts from './matterConsts.js'
import Enemy from './enemy.js'

class EnemyFactory {
  constructor (container, count, engine, loader, colCategory, events) {
    this.types = ['alien1.png', 'alien2.png', 'alien3.png', 'alien4.png', 'aliensprite.png', 'att2.png', 'att3.png', 'att5.png', 'bgbattleship.png', 'bgspeedship.png', 'blue1.png', 'blue2.png', 'blueship1.png', 'blueship2.png', 'blueship3.png', 'blueship4.png', 'F5S1.png', 'F5S2.png', 'F5S3.png', 'F5S4.png', 'greenship1.png', 'greenship2.png', 'greenship3.png', 'greenship4.png', 'orangeship.png', 'orangeship2.png', 'orangeship3.png', 'player_bullet.png', 'RD1.png', 'RD2.png', 'RD3.png', 'RD4.png', 'smallorange.png', 'spacestation.png', 'speedship.png', 'spshipsprite.png', 'tribase-u1-d0.png', 'tribase-u2-d0.png', 'tribase-u3-d0.png', 'wship-2.png', 'wship-3.png', 'wship-4.png', 'wship1.png']

    this._container = container
    this._count = count
    this._engine = engine
    this._loader = loader
    this._category = colCategory
    this._events = events
    this._enemies = []
  }

  init () {
    this.next()
  }

  isComplete () {
    this._enemies.forEach((enemy) => {
      if (!enemy.isAlive) return false
    })

    return true
  }

  next () {
    let type = this.types[0]
    this.texture = this._loader.resources['images/data.json'].textures[type]

    for (var i = 0; i < this._count; i++) {
      let enemy = new Enemy('enemy_' + i, this._engine, this._category, this._events)
      enemy.stage = this._container
      enemy.loader = this._loader
      enemy.init(i * -100, 100, 56, 105, this.texture)

      this._container.addChild(enemy.sprite)
      consts.World.addBody(this._engine.world, enemy.body)
      this._enemies.push(enemy)
    }
  }

  checkEnemy (body) {
    for (var i = 0; i < this._count; i++) {
      let enemy = this._enemies[i]
      if (enemy.body === body) {
        enemy.damage()
      }
    }
  }

  update (delta) {
    for (var i = 0; i < this._count; i++) {
      this._enemies[i].update(delta)
    }
  }
}

export default EnemyFactory
