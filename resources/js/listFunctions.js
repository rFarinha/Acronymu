const fs = require('fs')

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

// Filter to clean array with acronyms
function isNotEmpty(value) {
  return value !== "" && value !== "\n";
}
