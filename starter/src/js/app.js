import * as PIXI from 'pixi.js'
import keyboardJS from 'keyboardjs'

const canvas = document.getElementById('canvas')
const innerWidth = window.innerWidth
const innerHeight = window.innerHeight

const renderer = PIXI.autoDetectRenderer(innerWidth, innerHeight, {
  backgroundColor: 0x000000
})

const stage = new PIXI.Container()
document.body.appendChild(renderer.view)

let elapsed = Date.now()

const loader = PIXI.loader
loader.add('fonts/font.fnt')
loader.add('images/particle.png').load(setup)
// loader.add('images/data.json')

function setup () {
  addKeyboard()
  animate()
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
  console.log('called aPress function')
}

function bRelease () {
  console.log('called aRelease function')
}

function animate () {
  const now = Date.now()
  // console.log(elapsed)
  elapsed = now;

  renderer.render(stage)
  window.requestAnimationFrame(animate)
}
