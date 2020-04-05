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
    this.newGameMenu = document.getElementById("newGame-menu");
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
      var newGameMenu = this.newGameMenu;
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
      newGameMenu.addEventListener("mousedown", function (ev) {
        newGameMenu.className = "down";
      });
      newGameMenu.addEventListener("mouseup", function (ev) {
        newGameMenu.className = "";
        config.newGameMenuClick();
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
