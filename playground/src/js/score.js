import * as PIXI from 'pixi.js'

class Score {
  constructor (events) {
    this._score = 0
    this._sprite = new PIXI.extras.BitmapText('012', {font: '72px font'})
    this._events = events
    this._events.on('scoreIncrease', (data) => {
      this.increase(data)
    })
  }

  increase (data) {
    this._score += data.value
    this._sprite.text = this._score
  }

  decrease (value) {
    if ((this._score - value) > 0) {
      this._score -= value
    }
    this._sprite.text = this._score
  }

  get sprite () {
    return this._sprite
  }

  set sprite (newSprite) {
    this._sprite = newSprite
  }
}
export default Score
