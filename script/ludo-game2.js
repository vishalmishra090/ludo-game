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
let preIdValue = null;
let rndmNo = null; // generate rndmNo after dice is roll
let countSix = 0;
let cut = false;
let win = false;

let winningPos = [];

const winAreaPxPY = [
  [[380, 380]],
  [
    [380, 380],
    [305, 305],
  ],
  [
    [380, 380],
    [230, 380],
    [380, 230],
  ],
  [
    [380, 380],
    [230, 380],
    [305, 305],
    [380, 230],
  ],
];

//      ALL Audio Variables

var rollAudio = new Audio("../music/diceRollingSound.mp3");
var jumpAudio = new Audio("../music/jump-sound.mp3");

/* ************      Varialbe Diclartion End *************** */

/* ************    Object Diclartion Start  *************** */

function Position(length) {
  for (let i = 1; i <= length; i++) {
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
  this.winPath = [];
  this.winArea = [];
  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.winPathPos = new Position(5);
}

let players = {
  rPlayer: new Player("out1", "out51", "r"),
  gPlayer: new Player("out14", "out12", "g"),
  yPlayer: new Player("out27", "out25", "y"),
  bPlayer: new Player("out40", "out38", "b"),
};

let pos = new Position(52); //Create Array for indiviual Posititon

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
  (playerNo == 1 && (playerName = "rPlayer")) ||
    (playerNo == 2 && (playerName = "gPlayer")) ||
    (playerNo == 3 && (playerName = "yPlayer")) ||
    (playerNo == 4 && (playerName = "bPlayer"));
}

function getNoFromValue(value) {
  return +value.match(/\d+/);
}
function getColorFromClass(className) {
  return className.charAt(0);
}

function check52(id) {
  if (getNoFromValue(id) == 52) return true;

  return false;
}

function checkEnd(id) {
  if (getNoFromValue(id) == getNoFromValue(players[playerName].endPoint)) {
    return true;
  }
  return false;
}

function checkWinPathEnd(id) {
  if (getNoFromValue(id) == 5) {
    return true;
  }
  return false;
}

function nextPlayer() {
  if(winningPos.length == 3){
    setTimeout(function(){
      restartGame();
    }, 1000);
    return;
  }
  if (playerNo == 4) playerNo = 0;
  if ((rndmNo != 5 && cut != true && win != true) || countSix == 3) {
    playerNo++;
    countSix = 0;
    preIdValue = null;
  }
  win = false;
  cut = false;
  if (preDiceBoxId != null) $(preDiceBoxId).removeClass("showDice");
  switchDiceBoxId();
  switchPlayerName();
  if (
    players[playerName].winArea.length == 4 ||
    (players[playerName].inArea.length == 0 &&
      players[playerName].outArea.length == 0 &&
      players[playerName].winPath.length == 0)
  ) {
    if (rndmNo == 5) {
      rndmNo = null;
    }
    nextPlayer();
  } else {
    preDiceBoxId = diceBoxId; // update previous dice box id
    $(diceBoxId).addClass("startDiceRoll");
    $(diceBoxId).one("click", function () {
      rollDice(diceBoxId);
    });
  }
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
      if (rndmNo == 5 && countSix != 3) {
        openPawn();
        movePawn();
        moveOnWinPath();
      } else if (rndmNo < 5) {
        movePawn();
        moveOnWinPath();
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
  if (
    (preIdValue == null && rndmNo == 5) ||
    (preIdValue == idValue && rndmNo == 5)
  ) {
    countSix++;
  }

  if (countSix == 3) {
    pX = pXpYarr[rndmNo][0];
    pY = pXpYarr[rndmNo][1];
    $(idValue).removeClass("rollDice");
    $(idValue).addClass("showDice");
    $(idValue).css({
      "background-position-x": pX + "%",
      "background-position-y": pY + "%",
    });
    return;
  } else {
    pX = pXpYarr[rndmNo][0];
    pY = pXpYarr[rndmNo][1];
    $(idValue).removeClass("rollDice");
    $(idValue).addClass("showDice");
    $(idValue).css({
      "background-position-x": pX + "%",
      "background-position-y": pY + "%",
    });
    preIdValue = idValue;
  }
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
      let noInId = getNoFromValue(startPoint);
      let posLength = pos[noInId].length;
      let w = null;
      let h = null;
      if (posLength > 0) {
        w = 100 / (posLength + 1);
        h = 100 / (posLength + 1);
        for (const cValue of pos[noInId]) {
          $("." + cValue).css({
            width: w + "%",
            height: h + "%",
          });
        }
      } else {
        w = 100;
        h = 100;
      }
      $("." + classValue).remove();
      $("#" + startPoint).append(
        `<div class="${classValue}" style="width:${w}%; height:${h}%;"></div>`
      );
      jumpAudio.play();
      removFromInArea(classValue, playerName);
      addToOutArea(classValue, playerName);
      addPos(getNoFromString(startPoint), classValue);
      removeGlow(...players[playerName].inArea);
      removeEvent(...players[playerName].inArea);
      removeGlow(...players[playerName].outArea);
      removeEvent(...players[playerName].outArea);
      nextPlayer();
    });
  }
}

