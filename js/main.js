(function() {
  function makeField(numRows, numCols) {
    var fieldContainer = document.getElementById("fieldContainer");
    var mainWindow = document.getElementById("window");
    var colWidth = 16;
    var paddingsW = 28;
    var paddingsH = 105;

    fieldContainer.style.width = String(numCols * colWidth) + "px";
    mainWindow.style.width = String(colWidth * numCols + paddingsW) + "px";
    mainWindow.style.height = String(colWidth * numRows + paddingsH) + "px";
    mainWindow.style.left =
      "calc(50% - " + (colWidth * numCols + paddingsW) / 2 + "px)";

    for (var i = 0; i < numRows; i++) {
      for (var j = 0; j < numCols; j++) {
        var cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.i = i;
        cell.dataset.j = j;
        fieldContainer.appendChild(cell);
      }
    }

    fieldContainer.addEventListener("click", function(ev) {
      var cell = ev.target;
      console.log("click on", cell.dataset.i, cell.dataset.j);
      cell.className = "cell pressed-0";
    });

    fieldContainer.addEventListener("contextmenu", function(ev) {
      ev.preventDefault();
      var cell = ev.target;
      console.log("right click on", cell.dataset.i, cell.dataset.j);
    });
  }

  var numRows = 8;
  var numCols = 8;
  makeField(numRows, numCols);

  var smileyButton = document.getElementById("smiley-button");
  smileyButton.addEventListener("mousedown", function(ev) {
    smileyButton.className = "panel smiley down";
  });
  smileyButton.addEventListener("mouseup", function(ev) {
    smileyButton.className = "panel smiley";
  });
})();
