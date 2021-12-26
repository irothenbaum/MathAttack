/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./components/FX/ParticleSprite.js":
/*!*****************************************!*\
  !*** ./components/FX/ParticleSprite.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _models_Particle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../models/Particle */ \"./models/Particle.js\");\n/* harmony import */ var _models_Renderable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../models/Renderable */ \"./models/Renderable.js\");\n/* harmony import */ var _constants_engine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../constants/engine */ \"./constants/engine.js\");\n\n\n\n\nclass ParticleSprite extends _models_Renderable__WEBPACK_IMPORTED_MODULE_1__[\"default\"] {\n  /**\n   * @param {Particle} particle\n   */\n  constructor(particle) {\n    super()\n    this.particle = particle\n  }\n\n  step(timeDelta) {\n    this.particle.stepFrame(timeDelta)\n  }\n\n  draw(ctx) {\n    const pos = this.particle.position\n    ctx.beginPath()\n    ctx.arc(pos.x, pos.y, this.particle.size, 0, _constants_engine__WEBPACK_IMPORTED_MODULE_2__.TAU, false)\n    ctx.fillStyle = this.particle.color\n    ctx.fill()\n    ctx.lineWidth = 5\n    ctx.strokeStyle = '#000033'\n    ctx.stroke()\n  }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ParticleSprite);\n\n\n//# sourceURL=webpack://mathattack/./components/FX/ParticleSprite.js?");

/***/ }),

