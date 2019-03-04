(function() {
  var DEBUG = true;
  /**
   * MineSweeper game constructor. Creates a field with defined number of bombs in random positions.
   *
   * @param bombs Amount of bombs to place in the fields
   * @param numRows Number of rows
   * @param numCols Number of columns
   * @constructor
   */
  function MineSweeper(bombs, numRows, numCols) {
    this.BOMB = -1;
    this.EMPTY = 0;
    this.REVEALED = -2;
    this.field = [];
    this.numRows = numRows;
    this.numCols = numCols;
    this.numBombs = bombs;
    var i, j, k, tmpRow;
    this.timer = null;
    this.bombCounterElem = document.getElementById("bombs");
    this.timerElem = document.getElementById("time");

    this.bombCounterElem.innerText = this.numBombs;

    // 1. Create the field with empty cells
    for (i = 0; i < numRows; i++) {
      tmpRow = [];
      for (j = 0; j < numCols; j++) {
        tmpRow.push(this.EMPTY);
      }
      this.field.push(tmpRow);
    }

    // 2. Set bombs in random positions
    i = 0;
    while (i < this.numBombs) {
      var rowi = this.getRandomInt(this.numRows);
      var colj = this.getRandomInt(this.numCols);
      if (this.field[rowi][colj] !== this.BOMB) {
        i++;
        this.field[rowi][colj] = this.BOMB;

        // 3. Add +1 to surrounding cells that are not bombs:
        var neighbors = this.getSurroundingCells(rowi, colj);
        for (k = 0; k < neighbors.length; k++) {
          var n = neighbors[k];
          if (this.field[n[0]][n[1]] !== this.BOMB) {
            this.field[n[0]][n[1]] += 1;
          }
        }
      }
    }
  }

  MineSweeper.prototype.getRandomInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  /**
   * Renders the fields into the page and set event listeners
   */
  MineSweeper.prototype.renderField = function() {
    var numCols = this.numCols;
    var numRows = this.numRows;
    var field = this.field;
    var fieldContainer = document.getElementById("fieldContainer");
    var mainWindow = document.getElementById("window");
    var colWidth = 16;
    var paddingsW = 28;
    var paddingsH = 105;
    var i, j;

    fieldContainer.innerHTML = "";
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
          cell.innerHTML = this.field[i][j];
        }
        fieldContainer.appendChild(cell);
      }
    }

    fieldContainer.addEventListener(
      "click",
      function(ev) {
        var cell = ev.target;
        this.handleCellClick(cell);
      }.bind(this)
    );

    fieldContainer.addEventListener(
      "contextmenu",
      function(ev) {
        ev.preventDefault();
        var cell = ev.target;
        this.handleRightClick(cell);
      }.bind(this)
    );
  };

  MineSweeper.prototype.setupTimer = function() {
    if (!this.timer) {
      this.timer = setInterval(
        function() {
          var val = parseInt(this.timerElem.innerText);
          val++;
          this.timerElem.innerText = String(val);
        }.bind(this),
        1000
      );
    }
  };

  MineSweeper.prototype.handleRightClick = function(cell) {
    this.setupTimer();
    if (cell.dataset.dead !== "true") {
      var bombCount = Number(this.bombCounterElem.innerText);
      if (cell.className.indexOf("flag") === -1) {
        cell.className = "cell flag";
        bombCount--;
      } else {
        cell.className = "cell";
        bombCount++;
      }
      this.bombCounterElem.innerText = String(bombCount);
    }
  };

  MineSweeper.prototype.handleCellClick = function(cell) {
    this.setupTimer();
    var i, j;
    var field = this.field;
    if (cell.dataset.dead !== "true") {
      if (cell.className.indexOf("cell") !== -1) {
        cell.dataset.dead = "true"; // disables the on click handlers
        i = parseInt(cell.id.split("-")[0], 10);
        j = parseInt(cell.id.split("-")[1], 10);

        if (field[i][j] === this.BOMB) {
          cell.className = "cell pressed-bomb";
          this.gameOver();
        } else if (field[i][j] >= 0) {
          var bombCount = this.getBombCount(i, j);
          cell.className = "cell pressed-" + bombCount;
          if (bombCount === 0) {
            // reveal the connected empty cells
            this.revealConnectedCells(i, j);
          }
        }

        this.field[i][j] = this.REVEALED;
        this.checkScore();
      }
    }
  };

  MineSweeper.prototype.checkScore = function() {
    var revealedCount = 0;
    for (var i = 0; i < this.numRows; i++) {
      for (var j = 0; j < this.numCols; j++) {
        if (this.field[i][j] === this.REVEALED) {
          revealedCount++;
        }
      }
    }
    if (revealedCount === this.numRows * this.numCols - this.numBombs) {
      this.userWins();
    }
  };

  MineSweeper.prototype.gameOver = function() {
    alert("boo");
    clearInterval(this.timer);
  };

  MineSweeper.prototype.userWins = function() {
    alert("you win");
    clearInterval(this.timer);
  };

  /**
   * Loops through the connected cells and updates the value to this.REVEALED when they're empty
   */
  MineSweeper.prototype.revealConnectedCells = function(givenI, givenJ) {
    var toCheck = []; // we'll use the array as a queue
    var toReveal = [];
    var checkingCell, surroundingCell;
    var neighbors;
    this.field[givenI][givenJ] = this.REVEALED;
    toCheck.push([givenI, givenJ]);

    while (toCheck.length > 0) {
      checkingCell = toCheck.shift();
      neighbors = this.getSurroundingCells(checkingCell[0], checkingCell[1]);
      for (var i = 0; i < neighbors.length; i++) {
        surroundingCell = neighbors[i];

        if (this.field[surroundingCell[0]][surroundingCell[1]] === this.EMPTY) {
          this.field[surroundingCell[0]][surroundingCell[1]] = this.REVEALED;
          toCheck.push(surroundingCell);
          document.getElementById(
            "" + surroundingCell[0] + "-" + surroundingCell[1]
          ).className = "cell pressed-0";

          toReveal = toReveal.concat(
            this.getSurroundingCells(surroundingCell[0], surroundingCell[1])
          );
        } else {
          toReveal = toReveal.concat([
            [surroundingCell[0], surroundingCell[1]]
          ]);
        }
      }
    }

    for (var j = 0; j < toReveal.length; j++) {
      var cell = document.getElementById(
        "" + toReveal[j][0] + "-" + toReveal[j][1]
      );
      this.handleCellClick(cell);
    }
  };

  /**
   * Returns the surrounding cells of cell(i, j)
   */
  MineSweeper.prototype.getSurroundingCells = function(i, j) {
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

  /**
   * Returns the bomb count fot the given cell
   */
  MineSweeper.prototype.getBombCount = function(i, j) {
    var neighbors = this.getSurroundingCells(i, j);
    var count = 0;
    for (var k = 0; k < neighbors.length; k++) {
      var neig = neighbors[k];
      if (this.field[neig[0]][neig[1]] === this.BOMB) {
        count++;
      }
    }
    return count;
  };

  // --- End of MineSweeper class definition ---

  var numRows = 4;
  var numCols = 8;
  var numBombs = 5;
  var game = new MineSweeper(numBombs, numRows, numCols);
  game.renderField();

  var smileyButton = document.getElementById("smiley-button");
  smileyButton.addEventListener("mousedown", function(ev) {
    smileyButton.className = "panel smiley down";
  });
  smileyButton.addEventListener("mouseup", function(ev) {
    smileyButton.className = "panel smiley";
  });
})();