function movePawn() {
  let outAreaLength = players[playerName].outArea.length;
  if (outAreaLength == 0) {
    return;
  } else {
    // if (outAreaLength == 1 && rndmNo != 5) {
    //   autoMove();
    // } else {
    startMove();
    // }
  }
}

function startMove() {
  for (const classValue of players[playerName].outArea) {
    $("." + classValue).addClass("glow");
    $("." + classValue).one("click", function () {
      let count = -1;
      let idValue = $(this).parent().attr("id");
      let noInId = getNoFromValue(idValue);
      let newId = "out" + noInId;
      let oldId = idValue;
      let w = null;
      let h = null;

      let moveingClassValue = classValue;
      let color = getColorFromClass(moveingClassValue);
      removeGlow(...players[playerName].outArea);
      removeEvent(...players[playerName].outArea);
      removeEvent(...players[playerName].inArea);
      removeGlow(...players[playerName].inArea);
      removeEvent(...players[playerName].winPath);
      removeGlow(...players[playerName].winPath);

      let timerId = setInterval(function () {
        if (checkEnd(newId)) {
          count++;
          removePos(noInId, moveingClassValue);
          removeFromOutArea(moveingClassValue, playerName);
          $("." + moveingClassValue).remove();
          noInId = 1;
          newId = color + "-out-" + noInId;
          addToWinPath(moveingClassValue, playerName);
          addWinPathPos(noInId, moveingClassValue, playerName);
          if (players[playerName].winPathPos[noInId].length > 0) {
            w = 100 / players[playerName].winPathPos[noInId].length;
            h = 100 / players[playerName].winPathPos[noInId].length;
            for (const cValue of players[playerName].winPathPos[noInId]) {
              $("." + cValue).css({
                width: w + "%",
                height: h + "%",
              });
            }
          } else {
            w = 100;
            h = 100;
          }
          $("#" + newId).append(
            `<div class="${moveingClassValue}" style="width:${w}%; height:${h}%;"></div>`
          );
          jumpAudio.play();
        } else if (players[playerName].winPath.includes(moveingClassValue)) {
          count++;
          $("." + moveingClassValue).remove();
          removeWinPathPos(noInId, moveingClassValue, playerName);
          if (players[playerName].winPathPos[noInId].length > 0) {
            w = 100 / players[playerName].winPathPos[noInId].length;
            h = 100 / players[playerName].winPathPos[noInId].length;
            for (const cValue of players[playerName].winPathPos[noInId]) {
              $("." + cValue).css({
                width: w + "%",
                height: h + "%",
              });
            }
          }

          noInId++;
          newId = color + "-out-" + noInId;
          addWinPathPos(noInId, moveingClassValue, playerName);
          if (players[playerName].winPathPos[noInId].length > 0) {
            w = 100 / players[playerName].winPathPos[noInId].length;
            h = 100 / players[playerName].winPathPos[noInId].length;
            for (const cValue of players[playerName].winPathPos[noInId]) {
              $("." + cValue).css({
                width: w + "%",
                height: h + "%",
              });
            }
          } else {
            w = 100;
            h = 100;
          }
          $("#" + newId).append(
            `<div class="${moveingClassValue}" style="width:${w}%; height:${h}%;"></div>`
          );
          jumpAudio.play();
        } else {
          count++;
          $("." + moveingClassValue).remove();
          removePos(noInId, moveingClassValue);
          if (pos[noInId].length > 0) {
            w = 100 / pos[noInId].length;
            h = 100 / pos[noInId].length;
            for (const cValue of pos[noInId]) {
              $("." + cValue).css({
                width: w + "%",
                height: h + "%",
              });
            }
          }
          if (check52(oldId)) {
            noInId = 1;
            newId = "out" + noInId;
            oldId = newId;
          } else {
            noInId++;
            newId = "out" + noInId;
            oldId = newId;
          }
          if (pos[noInId].length > 0) {
            w = 100 / (pos[noInId].length + 1);
            h = 100 / (pos[noInId].length + 1);
            for (const cValue of pos[noInId]) {
              $("." + cValue).css({
                width: w + "%",
                height: h + "%",
              });
            }
          } else {
            w = 100;
            h = 100;
          }
          addPos(noInId, moveingClassValue);
          $("#" + newId).append(
            `<div class="${moveingClassValue}" style="width:${w}%; height:${h}%;"></div>`
          );
          jumpAudio.play();
        }

        if (count == rndmNo) {
          clearInterval(timerId);
          cutPawn(noInId, moveingClassValue);
          nextPlayer();
        }
      }, 300);
    });
  }
}

