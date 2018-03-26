const exec = require('child_process').exec;
const config = require('./config');

// const test_urls = ['https://www.google.com/', 'https://www.youtube.com/', 'https://www.baidu.com/'];
const urls = [].concat(config.site.main, config.site.mirrors);
const flags = {
  i: 0
};

let new_urls = urls.map(x => x + 'api/iphone/');

function getJson(urls, flags) {
  const len = urls.length;
  let i = flags.i;
  let url = urls[i];

  exec(`wget --output-document='./api/iphone' --tries=2 --timeout=5 ${url}`, (err, stdout, stderr) => {
    if(err) {
      console.log(`Can't connect ${url}!`);
      flags.i++;
      if(flags.i < len) {
        getJson(urls, flags);
      } else {
        console.log('All connect deny!');
      }
    } else {
      pushGithub();
      console.log('Success!');
    }
    console.log(`stdout is: ${stdout}`);
    console.log(`stdout is: ${stderr}`);
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
  exec(diff, (err, stdout, stderr) => {
    if (err){
      console.log(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);
    if(!stdout) {
      exec(add);
      exec(commit);
      exec(push);
    }
  })
}


getJson(new_urls, flags);