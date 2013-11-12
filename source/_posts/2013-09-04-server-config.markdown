---
layout: post
title: "服务器配置，tengine，git，nodejs，grunt，mongodb……"
date: 2013-09-04 21:58
comments: true
categories: nginx git node
---
>最近准备用nodejs+mongodb开发个网站，手上正好有个vps，装个centos，那就从头搭建个开发及生产环境吧，目前只需要考虑3点：
>1、使用git作代码管理，push后能自动部署到前端资源中。
>2、如果修改了node文件，需要push后能查看，在commit消息中加入`deploy`，代码全站部署。
>3、前端资源在发布时压缩，为了更加灵活，在访问时合并，并不是发布时合并。
<!-- more -->

##一、tengine安装##
>采用tengine完全是看中一些好用的模块，像`http_concat_module`之类的，不乏一些nginx商业版中的功能，taobao好样的。

*   先安装centos的编译环境，一阵y，y，y后安装成功
{% codeblock %}
yum install gcc gcc-c++ gcc-g77 flex bison autoconf automake bzip2-devel zlib-devel ncurses-devel libjpeg-devel libpng-devel libtiff-devel freetype-devel pam-devel openssl-devel libxml2-devel gettext-devel pcre-devel make
{% endcodeblock %}
*  常用工具 全部安装，省得麻烦
{% img http://feeloc.cn/downloads/images/2013-09-04/1.jpg 800 '安装成功' %}

*   安装pcre，因为tengine依赖pcre
    *   `yum install pcre`发现已经安装但版本比较老，反正编译tengine时候需要pcre源代码，更新最新版本
{% img http://feeloc.cn/downloads/images/2013-09-04/2.png 800 %}
    *   `yum remove pcre`发现有依赖无法删除
{% img http://feeloc.cn/downloads/images/2013-09-04/3.png 800 %}
    *   直接用`rpm -e --nodeps --allmatches pcre`，可安全卸载，`rpm -ql pcre | cat -n`查看下包情况，其实不用卸载
{% img http://feeloc.cn/downloads/images/2013-09-04/4.png 800 %}
    *   下载pcre源码包放入`/usr/localhost/src`中，好习惯
{% codeblock pcre %}
cd /usr/local/src
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.33.tar.gz
tar  zxvf pcre-8.33.tar.gz
mkdir /usr/local/pcre  #创建安装目录
cd pcre-8.33
./configure  --prefix=/usr/local/pcre  #配置
make
make install
{% endcodeblock %}

*   正式安装tengine服务器
{% codeblock tengine %}
cd /usr/local/src
wget http://www.openssl.org/source/openssl-1.0.1e.tar.gz    #因为安装tengin需要openssl源码
cd /usr/local/src
tar  zxvf openssl-1.0.1e.tar.gz
wget http://tengine.taobao.org/download/tengine-1.5.1.tar.gz
tar  zxvf tengine-1.5.1
cd tengine-1.5.1.tar.gz
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_concat_module --with-openssl=/usr/local/src/openssl-1.0.1e --with-pcre=/usr/local/src/pcre-8.33  #配置
#--with-pcre=/usr/local/src/pcre-8.13指向的是源码包解压的路径，而不是安装的路径，否则会报错
#如果要使用css/js等合并请求加载，请务必安装module --with-http_concat_module，正是我们需要的
make    #挺长一段时间的编译过程
>-e "s|%%PID_PATH%%|/usr/local/nginx/logs/nginx.pid|"
>-e "s|%%CONF_PATH%%|/usr/local/nginx/conf/nginx.conf|"
>-e "s|%%ERROR_LOG_PATH%%|/usr/local/nginx/logs/error.log|"
make install
{% endcodeblock %}
*   安装成功
{% codeblock success %}
/usr/local/nginx/sbin/nginx
chown nobody.nobody -R /usr/local/nginx/html
chmod 700 -R /usr/local/nginx/html
{% endcodeblock %}
*   访问http://ip发现成功界面
{% img http://feeloc.cn/downloads/images/2013-09-04/5.jpg 800 %}

*   为了方便管理服务，我们编写一个脚本来启动关闭重启重载配置文件等
    *   行关闭服务
{% codeblock kill%}
cat /usr/local/nginx/logs/nginx.pid #得到进程ID
kill id
{% endcodeblock %}

    *写shell脚本，`vi /etc/init.d/nginx`
{% codeblock nginx.sh %}
#!/bin/sh
#
# nginx - this script starts and stops the nginx daemin
#
# chkconfig:   - 85 15
# description:  Nginx is an HTTP(S) server, HTTP(S) reverse \
#               proxy and IMAP/POP3 proxy server
# processname: nginx
# config:      /usr/local/nginx/conf/nginx.conf
# pidfile:     /usr/local/nginx/logs/nginx.pid

# Source function library.
. /etc/rc.d/init.d/functions

# Source networking configuration.
. /etc/sysconfig/network

# Check that networking is up.
[ "$NETWORKING" = "no" ] && exit 0

nginx="/usr/local/nginx/sbin/nginx"
prog=$(basename $nginx)

NGINX_CONF_FILE="/usr/local/nginx/conf/nginx.conf"

lockfile=/var/lock/subsys/nginx

start() {
    [ -x $nginx ] || exit 5
    [ -f $NGINX_CONF_FILE ] || exit 6
    echo -n $"Starting $prog: "
    daemon $nginx -c $NGINX_CONF_FILE
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}

stop() {
    echo -n $"Stopping $prog: "
    killproc $prog -QUIT
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}

restart() {
    configtest || return $?
    stop
    start
}

reload() {
    configtest || return $?
    echo -n $"Reloading $prog: "
    killproc $nginx -HUP
    RETVAL=$?
    echo
}

force_reload() {
    restart
}

configtest() {
  $nginx -t -c $NGINX_CONF_FILE
}

rh_status() {
    status $prog
}

rh_status_q() {
    rh_status >/dev/null 2>&1
}

case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart|configtest)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
            ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart|condrestart|try-restart|reload|force-reload|configtest}"
        exit 2
esac
{% endcodeblock %}

    *   加权限，开机启动
{% codeblock check %}
chmod +x /etc/init.d/nginx
cd /et/init.d/
/sbin/chkconfig nginx on
/sbin/chkconfig --list nginx
nginx          	0:off	1:off	2:on	3:on	4:on	5:on	6:off

#使用以下命令操作nginx
service nginx start
service nginx stop
service nginx restart
service nginx reload

/etc/init.d/nginx start
/etc/init.d/nginx stop
/etc/init.d/nginx restart
/etc/init.d/nginx reload
{% endcodeblock %}

*   配置tengine，使之支持静态资源合并访问
{% codeblock nginx配置文件 %}
cd /usr/local/nginx/conf
vi nginx.conf
{% endcodeblock %}

    *   1、打开gzip
{% codeblock nginx配置文件 %}
gzip on;
gzip_min_length 1k;
gzip_buffers 16 64k;
gzip_http_version 1.1;
gzip_comp_level 6;
gzip_types text/plain application/x-javascript text/css application/xml;
gzip_vary on
{% endcodeblock %}

    *   2、新建conf.d/asset.dogolang.com.conf，在nginx.conf 中 include conf.d/*.conf
{% codeblock %}
#静态文件
server {
        listen       80;
        server_name  ***********;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;
        location /static/ {
                root /***********;
                concat on;
                concat_max_files 20;
        }
}
#顺便配置上呆会儿要用的nodejs的访问
server {
        listen       80;
        server_name  ***********;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
                proxy_pass    http://***********/;
                proxy_redirect          off;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
}
{% endcodeblock %}
    *   执行service nginx reload，更新下配置文件，成功！


##二、安装GIT##
*   安装git，gitosis
{% codeblock git,gitosis安装 %}
yum install git python python-setuptools
cd /usr/local/src
git clone git://github.com/res0nat0r/gitosis.git
cd gitosis
python setup.py install
{% endcodeblock %}

*   在开发机器上生成rsa key，这儿我想用这台服务器做git管理员管理，所以就在这台机器上生成key
{% codeblock %}
ssh-keygen -t rsa #不需要密码,一路回车就行(在本地操作)
cp /root/.ssh/id_rsa.pub /tmp/id_rsa.pub  # 如果是其它机器就上传下，scp ~/.ssh/id_rsa.pub root@xxx:/tmp/
{% endcodeblock %}

*   直接用root账号生成git库，网上很多教程使用git账户，因为我对linux权限系统不太了解，最后想写git hooks时，各种命令找不到，各种权限问题，干脆直接用root
{% codeblock %}
gitosis-init < /tmp/id_rsa.pub
#Initialized empty Git repository in /root/repositories/gitosis-admin.git/
#Reinitialized existing Git repository in /root/repositories/gitosis-admin.git/
{% endcodeblock %}

*   将gitosis-admin库，clone下来，用来管理git库和用户权限，git本来也是采用git来做各种管理的
{% codeblock %}
mkdir /projects
cd /projects
git clone ssh://root@127.0.0.1/gitosis-admin.git
cd gitosis-admin
vi gitosis-admin.conf
[group gitosis-admin]
writable = gitosis-admin
members = root@localhost

#这儿的members要和keydir中的*.pub中的*号名一致
#修改后，push
git add .
git commit -m "add a user"
git push
{% endcodeblock %}
*   在刚加的git用户的机器上init一个git库，并提交到git仓库中试下
{% codeblock %}
git init
remote add origin git@YOUR_SERVER_HOSTNAME:PROJECT.git
git add .
git commit -a -m "init project"
git push origin master:refs/heads/master

#注：修改git项目的地址
git remote set-url origin ssh://git@domain.com:3022/~/Projects/p1.git
#如果希望用代码库中的文件完全覆盖本地工作版本，方法如下：
git reset --hard
git pull
#如果想针对文件回退本地修改，方法如下：
git checkout HEAD file/to/restore
{% endcodeblock %}

*   我在服务器上git clone一份，刚提交的代码，是一个小项目，呆会儿测试安装nodejs时候使用

##三、安装nodejs##
*   下载，编译，安装nodejs
{% codeblock %}
cd /usr/local/src/
wget http://nodejs.org/dist/v0.10.17/node-v0.10.17.tar.gz
tar zxvf node-v0.10.17.tar.gz
cd node-v0.10.17
./configure --prefix=/usr/local/node/0.10
make   #编译时间很久，或许是我机器不行，基本可以去做100个仰卧起坐
make install
#将node放入环境变量中
echo "export PATH=$PATH:/usr/local/node/0.10/bin" >> ~/.bash_profile
#更新环境变量
. ~/.bash_profile
#echo $PATH 发现node的bin目录已经在环境变量中
#安装forever模块，启动管理node程序
npm install forever -g
{% endcodeblock %}

*   利用启动脚本，实现自动运行forever的node程序，实现开机自启动，`vi /etc/init.d/node`
{% codeblock node.sh %}
#!/bin/bash
#
# node      Start up node server daemon
#
# chkconfig: 345 85 15
# description: Forever for Node.js
#
PATH=/usr/local/node/0.10/bin
DEAMON=/projects/node/app.js
LOG=/projects/logs/node/hosts_log
PID=/tmp/forever.pid

case "$1" in
    start)
        forever start -l $LOG/forever.log -o $LOG/forever_out.log -e $LOG/forever_err.log --pidFile $PID --minUptime 5000 --spinSleepTime 2000 -a $DEAMON
        ;;
    stop)
        forever stop --pidFile $PID $DEAMON
        ;;
    stopall)
        forever stopall --pidFile $PID
        ;;
    restartall)
        forever restartall --pidFile $PID
        ;;
    restart)
        forever stop --pidFile $PID $DEAMON
        forever start -l $LOG/forever.log -o $LOG/forever_out.log -e $LOG/forever_err.log --pidFile $PID --minUptime 5000 --spinSleepTime 2000 -a $DEAMON
        ;;
    list)
        forever list
        ;;
    *)
        echo "Usage: /etc.init.d/node {start|stop|restart|reload|stopall|restartall|list}"
        exit 1
        ;;
