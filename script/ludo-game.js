const TOTALRUN = 55;
let diceBoxId = null;
let pawnBoxClass = null;
let playerNo = 0;
let playerName = null;
let count = -1;
let rndmNo = null;
let preId;
let pX = 0;
let pY = 0;
let noInId = null;
let newId = null;
let oldId = null;
const pXpYarr = [
  [0, 0],
  [100, 0],
  [0, 50],
  [100, 50],
  [0, 100],
  [100, 100],
];

function Position(){
  for(let i = 0; i < 53; i++){
    this[i] = [];
  }
}

let pos = new Position();

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
  playerR: new Player(1, 51, "r"),
  playerG: new Player(14, 12, "g"),
  playerY: new Player(27, 25, "y"),
  playerB: new Player(40, 38, "b"),
};

function switchId() {
  (playerNo == 1 && (diceBoxId = "#redDice")) ||
    (playerNo == 2 && (diceBoxId = "#greenDice")) ||
    (playerNo == 3 && (diceBoxId = "#yellowDice")) ||
    (playerNo == 4 && (diceBoxId = "#blueDice"));
}

function switchClass() {
  (diceBoxId == "#redDice" && (pawnBoxClass = "r-")) ||
    (diceBoxId == "#greenDice" && (pawnBoxClass = "g-")) ||
    (diceBoxId == "#yellowDice" && (pawnBoxClass = "y-")) ||
    (diceBoxId == "#blueDice" && (pawnBoxClass = "b-"));
}

function switchStartPoint() {
  let startPoint;
  (diceBoxId == "#redDice" && (startPoint = players.playerR.startPoint)) ||
    (diceBoxId == "#greenDice" && (startPoint = players.playerG.startPoint)) ||
    (diceBoxId == "#yellowDice" && (startPoint = players.playerY.startPoint)) ||
    (diceBoxId == "#blueDice" && (startPoint = players.playerB.startPoint));

  return startPoint;
}

function switchPlayerName() {
  (playerNo == 1 && (playerName = "playerR")) ||
    (playerNo == 2 && (playerName = "playerG")) ||
    (playerNo == 3 && (playerName = "playerY")) ||
    (playerNo == 4 && (playerName = "playerB"));
}

function getNoFromClass(className) {
  let noInClass = +className.match(/\d+/);
  return noInClass;
}

function getNoFromId(idValue) {
  let id = +idValue.match(/\d+/);
  return id;
}

function getPlayerName(color) {
  if (color == "r") return "playerR";
  else if (color == "g") return "playerG";
  else if (color == "y") return "playerY";
  else return "playerB";
}

function getClassList(id) {
  let classList = document.getElementById(id).classList;
  let temp = [];
  for (let i = 0; i < classList.length; i++) {
    temp[i] = classList[i];
  }
  return temp;
}

function getPos(playerName, noInClass) {
  return players[playerName].pos[noInClass - 1];
}

function setPos(playerName, className, newPos) {
  players[playerName].pos[getNoFromClass(className) - 1] = newPos;
}

function getColorFromClass(className){
  return className.charAt(0);
}



function checkEnd() {
  if (getNoFromId(id) == players[playerName].endPoint) {
    return true;
  }
  return false;
}

// function checkCut(){

// }



function nextPlayer() {
  if (playerNo == 4) playerNo = 0;
  if (rndmNo != 5) {
    playerNo++;
    if (preId != null) $(preId).removeClass("showDice");
  }
  switchId();
  switchPlayerName();
  $(diceBoxId).addClass("startDiceRoll");
  $(diceBoxId).one("click", function () {
    rollingDice(diceBoxId);
  });
}

function rollingDice(idValue) {
  pX = 0;
  pY = 0;
  // if (preId != idValue)
  //   $(preId).removeClass("showDice");

  $(idValue).removeClass("showDice").addClass("rollDice");

  var audio = new Audio("../music/diceRollingSound.mp3");
  audio.play();
  audio.playbackRate = 3.2;

  let timerId = setInterval(function () {
    if (pX == 100) {
      pX = 0;
      pY = pY + 25;
    } else {
      pX = pX + 20;
    }

    $(idValue).css({
      "background-position-x": pX + "%",
      "background-position-y": pY + "%",
    });

    if (pY == 100 && pX == 100) {
      clearInterval(timerId);
      showDice(idValue);
      if (rndmNo < 5) {
        movePawn(idValue);
      } else {
        openPawn(idValue);
      }
    }
  }, 20);
}

function showDice(idValue) {
  rndmNo = Math.floor(Math.random() * 6);
  preId = idValue;
  pX = pXpYarr[rndmNo][0];
  pY = pXpYarr[rndmNo][1];
  $(idValue).removeClass("rollDice").removeClass("startDiceRoll");
  $(idValue).addClass("showDice");
  $(idValue).css({
    "background-position-x": pX + "%",
    "background-position-y": pY + "%",
  });
}

