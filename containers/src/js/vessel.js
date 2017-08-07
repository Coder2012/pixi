import * as PIXI from 'pixi.js'

export default class Vessel extends PIXI.Sprite {
	constructor(texture) {
		super(texture)

		this.graphics = new PIXI.Sprite(texture)
		this.addChild(this.graphics)
	}

	init (ticker) {
		ticker.add(this.update, this)
	}

	setTint (color) {
		this.graphics.tint = color
	}

	get id () {
		return this._id
	}

	set id (value) {
		this._id = value
	}

	update (delta) {

	}
}