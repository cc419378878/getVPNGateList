const request = require('superagent');
const schedule = require('node-schedule');
const fs = require('fs');
const exec = require('child_process').exec;

const test_urls = ['https://www.google.com/', 'https://www.youtube.com/', 'https://www.sina.com.cn/'];
const urls = ['http://g95.222-224-140.ppp.wakwak.ne.jp:62462/api/iphone/', 'http://61.75.128.225:3068/api/iphone/', ' http://61.107.179.232:22980/api/iphone/', ' http://59.3.208.17:43950/api/iphone/', 'http://147.46.146.165:55866/api/iphone/'];
const flags = {
  i: 0,
  len: test_urls.length
};

function getJson(urls, flags) {
  let i = flags.i;
  let len = flags.len;
  let url = urls[i]
  console.log('url is: ' + url);
  request
    .get(url)
    .timeout({
      response: 10000,
      deadline: 10000,
    })
    .end(function(error, res) {
      if(error) {
        console.log(`can't connect ${url}!`);
        i < len ? getJson(urls, flags) : console.log(`can't connect all urls!`);
        i++;
        flags.i = i;
      } else{
        fs.writeFile('./api/iphone', JSON.stringify(res.text), (err) => {
          if (err) throw err;
          console.log('The file has been saved!');
        });
        console.log(`${url} is connected now!`);
      }
    });
}

function pushGithub() {
  const commitMsg = `更新于${new Date()}`;
  const iphone = './api/iphone';
  const diff = `git diff ${iphone}`;
  const add = `git add ${iphone}`;
  const commit = `git commit -m ${commitMsg}`;
  const push = `git push origin master`;

  // 如果iphone有改变再执行其他命令

}

getJson(test_urls, flags);


//定时任务
// schedule.scheduleJob('16 * * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
// });