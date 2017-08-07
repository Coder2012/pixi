import * as PIXI from 'pixi.js'

export default class Timer extends PIXI.Sprite {
	constructor (app) {
		super()

		this._app = app
		this._counter = 50
		this._text = 'TIME: '
		this._countdown = new PIXI.extras.BitmapText('--', {font: '72px Impact'})
		this._countdown.text = 'TIME: '
		this._hold = false
		this.addChild(this._countdown)

		this.reset()
	}

	start() {
		this._timer = setInterval(() => {
			if(this._counter >= 0) {
				this._countdown.text = this._text + this._counter--
			}else{
				this.complete()
			}
		}, 50)
	}

	stop() {
		clearInterval(this._timer)
	}

	complete() {
		this.emit('timer-complete')
	}

	reset() {
		this._counter = 50
	}

	update(delta) {
		// console.log(delta)	
	}
}