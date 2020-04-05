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
