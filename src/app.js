"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Car = require('./car.js');
const EntityManager = require('./entity-manager.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var score = 0;
var lives = 3;
var cars = [];
var entities = new EntityManager(canvas.width, canvas.height, 128);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
};
player.input = input;


entities.addEntity(player);
for(i=0;i<2;i++) {
  var carTop = new Car({x: i * 192 + 128, y: i * 128 + 50});
  var carBot = new Car({x: i * 192 + 128, y: i * 128 + 250});
  cars.push(carTop);
  cars.push(carBot);
  entities.addEntity(carTop);
  entities.addEntity(carBot);
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


window.onkeydown = function(event) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      input.down = true;
      break;
    case "ArrowUp":
      event.preventDefault();
      input.up = true;
      break;
    case "ArrowRight":
      event.preventDefault();
      input.right = true;
      break;
    case "ArrowLeft":
      event.preventDefault();
      input.left = true;
      break;
    default:
      return;
  }
}

window.onkeyup = function(event) {
  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      input.down = false;
      break;
    case "ArrowUp":
      event.preventDefault();
      input.up = false;
      break;
    case "ArrowRight":
      event.preventDefault();
      input.right = false;
      break;
    case "ArrowLeft":
      event.preventDefault();
      input.left = false;
      break;
    default:
      return;
  }
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  if(player.x > canvas.width) {
    score += 1;
    player.x = 0;
  }
  entities.updateEntity(player);
  // TODO: Update the game objects
  cars.forEach(function(car) {
    car.update(elapsedTime);
    entities.updateEntity(car);
  });

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score is: " + score, 20, 20);
  player.render(elapsedTime, ctx);
  cars.forEach(function(car) {
    car.render(elapsedTime, ctx);
  });
}