esac
exit 0
{% endcodeblock %}

*   开机自动运行
{% codeblock %}
chmod 755 /etc/init.d/node
cd /etc/init.d/
chkconfig node on
chkconfig --list node
{% endcodeblock %}

##四、配置GIT钩子，实现自动部署##
*   需要在客户端push后按照需求更新服务器代码，然后重启服务，所以我们要激活post-receive钩子。`vim **/**.git/hooks/post-receive`，如果commit -m "[deploy]"，含有[deploy]，就重启该服务
{% codeblock post-receive.sh %}
#!/bin/sh
#
# git autodeploy script when it matches the string "[deploy]"
#
# @author    icyleaf <icyleaf.cn@gmail.com>
# @link      http://icyleaf.com
# @version   0.1
#
# Usage:
#       1. put this into the post-receive hook file itself below
#       2. `chmod +x post-recive`
#       3. Done!

# Check the remote git repository whether it is bare
IS_BARE=$(git rev-parse --is-bare-repository)
if [ -z "$IS_BARE" ]; then
        echo >&2 "fatal: post-receive: IS_NOT_BARE"
        exit 1
fi

# Get the latest commit subject
SUBJECT=$(git log -1 --pretty=format:"%s")

# Deploy the HEAD sources to publish
IS_PULL=$(echo "$SUBJECT" | grep "\[deploy\]")
if [ -z "$IS_PULL" ]; then
        echo >&2 "tips: post-receive: IS_NOT_PULL"
        exit 1
