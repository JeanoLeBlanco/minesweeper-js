"use strict";

var DEBUG = false;

/**
 * Minesweeper model constructor
 * @param bombs
 * @param numRows
 * @param numCols
 * @constructor
 */
function MSModel(bombs, numRows, numCols) {
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

MSModel.constants = {
  EMPTY: 0,
  BOMB: -1,
  REVEALED: -2
};

MSModel.prototype.getRandomInt = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

MSModel.prototype.getSurroundingCells = function(i, j) {
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
    if (
      0 <= neig[0] &&
      neig[0] < this.numRows &&
      0 <= neig[1] &&
      neig[1] < this.numCols
    ) {
      neighbors.push(neig);
    }
  }
  return neighbors;
};

MSModel.prototype.revealConnectedCells = function(givenI, givenJ) {
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

      if (
        this.field[surroundingCell[0]][surroundingCell[1]] ===
        MSModel.constants.EMPTY
      ) {
        this.field[surroundingCell[0]][surroundingCell[1]] =
          MSModel.constants.REVEALED;
        toCheck.push(surroundingCell);
        toReveal = toReveal.concat(
          this.getSurroundingCells(surroundingCell[0], surroundingCell[1])
        );
      } else {
        toReveal = toReveal.concat([[surroundingCell[0], surroundingCell[1]]]);
      }
    }
  }

  return toReveal;
};

//--- END MODEL

/**
 * Minesweeper view constructor
 * @param numRows
 * @param numCols
 * @param bombs
 * @constructor
 */
var MSView = function(numRows, numCols, bombs) {
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
  this.paddingsH = 105;
  this.eventsSetUp = false;

  this.updateBombCounter(this.numBombs);
};

MSView.prototype.renderField = function(field) {
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
};

MSView.prototype.setupEventListeners = function(config) {
  if (!this.eventsSetUp) {
    var fieldContainer = this.fieldContainer;
    var smileyButton = this.smileyButton;

    fieldContainer.addEventListener(
      "click",
      function(ev) {
        var cell = ev.target;
        if (cell.className.indexOf("cell") !== -1) {
          config.click(cell);
        }
      }.bind(this)
    );

    fieldContainer.addEventListener(
      "contextmenu",
      function(ev) {
        var cell = ev.target;
        if (cell.className.indexOf("cell") !== -1) {
          ev.preventDefault();
          config.contextmenu(cell);
        }
      }.bind(this)
    );

    smileyButton.addEventListener("mousedown", function(ev) {
      smileyButton.className = "panel smiley down";
    });

    smileyButton.addEventListener("mouseup", function(ev) {
      smileyButton.className = "panel smiley";
      config.smileyClick();
    });
  }
  this.eventsSetUp = true;
};

MSView.prototype.revealCell = function(cell, value) {
  if (value === MSModel.constants.BOMB) {
    cell.className = "cell pressed-bomb";
  } else {
    cell.className = "cell pressed-" + value;
  }
};

MSView.prototype.updateRevealed = function(field) {
  for (var i = 0; i < this.numRows; i++) {
    for (var j = 0; j < this.numCols; j++) {
      if (field[i][j] === MSModel.constants.REVEALED) {
        var cell = document.getElementById("" + i + "-" + j);
        cell.className = "cell pressed-0";
      }
    }
  }
};

MSView.prototype.updateTime = function(value) {
  this.timerElem.innerText = value;
};

MSView.prototype.updateBombCounter = function(value) {
  this.bombCounterElem.innerText = value;
};

MSView.prototype.getRevealedCount = function(field) {
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
};

MSView.prototype.revealField = function(field, bombCell) {
  for (var i = 0; i < this.numRows; i++) {
    for (var j = 0; j < this.numCols; j++) {
      var cell = document.getElementById("" + i + "-" + j);
      if (field[i][j] !== MSModel.constants.REVEALED) {
        this.revealCell(cell, field[i][j]);
      }
    }
  }
  bombCell.className = "cell pressed-bomb-red";
};

//--- END VIEW

/**
 * Minesweeper controller constructor
 * @param bombs
 * @param numRows
 * @param numCols
 * @constructor
 */
var MSController = function(bombs, numRows, numCols) {
  this.numRows = numRows;
  this.numCols = numCols;
  this.numBombs = bombs;
  this.view = new MSView(numRows, numCols, bombs);
  this.handleCellClick = this.handleCellClick.bind(this);
  this.handleRightClick = this.handleRightClick.bind(this);
  this.handleSmileyClick = this.handleSmileyClick.bind(this);
  this.timer = null;
  this.gameStopped = true;
};

MSController.prototype.newGame = function() {
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
};

MSController.prototype.setupTimer = function() {
  if (this.timer === null) {
    var time = 1;
    this.timer = setInterval(
      function() {
        this.view.updateTime(time++);
      }.bind(this),
      1000
    );
  }
};

MSController.prototype.handleCellClick = function(cell) {
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
      } else if (bombCount === 0) {
        var toReveal = this.model.revealConnectedCells(i, j);
        for (var k = 0; k < toReveal.length; k++) {
          cell = document.getElementById(
            "" + toReveal[k][0] + "-" + toReveal[k][1]
          );
          this.handleCellClick(cell);
        }
        this.view.updateRevealed(field);
      }
      this.checkScore();
    }
  }
};

MSController.prototype.handleRightClick = function(cell) {
  if (!this.gameStopped) {
    this.setupTimer();
    if (cell.dataset.dead !== "true") {
      var bombCount = Number(this.view.bombCounterElem.innerText);
      if (cell.className.indexOf("flag") === -1) {
        cell.className = "cell flag";
        bombCount--;
      } else {
        cell.className = "cell";
        bombCount++;
      }
      this.view.updateBombCounter(bombCount);
    }
  }
};

MSController.prototype.checkScore = function() {
  var revealedCount = this.view.getRevealedCount(this.model.field);
  if (revealedCount === this.numRows * this.numCols - this.numBombs) {
    this.userWins();
  }
};

MSController.prototype.handleSmileyClick = function() {
  this.newGame();
};

MSController.prototype.userWins = function() {
  console.log("user wins");
  this.stopGame();
};

MSController.prototype.gameOver = function() {
  console.log("hit a bomb");
  this.stopGame();
};

MSController.prototype.stopGame = function() {
  clearInterval(this.timer);
  this.timer = null;
  this.gameStopped = true;
};

//--- END CONTROLLER

var game = new MSController(10, 8, 8);
game.newGame();