function moveOnWinPath() {
  if (players[playerName].winPath.length == 0) {
    if (players[playerName].outArea.length == 0) {
      if (players[playerName].inArea.length == 0) {
        nextPlayer();
      } else {
        if (rndmNo != 5) {
          setTimeout(function () {
            nextPlayer();
          }, 500);
          return;
        }
      }
    }
    return;
  }

  if (
    rndmNo == 5 &&
    (players[playerName].outArea.length != 0 ||
      players[playerName].inArea.length != 0)
  ) {
    return;
  }

  if (
    rndmNo == 5 &&
    players[playerName].outArea.length == 0 &&
    players[playerName].inArea.length == 0
  ) {
    setTimeout(function () {
      nextPlayer();
    }, 500);
    return;
  }

  let flag = false;

  for (const cValue of players[playerName].winPath) {
    let idValue = $("." + cValue)
      .parent()
      .attr("id");
    let noInId = getNoFromValue(idValue);
    if (rndmNo <= 5 - noInId) {
      flag = true;
      $("." + cValue).addClass("glow");
      $("." + cValue).one("click", function () {
        let idValue = $(this).parent().attr("id");
        let moveingClassValue = cValue;
        let noInId = getNoFromValue(idValue);
        let color = getColorFromClass(moveingClassValue);
        let count = -1;
        let newId = color + "-out-" + noInId;
        let oldId = newId;
        let w = null;
        let h = null;
        removeGlow(...players[playerName].outArea);
        removeEvent(...players[playerName].outArea);
        removeEvent(...players[playerName].inArea);
        removeGlow(...players[playerName].inArea);
        removeEvent(...players[playerName].winPath);
        removeGlow(...players[playerName].winPath);

        let timerId = setInterval(function () {
          count++;
          $("." + moveingClassValue).remove();
          removeWinPathPos(noInId, moveingClassValue, playerName);
          if (players[playerName].winPathPos[noInId].length > 0) {
            w = 100 / players[playerName].winPathPos[noInId].length;
            h = 100 / players[playerName].winPathPos[noInId].length;
            for (const cValue of players[playerName].winPathPos[noInId]) {
              $("." + cValue).css({
                width: w + "%",
                height: h + "%",
              });
            }
          }
          if (checkWinPathEnd(oldId)) {
            win = true;
            removeFromWinPath(moveingClassValue, playerName);
            addToWinArea(moveingClassValue, playerName);
            sendToWinArea(moveingClassValue, playerName, color);
            updateWinningPos(playerName);
            showWinningPos();
          } else {
            noInId++;
            newId = color + "-out-" + noInId;
            oldId = newId;
            addWinPathPos(noInId, moveingClassValue, playerName);
            if (players[playerName].winPathPos[noInId].length > 0) {
              w = 100 / players[playerName].winPathPos[noInId].length;
              h = 100 / players[playerName].winPathPos[noInId].length;
              for (const cValue of players[playerName].winPathPos[noInId]) {
                $("." + cValue).css({
                  width: w + "%",
                  height: h + "%",
                });
              }
            }
            $("#" + newId).append(
              `<div class="${moveingClassValue}" style="width:${w}%; height:${h}%;"></div>`
            );
            jumpAudio.play();
          }

          if (count == rndmNo) {
            clearInterval(timerId);
            nextPlayer();
          }
        }, 300);
      });
    } else {
      continue;
    }
  }

  if (flag == false) {
    if(players[playerName].outArea.length != 0){
        return;
     }
    setTimeout(function () {
      nextPlayer();
    }, 500);
  }
}

