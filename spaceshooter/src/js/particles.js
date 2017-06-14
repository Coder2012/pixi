import * as PIXI from 'pixi.js'
require('pixi-particles')

class Particles {
  constructor (container, loader) {
    this._container = container
    this._loader = loader
    this._position = undefined
    this._emit = false
    this._config = {
      'alpha': {
        'start': 0.4,
        'end': 0
      },
      'scale': {
        'start': 1,
        'end': 0.3
      },
      'color': {
        'start': '000000',
        'end': '000000'
      },
      'speed': {
        'start': 100,
        'end': 200
      },
      'startRotation': {
        'min': 0,
        'max': 360
      },
      'rotationSpeed': {
        'min': 0,
        'max': 10
      },
      'lifetime': {
        'min': 0.1,
        'max': 0.2
      },
      'frequency': 0.008,
      'emitterLifetime': 0.31,
      'maxParticles': 100,
      'pos': {
        'x': 0,
        'y': 0
      },
      'addAtBack': false,
      'spawnType': 'circle',
      'spawnCircle': {
        'x': 0,
        'y': 0,
        'r': 20
      }
    }
  }

  init () {
    this._emitterContainer = new PIXI.particles.ParticleContainer()
    this._emitterContainer.setProperties({
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    })
    this._container.addChild(this._emitterContainer)
    this._emitter = new PIXI.particles.Emitter(this._emitterContainer, [this._loader.resources['images/particle.png'].texture], this._config)
    this._emitter.updateOwnerPos(this.position.x, this.position.y)
  }
  get position () {
    return this._position
  }
  set position (newPosition) {
    this._position = newPosition
  }
  get emitter () {
    return this._emitter
  }
  set emitter (newEmitter) {
    this.emitter = newEmitter
  }
  get emit () {
    return this._emit
  }
  set emit (value) {
    this._emit = value
  }
  update (value) {
    this._emitter.emit = this._emit
    this._emitter.update(value)
  }
}
export default Particles
