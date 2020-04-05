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
    this.handleNewGameMenuClick = this.handleNewGameMenuClick.bind(this);
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
      smileyClick: this.handleSmileyClick,
      newGameMenuClick: this.handleNewGameMenuClick
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
  handleNewGameMenuClick() {
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
