let pX; // Postiton x    (for Background image)
let pY; // Position y    (for Background image)
const pXpYarr = [
  [0, 0],
  [100, 0],
  [0, 50],
  [100, 50],
  [0, 100],
  [100, 100],
];

let playerNo = 0; // (red = 1, green = 2, yellow = 3, blue = 4)
let playerName = null; // store defult playerName
let diceBoxId = null; // store id value of dice box
let preDiceBoxId = null; // store id value of previou diceBoxId
let rndmNo = null; // generate rndmNo after dice is roll

//      ALL Audio Variables

var rollAudio = new Audio("../music/diceRollingSound.mp3");
var jumpAudio = new Audio("../music/jump-sound.mp3");

/* ************      Varialbe Diclartion End *************** */

/* ************    Object Diclartion Start  *************** */

function Position() {
  for (let i = 0; i < 53; i++) {
    this[i] = [];
  }
}

function Player(startPoint, endPoint, color) {
  this.inArea = [
    color + "-pawn1",
    color + "-pawn2",
    color + "-pawn3",
    color + "-pawn4",
  ];
  this.outArea = [];
  this.winArea = [];
  this.startPoint = startPoint;
  this.endPoint = endPoint;
}

let players = {
  playerR: new Player("out1", "out51", "r"),
  playerG: new Player("out14", "out12", "g"),
  playerY: new Player("out27", "out25", "y"),
  playerB: new Player("out40", "out38", "b"),
};

let pos = new Position(); //Create Array for indiviual Posititon

/* ************    Object Diclartion End  *************** */

/* ************      Fuction Diclartion Start *************** */

function switchDiceBoxId() {
  // switch the value of diceBoxId variable
  (playerNo == 1 && (diceBoxId = "#redDice")) ||
    (playerNo == 2 && (diceBoxId = "#greenDice")) ||
    (playerNo == 3 && (diceBoxId = "#yellowDice")) ||
    (playerNo == 4 && (diceBoxId = "#blueDice"));
}

function switchPlayerName() {
  // switch the value of playerName variable
  (playerNo == 1 && (playerName = "playerR")) ||
    (playerNo == 2 && (playerName = "playerG")) ||
    (playerNo == 3 && (playerName = "playerY")) ||
    (playerNo == 4 && (playerName = "playerB"));
}

function getNoFromValue(value) {
  return +value.match(/\d+/);
}

function check52(id) {
  if (getNoFromValue(id) == 52) return true;

  return false;
}

function nextPlayer() {
  if (playerNo == 4) playerNo = 0;
  if (rndmNo != 5) {
    playerNo++;
  }
  if (preDiceBoxId != null) $(preDiceBoxId).removeClass("showDice");
  switchDiceBoxId();
  switchPlayerName();
  preDiceBoxId = diceBoxId; // update previous dice box id
  $(diceBoxId).addClass("startDiceRoll");
  $(diceBoxId).one("click", function () {
    rollDice(diceBoxId);
  });
}

function rollDice(idValue) {
  pX = 0;
  pY = 0;

  $(idValue).removeClass("startDiceRoll").addClass("rollDice");

  rollAudio.play();
  rollAudio.playbackRate = 3.2;

  let timerId = setInterval(() => {
    (pX == 100 && ((pX = 0), (pY = pY + 25))) || (pX = pX + 20);
    $(idValue).css({
      "background-position-x": pX + "%",
      "background-position-y": pY + "%",
    });

    if (pY == 100 && pX == 100) {
      clearInterval(timerId);
      showDice(idValue);
      if (rndmNo == 5) {
        openPawn();
      } else if (rndmNo < 5) {
        movePawn();
      } else {
        setTimeout(function () {
          nextPlayer();
        }, 500);
      }
    }
  }, 20);
}

function showDice(idValue) {
  rndmNo = Math.floor(Math.random() * 6);
  pX = pXpYarr[rndmNo][0];
  pY = pXpYarr[rndmNo][1];
  $(idValue).removeClass("rollDice");
  $(idValue).addClass("showDice");
  $(idValue).css({
    "background-position-x": pX + "%",
    "background-position-y": pY + "%",
  });
}

function openPawn() {
  let inAreaLength = players[playerName].inArea.length;
  if (inAreaLength == 0) {
    return;
  } else {
    sendToOut();
  }
}

function sendToOut() {
  let startPoint = players[playerName].startPoint;
  for (const classValue of players[playerName].inArea) {
    $("." + classValue).addClass("glow");
    $("." + classValue).one("click", function () {
      let idValue = this.id;
      $("#" + idValue).removeClass(classValue);
      $("#" + startPoint).addClass(classValue);
      jumpAudio.play();
      removFromInArea(classValue);
      addToOutArea(classValue);
      updatePos(getNoFromString(startPoint), classValue);
      removeGlow(...players[playerName].inArea);
      removeEvent(...players[playerName].inArea);
      nextPlayer();
    });
  }
}

function movePawn() {
  let outAreaLength = players[playerName].outArea.length;
  if (outAreaLength == 0) {
    setTimeout(function () {
      nextPlayer();
    }, 500);
    return;
  } else {
    startMove();
  }
}

function startMove() {
  for (const classValue of players[playerName].outArea) {
    if (
      document.querySelector("." + classValue).classList.contains("glow") !=
      true
    ) {
      $("." + classValue).addClass("glow");
      $("." + classValue).one("click", function () {
        let count = -1;
        let idValue = this.id;
        let noInId = getNoFromValue(idValue);
        let newId = "out" + noInId;
        let oldId = idValue;
        let moveingClassValue = classValue;
        removeGlow(...players[playerName].outArea);
        removeEvent(...players[playerName].outArea);

        let timerId = setInterval(function () {
          count++;
          $("#" + oldId).removeClass(moveingClassValue);
          if (check52(oldId)) {
            noInId = 1;
            newId = "out" + noInId;
            oldId = newId;
          } else {
            noInId++;
            newId = "out" + noInId;
            oldId = newId;
          }
          $("#" + newId).addClass(moveingClassValue);

          if (count == rndmNo) {
            clearInterval(timerId);
            nextPlayer();
          }
        }, 500);
      });
    } else {
      continue;
    }
  }
}

function removeGlow(...classValues) {
  for (const classValue of classValues) {
    $("." + classValue).removeClass("glow");
  }
}
function removeEvent(...classValues) {
  for (const classValue of classValues) {
    $("." + classValue).off();
  }
}

function removFromInArea(removeValue) {
  let newInArea = [];
  for (const classValue of players[playerName].inArea) {
    if (classValue != removeValue) {
      newInArea.push(classValue);
    }
  }
  players[playerName].inArea = newInArea;
}

function addToOutArea(addValue) {
  players[playerName].outArea.push(addValue);
}
function removeFromOutArea(removeValue) {
  let newOutArea = [];
  for (const classValue of players[playerName].outArea) {
    if (classValue != removeValue) {
      newOutArea.push(classValue);
    }
  }
  players[playerName].outArea = newOutArea;
}

function getNoFromString(stringValue) {
  let num = +stringValue.match(/\d+/);
  return num;
}

function updatePos(posValue, classValue) {
  pos[posValue].push(classValue);
}

nextPlayer();
