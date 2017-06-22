import * as PIXI from 'pixi.js'
import keyboardJS from 'keyboardjs'
import Test from './test.js'

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight
})

document.body.appendChild(app.view)


const loader = app.loader
loader.add('fonts/font.fnt')
loader.add('images/data.json').load(setup)

function setup () {
  console.log('application setup')

  const pixijs = new PIXI.Sprite(loader.resources['images/data.json'].textures['pixijs.png'])
  const bitcoin = new PIXI.Sprite(loader.resources['images/data.json'].textures['bitcoin.jpg'])
  const illuminati = new PIXI.Sprite(loader.resources['images/data.json'].textures['illuminati.png'])

  bitcoin.y = pixijs.height
  illuminati.x = ((bitcoin.x + bitcoin.width) * 0.5) - (illuminati.width * 0.5)

  app.stage.addChild(bitcoin)
  app.stage.addChild(pixijs)
  app.stage.addChild(illuminati)

  const test = new Test(app.ticker)
  test.on('event', () => console.log('event received')) 

  addKeyboard()
}

app.ticker.add(animate)

function animate (delta) {

}

function addKeyboard () {
  const keys = [
      { key:'a', press: aPress, release: aRelease }, 
      { key:'b', press: bPress, release: bRelease } 
    ]

  keys.forEach((map) => {
    keyboardJS.bind(map.key, (e) => {
      console.log(map.key + ' is pressed')
      map.press()
      e.preventRepeat()
    }, (e) => {
      console.log(map.key + ' is released')
      map.release()
    })
  })
}

function aPress () {
  console.log('called aPress function')
}

function aRelease () {
  console.log('called aRelease function')
}

function bPress () {
  console.log('called bPress function')
}

function bRelease () {
  console.log('called bRelease function')
}
