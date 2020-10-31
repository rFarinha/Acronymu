//let fs = require('fs')

function addToList(){

  const path = 'C:/Users/Farinha/Projects/Acronymu/resources/'
  let file = document.getElementById("listTxtsSelect").value
  console.log(path + file)
  let text = document.getElementById("text-area-to-add").value;
  fs.readFile(path+file, function(err, data) {
    res.write(text);
    return res.end();
  });
}
