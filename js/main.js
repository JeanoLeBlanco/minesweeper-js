(function() {
  function handleCellClick(elem, i, j) {
    elem.className += " pressed";
    console.log(i, j);
  }

  var fieldContainer = document.getElementById("fieldContainer");
  var colWidth = 20;
  var numRows = 10;
  var numCols = 10;

  fieldContainer.style.width = String(numCols * colWidth) + "px";

  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      var cell = document.createElement("div");
      var inner = document.createElement("div");
      cell.className = "cell";
      inner.className = "inner";
      cell.appendChild(inner);
      fieldContainer.appendChild(cell);

      cell.addEventListener("click", function() {
        handleCellClick(this, i, j);
      });
    }
  }
})();
