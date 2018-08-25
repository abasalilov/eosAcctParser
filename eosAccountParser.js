const data = require("./data/eosAccounts.json");

let counter = 0;

for (i = 0; i < 1000; i++) {
  console.log(data[i].account_name);
}
