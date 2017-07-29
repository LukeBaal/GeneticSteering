//Vehicle Class
function Vehicle(x, y, dna){
  this.acc = createVector(0,0);
  this.vel = createVector(0,-2);
  this.pos = createVector(x, y);
  this.r = 4;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  this.health = 1;

  this.dna = []
  if (dna === undefined){
    //Food weight
    this.dna[0] = random(-2,2);
    //Poison weight
    this.dna[1] = random(-2,2);
    //Food perception
    this.dna[2] = random(0, 100);
    //Poison perception
    this.dna[3] = random(0, 100);
  }else{
    this.dna[0] = dna[0];
    this.dna[1] = dna[1];
    this.dna[2] = dna[2];
    this.dna[3] = dna[3];
  }
}

//Update vehicle object
Vehicle.prototype.update = function () {
  this.health -= 0.005;

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
  var steerG = this.eat(good, 0.2, this.dna[2]);
  var steerB = this.eat(bad, -0.5, this.dna[3]);

  steerG.mult(this.dna[0]);
  steerB.mult(this.dna[1]);

  this.applyForce(steerG);
  this.applyForce(steerB);
}

//Make new copy of this vehicle object
Vehicle.prototype.clone = function () {
  if (random(1) < 0.001) return new Vehicle(this.pos.x, this.pos.y, this.dna);
  else return null;
}

Vehicle.prototype.eat = function (list, nutrition, perception) {
  var record = Infinity;
  var closest = null;

  for (var i=list.length-1; i >= 0 ; i--){
    var d = this.pos.dist(list[i]);

    //Eating
    if (d < this.maxspeed){
      //Remove food/poison that was consume and update vehicle health
      list.splice(i, 1);
      this.health += nutrition;
    }else{ //If no consumption occurs, find closest food/poison
      if (d < record && d < perception){
        record = d;
        closest = list[i];
      }
    }
  }

  //If a closest food/poison exists, steer towards/away from it.
  if (closest != null){
    //Steer towards/away the closest food/posion
    return this.seek(closest);
  }
  //If nothing happens, return a zero vector
  return createVector(0,0);
}

//Return a steering vector towards/away from the food/poison
Vehicle.prototype.seek = function (target) {
  var desired = p5.Vector.sub(target, this.pos);

  desired.setMag(this.maxspeed);

  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);

  return steer;
}

//If out of health, return true, false otherwise.
Vehicle.prototype.dead = function () {
  return (this.health < 0);
}

//Display the vehicle to the canvas
Vehicle.prototype.display = function () {
  var angle = this.vel.heading() + PI/2;


  push()
  translate(this.pos.x, this.pos.y);
  rotate(angle);

  strokeWeight(3)
  stroke(0, 255, 0);
  noFill();
  line(0, 0, 0, -this.dna[0]*20);
  strokeWeight(2)
  ellipse(0,0,this.dna[2]*2);
  stroke(255, 0, 0);
  line(0, 0, 0, -this.dna[1]*20);
  ellipse(0,0,this.dna[3]*2);

  var full = color(0, 255, 0);
  var empty = color(255, 0, 0);
  var colour = lerpColor(empty, full, this.health);

  fill(colour);
  stroke(colour);
  strokeWeight(1);
  beginShape();
  vertex(0, -this.r*2);
  vertex(-this.r, this.r*2);
  vertex(this.r, this.r*2);
  endShape(CLOSE);
  pop();
}

Vehicle.prototype.boundaries = function() {
  var d = 25;

  var desired = null;

  if (this.pos.x < d) {
    desired = createVector(this.maxspeed, this.vel.y);
  }
  else if (this.pos.x > width -d) {
    desired = createVector(-this.maxspeed, this.vel.y);
  }

  if (this.pos.y < d) {
    desired = createVector(this.vel.x, this.maxspeed);
  }
  else if (this.pos.y > height-d) {
    desired = createVector(this.vel.x, -this.maxspeed);
  }

  if (desired !== null) {
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
}
