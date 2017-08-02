import * as PIXI from 'pixi.js'

export default class Container extends PIXI.Sprite {
	constructor(texture) {
		super(texture)
	}

	init (ticker) {
		ticker.add(this.update, this)
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