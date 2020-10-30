const fs = require('fs');
let listsPath = './resources/'
const EXTENSION = '.txt'
// Change TAB
function openTab(Tab) {

  let btns = document.getElementsByClassName("btn");

  // Loop through the buttons and add the active class to the current/clicked button
  for (let i = 0; i < btns.length; i++) {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      document.getElementById(Tab + 'Btn').className += " active";
  }
  var i;
  var x = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

  document.getElementById(Tab).style.display = "block";
}

//document.querySelector('#settingsButton').addEventListener('click', () => {
//  openTab()
//})


require('electron').ipcRenderer.on('StartingWindow', function(event, message) {
      console.log(message);
      openTab(message);
});


fs.readdir(listsPath, (err, files) => {
  let listSelector = document.getElementById("listTxtsSelect");
  files.forEach(file => {
    if(file.slice(-4, file.length) === EXTENSION){
      let option = document.createElement("option");
      option.text = file;
      listSelector.add(option)
    }
  });
});
