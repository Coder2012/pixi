(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _player = require("./player");

var _player2 = _interopRequireDefault(_player);

var _vector = require("./vector");

var _vector2 = _interopRequireDefault(_vector);

var _clock = require("./clock");

var _clock2 = _interopRequireDefault(_clock);

var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
    "antialias": true,
    "autoResize": true,
    "transparent": true,
    "resolution": 1
});

document.body.appendChild(renderer.view);

var step = 1000 / 60;
var fired = false;
var start = 0;
var ax = 0;
var arrowSpeed = 0.1;
var arrowPosition = new _vector2["default"](100, window.innerHeight - 10);
var mouse = undefined;
var mousePosition = new _vector2["default"](0, 0);
var directionVector = new _vector2["default"](0, 0);
var gravityVector = new _vector2["default"](-5, 10);
var forwardVector = new _vector2["default"](1, 0);
var clock = new _clock2["default"]();

var loader = PIXI.loader;

loader.add(['images/orange-van.png', 'images/orange-van-wheel.png']).on("progress", function () {}).load(function (loader, resources) {
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

    var player = new _player2["default"](container, window.innerWidth / 2, window.innerHeight / 2, 0);

    var state = {
        "renderer": renderer,
        "stage": stage
    };

    function keyboard(keyCode) {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;

        key.downHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };

        key.upHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };

        window.addEventListener("keydown", key.downHandler.bind(key), false);

        window.addEventListener("keyup", key.upHandler.bind(key), false);

        return key;
    }

    var upKey = keyboard(38);
    upKey.press = function () {
        ax += 2;
        console.log('keycode press');
    };
    upKey.release = function () {
        console.log('keycode release');
    };
    var downKey = keyboard(40);
    downKey.press = function () {
        ax -= 2;
        console.log('keycode press');
    };
    downKey.release = function () {
        console.log('keycode release');
    };

    window.addEventListener("mousemove", function () {
        if (!fired) {
            mouse = renderer.plugins.interaction.mouse.global;
            mousePosition.x = mouse.x;
            mousePosition.y = mouse.y;

            directionVector = mousePosition.sub(arrowPosition).normalize();

            var radians = Math.atan2(directionVector.y, directionVector.x);
            arrow.rotation = radians;
        }
    });

    window.addEventListener("mouseup", function () {
        directionVector.multiplyScalar(mouse.x / window.innerWidth * 30);

        fire();
    }, false);

    function fire() {
        console.log('fire');
        fired = true;
    }

    animate(0);

    function animate(timestamp) {

        var delta = clock.getDelta();

        if (delta > 0.016) {
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
        if (fired) {
            directionVector.addScaledVector(gravityVector, delta);
            arrowPosition.add(directionVector);

            // axis.crossVectors(up, v).normalize();
            // let radians = Math.acos(forwardVector.dot(directionVector.clone().normalize()));
            var radians = Math.atan2(directionVector.y, directionVector.x);
            arrow.rotation = radians;

            arrow.position.set(arrowPosition.x, arrowPosition.y);
        }
    }
});

},{"./clock":2,"./player":3,"./vector":4}],2:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
		value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Clock = (function () {
		function Clock(autoStart) {
				_classCallCheck(this, Clock);

				this.autoStart = autoStart !== undefined ? autoStart : true;

				this.startTime = 0;
				this.oldTime = 0;
				this.elapsedTime = 0;

				this.running = false;
		}

		_createClass(Clock, [{
				key: "start",
				value: function start() {

						this.startTime = (performance || Date).now();

						this.oldTime = this.startTime;
						this.elapsedTime = 0;
						this.running = true;
				}
		}, {
				key: "stop",
				value: function stop() {

						this.getElapsedTime();
						this.running = false;
				}
		}, {
				key: "getElapsedTime",
				value: function getElapsedTime() {

						this.getDelta();
						return this.elapsedTime;
				}
		}, {
				key: "getDelta",
				value: function getDelta() {

						var diff = 0;

						if (this.autoStart && !this.running) {

								this.start();
						}

						if (this.running) {

								var newTime = (performance || Date).now();

								diff = (newTime - this.oldTime) / 1000;
								this.oldTime = newTime;

								this.elapsedTime += diff;
						}

						return diff;
				}
		}]);

		return Clock;
})();

