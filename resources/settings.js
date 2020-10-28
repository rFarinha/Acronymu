function openTab() {

  var i;
  var x = document.getElementsByClassName("tab");
  console.log(x)
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById('#home').style.display = "block";
}

document.querySelector('#settingsButton').addEventListener('click', () => {
  openTab()
})
