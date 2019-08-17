"use strict";

var DEBUG = true;

/**
 * Minesweeper model constructor
 * @param bombs
 * @param numRows
 * @param numCols
 * @constructor
 */
class MSModel {
  constructor(bombs, numRows, numCols) {
    this.field = [];
    this.numRows = numRows;
    this.numCols = numCols;
    this.numBombs = bombs;
    var i, j, k, tmpRow;
    var constants = MSModel.constants;
    // 1. Create the field with empty cells
    for (i = 0; i < numRows; i++) {
      tmpRow = [];
      for (j = 0; j < numCols; j++) {
        tmpRow.push(constants.EMPTY);
      }
      this.field.push(tmpRow);
    }
    // 2. Set bombs in random positions
    i = 0;
    while (i < this.numBombs) {
      var rowi = this.getRandomInt(this.numRows);
      var colj = this.getRandomInt(this.numCols);
      if (this.field[rowi][colj] !== constants.BOMB) {
        i++;
        this.field[rowi][colj] = constants.BOMB;
        // 3. Add +1 to surrounding cells that are not bombs:
        var neighbors = this.getSurroundingCells(rowi, colj);
        for (k = 0; k < neighbors.length; k++) {
          var n = neighbors[k];
          if (this.field[n[0]][n[1]] !== constants.BOMB) {
            this.field[n[0]][n[1]] += 1;
          }
        }
      }
    }
  }
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  getSurroundingCells(i, j) {
    var neighborPositions = [
      [i - 1, j - 1],
      [i - 1, j],
      [i - 1, j + 1],
      [i, j - 1],
      [i, j + 1],
      [i + 1, j - 1],
      [i + 1, j],
      [i + 1, j + 1]
    ];
    var neighbors = [];
    for (var k = 0; k < neighborPositions.length; k++) {
      var neig = neighborPositions[k];
      if (0 <= neig[0] &&
        neig[0] < this.numRows &&
        0 <= neig[1] &&
        neig[1] < this.numCols) {
        neighbors.push(neig);
      }
    }
    return neighbors;
  }
  revealConnectedCells(givenI, givenJ) {
    var toCheck = []; // we'll use the array as a queue
    var toReveal = [];
    var checkingCell, surroundingCell;
    var neighbors;
    this.field[givenI][givenJ] = MSModel.constants.REVEALED;
    toCheck.push([givenI, givenJ]);
    while (toCheck.length > 0) {
      checkingCell = toCheck.shift();
      neighbors = this.getSurroundingCells(checkingCell[0], checkingCell[1]);
      for (var i = 0; i < neighbors.length; i++) {
        surroundingCell = neighbors[i];
        if (this.field[surroundingCell[0]][surroundingCell[1]] ===
          MSModel.constants.EMPTY) {
          this.field[surroundingCell[0]][surroundingCell[1]] =
            MSModel.constants.REVEALED;
          toCheck.push(surroundingCell);
          toReveal = toReveal.concat(this.getSurroundingCells(surroundingCell[0], surroundingCell[1]));
        }
        else {
          toReveal = toReveal.concat([[surroundingCell[0], surroundingCell[1]]]);
        }
      }
    }
    return toReveal;
  }
}

MSModel.constants = {
  EMPTY: 0,
  BOMB: -1,
  REVEALED: -2
};




//--- END MODEL
/**
 * Minesweeper view constructor
 * @param bombs
 * @param numRows
 * @param numCols
 * @constructor
 */