function sendToWinArea(cValue, pName, color) {
  $("#" + color + "-win-pawn-box").append(`<div class="${cValue}"></div>`);
  updateWinAreaCss(pName, color);
}

function updateWinAreaCss(pName, color) {
  let x = null;
  let y = null;
  let i = 0;
  let rotateValue = getRotateValue(color);
  let winAreaLength = players[pName].winArea.length;
  for (const classValue of players[pName].winArea) {
    x = winAreaPxPY[winAreaLength - 1][i][0];
    y = winAreaPxPY[winAreaLength - 1][i][1];
    i++;
    $("." + classValue).css({
      transform: `translate(${x}%, ${y}%) rotate(${rotateValue})`,
    });
  }
}

function getRotateValue(color) {
  let rotate = null;
  (color == "g" && (rotate = "-45deg")) ||
    (color == "y" && (rotate = "-135deg")) ||
    (color == "b" && (rotate = "-225deg")) ||
    (color == "r" && (rotate = "-315deg"));

  return rotate;
}

function autoMove() {
  let count = -1;
  let moveingClassValue = players[playerName].outArea[0];
  let idValue = $("." + moveingClassValue)
    .parent()
    .attr("id");
  let noInId = getNoFromValue(idValue);
  let newId = "out" + noInId;
  let oldId = idValue;
  let w = null;
  let h = null;

  let timerId = setInterval(function () {
    count++;
    $("." + moveingClassValue).remove();

    removePos(noInId, moveingClassValue);

    if (pos[noInId].length > 0) {
      w = 100 / pos[noInId].length;
      h = 100 / pos[noInId].length;
      for (const cValue of pos[noInId]) {
        $("." + cValue).css({
          width: w + "%",
          height: h + "%",
        });
      }
    }

    if (check52(oldId)) {
      noInId = 1;
      newId = "out" + noInId;
      oldId = newId;
      pos[noInId].length = pos[noInId].length;
    } else {
      noInId++;
      newId = "out" + noInId;
      oldId = newId;
      pos[noInId].length = pos[noInId].length;
    }
    if (pos[noInId].length > 0) {
      w = 100 / (pos[noInId].length + 1);
      h = 100 / (pos[noInId].length + 1);
      for (const cValue of pos[noInId]) {
        $("." + cValue).css({
          width: w + "%",
          height: h + "%",
        });
      }
    } else {
      w = 100;
      h = 100;
    }
    addPos(noInId, moveingClassValue);

    $("#" + newId).append(
      `<div class="${moveingClassValue}" style="width:${w}%; height:${h}%;"></div>`
    );
    jumpAudio.play();

    if (count == rndmNo) {
      clearInterval(timerId);
      cutPawn(noInId, moveingClassValue);
      nextPlayer();
    }
  }, 500);
}

