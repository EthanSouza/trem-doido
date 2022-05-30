const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;


let engine, world;

var ground, tower, towerImg;
var backgroundImg;
var cannon;
var angle;
var balls = [];
var boats = [];

var boatSpritedata, boatSpritesheet; 
var boatAnimation = [];

var brokenBoatSpritedata, brokenBoatSpritesheet;
var brokenBoatAnimation = [];

var waterSplashSpritedata, waterSplashSpritesheet;
var waterSplashAnimation = [];

var backgroundMusic, cannonExplosionMusic, cannonWaterMusic, pirateLaughMusic;

var isGameOver = false

function preload() {

  backgroundImg = loadImage("/assets/background.gif");
  towerImg = loadImage("/assets/tower.png");
 
  boatSpritedata = loadJSON("/assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");

  brokenBoatSpritedata = loadJSON("/assets/boat/brokenBoat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/brokenBoat.png");

  waterSplashSpritedata = loadJSON("/assets/waterSplash/waterSplash.json");
  waterSplashSpritesheet = loadImage("/assets/waterSplash/waterSplash.png");

  backgroundMusic = loadSound("/assets/background_music.mp3");
  cannonExplosionMusic = loadSound("assets/cannon_explosion.mp3");
  cannonWaterMusic = loadSound("assets/cannon_water.mp3");
  pirateLaughMusic = loadSound("assets/pirate_laugh.mp3");
}

function setup() {
  createCanvas(1200, 600);

  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);
  angle = 28;
  
  options = {
    isStatic:true
  }
 
  ground= Bodies.rectangle(0,height-1, width*2,1,options);
  World.add(world,ground);
 
  tower = Bodies.rectangle(140,350,160,310,options);
  World.add(world,tower);

  cannon = new Cannon(150,110,130,100,20);


  var boatFrames = boatSpritedata.frames;
  
  for (var i=0; i < boatFrames.length; i++){
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }

 var brokenBoatFrames = brokenBoatSpritedata.frames;

 for (var i=0; i < brokenBoatFrames.length; i++){
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    brokenBoatAnimation.push(img);
 }
 
 var waterSplashFrames = waterSplashSpritedata.frames

 for(var i=0; i < waterSplashFrames.length; i++){
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
 }
}

function draw() {
  image(backgroundImg, 0,0,1200,600);
  Engine.update(engine);

  if(!backgroundMusic.isPlaying()){
    backgroundMusic.play();
    backgroundMusic.setVolume(0.5);
  }
 
  rect(ground.position.x, ground.position.y,width*2,1);
  
  push();
  imageMode(CENTER);
  image(towerImg, tower.position.x, tower.position.y, 160,310);
  pop();

  cannon.display();
  
  for(var i=0; i < balls.length; i++){
    showCannonBalls(balls[i], i)
    collisionWithBoat(i);
  }

 showBoats();

}
  
function keyPressed(){
   if (keyCode === DOWN_ARROW){
   var cannonBall = new CannonBall(cannon.x, cannon.y);
   balls.push(cannonBall);
  }
}


function keyReleased(){

    if (keyCode === DOWN_ARROW){
      balls[balls.length -1].shoot();
      cannonExplosionMusic.play();
      cannonExplosionMusic.setVolume(0.5)
    }
  }

  function showCannonBalls(ball, i){
    if(ball){
      ball.display();
      ball.animate();
      if(ball.body.position.y >= height -40){
        ball.remove(i);
      }else if (ball.body.position.x > width){
        ball.removeImediate(i); 
      }
    }
  }

  function showBoats(){
    
    if(boats.length > 0){

      if(boats[boats.length-1] === undefined || 
        boats[boats.length-1].body.position.x < width -300){
      
       var positions = [-40, -60, -70, -20]
       var position = random(positions);
       var boat = new Boat(width, height -60, 170, 170, position, boatAnimation)
    
       boats.push(boat);
      }
    
    for(var i=0; i < boats.length; i++){

      if(boats[i]){
        Body.setVelocity(boats[i].body, {x: -0.9, y: 0})

        boats[i].display();
        boats[i].animate();
        
        var collision = Matter.SAT.collides(tower, boats[i].body);
        
        if(collision.collided && !boats[i].isBroken){
          isGameOver = true;
          gameOver();
        }
      }


    }
    }else{
      var boat = new Boat(width -80, height -60, 170, 170, -80, boatAnimation)
      boats.push(boat);
    }
  
  }

  function collisionWithBoat(index){
    for(var i=0; i< boats.length; i++){
      if(balls[index] !== undefined && boats[i] !== undefined){
        var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
        
        if (collision.collided){
          
          boats[i].remove(i);

          World.remove(world, balls[index].body);
          delete balls[index];

        }
      }
    }
  }

  function gameOver(){
     swal({
      title: `Fim de jogo!!`, 
      text: "Obrigo por jogar!",
      imageUrl: "https://imageproxy.ifunny.co/crop:x-20,resize:640x,quality:90x75/images/fc63dd1fea3eda036d73d69e697eeb35347d15e859e1d2f14e504ba1bae5088e_1.jpg",
      imageSize: "150X150",
      confirmButtonText: "Jogar Novamente"
    },
     function (isConfirm){
      if(isConfirm){
        location.reload();
      } 
     }
);
  
}