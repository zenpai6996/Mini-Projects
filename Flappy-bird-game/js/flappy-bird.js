//?board
let board ;
let boardWidth = 360;
let boardHeight = 640;

//?bird
let birdWidth = 34;//*width-height ratio : 408/228 : 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;//*to get the bird png on the right position on the canvas
// let birdImg;
let birdImgs = [];
let birdImgsIndex = 0;

let bird = {
  x : birdX,
  y : birdY,
  width : birdWidth,
  height : birdHeight
}

//?pipes
let pipeArray =[];
let pipeWidth = 64;//*width-height ratio : 384/3072px = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//? game physics 
let velocityX = -2;// pipes moving left speed
let velocityY = 0;// bird jump speed
let gravity =  0.4;
let gameOver = false;
let score = 0;
let wingSound = new Audio("sounds/sfx_swooshing.wav");
let hitSound = new Audio("sounds/sfx_die.wav");
let bgm = new Audio("sounds/bgm_mario.mp3");
bgm.loop = true;
let pointSound = new Audio("sounds/sfx_point.wav");
let cheatModeActive = false;


window.onload = function(){
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");//! this is for  drawing on the board/canvas element

  //todo: draw flappy bird

  // context.fillStyle = "green";//!changes the pen color to green
  // context.fillRect(bird.x , bird.y ,bird.width , bird.height);

  //todo: load bird image
  // birdImg = new Image();
  // birdImg.src = "assets/flappybird.png";
  // birdImg.onload = function(){
  // context.drawImage(birdImg , bird.x, bird.y, bird.width,bird.height);   //! draws the bird image on the the campus when loaded similar to the fillRect function
  // }

    for(let i=0; i<4 ;i++){
      let birdImg = new Image();
      birdImg.src = `assets/flappybird${i}.png`;
      birdImgs.push(birdImg);
    }

  //todo: load bottom and top pipe image

  topPipeImg = new Image();
  topPipeImg.src = "assets/toppipe.png";
  bottomPipeImg = new Image();
  bottomPipeImg.src = "assets/bottompipe.png"

  requestAnimationFrame(update);
  setInterval(placePipes , 1500);  //! places pipes every 1.5 seconds
  setInterval(animateBird , 100)//every 1/10th of a second
  
  //! event listener to check for button press to move the bird up

  document.addEventListener("keydown",cheatMode);
  document.addEventListener("keydown",moveBird);
  

}

function update(){
  requestAnimationFrame(update);

  if(gameOver){
    return;
  }

  context.clearRect( 0 , 0 , board.width , board.height );//*clearing the canvas so that the frames dont stack on eachother

  velocityY += gravity;

  // bird.y += velocityY;

  bird.y = Math.max(bird.y + velocityY ,
   0);
    //apply gravity and make sure it doesnt go past the canvas
  
  //? drawing bird over and over for each frame
  // context.drawImage(birdImg , bird.x, bird.y, bird.width , bird.height);
  context.drawImage(birdImgs[birdImgsIndex] , bird.x, bird.y, bird.width , bird.height);
  // birdImgsIndex++;// increment to next frame
  // birdImgsIndex %= birdImgs.length ;//circle back with modulus, max frame is 4//012301230123

  if(bird.y > boardHeight){
    gameOver = true ;
  }

  //? for pipes 
  for(let i = 0; i < pipeArray.length ; i++){
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img , pipe.x , pipe.y , pipe.width , pipe.height);

    if(!pipe.passed && bird.x > pipe.x + pipe.width){
      score += 0.5;//otherwise score will increase by 2 due to 2 pipes up and down.
      pointSound.play();
      pipe.passed = true;
    }
    if(!cheatModeActive){
     
      for(let pipe of pipeArray){
        if(detectCollision(bird,pipe)){
          gameOver = true;
          break;
        }
      }
    }

    if(detectCollision(bird , pipe)){
      hitSound.play();
      gameOver = true ;
    }

  }


  //todo: clear pipes
  while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth ){
    pipeArray.shift();//removes 1st element from array to avoid causing memory issues 
  }
  //todo: score 
  context.fillStyle = "white";
  context.font = "40px sans-serif";
  context.fillText(score , 5 , 45); //x pos. -> 5 , y pos. -> 45

  if(gameOver){
    context.fillText("GAME OVER :)", 40 , 320 );
    bgm.pause();
    bgm.currentTime = 0;
  }

  
}

function animateBird(){
  birdImgsIndex++;// increment to next frame
  birdImgsIndex %= birdImgs.length ;
}

function placePipes(){

  if(gameOver){
    return;
  }

  //todo:Math.random returns value between 1 & 2 (0 to 1) *  (pipeHeight/2)
  //todo: if 0 -> -128 *(pipeHeight/2)
  //todo: if 1 ->  -128 -256 -> (pipeHeight/4 -pipeHeight/2) = (-3/4 pipeHeight)
  //todo: (-pipeHeight/4 to - 3*pipeHeight/4) toppipe range
  
  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
  //! pipeY - pipeHeight/4
  //! 0 - 512/4 = - 128 ->shifting the pipe upwards by 128px above the canvas

  let openingspace = board.height / 4;


  let topPipe = {

    img : topPipeImg,
    x : pipeX,
    y : randomPipeY,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  }

  pipeArray.push(topPipe);// pushes toppipes to array every 1.5s

  let bottomPipe = {
    img : bottomPipeImg,
    x : pipeX,
    y : randomPipeY + pipeHeight + openingspace,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  }

  pipeArray.push(bottomPipe);//pushes bottompipes to array every 1.5s

}

function moveBird(e){// e is the parameter for thekey event 
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyW"){

    if(bgm.paused){
      bgm.play();
    }
    // wingSound.play();
    //jump
    velocityY = -6;

    //reset game
    if(gameOver){
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false ;
    }

  }

}
function cheatMode(e){
  if(e.code == 'KeyX'){
   
   cheatModeActive = !cheatModeActive;
  }
}

function detectCollision(a,b){//a and b parameter for two rectangles to check for collisions

  if (cheatModeActive){
    context.fillText("cheatModeOn ;)" , 5 , 80);
    return false;
  } 

//! The function uses the Axis-Aligned Bounding Box (AABB) collision detection algorithm. It checks if the rectangles overlap on both the x-axis and y-axis.

  return a.x < b.x + b.width &&// Checks if the left edge of a is to the left of the right edge of b.

         a.x + a.width > b.x &&// Checks if the right edge of a is to the right of the left edge of b.

         a.y < b.y + b.height &&// Checks if the top edge of a is above the bottom edge of b.

         a.y + a.height > b.y;//Checks if the top edge of a is above the bottom edge of b.

}
