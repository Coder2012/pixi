import * as PIXI from 'pixi.js'
import TimelineMax from 'gsap/TimelineMax'
import keyboardJS from 'keyboardjs'
import Ship from './vessel.js'
import Container from './container.js'
import Storage from './storage.js'
import Test from './test.js'
import Crane from './crane.js'
import Fleet from './fleet.js'
import Timer from './timer.js'
import Bank from './banker.js'

const canvas = document.createElement('canvas');

canvas.id = "backgroundGradient";
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
canvas.style.zIndex = -1;
canvas.style.position = "absolute";
let ctx = canvas.getContext('2d');

let gradient = ctx.createLinearGradient(0, 0, window.innerWidth / 4, window.innerHeight);
gradient.addColorStop(0, '#000000');
gradient.addColorStop(1, '#6694ff');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

let body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

const app = new PIXI.Application({
  width: window.innerWidth - 50,
  height: window.innerHeight - 50,
  transparent: true
})

document.body.appendChild(app.view)


const loader = app.loader
loader.add('fonts/font.fnt')
loader.add('fonts/impact.fnt')
loader.add('images/data.json').load(setup)

let ship = undefined
let graphics = undefined
let id = undefined
let tl = undefined
let target = undefined
let dockStore = undefined
let crane = undefined
let fleet = undefined
let platform = undefined
let container = undefined
let timer = undefined
let bank = undefined

//state
let craneMoving = false
let shipMoving = false

function setup () {
  console.log('application setup')
  
  createDocks()
  createFleet()
  createCrane()
  createTimer()
  createBank()
  addKeyboard()
}

function createFleet(argument) {
  fleet = new Fleet(app, loader)
  fleet.on('platform-selected', onPlatformSelected)
  fleet.on('container-selected', onContainerSelected)
  fleet.on('ship-docked', onShipDocked)
  fleet.on('ship-departed', onShipDeparted)
  fleet.on('ship-moving', () => shipMoving = true)
  fleet.dock()
}

function createDocks () {
  let port = new PIXI.Graphics()
  port = new PIXI.Graphics()
  port.lineStyle(2, 0x884756);
  port.beginFill(0x991234)
  port.drawRect(0, 0, app.screen.width, 40);
  port.endFill()
  port.y = app.screen.height - port.height
  app.stage.addChild(port)

  dockStore = new Storage(app, 4)
  dockStore.y = app.screen.height - (port.height + 55)
  dockStore.on('platform-selected', onPlatformSelected)
  app.stage.addChild(dockStore)
}

function createCrane() {
  crane = new Crane(app)
  crane.on('crane-moving', () => craneMoving = true)
  crane.on('crane-stopped', (container) => {
    bank.update(container.cost)
    craneMoving = false
    onTimerCompleted()
  })
  app.stage.addChild(crane)
}

function createTimer() {
  timer = new Timer(app)
  timer.on('timer-complete', onTimerCompleted)
  app.stage.addChild(timer)
}

function createBank() {
  bank = new Bank(app)
  app.stage.addChild(bank)
  bank.x = app.screen.width - bank.getWidth() - 10
}

function onTimerCompleted() {
  timer.stop()

  if(!craneMoving) {
    fleet.depart()
  }
}

function onShipDocked() {
  shipMoving = false
  timer.start()
}

function onShipDeparted() {
  shipMoving = false
  timer.stop()
  timer.reset()
  fleet.dock()
}

function onPlatformSelected(value) {
  if(!shipMoving) {
    crane.platform = value.currentTarget
  }else{
    crane.platform = crane.container = undefined
  }
}

function onContainerSelected(value) {
  if(!shipMoving) {
    crane.container = value.currentTarget
  }else{
    crane.platform = crane.container = undefined
  }
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