fi

# Check the deploy dir whether it exists
DEPLOY_DIR=********
if [ ! -d $DEPLOY_DIR ] ; then
        echo >&2 "fatal: post-receive: DEPLOY_DIR_NOT_EXIST: \"$DEPLOY_DIR\""
        exit 1
fi

# Check the deploy dir whether it is git repository
#
#IS_GIT=$(git rev-parse --git-dir 2>/dev/null)
#if [ -z "$IS_GIT" ]; then
#       echo >&2 "fatal: post-receive: IS_NOT_GIT"
#       exit 1
#fi

# Goto the deploy dir and pull the latest sources
cd $DEPLOY_DIR
#env -i git reset --hard
env -i git pull

# restart app.js
*** restart     #部署脚本，重启该服务
{% endcodeblock %}

##五、mongoDB安装##
*   源码安装及开机启动配置
{% codeblock %}
1、下载源码，注意64位和32位
cd /usr/local/src/
wget http://fastdl.mongodb.org/linux/mongodb-linux-i686-2.4.6.tgz
2、解压，移动
tar zxvf mongodb-linux-i686-2.4.6.tgz
mv mongodb-linux-i686-2.4.6 /usr/local/mongodb
3、创建数据目录，日志目录
cd /usr/local/mongoDB
mkdir -p ./data/db/
mkdir logs
4、以后台方式运行mongoDB
/usr/local/mongodb/bin/mongod --dbpath=/usr/local/mongodb/data/db --logpath=/usr/local/mongodb/logs/mongodb.log --fork
5、开机启动mongoDB，将启动命令加入rc.local中
echo "/usr/local/mongodb/bin/mongod --dbpath=/usr/local/mongodb/data/db --logpath=/usr/local/mongodb/logs/mongodb.log --fork" >> /etc/rc.local
6、查看mongoDB运行日志
tail -f /usr/local/mongodb/logs/mongodb.log
7、查看mongoDB的运行状态
ps aux |grep mongodb