class MSView {
  constructor(numRows, numCols, bombs) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.numBombs = bombs;
    this.bombCounterElem = document.getElementById("bombs");
    this.timerElem = document.getElementById("time");
    this.fieldContainer = document.getElementById("fieldContainer");
    this.mainWindow = document.getElementById("window");
    this.smileyButton = document.getElementById("smiley-button");
    this.colWidth = 16;
    this.paddingsW = 28;
    this.paddingsH = 107;
    this.eventsSetUp = false;
    this.updateBombCounter(this.numBombs);
  }
  renderField(field) {
    var fieldContainer = this.fieldContainer;
    var mainWindow = this.mainWindow;
    var numCols = this.numCols;
    var numRows = this.numRows;
    var colWidth = this.colWidth;
    var paddingsW = this.paddingsW;
    var paddingsH = this.paddingsH;
    var i, j;
    while (fieldContainer.firstChild) {
      fieldContainer.removeChild(fieldContainer.firstChild);
    }
    fieldContainer.style.width = String(numCols * colWidth) + "px";
    mainWindow.style.width = String(colWidth * numCols + paddingsW) + "px";
    mainWindow.style.height = String(colWidth * numRows + paddingsH) + "px";
    mainWindow.style.left =
      "calc(50% - " + (colWidth * numCols + paddingsW) / 2 + "px)";
    for (i = 0; i < numRows; i++) {
      for (j = 0; j < numCols; j++) {
        var cell = document.createElement("div");
        cell.className = "cell";
        cell.id = "" + i + "-" + j;
        if (DEBUG) {
          cell.innerHTML = field[i][j];
        }
        fieldContainer.appendChild(cell);
      }
    }
    var icon = this.smileyButton.getElementsByClassName("icon")[0];
    icon.innerText = "😄";
  }
  setupEventListeners(config) {
    if (!this.eventsSetUp) {
      var fieldContainer = this.fieldContainer;
      var smileyButton = this.smileyButton;
      fieldContainer.addEventListener("click", function (ev) {
        var cell = ev.target;
        if (cell.className.indexOf("cell") !== -1) {
          config.click(cell);
        }
      }.bind(this));
      fieldContainer.addEventListener("contextmenu", function (ev) {
        var cell = ev.target;
        if (cell.className.indexOf("cell") !== -1) {
          ev.preventDefault();
          config.contextmenu(cell);
        }
      }.bind(this));
      smileyButton.addEventListener("mousedown", function (ev) {
        smileyButton.className = "panel smiley down";
      });
      smileyButton.addEventListener("mouseup", function (ev) {
        smileyButton.className = "panel smiley";
        config.smileyClick();
      });
    }
    this.eventsSetUp = true;
  }
  revealCell(cell, value) {
    if (value === MSModel.constants.BOMB) {
      cell.className = "cell pressed-bomb";
    }
    else {
      cell.className = "cell pressed-" + value;
    }
  }
  updateRevealed(field) {
    for (var i = 0; i < this.numRows; i++) {
      for (var j = 0; j < this.numCols; j++) {
        if (field[i][j] === MSModel.constants.REVEALED) {
          var cell = document.getElementById("" + i + "-" + j);
          cell.className = "cell pressed-0";
        }
      }
    }
  }
  updateTime(value) {
    var values = String(value).split("");
    var digits = this.timerElem.getElementsByClassName("num");
    if (values.length === 1) {
      digits[0].className = "num p0 num0";
      digits[1].className = "num p1 num0";
      digits[2].className = "num p2 num" + values[0];
    }
    else if (values.length === 2) {
      digits[0].className = "num p0 num0";
      digits[1].className = "num p1 num" + values[0];
      digits[2].className = "num p2 num" + values[1];
    }
    else {
      digits[0].className = "num p0 num" + values[0];
      digits[1].className = "num p1 num" + values[1];
      digits[2].className = "num p2 num" + values[2];
    }
  }
  updateBombCounter(value) {
    if (value >= 0) {
      // TODO display negative number
      var values = String(value).split("");
      var digits = this.bombCounterElem.getElementsByClassName("num");
      if (values.length === 1) {
        digits[0].className = "num p0 num0";
        digits[1].className = "num p1 num0";
        digits[2].className = "num p2 num" + values[0];
      }
      else if (values.length === 2) {
        digits[0].className = "num p0 num0";
        digits[1].className = "num p1 num" + values[0];
        digits[2].className = "num p2 num" + values[1];
      }
      else {
        digits[0].className = "num p0 num" + values[0];
        digits[1].className = "num p1 num" + values[1];
        digits[2].className = "num p2 num" + values[2];
      }
    }
  }
  getRevealedCount(field) {
    var count = 0;
    for (var i = 0; i < this.numRows; i++) {
      for (var j = 0; j < this.numCols; j++) {
        var cell = document.getElementById("" + i + "-" + j);
        if (cell.className.indexOf("pressed") !== -1) {
          count++;
        }
      }
    }
    return count;
  }
  revealField(field, bombCell) {
    for (var i = 0; i < this.numRows; i++) {
      for (var j = 0; j < this.numCols; j++) {
        var cell = document.getElementById("" + i + "-" + j);
        if (field[i][j] !== MSModel.constants.REVEALED) {
          this.revealCell(cell, field[i][j]);
        }
      }
    }
    bombCell.className = "cell pressed-bomb-red";
  }
  gameOver() {
    var icon = this.smileyButton.getElementsByClassName("icon")[0];
    icon.innerText = "😭";
  }
}










