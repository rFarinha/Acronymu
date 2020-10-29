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
  console.log(x)
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(Tab).style.display = "block";
}

//document.querySelector('#settingsButton').addEventListener('click', () => {
//  openTab()
//})