注：参数解释:
  --dbpath 数据库路径(数据文件)
  --logpath 日志文件路径
  --master 指定为主机器
  --slave 指定为从机器
  --source 指定主机器的IP地址
  --pologSize 指定日志文件大小不超过64M.因为resync是非常操作量大且耗时，最好通过设置一个足够大的oplogSize来避免resync(默认的 oplog大小是空闲磁盘大小的5%)。
  --logappend 日志文件末尾添加
  --port 启用端口号
  --fork 在后台运行
  --only 指定只复制哪一个数据库
  --slavedelay 指从复制检测的时间间隔
  --auth 是否需要验证权限登录(用户名和密码)
{% endcodeblock %}

*   编写启动脚本
{% codeblock monogo.sh %}
#!/bin/bash
#
# auto start mongodb
#
# chkconfig: 345 85 15
#
mongopath=/usr/local/mongodb
dbpath=/usr/local/mongodb/data/db
logpath=/usr/local/mongodb/logs/mongodb.log
pid=/tmp/mongodb.pid
bind_ip=0.0.0.0
port=27017

case "$1" in
    start)
        $mongopath/bin/mongod --dbpath=$dbpath --logpath=$logpath --bind_ip=$bind_ip --port=$port --auth --pidfilepath=$pid --fork
        ;;
    stop)
        pid=`ps -o pid,command ax | grep mongod | awk '!/awk/ && !/grep/ {print $1}'`;
        if [ "${pid}" != "" ]; then
            kill -2 ${pid};
            fi
        ;;
    *)
        echo "Usage: /etc/init.d/mongodb {start|stop}"
        exit 1
        ;;
