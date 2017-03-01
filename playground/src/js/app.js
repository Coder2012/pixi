import * as PIXI from 'pixi.js'
import consts from './matterConsts.js'
import Player from './player'
import BulletPool from './bulletPool.js'
import Enemy from './enemy.js'

const canvas = document.getElementById('canvas')
const innerWidth = window.innerWidth
const innerHeight = window.innerHeight
const engine = consts.Engine.create({
  render: {
    element: document.body,
    canvas: canvas,
    options: {
      width: innerWidth,
      height: innerHeight
    }
  }
})

const bodies = []
const renderer = PIXI.autoDetectRenderer(innerWidth, innerHeight, {
  backgroundColor: 0x000000
})
const stage = new PIXI.Container()
document.body.appendChild(renderer.view)

let enemy, ship, pool, texture, emitter
let elapsed = Date.now()

const colCategory = 0x001
const colCategory2 = 0x002
const loader = PIXI.loader
loader.add('images/particle.png')
loader.add('images/data.json').load(setup)

function setup () {
  texture = loader.resources['images/data.json'].textures['spacestation.png']
  enemy = new Enemy('enemy', engine, colCategory)
  enemy.stage = stage
  enemy.loader = loader
  enemy.init(800, 200, 80, 0, texture, 'circle')
  texture = loader.resources['images/data.json'].textures['wship-4.png']
  ship = new Player('player', engine, colCategory2)
  ship.init(800, window.innerHeight - 100, 34, 72, texture)
  pool = new BulletPool(engine, stage)
  pool.init('bullet', colCategory)
  consts.World.addBody(engine.world, enemy.body)
  consts.World.addBody(engine.world, ship.body)
  stage.addChild(enemy.sprite)
  stage.addChild(ship.sprite)
  animate()
}

function animate () {
  const now = Date.now()
  if (emitter) emitter.update((now - elapsed) * 0.001)
  if (leftKey.isDown) {
    consts.Body.applyForce(ship.body, ship.body.position, {
      x: -0.003,
      y: 0
    })
  }
  if (rightKey.isDown) {
    consts.Body.applyForce(ship.body, ship.body.position, {
      x: 0.003,
      y: 0
    })
  }
  ship.update()
  enemy.update((now - elapsed) * 0.001)
  pool.update()
  elapsed = now
  renderer.render(stage)
  window.requestAnimationFrame(animate)
}
consts.Events.on(engine, 'collisionStart', function (event) {
  const pairs = event.pairs
  pairs.forEach((collision) => {
    const bodyA = collision.bodyA
    const bodyB = collision.bodyB
    if (bodyA.label === 'enemy' && collision.bodyB.label.indexOf(
        'bullet') !== -1) {
      pool.remove(bodyB.label)
      if (enemy.body === bodyA) {
        enemy.damage()
      }
    }
  })
})
const leftKey = keyboard(37)
const rightKey = keyboard(39)
const spaceKey = keyboard(32)
spaceKey.release = function () {
  pool.getBullet(ship.body.position)
}

function keyboard (keyCode) {
  const key = {}
  key.code = keyCode
  key.isDown = false
  key.isUp = true
  key.press = undefined
  key.release = undefined

  key.downHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press()
      key.isDown = true
      key.isUp = false
    }
    event.preventDefault()
  }

  key.upHandler = function (event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release()
      key.isDown = false
      key.isUp = true
    }
    event.preventDefault()
  }

  window.addEventListener('keydown', key.downHandler.bind(key), false)
  window.addEventListener('keyup', key.upHandler.bind(key), false)
  return key
}
// engine.world.bounds.max.x = 1000
// engine.world.bounds.max.y = 800
engine.world.gravity.y = 0
// add all of the bodies to the world
consts.World.add(engine.world, bodies)
// run the engine
consts.Engine.run(engine)
