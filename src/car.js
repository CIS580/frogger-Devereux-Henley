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
