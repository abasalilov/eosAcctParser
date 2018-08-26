var fs = require("fs");
const data = require("./data/eosAccounts.json");
const nameFactorsList = require("./factors/factorList.json");
const parsedNames = [];
const minEosLimit = 1.33;

const writeJSONFile = dataArr => {
  const stringDataArr = JSON.strigify(dataArr);
  fs.writeFile("eosAccounts.json", stringDataArr, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("EOS docs saved!");
  });
};

const getNameRelevance = (acctName, factorList) => {
  let relevanceBool = false;
  for (let k = 0; k < factorList.length; k++) {
    const factorStringPos = acctName.search(factorList[k].factor);
    const isNameRelevant = factorStringPos > -1;
    if (isNameRelevant) {
      relevanceBool = true;
      console.log("factorStringPos", factorStringPos);
      console.log("factorList[k]", factorList[k]);
      break;
    }
  }
  return relevanceBool;
};

const getTotalBool = (eos, limit) => {
  const totalInt = parseInt(eos);
  const totalFloat = parseFloat(eos);
  const totalInAcct = totalInt > totalFloat ? totalInt : totalFloat;
  console.log("totalInAcct", totalInAcct);
  return totalInAcct > limit;
};

const checkAcctRelevance = account => {
  const { account_name, total_eos } = account;
  // if (getTotalBool(total_eos, minEosLimit)) {
  //   console.log("total_eos", account);
  //   return true;
  // }
  if (getNameRelevance(account_name, nameFactorsList)) {
    console.log("account_name", account_name);
    return true;
  }
};

for (let i = 0; i < 100; i++) {
  let account = data[i];
  if (checkAcctRelevance(account)) {
    parsedNames.push(account.account_name);
  }
}
