var v;
var food = [];
var foodCount = 10;
var poison = [];
var poisonCount = 10;

function setup() {
  createCanvas(640,360);
  v = new Vehicle(width/2, height/2);
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

  v.behaviours(food, poison);
  v.update();
  v.display();

}