function cutPawn(noInId, moveingClassValue) {
  if ([1, 48, 9, 22, 35, 14, 27, 40].includes(noInId)) {
    return;
  } else {
    let colorInClass = getColorFromClass(moveingClassValue);
    let targetClass = null;
    for (const cValve of pos[noInId]) {
      if (colorInClass != getColorFromClass(cValve)) {
        targetClass = cValve;
      }
    }
    if (targetClass != null) {
      $("." + targetClass).remove();
      colorInClass = getColorFromClass(targetClass);
      let pName = colorInClass + "Player";
      removeFromOutArea(targetClass, pName);
      addToInArea(targetClass, pName);
      removePos(noInId, targetClass);
      let noInClass = getNoFromValue(targetClass);
      $(`#in-${colorInClass}-${noInClass}`).append(
        `<div class='${colorInClass}-pawn${noInClass}'></div>`
      );
      cut = true;
      if (pos[noInId].length > 0) {
        w = 100 / pos[noInId].length;
        h = 100 / pos[noInId].length;
        for (const cValue of pos[noInId]) {
          $("." + cValue).css({
            width: w + "%",
            height: h + "%",
          });
        }
      }
    } else {
      return;
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
function addToInArea(addValue, pName) {
  players[pName].inArea.push(addValue);
}

function removFromInArea(removeValue, pName) {
  let newInArea = [];
  for (const classValue of players[pName].inArea) {
    if (classValue != removeValue) {
      newInArea.push(classValue);
    }
  }
  players[pName].inArea = newInArea;
}

function addToOutArea(addValue, pName) {
  players[pName].outArea.push(addValue);
}
function removeFromOutArea(removeValue, pName) {
  let newOutArea = [];
  for (const classValue of players[pName].outArea) {
    if (classValue != removeValue) {
      newOutArea.push(classValue);
    }
  }
  players[pName].outArea = newOutArea;
}

function addToWinPath(addValue, pName) {
  players[pName].winPath.push(addValue);
}
function removeFromWinPath(removeValue, pName) {
  let newWinPath = [];
  for (const classValue of players[pName].winPath) {
    if (classValue != removeValue) {
      newWinPath.push(classValue);
    }
  }
  players[pName].winPath = newWinPath;
}

function addToWinArea(addValue, pName) {
  players[pName].winArea.push(addValue);
}
function removeFromWinArea(removeValue, pName) {
  let newWinArea = [];
  for (const classValue of players[pName].winArea) {
    if (classValue != removeValue) {
      newWinArea.push(classValue);
    }
  }
  players[pName].winArea = newWinArea;
}

function getNoFromString(stringValue) {
  let num = +stringValue.match(/\d+/);
  return num;
}

function addPos(posValue, classValue) {
  pos[posValue].push(classValue);
}

function removePos(posValue, classValue) {
  let newPosArr = [];
  for (const cValue of pos[posValue]) {
    if (cValue != classValue) {
      newPosArr.push(cValue);
    }
  }
  pos[posValue] = newPosArr;
}

function removeWinPathPos(posValue, classValue, pName) {
  let newWinPathPosArr = [];
  for (const cValue of players[pName].winPathPos[posValue]) {
    if (cValue != classValue) {
      newWinPathPosArr.push(cValue);
    }
  }
  players[pName].winPathPos[posValue] = newWinPathPosArr;
}

function addWinPathPos(posValue, classValue, pName) {
  players[pName].winPathPos[posValue].push(classValue);
}

function updateWinningPos(pName){
    if(players[pName].winArea.length == 4){
      winningPos.push(pName);
    }
}

function showWinningPos(){
  if(winningPos.length > 0){
    
    let idValue = winningPos[winningPos.length - 1];
    let url = getWinningImage(winningPos.length - 1);
      $("#" + idValue).append(
        `<div class="badge-box" style="background-image: ${url};"></div>`
      );
  }
}

function getWinningImage(winNo){
   let imageName = null;

   winNo == 0 && (imageName = "win1") ||
   winNo == 1 && (imageName = "win2") ||
   winNo == 2 && (imageName = "win3") ;

   return `url(../images/${imageName}.png)`;
}

nextPlayer();

function redyGame(color) {
  for (i = 1; i <= 4; i++)
    $(`#in-${color}-${i}`).append(`<div class='${color}-pawn${i}'></div>`);
}

function resetPawn(){
  let color = ["r", "g", "y", "b"];
  
  for (const colorName of color) {
    for(let i = 1; i <= 4; i++){
      $(`.${colorName}-pawn${i}`).remove();
    }
  }
  for (const colorName of color) {
    redyGame(colorName);
  }
}

redyGame("r");
redyGame("g");
redyGame("y");
redyGame("b");

function restartGame(){

  $("." + "badge-box").remove();

  playerNo = 0;
  winningPos = [];
  rndmNo = null;
  countSix = 0;
  cut = false;
  win = false;

  players = {
    rPlayer: new Player("out1", "out51", "r"),
    gPlayer: new Player("out14", "out12", "g"),
    yPlayer: new Player("out27", "out25", "y"),
    bPlayer: new Player("out40", "out38", "b"),
  };
  $(diceBoxId).removeClass("startDiceRoll");
  $(diceBoxId).removeClass("showDice");
  $(diceBoxId).off();
  pos = new Position(52);
  resetPawn();
  nextPlayer();
}