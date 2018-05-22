#使用vue-cli快速构建项目
npm install -g vue-cli
vue init webpack project-name

#项目框架搭建好后，把项目跟远程仓库关联起来
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/calazhi/MonitorScreen
git push -u origin master