const fs = require("fs");
const crypto = require("./factors/crypto.json");
const shapecoin = require("./factors/fitness_bodybuild_nutrition.json");

const generateFactorList = list => {
  const declutterRef = {};
  const masterListArr = [];
  list.map(subArrJson => {
    for (let i = 0; i < subArrJson.length; i++) {
      declutterRef[subArrJson[i]] = subArrJson[i];
    }
  });

  for (let key in declutterRef) {
    masterListArr.push({ factor: key });
  }

  fs.writeFile("masterList.json", JSON.stringify(masterListArr), err => {
    // throws an error, you could also catch it here
    if (err) throw err;
    // success case, the file was saved
    console.log("masterListJson list saved!");
  });
};

generateFactorList([crypto, shapecoin]);