//--- END VIEW
/**
 * Minesweeper controller constructor
 * @param bombs
 * @param numRows
 * @param numCols
 * @constructor
 */
class MSController {
  constructor(bombs, numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.numBombs = bombs;
    this.numFlags = 0;
    this.view = new MSView(numRows, numCols, bombs);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleSmileyClick = this.handleSmileyClick.bind(this);
    this.timer = null;
    this.gameStopped = true;
  }
  newGame() {
    this.model = new MSModel(this.numBombs, this.numRows, this.numCols);
    var field = this.model.field;
    this.view.renderField(field);
    this.view.setupEventListeners({
      click: this.handleCellClick,
      contextmenu: this.handleRightClick,
      smileyClick: this.handleSmileyClick
    });
    this.view.updateBombCounter(this.numBombs);
    this.view.updateTime(0);
    clearInterval(this.timer);
    this.timer = null;
    this.gameStopped = false;
    this.numFlags = 0;
  }
  setupTimer() {
    if (this.timer === null) {
      var time = 1;
      this.timer = setInterval(function () {
        this.view.updateTime(time++);
      }.bind(this), 1000);
    }
  }
  handleCellClick(cell) {
    if (!this.gameStopped) {
      var i, j;
      var field = this.model.field;
      this.setupTimer();
      if (cell.dataset.dead !== "true") {
        cell.dataset.dead = "true"; // cells are clickable only once
        i = parseInt(cell.id.split("-")[0], 10);
        j = parseInt(cell.id.split("-")[1], 10);
        var bombCount = field[i][j];
        this.view.revealCell(cell, bombCount);
        if (bombCount === MSModel.constants.BOMB) {
          this.view.revealField(field, cell);
          this.gameOver();
        }
        else if (bombCount === 0) {
          var toReveal = this.model.revealConnectedCells(i, j);
          for (var k = 0; k < toReveal.length; k++) {
            cell = document.getElementById("" + toReveal[k][0] + "-" + toReveal[k][1]);
            this.handleCellClick(cell);
          }
          this.view.updateRevealed(field);
        }
        this.checkScore();
      }
    }
  }
  handleRightClick(cell) {
    if (!this.gameStopped) {
      this.setupTimer();
      if (cell.dataset.dead !== "true") {
        if (cell.className.indexOf("flag") === -1) {
          cell.className = "cell flag";
          this.numFlags++;
        }
        else {
          cell.className = "cell";
          this.numFlags--;
        }
        var bombCount = this.numBombs - this.numFlags;
        this.view.updateBombCounter(bombCount);
      }
    }
  }
  checkScore() {
    var revealedCount = this.view.getRevealedCount(this.model.field);
    if (revealedCount === this.numRows * this.numCols - this.numBombs) {
      this.userWins();
    }
  }
  handleSmileyClick() {
    this.newGame();
  }
  userWins() {
    console.log("user wins");
    this.stopGame();
  }
  gameOver() {
    console.log("hit a bomb");
    this.view.gameOver();
    this.stopGame();
  }
  stopGame() {
    clearInterval(this.timer);
    this.timer = null;
    this.gameStopped = true;
  }
}










//--- END CONTROLLER

var game = new MSController(10, 8, 8);
game.newGame();
