import * as PIXI from 'pixi.js'

export default class Container extends PIXI.Sprite {
	constructor(loader) {
		super(loader.resources['images/data.json'].textures['container'])
		
		this._types = { 
			standard: {
				cost: 500,
				tint: 0x00ff00
			},
			budget: {
				cost: 250,
				tint: 0xff0000
			},
			premium: {
				cost: 1000,
				tint: 0x0000ff
			} 
		}

		this._type = this._types.standard
		this.updateTint()
	}

	setRandomType () {
		let rnd = Math.floor(Math.random() * 3)

		switch (rnd) {
			case 0:
				this._type = this._types.standard
				break

			case 1:
				this._type = this._types.budget
				break
				
			case 2:
				this._type = this._types.premium
				break	
		}

		this.updateTint()
	}

	updateTint () {
		this.tint = this._type.tint
	}

	get cost () {
		return this._type.cost
	}

	set type (value) {
		this._type = this._types[value]
		console.log(this._types[value])
	}

	get type () {
		return this._type
	}

	get id () {
		return this._id
	}

	set id (value) {
		this._id = value
	}

}