/***/ "./constants/engine.js":
/*!*****************************!*\
  !*** ./constants/engine.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GRAVITY_PIXELS_PER_SECOND\": () => (/* binding */ GRAVITY_PIXELS_PER_SECOND),\n/* harmony export */   \"GRAVITY_PIXELS_PER_MS\": () => (/* binding */ GRAVITY_PIXELS_PER_MS),\n/* harmony export */   \"FRAMES_PER_SECOND\": () => (/* binding */ FRAMES_PER_SECOND),\n/* harmony export */   \"FRAMES_PER_MS\": () => (/* binding */ FRAMES_PER_MS),\n/* harmony export */   \"MS_PER_FRAME\": () => (/* binding */ MS_PER_FRAME),\n/* harmony export */   \"PIXELS_PER_SECOND\": () => (/* binding */ PIXELS_PER_SECOND),\n/* harmony export */   \"PIXELS_PER_MS\": () => (/* binding */ PIXELS_PER_MS),\n/* harmony export */   \"TAU\": () => (/* binding */ TAU),\n/* harmony export */   \"DIRECTION_EAST\": () => (/* binding */ DIRECTION_EAST),\n/* harmony export */   \"DIRECTION_NORTH\": () => (/* binding */ DIRECTION_NORTH),\n/* harmony export */   \"DIRECTION_WEST\": () => (/* binding */ DIRECTION_WEST),\n/* harmony export */   \"DIRECTION_SOUTH\": () => (/* binding */ DIRECTION_SOUTH),\n/* harmony export */   \"getForceOfGravity\": () => (/* binding */ getForceOfGravity),\n/* harmony export */   \"applyVectorToCoordinates\": () => (/* binding */ applyVectorToCoordinates),\n/* harmony export */   \"addManyVectors\": () => (/* binding */ addManyVectors),\n/* harmony export */   \"addVectors\": () => (/* binding */ addVectors),\n/* harmony export */   \"coordinatesToVector\": () => (/* binding */ coordinatesToVector),\n/* harmony export */   \"vectorToCoordinates\": () => (/* binding */ vectorToCoordinates),\n/* harmony export */   \"round\": () => (/* binding */ round)\n/* harmony export */ });\n/* harmony import */ var _models_Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/Vector */ \"./models/Vector.js\");\n/* harmony import */ var _models_Coordinates__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/Coordinates */ \"./models/Coordinates.js\");\n/* harmony import */ var _models_Acceleration__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/Acceleration */ \"./models/Acceleration.js\");\n\n\n// import {Dimensions} from 'react-native'\n\n\nconst GRAVITY_PIXELS_PER_SECOND = 20\nconst GRAVITY_PIXELS_PER_MS = GRAVITY_PIXELS_PER_SECOND / 1000\nconst FRAMES_PER_SECOND = 30\nconst FRAMES_PER_MS = FRAMES_PER_SECOND / 1000\nconst MS_PER_FRAME = 1 / FRAMES_PER_MS\nconst PIXELS_PER_SECOND = 500 // Dimensions.get('window').width -- the standard unit of speed is the screen width in 1 second\nconst PIXELS_PER_MS = PIXELS_PER_SECOND / 1000\nconst TAU = Math.PI * 2\n\nconst DIRECTION_EAST = 0\nconst DIRECTION_NORTH = Math.PI * 1.5\nconst DIRECTION_WEST = Math.PI\nconst DIRECTION_SOUTH = Math.PI * 0.5\n\nfunction getForceOfGravity() {\n  return new _models_Acceleration__WEBPACK_IMPORTED_MODULE_2__[\"default\"](GRAVITY_PIXELS_PER_MS, new _models_Vector__WEBPACK_IMPORTED_MODULE_0__[\"default\"](0, DIRECTION_SOUTH))\n}\n\n/**\n * @param {Coordinates} coordinates\n * @param {Vector} v2\n * @returns {Coordinates}\n */\nfunction applyVectorToCoordinates(coordinates, v2) {\n  let pos2 = vectorToCoordinates(v2)\n\n  let newX = coordinates.x + pos2.x\n  let newY = coordinates.y + pos2.y\n\n  let retVal = new _models_Coordinates__WEBPACK_IMPORTED_MODULE_1__[\"default\"](newX, newY)\n  return retVal\n}\n\n/**\n * @param {Array<Vector>} vectors\n * @returns {*}\n */\nfunction addManyVectors(vectors) {\n  let retVal = vectors[0]\n\n  for (let i = 1; i < vectors.length; i++) {\n    retVal = addVectors(retVal, vectors[i])\n  }\n\n  return retVal\n}\n\n/**\n * @param {Vector} v1\n * @param {Vector} v2\n * @returns {Vector}\n */\nfunction addVectors(v1, v2) {\n  let pos1 = vectorToCoordinates(v1)\n  let newCoordinates = applyVectorToCoordinates(pos1, v2)\n  return coordinatesToVector(newCoordinates)\n}\n\n/**\n * @param {Coordinates} coords\n * @returns {Vector}\n */\nfunction coordinatesToVector(coords) {\n  // we need to negate Y so that our grid coordinates match the graph coordinates\n  /*\n           (-)\n            ^\n            |\n            |\n  (-)<------|------>(+)\n            |\n            |\n            V\n           (+)\n   */\n  let rawRotation = round(Math.atan(coords.y / coords.x))\n  if (coords.x < 0) {\n    rawRotation += Math.PI\n  }\n  let newRotation = (TAU + rawRotation) % TAU\n  let newSpeed = Math.sqrt(Math.pow(coords.x, 2) + Math.pow(coords.y, 2))\n  let retVal = new _models_Vector__WEBPACK_IMPORTED_MODULE_0__[\"default\"](newSpeed, newRotation)\n  return retVal\n}\n\n/**\n * @param {Vector} vector\n * @returns {Coordinates}\n */\nfunction vectorToCoordinates(vector) {\n  return new _models_Coordinates__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\n    round(Math.cos(vector.direction)) * vector.speed,\n    round(Math.sin(vector.direction)) * vector.speed,\n  )\n}\n\nfunction round(v) {\n  return Math.round(v * 10000) / 10000\n}\n\n\n//# sourceURL=webpack://mathattack/./constants/engine.js?");

/***/ }),

/***/ "./models/Acceleration.js":
/*!********************************!*\
  !*** ./models/Acceleration.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector */ \"./models/Vector.js\");\n/* harmony import */ var _constants_engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/engine */ \"./constants/engine.js\");\n\n\n\nclass Acceleration {\n  /**\n   * @param {number} velocityDelta\n   * @param {Vector} startingVelocity\n   */\n  constructor(velocityDelta, startingVelocity) {\n    this.velocityDelta = velocityDelta\n    this.startingVelocity = startingVelocity\n    this.currentVelocity = startingVelocity\n  }\n\n  /**\n   * @param {number} timeMS\n   * @returns {Vector}\n   */\n  getVelocityAtTime(timeMS) {\n    return new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\n      this.startingVelocity + this.velocityDelta * timeMS * _constants_engine__WEBPACK_IMPORTED_MODULE_1__.PIXELS_PER_MS,\n      this.currentVelocity.direction,\n    )\n  }\n\n  /**\n   * @param {number} timeDelta\n   * @returns {Vector}\n   */\n  stepFrame(timeDelta) {\n    this.currentVelocity = new _Vector__WEBPACK_IMPORTED_MODULE_0__[\"default\"](\n      this.currentVelocity.speed +\n        this.velocityDelta * timeDelta +\n        _constants_engine__WEBPACK_IMPORTED_MODULE_1__.PIXELS_PER_MS,\n      this.currentVelocity.direction,\n    )\n\n    return this.currentVelocity\n  }\n\n  /**\n   * @returns {Acceleration}\n   */\n  clone() {\n    let retVal = new Acceleration(this.velocityDelta, this.currentVelocity)\n    retVal.startingVelocity = this.startingVelocity\n\n    return retVal\n  }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Acceleration);\n\n\n//# sourceURL=webpack://mathattack/./models/Acceleration.js?");

