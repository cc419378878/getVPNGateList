const request = require('request');
const fs = require('fs')

const url = 'https://github.com/test.json';

request.get(url, function(error, response, body) {
  console.log(body);
})
  .pipe(fs.createWriteStream('./api/iphone/123.txt'));
