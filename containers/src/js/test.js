import * as PIXI from 'pixi.js'

export default class Test extends PIXI.utils.EventEmitter {
	constructor(ticker) {
		super()
		
		ticker.add(this.update, this)
	}

	init() {
		
		this.emit('event')
	}

	update(delta) {
	}
}