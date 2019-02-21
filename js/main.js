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

  makeField(20, 20);
})();
