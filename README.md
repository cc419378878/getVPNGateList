Get VPNGate Rely Server List
============================
### 1.For Who?
纯属个人使用，练习node
### 2.For What?
为了稳定的获取VPNGate的中继服务器列表，来提供给第三方工具使用，避免因镜像网站地址变动以及其它不可描述的原因导致的资源无法获得
### 3.How to Use？
1.增加main.js的可执行权限
````bash
chmod +x main.js
````
2.添加crontab的定时任务
````bash
crontab -e
0 12 * * * /usr/bin/node .../getVPNGateList/main.js>>.../getVPNGateList/log 2>&1
````
+ 时间频率自定义
+ node, main.js, log位置按照实际情况更改, 使用绝对路径