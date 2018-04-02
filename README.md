``` bash
#使用vue-cli快速构建项目
npm install -g vue-cli
vue init webpack project-name

#项目框架搭建好后，把项目跟远程仓库关联起来
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/calazhi/SCP-Project.git
git push -u origin master

#说明：https://github.com/calazhi/SCP-Project.git 是想要关联到的远程仓库地址
```

# egsc-admin-UI

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