function openPawn(idValue) {
  if (rndmNo != 5) {
    movePawn(idValue);
    return;
  } else if (players[playerName].inArea.length == 0) {
    movePawn(idValue);
    return;
  } else {
    let inAreaLength = players[playerName].inArea.length;
    for (let i = 0; i < inAreaLength; i++) {
      $("." + players[playerName].inArea[i]).addClass("glow");
      $("." + players[playerName].inArea[i]).one("click", function () {
        if (players[playerName].outArea.length != 0) {
          for (let i = 0; i < players[playerName].outArea.length; i++) {
            $("." + players[playerName].outArea[i]).removeClass("glow");
            $("." + players[playerName].outArea[i]).removeAttr("data-listner");
            $("." + players[playerName].outArea[i]).off();
          }
        }
        let startPoint = switchStartPoint();
        let idValue = this.id;
        let classList = getClassList(idValue);
        let newInArea = [];
        for (let i = 0; i < players[playerName].inArea.length; i++) {
          if (classList[1] == players[playerName].inArea[i]) {
            players[playerName].inArea[i];
            continue;
          } else {
            newInArea.push(players[playerName].inArea[i]);
          }
        }
        players[playerName].inArea = newInArea;
        players[playerName].outArea.push(classList[1]);
        setPos(playerName, classList[1], startPoint);
        $("#" + idValue).removeClass(classList[1]);
        $("#out" + startPoint).addClass(classList[1]);
        let audio = new Audio("../music/jump-sound.mp3");
        audio.play();
        $("." + classList[1]).removeClass("glow");
        $("." + classList[0]).removeClass("glow");
        $("." + classList[0]).off();
        $(diceBoxId).removeClass("showDice");
        nextPlayer();
      });
    }
    if (players[playerName].outArea.length != 0) movePawn(idValue);
  }
}

function movePawn(idValue) {
  let outAreaLength = players[playerName].outArea.length;
  if (outAreaLength == 0) {
    setTimeout(function () {
      $(idValue).removeClass("showDice");
      nextPlayer();
      return;
    }, 1000);
  } else {
    for (let i = 0; i < 4; i++) {
      if (
        (players[playerName].pos[i] != 0) &&
        ($("#out" + players[playerName].pos[i]).attr("data-flag") == undefined)
      ) {
        $("#out" + players[playerName].pos[i]).attr("data-flag","true");
        $("#out" + players[playerName].pos[i]).addClass("glow");
        $("#out" + players[playerName].pos[i]).one("click", function () {
          if (rndmNo == 5) {
            for (let i = 0; i < players[playerName].inArea.length; i++) {
              $("." + players[playerName].inArea[i]).removeClass("glow");
              $("." + players[playerName].inArea[i]).off();
            }
          }
          let idValue = this.id;
          $("#" + idValue).removeClass("glow");
          
          noInId = getNoFromId(idValue);
          newId = "out" + noInId;
          oldId = newId;
          let timerId = setInterval(function () {
            count++;
            let classList = getClassList(oldId);
            if (classList.length >= 1) {
              if (
                classList[0] != "star-stop" &&
                classList[0].search("box") == -1
              ) {
                $("#" + oldId).removeClass(classList[0]);
                $("#" + oldId).removeAttr("data-flag");
                if (check52(oldId)) {
                  noInId = 1;
                  newId = "out" + noInId;
                  oldId = newId;
                } else {
                  noInId++;
                  newId = "out" + noInId;
                  oldId = newId;
                }
                setPos(playerName,classList[0],noInId);
                $("#" + newId).addClass(classList[0]);
                $("#" + newId).attr("data-flag","true");
              } else {
                $("#" + oldId).removeClass(classList[1]);
                $("#" + oldId).removeAttr("data-flag");
                if (check52(oldId)) {
                  noInId = 1;
                  newId = "out" + noInId;
                  oldId = newId;
                } else {
                  noInId++;
                  newId = "out" + noInId;
                  oldId = newId;
                }
                $("#" + newId).addClass(classList[1]);
                setPos(playerName, classList[1], noInId);
                $("#" + newId).attr("data-flag", "true");
              }
            }
            if (count == rndmNo) {
              for (let i = 0; i < 4; i++) {
                if (players[playerName].pos[i] != 0)
                  $("#out" + players[playerName].pos[i]).removeClass("glow");
                  $("#out" + players[playerName].pos[i]).removeAttr("data-flag");
              }
             
              count = -1;

              $(preId).removeClass("showDice");
              nextPlayer();
            }
          }, 500);
        });
      } else {
        continue;
      }
    }
  }
}

nextPlayer();
