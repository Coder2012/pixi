import * as PIXI from 'pixi.js'
import TimelineMax from 'gsap/TimelineMax'
import EasePack from 'gsap/EasePack'
import Ship from './vessel.js'
import Container from './container.js'
import Storage from './storage.js'

export default class Fleet extends PIXI.utils.EventEmitter {
	constructor (app, loader) {
		super()

		this._app = app
		this._loader = loader

		this._numShips = 8
		this._speed = 1
		this._ships = []
		this._activeShip

		this.createShips()
		
	}

	createShips () {
		let colors = [0xff0000, 0x00ff00, 0x0000ff, 0x628297, 0x224466, 0xff00ff, 0xaa0044, 0x721456]

		for (let i = 0; i < this._numShips; i++) {
			let ship = this.createShip(i, colors[i])
			this.addStorage(ship)
			this.addContainers(ship)
			this._ships.push(ship)
		}
	}

	createShip (id, color) {
		let texture = this._loader.resources['images/data.json'].textures['ship']
		let ship = new Ship(texture)
		ship.init(this._app.ticker)
		ship.id = id
		ship.setTint(color)
		ship.anchor.set(0)
		ship.x = this._app.screen.width
		ship.y = this._app.screen.height - ship.height
		this._app.stage.addChild(ship)

		return ship
	}

	addStorage (ship) {
		this._storage = new Storage(this._app, 3)
		this._storage.on('platform-selected', this.platformSelected, this)
		this._storage.x = 126
		this._storage.y = 35
		ship.addChild(this._storage)
	}

	addContainers (ship) {
		const containers = []
		
		for (var i = 0; i < 3; i++) {
			let container = this.createContainer(i)
			ship.addChild(container)
			containers.push(container)
		}

	}

	createContainer (i) {
		let item = new Container(this._loader)
		item.id = i
		item.setRandomType()
		item.interactive = true
		item.on('mousedown', this.containerSelected, this)
		item.on('touchstart', this.containerSelected, this)
		item.x = this._storage.x + (i * item.width) + i * 2
		item.y = this._storage.y

		return item
	}

	dock() {
		this.emit('ship-moving')
		this._activeShip = this._ships[Math.floor(Math.random() * this._numShips)]
		this._tl = new TimelineMax({onComplete: this.docked.bind(this)})
		this._tl.delay(Math.floor(Math.random() * 5))
		this._tl.to(this._activeShip, this._speed, {x: this._app.screen.width - this._activeShip.width - 50, ease: EasePack.Power4.easeOut})
	}

	depart() {
		this.emit('ship-moving')
		this._tl = new TimelineMax({onComplete: this.departed.bind(this)})
		this._tl.to(this._activeShip, this._speed, {x: this._app.screen.width, ease: EasePack.Power4.easeIn})
	}

	docked() {
		this.emit('ship-docked')
	}

	departed() {
		this.emit('ship-departed')
	}

	platformSelected (eventData) {
		eventData.stopPropagation()
		this.emit('platform-selected', eventData)
	}

	containerSelected (eventData) {
		eventData.stopPropagation()
		this.emit('container-selected', eventData)
	}
}