var fs = require("fs");
const data = require("./data/eosAccounts.json");
const nameFactorsList = require("./factors/factorList.json");
const nogoListArr = require("./factors/nogoList.json");
const confirmedAirDropAccts = [];
const minEosLimit = 1;
let level1 = 0;
let level10 = 0;
let level20 = 0;

const writeJSONFile = dataArr => {
  const stringDataArr = JSON.strigify(dataArr);
  fs.writeFile("eosAccounts.json", stringDataArr, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("EOS docs saved!");
  });
};

const checkNoGoList = (name, ngList) => {
  let nogoBool = false;
  for (let j = 0; j < ngList.length; j++) {
    const factorStringPos = name.search(ngList[j].factor);
    const isNogo = factorStringPos > -1;
    if (isNogo || ngList[j].factor === name) {
      nogoBool = true;
      break;
    }
  }
  return nogoBool;
};

const getNameRelevanceScore = (acctName, factorList) => {
  let nameRelevanceObj = { rel: false };
  for (let k = 0; k < factorList.length; k++) {
    const factorStringPos = acctName.search(factorList[k].factor);
    const isNameRelevant = factorStringPos > -1;
    if (isNameRelevant) {
      nameRelevanceObj.rel = true;
      nameRelevanceObj.factor = factorList[k].factor;
      break;
    }
  }
  if (nameRelevanceObj.rel) {
    const nogoBool = checkNoGoList(acctName, nogoListArr);
    if (nogoBool) {
      nameRelevanceObj.rel = false;
      nameRelevanceObj.flag = true;
    }
  }
  return nameRelevanceObj;
};

const getBalanceScore = (eos, limit) => {
  const balanceScore = { qualify: false, lvl: 0 };
  const nextLimit = 50;
  const totalInt = parseInt(eos);
  const totalFloat = parseFloat(eos);
  const totalInAcct = totalInt > totalFloat ? totalInt : totalFloat;
  if (totalInAcct > limit) {
    balanceScore.lvl = 1;
    balanceScore.qualify = true;
  }
  if (totalInAcct > nextLimit) {
    balanceScore.lvl = 20;
  }
  return balanceScore;
};

const checkAcctRelevance = account => {
  const { account_name, total_eos } = account;
  const score = { rel: false };
  const balScoreObj = getBalanceScore(total_eos, minEosLimit);

  if (balScoreObj.qualify) {
    score.rel = true;
    score.lvl = balScoreObj.lvl;
    score.acct = account_name;
  }

  if (score.rel) {
    const nameResponse = getNameRelevanceScore(account_name, nameFactorsList);

    if (nameResponse.rel) {
      if (score.lvl === 1) {
        score.lvl = 10;
      }
    }

    return nameResponse.flag ? false : score;
  }

  return false;
};

const one = {
  creation_time: "2018-06-12 18:36:07.500000",
  account_name: "1234567890",
  total_eos: "60.0000"
};

for (let i = 0; i < data.length; i++) {
  const masterScore = checkAcctRelevance(data[i]);
  if (masterScore) {
    confirmedAirDropAccts.push(masterScore);
  }
}

// at 1K is 15%
// at 10K is 0.025%
// at 100K is 40%

const doubleCheckedArr = data => {
  const checked = [];
  for (let l = 0; l < data.length; l++) {
    const name = data[l].acct;

    if (data[l].lvl === 10) {
      level10++;
    } else if (data[l].lvl === 20) {
      level20++;
    } else {
      level1++;
    }

    if (
      name === "eosio.names" ||
      name === "eosio.vpay" ||
      name === "eosio.msig" ||
      name === "eosio.bpay" ||
      name === "eosio.ram" ||
      name === "eosio.ramfee" ||
      name === "eosio.saving" ||
      name === "eosio.stake" ||
      name === "eosio.token"
    ) {
      console.log(name);
    } else {
      checked.push(data[l]);
    }
  }
  const totalAccts = level1 + level10 + level20;

  console.log("level1", level1);
  console.log("level10", level10);
  console.log("level20", level20);
  console.log("total # of accts", totalAccts);
  const one = level1 * 1000;
  const ten = level10 * 1000 * 3;
  const twenty = level20 * 1000 * 5.45;
  const totalToDistribute = one + ten + twenty;
  console.log("level1 - total", one);
  console.log("level10 - total", ten);
  console.log("level20 - total", twenty);
  console.log("total distributed", totalToDistribute);
  console.log("% of 1,000,000,000", totalToDistribute / 1000000000);
  return checked;
};

const finalArr = doubleCheckedArr(confirmedAirDropAccts);

fs.writeFile("filteredEOSAddresses.json", JSON.stringify(finalArr), err => {
  // throws an error, you could also catch it here
  if (err) throw err;

  // success case, the file was saved
  console.log("EOS docs saved!");
});
