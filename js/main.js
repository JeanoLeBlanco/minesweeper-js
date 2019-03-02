(function() {
  function makeField(numRows, numCols) {
    var fieldContainer = document.getElementById("fieldContainer");
    var colWidth = 16;

    fieldContainer.style.width = String(numCols * colWidth) + "px";

    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        var cell = document.createElement("div");
        cell.className = "cell";
        fieldContainer.appendChild(cell);

        // cell.addEventListener("click", function() {
        //   handleCellClick(this, i, j);
        // });
      }
    }
  }

  function handleCellClick(elem, i, j) {
    elem.className += " pressed";
    console.log(i, j);
  }

  makeField(8, 8);
  var mainWindow = document.getElementById("window");
  var windowStyles = window.getComputedStyle(mainWindow);
  var width = parseInt(windowStyles.width, 10);
  var height = parseInt(windowStyles.height, 10);
  mainWindow.style.left = "calc(50% - " + width / 2 + "px)";
})();
