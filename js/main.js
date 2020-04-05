"use strict";

var DEBUG = true;

MSModel.constants = {
  EMPTY: 0,
  BOMB: -1,
  REVEALED: -2
};




var form = document.querySelector("form");
var log = document.querySelector("#log");

form.addEventListener("submit", function(event) {
  var data = new FormData(form);
  var output = "";
  for (const entry of data) {
    output = entry[0] + "=" + entry[1];
  };
  log.innerText = output;
  event.preventDefault();

  if (log.innerText == "difficulty-level=beginner") {
    var game = new MSController(10, 8, 8);
    var myStr = 'Beginner';
    var newStr = myStr.replace(/Beginner/g, "&#x2714; Beginner");
    document.getElementById("beginner-mode").innerHTML = newStr;
  }

  else if (log.innerText == "difficulty-level=intermediate") {
    var game = new MSController(40, 16, 16);
    var myStr = 'Intermediate';
    var newStr = myStr.replace(/Intermediate/g, "&#x2714; Intermediate");
    document.getElementById("intermediate-mode").innerHTML = newStr;
  }

  else if (log.innerText == "difficulty-level=expert") {
    var game = new MSController(99, 16, 30);
    var myStr = 'Expert';
    var newStr = myStr.replace(/Expert/g, "&#x2714; Expert");
    document.getElementById("expert-mode").innerHTML = newStr;
  }
  game.newGame();
  document.getElementById("window").style.visibility = "visible";
}, false);

//--- END CONTROLLER

//var game = new MSController(10, 8, 8);
//game.newGame();
