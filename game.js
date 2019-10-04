/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/
let CurrentSession = {}
let canvas;
let ctx;

canvas = document.createElement("canvas");
canvas.style = "position:absolute; top:10%;left: 50%; margin-left: -250px;";
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, TheUglyDogReally, TheTableReally;
let bgImage, heroImage, monsterImage, TheUglyDogImage, TheTableImage;
let Direction = 1;
let startTime = Date.now();
let SECONDS_PER_ROUND = 30;
let elapsedTime = 0;
let scope = 0;
let PlayerName = ''
let MonsterImager = ['images/banhmi.png', 'images/bread.png', 'images/donut.png', 'images/hambuger.png', 'images/stawperry.png']
let CurrentMonster = 0
// FUNCTIONS WILL GOES FROM HERE

///DEFINE WHAT DIRECTION MONSTER WILL RUN
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function MonsterRunDirectionGenerator() {
  while (true) {
    Direction = Math.ceil((Math.random() * (4 - 1) + 1));
    await sleep(1000);
  }
};

function DontRunThoughTheTablePlease(FutureX, FutureY) {
  if (Math.abs(FutureX - (TheTableX+16)) <= 32 && Math.abs(FutureY - (TheTableY+16)) <= 20) { return true } else { return false }
}
  // Load user name on call
  function LoadUsername() {
    UserName = document.getElementById('username').value;
    if (UserName.length > 0) {
      PlayerName = UserName;
    } else {
      PlayerName = "Unknown";
    }
    console.log('This time, the summoner is:', PlayerName);
  }

  function loadImages() {
    bgImage = new Image();
    bgImage.onload = function () {
      // show the background image
      bgReady = true;
    };
    bgImage.src = "images/background.jpg";
    heroImage = new Image();
    heroImage.onload = function () {
      // show the hero image
      heroReady = true;
    };
    heroImage.src = "images/Garfield.png";

    monsterImage = new Image();
    monsterImage.onload = function () {
      // show the monster image
      monsterReady = true;
    };
    monsterImage.src = MonsterImager[CurrentMonster];

    TheUglyDogImage = new Image();
    TheUglyDogImage.onload = function () {
      // show the Ugly Dog image
      TheUglyDogReally = true;
    };
    TheUglyDogImage.src = "images/rsz_1bear.png";

    TheTableImage = new Image();
    TheTableImage.onload = function () {
      // show the Table image
      TheTableReally = true;
    };
    TheTableImage.src = "images/rsz_table.png";
  };

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = Math.floor(Math.random() * (canvas.width - 32));
let monsterY = Math.floor(Math.random() * (canvas.height - 32));

let TheUglyDogX = -100;
let TheUglyDogY = -100;

let TheTableX = Math.floor(Math.random() * (canvas.width - 32));
let TheTableY = Math.floor(Math.random() * (canvas.height - 32));

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}
// Get Previous games information

function getOldSession() {
  let GetCurrentSession = localStorage.getItem("PreviousSession")
  if (GetCurrentSession == null) {
    CurrentSession = {
      isGameOver: false,
      Top1: {
        user: "Garfield", score: 1
      },
      highScopes: []
    }
    localStorage.setItem("PreviousSession", JSON.stringify(CurrentSession))
  } else {
    CurrentSession = JSON.parse(GetCurrentSession)
    CurrentSession.isGameOver = false;
  }
}

//NOW MONSTER NEED TO CHASE THE GARFIELD

function RunGarfieldRunnnnnn() {
  if (CurrentSession.isGameOver == false) {
    if (TheUglyDogX >= heroX) {
      TheUglyDogX -= 3;
    } if (TheUglyDogX <= heroX) {
      TheUglyDogX += 3;
    } if (TheUglyDogY >= heroY) {
      TheUglyDogY -= 3;
    } if (TheUglyDogY <= heroY) {
      TheUglyDogY += 3;
    }
  }
};


function MosterRunnnnnnnnn() {
  if (CurrentSession.isGameOver === false) {
    if (Direction === 1) {
      monsterX -= 5;
    }
    if (Direction === 2) {
      monsterY += 5;
    }
    if (Direction === 3) {
      monsterX += 5;
    }
    if (Direction === 4) {
      monsterY -= 5;
    }
  } else if (CurrentSession.isGameOver === true) {
  }
}

function HeroDontFalllllll() {
  if (heroX <= 2) {
    heroX = canvas.width - 2;
  } else if (heroX >= (canvas.width - 2)) {
    heroX = 2;
  }
  // Handel up-down
  if (heroY <= 2) {
    heroY = canvas.height - 2;
  } else if (heroY >= (canvas.height - 2)) {
    heroY = 2;
  };
};

function MonsterDontFalllll() {
  if (monsterX <= 2) {
    monsterX = canvas.width - 2;
  } else if (monsterX >= (canvas.width - 2)) {
    monsterX = 2;
  }
  // Handel up-down
  if (monsterY <= 2) {
    monsterY = canvas.height - 2;
  } else if (monsterY >= (canvas.height - 2)) {
    monsterY = 2;
  };
};