/***/ }),

/***/ "./models/Coordinates.js":
/*!*******************************!*\
  !*** ./models/Coordinates.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Coordinates {\n  constructor(x, y) {\n    this.x = x\n    this.y = y\n  }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Coordinates);\n\n\n//# sourceURL=webpack://mathattack/./models/Coordinates.js?");

/***/ }),

/***/ "./models/Particle.js":
/*!****************************!*\
  !*** ./models/Particle.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SIZE_SMALL\": () => (/* binding */ SIZE_SMALL),\n/* harmony export */   \"SIZE_MEDIUM\": () => (/* binding */ SIZE_MEDIUM),\n/* harmony export */   \"SIZE_LARGE\": () => (/* binding */ SIZE_LARGE),\n/* harmony export */   \"SPEED_SLOW\": () => (/* binding */ SPEED_SLOW),\n/* harmony export */   \"SPEED_MEDIUM\": () => (/* binding */ SPEED_MEDIUM),\n/* harmony export */   \"SPEED_FAST\": () => (/* binding */ SPEED_FAST),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _styles_colors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/colors */ \"./styles/colors.js\");\n/* harmony import */ var _Vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector */ \"./models/Vector.js\");\n/* harmony import */ var _Coordinates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Coordinates */ \"./models/Coordinates.js\");\n/* harmony import */ var _Acceleration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Acceleration */ \"./models/Acceleration.js\");\n/* harmony import */ var _constants_engine__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/engine */ \"./constants/engine.js\");\n\n\n\n\n\n\nconst SIZE_SMALL = 6\nconst SIZE_MEDIUM = 14\nconst SIZE_LARGE = 24\n\nconst SPEED_SLOW = 1\nconst SPEED_MEDIUM = 2\nconst SPEED_FAST = 4\n\nlet ID_Counter = 0\n\nclass Particle {\n  /**\n   * @param {string} color\n   * @param {number} size\n   * @param {Coordinates} position\n   * @param {Vector} initialVelocity\n   * @param {number} duration\n   */\n  constructor(color, size, position, initialVelocity, duration) {\n    this.id = ++ID_Counter\n    this.color = color\n    this.size = size\n    this.position = position\n    this.duration = duration\n\n    // the 2 forces that act on a particle are its constant initial velocity and gravity\n    this.forces = [new _Acceleration__WEBPACK_IMPORTED_MODULE_3__[\"default\"](0, initialVelocity), (0,_constants_engine__WEBPACK_IMPORTED_MODULE_4__.getForceOfGravity)()]\n  }\n\n  /**\n   * @param {number} timeDelta\n   */\n  stepFrame(timeDelta) {\n    this.duration -= timeDelta\n\n    if (this.duration < 0) {\n      // TODO: destroy\n      return\n    }\n\n    // new force vectors\n    let velocities = this.forces.map(a => a.stepFrame(timeDelta))\n    let consolidatedVector = (0,_constants_engine__WEBPACK_IMPORTED_MODULE_4__.addManyVectors)(velocities)\n    this.position = (0,_constants_engine__WEBPACK_IMPORTED_MODULE_4__.applyVectorToCoordinates)(this.position, consolidatedVector)\n  }\n\n  // TODO: How to pass generation rules with gradients and randomization (color, size, etc)\n  static generateRandom(duration) {\n    let dir = Math.random() * _constants_engine__WEBPACK_IMPORTED_MODULE_4__.TAU\n    return new Particle(\n      _styles_colors__WEBPACK_IMPORTED_MODULE_0__.white,\n      SIZE_SMALL,\n      new _Coordinates__WEBPACK_IMPORTED_MODULE_2__[\"default\"](200, 200),\n      new _Vector__WEBPACK_IMPORTED_MODULE_1__[\"default\"](4, dir),\n      duration,\n    )\n  }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Particle);\n\n\n//# sourceURL=webpack://mathattack/./models/Particle.js?");

