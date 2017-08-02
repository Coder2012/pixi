import * as PIXI from 'pixi.js'
import TimelineMax from 'gsap/TimelineMax'

export default class Crane extends PIXI.Sprite {
	constructor () {
		super()

		this._platform = undefined
		this._container = undefined

		this._graphics = new PIXI.Graphics()
	  this._graphics.lineStyle(2, 0x0000FF, 1);
	  this._graphics.drawRect(0, 0, 126, 53);
	  this.addChild(this._graphics)

	}

	move() {
		if(this._container === undefined || this._platform === undefined) {
			console.log('error')
			return
		}

	  let pos = this._container.parent.toGlobal(this._container)
	  
	  this._tl = new TimelineMax({onComplete: this.collect.bind(this)})
	   
	  this._tl.fromTo(this._graphics.position, 0.5, {x: this._graphics.position.x}, {x: pos.x})
	  this._tl.fromTo(this._graphics.position, 0.5, {y: this._graphics.position.y}, {y: pos.y})
	}

	collect () {
	  this._container.x = 0
	  this._container.y = 0
	  this._graphics.addChildAt(this._container, 0)
	  this.drop()
	}

	drop() {
	  this._tl = new TimelineMax({onComplete: () => {
	  	this._platform.addChild(this._container)
	  	this.reset()	
	  }})
	  let pos = {x: (window.innerWidth - this._graphics.width) * 0.5, y: 0}
	   
	  this._tl.to(this._graphics.position, 0.5, {y: pos.y})
	  this._tl.to(this._graphics.position, 0.5, {x: this._platform.x})
	  this._tl.to(this._graphics.position, 0.5, {y: this._platform.y})
	}

	reset () {
		this._container = this._platform = undefined
	}

	get platform () {
		return this._platform
	}

	set platform (value) {
		this._platform = value
		this.move()
	}

	get container () {
		return this._container
	}

	set container (value) {
		this._container = value
		this.move()
	}
}