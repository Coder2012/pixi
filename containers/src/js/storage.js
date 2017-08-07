import * as PIXI from 'pixi.js'

export default class Storage extends PIXI.Sprite {
	constructor (app, num) {
		super()

		this._app = app
		this._num = num

		this.createPlatforms()
	}

	createPlatforms () {
		for (var i = 0; i < this._num; i++) {
	    let g = new PIXI.Graphics()
	    g.interactive = true
	    g.beginFill(0x004400)
	    g.lineStyle(4, 0x008800)
	    g.drawRect(0, 0, 126, 53)
	    g.endFill()
	    g.on('mousedown', this.select, this)
	    g.on('touchstart', this.select, this)
	    g.x = i * 126
	    g.y = 0
	    this.addChild(g)
	  }
	}

	select (eventData) {
		this.emit('platform-selected', eventData)
	}
}