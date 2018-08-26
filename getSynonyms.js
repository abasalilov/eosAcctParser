const axios = require("axios");
const fs = require("fs");

const getSynonyms = word => {
  const listArr = [];
  axios
    .get(`http://semantic-link.com/related.php?word=${word}`)
    .then(function(response) {
      const data = response.data;
      for (let idx in data) {
        const word = data[idx].v;
        if (12 > word.length) {
          listArr.push(word.toLowerCase());
        }
      }
      fs.writeFile(`${word}.json`, JSON.stringify(listArr), err => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log("word list saved!");
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};

getSynonyms("pr");
// console.log("one", one);

module.exports = getSynonyms;
