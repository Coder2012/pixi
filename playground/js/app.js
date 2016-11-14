import Player from "./player";
import Vector from "./vector";
import Clock from "./clock";

var renderer = new PIXI.autoDetectRenderer(
    window.innerWidth,
    window.innerHeight,
    {
        "antialias": true,
        "autoResize": true,
        "transparent": true,
        "resolution": 1
    }
);
 
document.body.appendChild(renderer.view);

const step = 1000 / 60;
let fired = false;
let start = 0;
let ax = 0;
let arrowSpeed = 0.1;
let arrowPosition = new Vector(100, window.innerHeight - 10);
let mouse;
let mousePosition = new Vector(0, 0);
let directionVector = new Vector(0, 0);
let gravityVector = new Vector(-5, 10);
let forwardVector = new Vector(1, 0);
let clock = new Clock();

const loader = PIXI.loader;

loader.add(['images/orange-van.png', 'images/orange-van-wheel.png'])
    .on("progress", () => {})
    .load((loader, resources) => {
        var currentPosition, lastPosition, ratio, circumference, degrees;

        var stage = new PIXI.Container();
        var container = new PIXI.Container();

        var van = new PIXI.Sprite(resources['images/orange-van.png'].texture);
        var frontWheel = new PIXI.Sprite(resources['images/orange-van-wheel.png'].texture);
        var rearWheel = new PIXI.Sprite(resources['images/orange-van-wheel.png'].texture);

        frontWheel.anchor.set(0.5, 0.5);
        rearWheel.anchor.set(0.5, 0.5);

        frontWheel.position.set(74, 172);
        rearWheel.position.set(287, 172);

        van.addChild(frontWheel);
        van.addChild(rearWheel);
        container.addChild(van);

        // stage.addChild(container);

        var arrow = new PIXI.Graphics();
        arrow.lineStyle(1, 0xff0000);
        arrow.moveTo(0, 0);
        arrow.lineTo(80, 0);
        stage.addChild(arrow);

        arrow.position.set(arrowPosition.x, arrowPosition.y);

        var player = new Player(
            container,
            window.innerWidth / 2,
            window.innerHeight / 2,
            0
        );
         
        var state = {
            "renderer": renderer,
            "stage": stage
        };

        function keyboard(keyCode) {
            let key = {};
            key.code = keyCode;
            key.isDown = false;
            key.isUp = true;
            key.press = undefined;
            key.release = undefined;

            key.downHandler = event => {
                if (event.keyCode === key.code) {
                    if (key.isUp && key.press) key.press();
                    key.isDown = true;
                    key.isUp = false;
                }
                event.preventDefault();
            }

            key.upHandler = event => {
                if (event.keyCode === key.code) {
                    if (key.isDown && key.release) key.release();
                        key.isDown = false;
                        key.isUp = true;
                    }
                event.preventDefault();
            }

            window.addEventListener(
                "keydown", key.downHandler.bind(key), false
            )

            window.addEventListener(
                "keyup", key.upHandler.bind(key), false
            )

            return key;
        }

        let upKey = keyboard(38);
        upKey.press = () => {
            ax += 2;
            console.log('keycode press');
        }
        upKey.release = () => {
            console.log('keycode release');
        }
        let downKey = keyboard(40);
        downKey.press = () => {
            ax -= 2;
            console.log('keycode press');
        }
        downKey.release = () => {
            console.log('keycode release');
        }

        window.addEventListener(
            "mousemove", () => {
                if(!fired) {
                    mouse = renderer.plugins.interaction.mouse.global;
                    mousePosition.x = mouse.x;
                    mousePosition.y = mouse.y;

                    directionVector = mousePosition.sub(arrowPosition).normalize();

                    let radians = Math.atan2(directionVector.y, directionVector.x);
                    arrow.rotation = radians;
                }
            }
        )

        window.addEventListener(
            "mouseup", () => {
                directionVector.multiplyScalar((mouse.x / window.innerWidth) * 30);

                fire();
            }, false
        )

        function fire() {
            console.log('fire');
            fired = true;
        }
         
        animate(0);
         
        function animate(timestamp) {

            var delta = clock.getDelta();

            if(delta > 0.016){
                delta = 0.016;
            }

            if (timestamp >= start) {

                getVectorToMouse(delta);

                // circumference = (2 * Math.PI) * 42;
                // ratio = ax / circumference;
                // degrees = ratio * 360;
                
                // rearWheel.rotation += degrees * (Math.PI / 180);
                // frontWheel.rotation = rearWheel.rotation;
                
                player.animate(ax);
                renderer.render(stage);

                start = timestamp + step;

            }

            requestAnimationFrame(animate);
        }

        function getVectorToMouse(delta) {
            if(fired) {
                directionVector.addScaledVector(gravityVector, delta);
                arrowPosition.add(directionVector);

                // axis.crossVectors(up, v).normalize();
                // let radians = Math.acos(forwardVector.dot(directionVector.clone().normalize()));
                let radians = Math.atan2(directionVector.y, directionVector.x);
                arrow.rotation = radians;

                arrow.position.set(arrowPosition.x, arrowPosition.y);
            }
        }
        
    })