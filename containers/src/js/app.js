import * as PIXI from 'pixi.js'
import TimelineMax from 'gsap/TimelineMax'
import keyboardJS from 'keyboardjs'
import Ship from './vessel.js'
import Container from './container.js'
import Storage from './storage.js'
import Test from './test.js'
import Crane from './crane.js'
import Fleet from './fleet.js'

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight
})

document.body.appendChild(app.view)


const loader = app.loader
loader.add('fonts/font.fnt')
loader.add('images/data.json').load(setup)

let ship = undefined
let graphics = undefined
let id = undefined
let tl = undefined
let target = undefined
let storage = undefined
let crane = undefined
let fleet = undefined
let platform = undefined
let container = undefined

function setup () {
  console.log('application setup')
  
  fleet = new Fleet(app, loader)
  fleet.on('container-selected', onContainerSelected)

  createPlatforms()
  createCrane()
  addKeyboard()
}

function createPlatforms () {
  storage = new Storage(app)
  storage.on('platform-selected', onPlatformSelected)
  app.stage.addChild(storage)
}

function createCrane() {
  crane = new Crane()
  app.stage.addChild(crane)
}

function onPlatformSelected(value) {
  crane.platform = value
}

function onContainerSelected(value) {
  crane.container = value
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
