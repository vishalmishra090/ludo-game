const RSTARTPOINT = "#out1";
const GSTARTPOINT = "#out14";
const YSTARTPOINT = "#out27";
const BSTARTPOINT = "#out40";
const TOTALRUN = 50;
let diceBoxId = null;
let pawnBoxClass = null;
let playerNo = 0;
let rndmNo = null;
function Player() {
  this.inArea = ["pawn1", "pawn2", "pawn3", "pawn4"];
  this.outArea = [];
  this.winArea = [];
}

let player1 = new Player();
let player2 = new Player();
let player3 = new Player();
let player4 = new Player();

let pX = 0;
let pY = 0;
let preId;
let pXpYarr = [
  [0, 0],
  [100, 0],
  [0, 50],
  [100, 50],
  [0, 100],
  [100, 100],
];
function switchId() {
  (playerNo == 1 && (diceBoxId = "#redDice")) ||
    (playerNo == 2 && (diceBoxId = "#greenDice")) ||
    (playerNo == 3 && (diceBoxId = "#yellowDice")) ||
    (playerNo == 4 && (diceBoxId = "#blueDice"));
}

function switchClass() {
  (diceBoxId == "#redDice" && (pawnBoxClass = ".r-pawn")) ||
    (diceBoxId == "#greenDice" && (pawnBoxClass = ".g-pawn")) ||
    (diceBoxId == "#yellowDice" && (pawnBoxClass = ".y-pawn")) ||
    (diceBoxId == "#blueDice" && (pawnBoxClass = ".b-pawn"));
}

function switchStartPoint(){
  let startPoint;
  (diceBoxId == "#redDice" && (startPoint = RSTARTPOINT)) ||
    (diceBoxId == "#greenDice" && (startPoint = GSTARTPOINT)) ||
    (diceBoxId == "#yellowDice" && (startPoint = YSTARTPOINT)) ||
    (diceBoxId == "#blueDice" && (startPoint = BSTARTPOINT));

  return startPoint;
}

function playGame() {
  if (playerNo == 4) playerNo = 0;
  playerNo++;
  switchId();
  $(diceBoxId).addClass("startDiceRoll");
  $(diceBoxId).one("click", function () {
    rollingDice(diceBoxId);
  });
}

function rollingDice(idValue) {
  pX = 0;
  pY = 0;
  // if (preId != idValue)
  //   $(preId).removeClass("showDice").addClass("startDiceRoll");

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
      openPawn();
    }
  }, 20);
}

function showDice(idValue) {
  rndmNo = Math.floor(Math.random() * 6);
  // preId = idValue;
  pX = pXpYarr[rndmNo][0];
  pY = pXpYarr[rndmNo][1];
  $(idValue).removeClass("rollDice").removeClass("startDiceRoll");
  if (rndmNo == 5) {
    $(idValue).addClass("showDice");
    $(idValue).css({
      "background-position-x": pX + "%",
      "background-position-y": pY + "%",
    });
  }
}

function openPawn() {
  if (rndmNo != 5) {
    playGame();
    return;
  } else {
    switchClass();
    $(pawnBoxClass).addClass("glow");
    $(pawnBoxClass).one("click", function () {
      let startPoint = switchStartPoint();
      let idValue = this.id;
      let classList = document.getElementById(idValue).classList;
      let targetClass = [classList[0], classList[1], classList[2]];
      console.log(targetClass);

      $("#" + idValue).removeClass(targetClass[1]);
      $("#" + idValue).removeClass(targetClass[2]);
      $(startPoint).addClass(targetClass[2]);
      let audio = new Audio("../music/jump-sound.mp3");
      audio.play();
      $("." + targetClass[0]).removeClass("glow");
      $("." + targetClass[0]).off();
      $(diceBoxId).removeClass("showDice");
      playGame();
    });
  }
}

playGame();