function HeroControl() {
  if (CurrentSession.isGameOver === false) {
    if (38 in keysDown) { // Player is holding up key
      let Blocked = DontRunThoughTheTablePlease(heroX, heroY - 7)
      if (Blocked === false) {
        heroY -= 7;
      }
    }
    if (40 in keysDown) { // Player is holding down key
      let Blocked = DontRunThoughTheTablePlease(heroX, heroY + 7)
      if (Blocked === false) {
        heroY += 7;
      }
    }
    if (37 in keysDown) { // Player is holding left key
      let Blocked = DontRunThoughTheTablePlease(heroX - 7, heroY)
      if (Blocked === false) {
        heroX -= 7;
      }
    }
    if (39 in keysDown) { // Player is holding right key
      let Blocked = DontRunThoughTheTablePlease(heroX + 7, heroY)
      if (Blocked === false) {
        heroX += 7;
      }
    }
  } else if (CurrentSession.isGameOver === true) {
  }
}

/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */

let update = function () {
  // Update the time.
  if (CurrentSession.isGameOver == false) {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  } else if (CurrentSession.isGameOver == true) {
    elapsedTime = 30;
  }
  //I want to control my hero
  HeroControl()
  //Monster run run run
  MosterRunnnnnnnnn()
  // If hero touch the border, he will pull off
  HeroDontFalllllll()
  // If Monster touch the border, he will pull off
  MonsterDontFalllll()
  ///The ugly dog trying to catch Garfield
  RunGarfieldRunnnnnn()
  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  let GarfieldTouchMonster =
    (heroX <= (monsterX + 32)
      && heroY <= (monsterY + 32)
      && monsterX <= (heroX + 32)
      && monsterY <= (heroY + 32)) || false;

  let UglyDogTouchGarfield =
    (heroX <= (TheUglyDogX + 32)
      && heroY <= (TheUglyDogY + 32)
      && TheUglyDogX <= (heroX + 32)
      && TheUglyDogY <= (heroY + 32)) || false;

  if (GarfieldTouchMonster) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    monsterX = Math.floor(Math.random() * (canvas.width - 32));
    monsterY = Math.floor(Math.random() * (canvas.height - 32));
    scope++;
    elapsedTime--;

    if (CurrentMonster < MonsterImager.length - 1) {
      CurrentMonster += 1;
      monsterImage.src = MonsterImager[CurrentMonster];
    } else if (CurrentMonster + 1 >= MonsterImager.length) {
      CurrentMonster = 0;
      monsterImage.src = MonsterImager[CurrentMonster];
    }
  }

  if (UglyDogTouchGarfield) {
    //End the game
    CurrentSession.isGameOver = true;
  }

};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (TheUglyDogReally) {
    ctx.drawImage(TheUglyDogImage, TheUglyDogX, TheUglyDogY);
  }
  if (TheTableReally) {
    ctx.drawImage(TheTableImage, TheTableX, TheTableY);
  }
  ctx.font = "10px Verdana";
  if (CurrentSession.isGameOver === false) {
    let Remaining = ctx.fillText(`Seconds Remaining: ${SECONDS_PER_ROUND - elapsedTime}`, canvas.width / 2 - 50, 100);
  } else {
    let Remaining = ctx.fillText(`The game is over now!`, canvas.width / 2 - 50, 100);
  }
  ctx.fillText(`Your scope: ${scope}`, 20, 40)
  ctx.fillText(`High scope: ${CurrentSession.Top1.score} | ${CurrentSession.Top1.user}`, 20, 70)

};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
let main = function () {
  update();
  render();
  ///Break the game if time down to 0

  if (elapsedTime >= 30) {
    CurrentSession.highScopes.push({ "user": PlayerName, "scope": scope })
    CurrentSession.isGameOver = true;
    localStorage.setItem('PreviousSession', JSON.stringify(CurrentSession))
  }
  ///Change the highscope if user react to it
  if (scope > CurrentSession.Top1.score) {
    CurrentSession.Top1.score = scope;
    CurrentSession.Top1.user = PlayerName;
  }
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
function StartTheFun() {
  startTime = Date.now();
  MonsterRunDirectionGenerator();
  getOldSession();
  loadImages();
  setupKeyboardListeners();
  main();
};

//Call Username Modal
$(document).ready(function () {
  $('#tallModal').modal('show');
});


function ResetTheGame() {
  startTime = Date.now();
  SECONDS_PER_ROUND = 30;
  elapsedTime = 0;
  scope = 0;
  CurrentSession.isGameOver = false;
  heroX = canvas.width / 2;
  heroY = canvas.height / 2;
  monsterX = Math.floor(Math.random() * (canvas.width - 32));
  monsterY = Math.floor(Math.random() * (canvas.height - 32));
  TheUglyDogX = -100;
  TheUglyDogY = -100;
}