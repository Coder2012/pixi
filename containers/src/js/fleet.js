import * as PIXI from 'pixi.js'
import Ship from './vessel.js'
import Container from './container.js'

export default class Fleet extends PIXI.utils.EventEmitter {
	constructor (app, loader) {
		super()

		this._app = app
		this._loader = loader

		this.createShip()
		this.addContainers()
	}

	createShip () {
		let texture = this._loader.resources['images/data.json'].textures['ship']
		this._ship = new Ship(texture)
		this._ship.init(this._app.ticker)
		this._ship.anchor.set(0)
		this._ship.x = this._app.screen.width - this._ship.width
		this._ship.y = this._app.screen.height - this._ship.height
		this._app.stage.addChild(this._ship)
	}

	addContainers () {
		let texture = this._loader.resources['images/data.json'].textures['container']
		const containers = [new Container(texture), new Container(texture), new Container(texture)]

		containers.forEach((item, i) => {
			item.id = i
			item.init(this._app.ticker)
			item.interactive = true
			item.on('mousedown', this.select, this)
			item.on('touchstart', this.select, this)
			item.x = 110 + (i * item.width) + i * 2
			item.y = 40
			this._ship.addChild(item)
		})
	}

	select (eventData) {
		this.emit('container-selected', eventData.currentTarget)
	}
}