esac
exit 0
{% endcodeblock %}

*   开机自动运行
{% codeblock %}
chmod 755 /etc/init.d/mongo
cd /etc/init.d/
chkconfig mongo on
chkconfig --list mongo
{% endcodeblock %}

*   利用脚本更方便管理mongoDB，这样就不用在rc.local中直接写启动脚本了，把`/etc/init.d/mongo start`，写进去就可以实现开机启动了

##MySQL安装##

*   安装cmake`mysql的编译工具`
{%codeblock%}
下载
wget http://www.cmake.org/files/v2.8/cmake-2.8.12.tar.gz

tar zxvf cmake-2.8.12.tar.gz
cd cmake-2.8.12
#反正是工具软件，就直接配置编译安装了#
./configure
make #编译
make install #安装
#漫长地过程后安装完成
{%endcodeblock%}

*   安装MySQL
{%codeblock%}
下载适合自己的版本`ftp://mirror.switch.ch/mirror/mysql/Downloads/`
wget ftp://mirror.switch.ch/mirror/mysql/Downloads/MySQL-5.6/mysql-5.6.14.tar.gz

groupadd mysql #添加mysql组
useradd -g mysql mysql -s /bin/false #创建用户mysql并加入到mysql组，不允许mysql用户直接登录系统
mkdir -p /data/mysql #创建MySQL数据库存放目录
chown -R mysql:mysql /data/mysql #设置MySQL数据库目录权限
mkdir -p /usr/local/mysql #创建MySQL安装目录
cd /usr/local/src
tar zxvf mysql-5.5.25a.tar.gz #解压
cd mysql-5.5.25a
cmake . -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_DATADIR=/data/mysql -DSYSCONFDIR=/etc #配置
make #编译
make install #安装

cd /usr/local/mysql
cp ./support-files/my-huge.cnf /etc/my.cnf #拷贝配置文件（注意：如果/etc目录下面默认有一个my.cnf，直接覆盖即可）
vi /etc/my.cnf #编辑配置文件,在 [mysqld] 部分增加下面一行
datadir = /data/mysql #添加MySQL数据库路径
:wq! #保存退出
./scripts/mysql_install_db --user=mysql #生成mysql系统数据库
cp ./support-files/mysql.server /etc/rc.d/init.d/mysqld #把Mysql加入系统启动
chmod 755 /etc/init.d/mysqld #增加执行权限
chkconfig mysqld on #加入开机启动
vi /etc/rc.d/init.d/mysqld #编辑
basedir = /usr/local/mysql #MySQL程序安装路径
datadir = /data/mysql #MySQl数据库存放目录
service mysqld start #启动
vi /etc/profile #把mysql服务加入系统环境变量：在最后添加下面这一行
export PATH=$PATH:/usr/local/mysql/bin
:wq! #保存退出
下面这两行把myslq的库文件链接到系统默认的位置，这样你在编译类似PHP等软件时可以不用指定mysql的库文件地址。
ln -s /usr/local/mysql/lib/mysql /usr/lib/mysql
ln -s /usr/local/mysql/include/mysql /usr/include/mysql
shutdown -r now #需要重启系统，等待系统重新启动之后继续在终端命令行下面操作
mysql_secure_installation #设置Mysql密码
根据提示按Y 回车
然后输入2次密码
继续按Y 回车，直到设置完成
或者直接修改密码/usr/local/mysql/bin/mysqladmin -u root -p password "123456" #修改密码
service mysqld restart #重启
{%endcodeblock%}
