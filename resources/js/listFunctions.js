const fs = require('fs')
const settings = require('./settings.js')

// Adds text to list in path
exports.addToList = (listPath, text) => {
  console.log("Adding to List...")
  // Read file to string
  let dataString = fs.readFileSync(listPath);
  // String to array
  let dataArray = dataString.toString().split("\n")
  // Join array with new acronyms from text
  let dataJoin = dataArray.concat(text.split("\n"))
  // Clean Array and sort alphabetical
  let cleanDataArray = dataJoin.filter(isNotEmpty).sort()

  // Write the txt again
  fs.writeFile(listPath, cleanDataArray.join("\n"), "utf-8", (error, data) => {
      if (error){
        console.error("error: " + error);
      }else{
        console.log("Adding to List success")
      }
  });
}


// Remove
exports.removeFromList = (listPath, text) =>{

  console.log("Remove from List...")
  // Read file to string
  let dataString = fs.readFileSync(listPath);
  // String to array
  let dataArray = dataString.toString().split("\n")
  // Clean Array empty lines
  let cleanDataArray = dataArray.filter(isNotEmpty)
  // Array with acronyms to remove
  let removeArray = text.split("\n")

  // Loop each line and check if acronym in removeArray, if yes it removes from cleanDataArray
  let i = 0
  while(i<cleanDataArray.length){
    let [acronymInList, meaning] = cleanDataArray[i].split(',');
    if(removeArray.includes(acronymInList)){
      cleanDataArray.splice(i, 1)
    }else{
      i++
    }
  }

  // Write the txt again
  fs.writeFile(listPath, cleanDataArray.join("\n"), "utf-8", (error, data) => {
      if (error){
        console.error("error: " + error);
      }else{
        console.log("Remove from List success")
      }
  });
  // console.log("Final array: " + cleanDataArray)
}

// Delete selected list file
exports.deleteListFile = (list) => {
  const path = settings.getFolderPath()
  const filepath = path + '\\' + list
  fs.access(filepath, (err) => {
    if(err){
      alert("This file doesn't exist, cannot delete");
    }else{
      fs.unlink(filepath, (err2) => {
          if (err2) {
              alert("An error ocurred updating the file" + err.message);
              console.log(err2);
              return;
          }
          console.log("File succesfully deleted");
      });
    }
  });
}

exports.createNewList = (listName) => {
  console.log("Name of list to create: " + listName)
  let pathList = settings.getFolderPath() + '\\' + listName
  fs.writeFile(pathList, "", (err) => {
        if(err){
            alert("An error ocurred creating the file "+ err.message)
        }
    });
}


// Filter to clean array with acronyms
function isNotEmpty(value) {
  return value !== "" && value !== "\n";
}
