(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Car = require('./car.js');
const Log = require('./log.js');
const EntityManager = require('./entity-manager.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var score = 0;
var lives = 3;
var cars = [];
var logs = [];
var entities = new EntityManager(canvas.width, canvas.height, 32);
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
  var log = new Log({x: 500, y: i * 128 + 128});
  cars.push(carTop);
  cars.push(carBot);
  logs.push(log);
  entities.addEntity(carTop);
  entities.addEntity(carBot);
  entities.addEntity(log);
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
  ;
  entities.updateEntity(player);
  entities.collide(collisionEvents);
  // TODO: Update the game objects
  cars.forEach(function(car) {
    car.update(elapsedTime);
    entities.updateEntity(car);
  });

}

function collisionEvents(entity1, entity2) {
  frogDeathCheck(entity1, entity2);
}

function frogDeathCheck(entity1, entity2) {
  if(entity1 === player && cars.includes(entity2)) {
    lives -= 1;
    entity1.x = 0;
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  if(lives > 0) {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score is: " + score, 20, 20);
    ctx.fillText("Lives: " + lives, 600, 20);
    ctx.fillStyle = "grey";
    ctx.fillRect(128, 0, 100, canvas.height);
    ctx.fillRect(320, 0, 100, canvas.height);
    logs.forEach(function(log) {
      log.render(elapsedTime, ctx);
    });
    player.render(elapsedTime, ctx);
    cars.forEach(function(car) {
      car.render(elapsedTime, ctx);
    });
  }
  else {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over",canvas.width/3, canvas.height/3);
  }
}

},{"./car.js":2,"./entity-manager.js":3,"./game.js":4,"./log.js":5,"./player.js":6}],2:[function(require,module,exports){
"use stict";

const MS_PER_FRAME = 1000/16;

module.exports =  exports = Car;


/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Car(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 70;
  this.height = 100;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_mini.svg');
  this.spritesheet.src.width = 70;
  this.spritesheet.src.height = 100;
  this.direction = {
    up: true,
    down: false,
    left: false,
    right: false
  };
  this.timer = 0;
  this.frame = 0;
}

Car.prototype.update = function(time) {
  this.timer += time;
  if(this.timer > MS_PER_FRAME) {
    if(this.y < -100){
      this.y = 600;
    }
    else {
      this.y -= 8;
    }
    this.timer = 0;
  }
}

Car.prototype.render = function(time, ctx) {
  ctx.drawImage(
    this.spritesheet,
     60, 0, this.width, this.height,
    this.x, this.y, this.width, this.height
  );
}

},{}],3:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.updateEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  // If we moved to a new cell, remove from old and add to new
  if(index != entity._cell) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    this.cells[index].push(entity);
    entity._cell = index;
  }
}

EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}

EntityManager.prototype.collide = function(callback) {
  var self = this;
  this.cells.forEach(function(cell, i) {
    // test for collisions
    cell.forEach(function(entity1) {
      // check for collisions with cellmates
      cell.forEach(function(entity2) {
        if(entity1 != entity2) checkForCollision(entity1, entity2, callback);

        // check for collisions in cell to the right
        if(i % (self.widthInCells - 1) != 0) {
          self.cells[i+1].forEach(function(entity2) {
            checkForCollision(entity1, entity2, callback);
          });
        }

        // check for collisions in cell below
        if(i < self.numberOfCells - self.widthInCells) {
          self.cells[i+self.widthInCells].forEach(function(entity2){
            checkForCollision(entity1, entity2, callback);
          });
        }

        // check for collisions diagionally below and right
        if(i < self.numberOfCells - self.withInCells && i % (self.widthInCells - 1) != 0) {
          self.cells[i+self.widthInCells + 1].forEach(function(entity2){
            checkForCollision(entity1, entity2, callback);
          });
        }
      });
    });
  });
}

function checkForCollision(entity1, entity2, callback) {
  var collides = !(entity1.x + entity1.width < entity2.x ||
                   entity1.x > entity2.x + entity2.width ||
                   entity1.y + entity1.height < entity2.y ||
                   entity1.y > entity2.y + entity2.height);
  if(collides) {
    callback(entity1, entity2);
  }
}

EntityManager.prototype.renderCells = function(ctx) {
  for(var x = 0; x < this.widthInCells; x++) {
    for(var y = 0; y < this.heightInCells; y++) {
      ctx.strokeStyle = '#333333';
      ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
  }
}

},{}],4:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],5:[function(require,module,exports){
"use stict";

const MS_PER_FRAME = 1000/16;

module.exports =  exports = Log;

function Log(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 180;
  this.height = 180;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/wood.svg.png');
  this.spritesheet.src.width = 180;
  this.spritesheet.src.height = 180;
  this.timer = 0;
  this.frame = 0;
}

Log.prototype.update = function(time) {
  this.timer += time;
  if(this.timer > MS_PER_FRAME) {
    if(this.y > 500){
      this.y = -100;
    }
    else {
      this.y += 8;
    }
    this.timer = 0;
  }
}

Log.prototype.render = function(time, ctx) {
  ctx.drawImage(
    this.spritesheet,
     0, 0, this.width, this.height,
    this.x, this.y, this.width, this.height
  );
}

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 100;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite0.png');
  this.input = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  this.direction = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  this.timer = 0;
  this.frame = 0;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
        if(this.input.up || this.input.down || this.input.left || this.input.right) {
          this.state="moving";
          this.direction.up = this.input.up;
          this.direction.down = this.input.down;
          this.direction.left = this.input.left;
          this.direction.right = this.input.right;
          this.frame = 0;
        }
      }
      break;
    case "moving":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.direction.up) this.y -= 16;
        else if (this.direction.down) this.y += 16;
        else if (this.direction.right) this.x += 16;
        else if (this.direction.left) this.x -= 16;
        if(this.frame > 3) {
          this.frame = 0;
          this.state = "idle";
        }
      }
      break;
    default:
      break;
    // TODO: Implement your player's update by state
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
    case "moving":
      ctx.drawImage(
        this.spritesheet,
        this.frame * 64, 0, this.width, this.height,
        this.x, this.y, this.width, this.height
      );
      break;
    default:
      break;
  }
}

},{}]},{},[1]);
