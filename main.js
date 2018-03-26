const { exec, spawn } = require('child_process');
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
    if (err) {
      console.log(`Can't connect ${url}!`);
      flags.i++;
      if (flags.i < len) {
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
  const add = `git add ${iphone}`;
  const commit = `git commit -m '${commitMsg}'`;
  const push = `git push origin master`;

  // 如果iphone有改变再执行其他命令
  let diff = spawn('git', ['diff', iphone]);
  diff.stdout.on('data', (data) => {
    console.log(!!data);
    if (!!data) {
      exec(add);
      exec(commit, ((err, stdout, stderr) => {
        if(err) {
          console.log(`# git commit is err #: ${err}!`);
          return;
        }
        console.log(`# git commit stdout #: ${stdout}!`);
      }));
      exec(push, ((err, stdout, stderr) => {
        if(err) {
          console.log(`# git push is err #: ${err}!`);
          return;
        }
        console.log(`git push stdout: ${stdout}!`);
      }));
    }
    // console.log(`data from child  ${data}`);
  });

}


getJson(new_urls, flags);