/***/ }),

/***/ "./models/Renderable.js":
/*!******************************!*\
  !*** ./models/Renderable.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Renderable {\n  draw(ctx) {}\n  step(timeDelta) {}\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Renderable);\n\n\n//# sourceURL=webpack://mathattack/./models/Renderable.js?");

/***/ }),

/***/ "./models/Vector.js":
/*!**************************!*\
  !*** ./models/Vector.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nclass Vector {\n  /**\n   * @param {number} speed\n   * @param {number} direction -- rotation in radians, 0 === East\n   */\n  constructor(speed, direction) {\n    this.speed = speed\n    this.direction = direction\n  }\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vector);\n\n\n//# sourceURL=webpack://mathattack/./models/Vector.js?");

/***/ }),

/***/ "./styles/colors.js":
/*!**************************!*\
  !*** ./styles/colors.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"black\": () => (/* binding */ black),\n/* harmony export */   \"darkGrey\": () => (/* binding */ darkGrey),\n/* harmony export */   \"grey\": () => (/* binding */ grey),\n/* harmony export */   \"middleGrey\": () => (/* binding */ middleGrey),\n/* harmony export */   \"lightGrey\": () => (/* binding */ lightGrey),\n/* harmony export */   \"nearWhite\": () => (/* binding */ nearWhite),\n/* harmony export */   \"white\": () => (/* binding */ white),\n/* harmony export */   \"neonMagenta\": () => (/* binding */ neonMagenta),\n/* harmony export */   \"neonOrange\": () => (/* binding */ neonOrange),\n/* harmony export */   \"neonGreen\": () => (/* binding */ neonGreen),\n/* harmony export */   \"neonBlue\": () => (/* binding */ neonBlue),\n/* harmony export */   \"neonRed\": () => (/* binding */ neonRed)\n/* harmony export */ });\nconst black = '#000'\nconst darkGrey = '#333'\nconst grey = '#777'\nconst middleGrey = '#aaa'\nconst lightGrey = '#ccc'\nconst nearWhite = '#e4e4e4'\nconst white = '#fff'\n\nconst neonMagenta = '#e600ff'\nconst neonOrange = '#ff7700'\nconst neonGreen = '#37ff00'\nconst neonBlue = '#00aeff'\nconst neonRed = '#ff0000'\n\n\n//# sourceURL=webpack://mathattack/./styles/colors.js?");

/***/ }),

/***/ "./test.js":
/*!*****************!*\
  !*** ./test.js ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_FX_ParticleSprite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/FX/ParticleSprite */ \"./components/FX/ParticleSprite.js\");\n/* harmony import */ var _models_Particle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models/Particle */ \"./models/Particle.js\");\n/* harmony import */ var _constants_engine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/engine */ \"./constants/engine.js\");\n/* harmony import */ var _models_Vector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models/Vector */ \"./models/Vector.js\");\n/* harmony import */ var _models_Coordinates__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models/Coordinates */ \"./models/Coordinates.js\");\n\n\n\n\n\n\n\nlet canvas\nlet lastStep = 0\nlet renderables = [...new Array(100)].map(\n  () => new _components_FX_ParticleSprite__WEBPACK_IMPORTED_MODULE_0__[\"default\"](_models_Particle__WEBPACK_IMPORTED_MODULE_1__[\"default\"].generateRandom(5000)),\n)\n\nfunction start() {\n  if (!canvas) {\n    return\n  }\n\n  let now = Date.now()\n  if (lastStep === 0) {\n    lastStep = now\n  }\n\n  const ctx = canvas.getContext('2d')\n\n  ctx.clearRect(0, 0, canvas.width, canvas.height)\n\n  if (renderables.length > 0) {\n    renderables.forEach(p => {\n      p.draw(ctx)\n    })\n\n    renderables.forEach(p => {\n      p.step(now - lastStep)\n    })\n  }\n\n  lastStep = now\n}\n\n$(document).ready(function () {\n  canvas = $('#canvas')[0]\n  canvas.width = $(window).width()\n  canvas.height = $(window).height()\n  setInterval(start, _constants_engine__WEBPACK_IMPORTED_MODULE_2__.MS_PER_FRAME)\n})\n\n\n//# sourceURL=webpack://mathattack/./test.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./test.js");
/******/ 	
/******/ })()
;