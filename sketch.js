var vehicles = [];
var vehicleCount = 10;
var food = [];
var foodCount = 40;
var poison = [];
var poisonCount = 20;

function setup() {
  createCanvas(640,360);

  for (var i=0; i < vehicleCount; i++){
    var x = random(width);
    var y = random(height);
    vehicles[i] = new Vehicle(x, y);
  }

  for (var i=0; i < foodCount; i++){
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  for (var i=0; i < poisonCount; i++){
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }
}

function draw() {
  background(51);

  if (random(1) < 0.05){
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  if (random(1) < 0.01){
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }

  for (var i=0; i < food.length; i++){
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 8, 8);
  }

  for (var i=0; i < poison.length; i++){
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 8, 8);
  }

  for (var i = vehicles.length - 1; i >= 0; i--){
    vehicles[i].boundaries();
    vehicles[i].behaviours(food, poison);
    vehicles[i].update();
    vehicles[i].display();

    var newVehicle = vehicles[i].clone();
    if (newVehicle != null){
      vehicles.push(newVehicle);
    }

    if (vehicles[i].dead()){
      var x = vehicles[i].pos.x;
      var y = vehicles[i].pos.y;
      food.push(createVector(x, y));

      vehicles.splice(i, 1);
    }

  }
}
