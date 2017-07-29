//Vehicle Class
function Vehicle(x, y){
  this.acc = createVector(0,0);
  this.vel = createVector(0,-2);
  this.pos = createVector(x, y);
  this.r = 6;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  this.dna = []
  this.dna[0] = random(-5,5);
  this.dna[1] = random(-5,5);

}

//Update vehicle object
Vehicle.prototype.update = function () {
  this.vel.add(this.acc);
  this.vel.limit(this.maxspeed);
  this.pos.add(this.vel);
  this.acc.mult(0);
}

//Apply given force to the vehicle
Vehicle.prototype.applyForce = function (force) {
  this.acc.add(force);
}

Vehicle.prototype.behaviours = function (good, bad) {
  var steerG = this.eat(good);
  var steerB = this.eat(bad);

  steerG.mult(this.dna[0]);
  steerB.mult(this.dna[1]);

  this.applyForce(steerG);
  this.applyForce(steerB);
}

Vehicle.prototype.eat = function (list) {
  var record = Infinity;
  var closest = -1;

  for (var i=0; i < list.length; i++){
    var d = this.pos.dist(list[i]);
    if (d < record){
      record = d;
      closest = i;
    }
  }

  if (record < 5){
    list.splice(closest, 1);
  }else if (closest > -1){
    return this.seek(list[closest]);
  }

  return createVector(0,0);
}

//Steer the vehicle towards a given target
Vehicle.prototype.seek = function (target) {
  var desired = p5.Vector.sub(target, this.pos);

  desired.setMag(this.maxspeed);

  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);

  return steer;
}

//Display the vehicle to the canvas
Vehicle.prototype.display = function () {
  var angle = this.vel.heading() + PI/2;

  fill(127);
  stroke(200);
  strokeWeight(1);
  push()
  translate(this.pos.x, this.pos.y);
  rotate(angle);
  beginShape();
  vertex(0, -this.r*2);
  vertex(-this.r, this.r*2);
  vertex(this.r, this.r*2);
  endShape(CLOSE);
  pop();
}
