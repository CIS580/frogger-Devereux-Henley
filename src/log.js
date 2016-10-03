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