exports["default"] = Clock;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = (function () {
    function Player(container, x, y, ax) {
        _classCallCheck(this, Player);

        this.container = container;
        // this.container.scale.set(0.5, 0.5);
        this.x = x;
        this.y = y;

        this.container.x = this.x;
        this.container.y = this.y;
    }

    _createClass(Player, [{
        key: "animate",
        value: function animate(ax) {
            this.x += ax;

            if (this.x > window.innerWidth) {
                this.x = 0;
            }

            this.container.x = this.x;
            this.container.y = this.y;
        }
    }]);

    return Player;
})();

exports["default"] = Player;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Vector = (function () {
	function Vector(x, y) {
		_classCallCheck(this, Vector);

		this.x = x || 0;
		this.y = y || 0;
	}

	_createClass(Vector, [{
		key: 'getWidth',
		value: function getWidth() {

			return this.x;
		}
	}, {
		key: 'width',
		value: function width(value) {

			this.x = value;
		}
	}, {
		key: 'getHeight',
		value: function getHeight() {

			return this.y;
		}
	}, {
		key: 'height',
		value: function height(value) {

			this.y = value;
		}

		//

	}, {
		key: 'set',
		value: function set(x, y) {

			this.x = x;
			this.y = y;

			return this;
		}
	}, {
		key: 'setScalar',
		value: function setScalar(scalar) {

			this.x = scalar;
			this.y = scalar;

			return this;
		}
	}, {
		key: 'setX',
		value: function setX(x) {

			this.x = x;

			return this;
		}
	}, {
		key: 'setY',
		value: function setY(y) {

			this.y = y;

			return this;
		}
	}, {
		key: 'setComponent',
		value: function setComponent(index, value) {

			switch (index) {

				case 0:
					this.x = value;break;
				case 1:
					this.y = value;break;
				default:
					throw new Error('index is out of range: ' + index);

			}

			return this;
		}
	}, {
		key: 'getComponent',
		value: function getComponent(index) {

			switch (index) {

				case 0:
					return this.x;
				case 1:
					return this.y;
				default:
					throw new Error('index is out of range: ' + index);

			}
		}
	}, {
		key: 'clone',
		value: function clone() {

			return new this.constructor(this.x, this.y);
		}
	}, {
		key: 'copy',
		value: function copy(v) {

			this.x = v.x;
			this.y = v.y;

			return this;
		}
	}, {
		key: 'add',
		value: function add(v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
				return this.addVectors(v, w);
			}

			this.x += v.x;
			this.y += v.y;

			return this;
		}
	}, {
		key: 'addScalar',
		value: function addScalar(s) {

			this.x += s;
			this.y += s;

			return this;
		}
	}, {
		key: 'addVectors',
		value: function addVectors(a, b) {

			this.x = a.x + b.x;
			this.y = a.y + b.y;

			return this;
		}
	}, {
		key: 'addScaledVector',
		value: function addScaledVector(v, s) {

			this.x += v.x * s;
			this.y += v.y * s;

			return this;
		}
	}, {
		key: 'sub',
		value: function sub(v, w) {

			if (w !== undefined) {

				console.warn('THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
				return this.subVectors(v, w);
			}

			this.x -= v.x;
			this.y -= v.y;

			return this;
		}
	}, {
		key: 'subScalar',
		value: function subScalar(s) {

			this.x -= s;
			this.y -= s;

			return this;
		}
	}, {
		key: 'subVectors',
		value: function subVectors(a, b) {

			this.x = a.x - b.x;
			this.y = a.y - b.y;

			return this;
		}
	}, {
		key: 'multiply',
		value: function multiply(v) {

			this.x *= v.x;
			this.y *= v.y;

			return this;
		}
	}, {
		key: 'multiplyScalar',
		value: function multiplyScalar(scalar) {

			if (isFinite(scalar)) {

				this.x *= scalar;
				this.y *= scalar;
			} else {

				this.x = 0;
				this.y = 0;
			}

			return this;
		}
	}, {
		key: 'divide',
		value: function divide(v) {

			this.x /= v.x;
			this.y /= v.y;

			return this;
		}
	}, {
		key: 'divideScalar',
		value: function divideScalar(scalar) {

			return this.multiplyScalar(1 / scalar);
		}
	}, {
		key: 'min',
		value: function min(v) {

			this.x = Math.min(this.x, v.x);
			this.y = Math.min(this.y, v.y);

			return this;
		}
	}, {
		key: 'max',
		value: function max(v) {

			this.x = Math.max(this.x, v.x);
			this.y = Math.max(this.y, v.y);

			return this;
		}
	}, {
		key: 'clamp',
		value: function clamp(min, max) {

			// This function assumes min < max, if this assumption isn't true it will not operate correctly

			this.x = Math.max(min.x, Math.min(max.x, this.x));
			this.y = Math.max(min.y, Math.min(max.y, this.y));

			return this;
		}
	}, {
		key: 'clampScalar',
		value: function clampScalar() {

			var min, max;

			return function clampScalar(minVal, maxVal) {

				if (min === undefined) {

					min = new Vector2();
					max = new Vector2();
				}

				min.set(minVal, minVal);
				max.set(maxVal, maxVal);

				return this.clamp(min, max);
			};
		}
	}, {
		key: 'clampLength',
		value: function clampLength(min, max) {

			var length = this.length();

			return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length);
		}
	}, {
		key: 'floor',
		value: function floor() {

			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

			return this;
		}
	}, {
		key: 'ceil',
		value: function ceil() {

			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);

			return this;
		}
	}, {
		key: 'round',
		value: function round() {

			this.x = Math.round(this.x);
			this.y = Math.round(this.y);

			return this;
		}
	}, {
		key: 'roundToZero',
		value: function roundToZero() {

			this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
			this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);

			return this;
		}
	}, {
		key: 'negate',
		value: function negate() {

			this.x = -this.x;
			this.y = -this.y;

			return this;
		}
	}, {
		key: 'dot',
		value: function dot(v) {

			return this.x * v.x + this.y * v.y;
		}
	}, {
		key: 'lengthSq',
		value: function lengthSq() {

			return this.x * this.x + this.y * this.y;
		}
	}, {
		key: 'length',
		value: function length() {

			return Math.sqrt(this.x * this.x + this.y * this.y);
		}
	}, {
		key: 'lengthManhattan',
		value: function lengthManhattan() {

			return Math.abs(this.x) + Math.abs(this.y);
		}
	}, {
		key: 'normalize',
		value: function normalize() {

			return this.divideScalar(this.length());
		}
	}, {
		key: 'angle',
		value: function angle() {

			// computes the angle in radians with respect to the positive x-axis

			var angle = Math.atan2(this.y, this.x);

			if (angle < 0) angle += 2 * Math.PI;

			return angle;
		}
	}, {
		key: 'distanceTo',
		value: function distanceTo(v) {

			return Math.sqrt(this.distanceToSquared(v));
		}
	}, {
		key: 'distanceToSquared',
		value: function distanceToSquared(v) {

			var dx = this.x - v.x,
			    dy = this.y - v.y;
			return dx * dx + dy * dy;
		}
	}, {
		key: 'distanceToManhattan',
		value: function distanceToManhattan(v) {

			return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
		}
	}, {
		key: 'setLength',
		value: function setLength(length) {

			return this.multiplyScalar(length / this.length());
		}
	}, {
		key: 'lerp',
		value: function lerp(v, alpha) {

			this.x += (v.x - this.x) * alpha;
			this.y += (v.y - this.y) * alpha;

			return this;
		}
	}, {
		key: 'lerpVectors',
		value: function lerpVectors(v1, v2, alpha) {

			return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
		}
	}, {
		key: 'equals',
		value: function equals(v) {

			return v.x === this.x && v.y === this.y;
		}
	}, {
		key: 'fromArray',
		value: function fromArray(array, offset) {

			if (offset === undefined) offset = 0;

			this.x = array[offset];
			this.y = array[offset + 1];

			return this;
		}
	}, {
		key: 'toArray',
		value: function toArray(array, offset) {

			if (array === undefined) array = [];
			if (offset === undefined) offset = 0;

			array[offset] = this.x;
			array[offset + 1] = this.y;

			return array;
		}
	}, {
		key: 'fromAttribute',
		value: function fromAttribute(attribute, index, offset) {

			if (offset === undefined) offset = 0;

			index = index * attribute.itemSize + offset;

			this.x = attribute.array[index];
			this.y = attribute.array[index + 1];

			return this;
		}
	}, {
		key: 'rotateAround',
		value: function rotateAround(center, angle) {

			var c = Math.cos(angle),
			    s = Math.sin(angle);

			var x = this.x - center.x;
			var y = this.y - center.y;

			this.x = x * c - y * s + center.x;
			this.y = x * s + y * c + center.y;

			return this;
		}
	}]);

	return Vector;
})();

exports['default'] = Vector;
module.exports = exports['default'];

},{}]},{},[1]);
