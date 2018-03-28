const { exec, spawn } = require('child_process');
const config = require('./config');

// const test_urls = ['http://www.163.com/', 'http://www.youtube.com/', 'http://www.baidu.com/'];
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
      console.log(`Connect ${url} Success!`);
    }
    // console.log(`stdout is: ${stdout}`);
    // console.log(`stdout is: ${stderr}`);
  });

}

function pushGithub() {
  const commitMsg = `更新于${new Date()}`;
  const iphone = './api/iphone';
  const add = `git add ${iphone}`;
  const commit = `git commit -m '${commitMsg}'`;
  const push = `git push origin master`;

  // 如果iphone有改变再执行其他命令
  const diff = spawn('git', ['diff', iphone],{ stdio: ['inherit', 'pipe', 'pipe'] });
  const stdOut = [];
  const stdErr = [];

  diff.stdout.on('data', (data) => {
    stdOut.push(data.toString('utf8'));
  });

  diff.stderr.on('data', (data) => {
    stdErr.push(data.toString('utf8'));
  });

  diff.on('close', () => {
    // console.log(`stdOut is ${!!stdOut.length} and stdErr is ${!stdErr.length}`);
    if(!stdErr.length && !!stdOut.length) {
      exec(add, (err, stdout, stderr) => {
        if(err) {
          console.error(`# git add is err #: ${err}!`);
          return;
        }
        // console.log(`# git add stdout #: ${stdout}!`);
        exec(commit, ((err, stdout, stderr) => {
          if(err) {
            console.error(`# git commit is err #: ${err}!`);
            return;
          }
          if(stdout) console.log(`# git commit stdout #: ${stdout}!`);
          if(stderr) console.warn(`# git commit stderr #: ${stderr}!`);
          exec(push, ((err, stdout, stderr) => {
            if(err) {
              console.error(`# git push is err #: ${err}!`);
              return;
            }
            if(stdout) console.log(`# git push stdout #: ${stdout}!`);
            if(stderr) console.warn(`# git push stderr #: ${stderr}!`);
          }));
        }));
      });
    } else {
      console.log('文件没有更新内容！');
    }
  });
}

getJson(new_urls, flags);
// pushGithub();