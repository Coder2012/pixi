import * as PIXI from 'pixi.js'

export default class Test extends PIXI.utils.EventEmitter {
	constructor(ticker) {
		super()
		
		ticker.add(this.update, this)
	}

	init() {
		
	}

	update(delta) {
		this.emit('event')
	}
}