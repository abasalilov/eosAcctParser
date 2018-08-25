var fs = require("fs");
const data = require("./data/eosAccounts.json");

const parsedNames = [];

const writeJSONFile = dataArr => {
  const stringDataArr = JSON.strigify(dataArr);
  fs.writeFile("eosAccounts.json", stringDataArr, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("EOS docs saved!");
  });
};

const parseEOSaccountName = account => {
  const { account_name, total_eos } = account;
  const totalInt = parseInt(total_eos);
  const totalFloat = parseFloat(total_eos);
  // console.log("account.account_name", account_name);
  console.log("total", totalInt);
  console.log("type", totalFloat);
  let total = totalInt > totalFloat ? totalInt : totalFloat;
  if (total > 0.1) {
    return true;
  }
};

for (i = 0; i < 3; i++) {
  let account = data[i];
  let bool = parseEOSaccountName(account);
  if (bool) {
    parsedNames.push(account.account_name);
  }
}

console.log("parsedNames", parsedNames);
