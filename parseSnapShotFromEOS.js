var csv = require("csv-parser");
var fs = require("fs");

const dataArr = [];
let counter = 0;
fs.createReadStream("./data/20180824_account_snapshot.csv")
  .pipe(csv())
  .on("data", function(data) {
    dataArr.push(data);
  })
  .on("end", () => {
    const stringDataArr = JSON.stringify(dataArr);
    fs.writeFile("eosAccounts.json", stringDataArr, err => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log("EOS docs saved!");
    });
  });
