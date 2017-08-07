import * as PIXI from 'pixi.js'

export default class Bank extends PIXI.Sprite {
	constructor (app) {
		super()

		this._app = app
		this._bitmapText = new PIXI.extras.BitmapText('bal', {font: '72px Impact'})
		this.addChild(this._bitmapText)
		this._text = 'BALANCE: '
		this._balance = 0
		this.update()
	}

	update (value = 0) {
		this._balance += value
		this._bitmapText.text = this._text + this._balance
		this._bitmapText.parent.x = this._app.screen.width - this.getWidth() - 10
	}

	getWidth () {
		return this._bitmapText.textWidth
	}

}