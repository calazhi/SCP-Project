#2018-03-13
1.添加登录用户失效前端跳转处理
2.调整npm run build 相关的参数将 productionSourceMap设置为false及可
M  src/assets/js/util.js
M  config/index.js

#2018-03-04
1.添加登录用户失效前端跳转处理
M  src/assets/js/util.js

#2018-03-02
1.添加401或404页面，为处理401或404情况
A  src/assets/images/401.gif
A  src/assets/images/404.png
A  src/assets/images/404_cloud.png
A  src/components/error/page401.vue
A  src/components/error/page404.vue
M  src/main.js
M  src/routers/index.js


#2018-02-28
1.对用户退出相关功能进行完善
M  src/components/main/Header.vue
M  src/main.js
M  src/views/UserMgmt/login/apis/index.js
M  src/views/UserMgmt/login/mocks/mock.js

#2018-02-26
1.对npm构建build进行完善，生成相关是否成功标识
M  build/build.js


#20180205
1.开启登录相关的认证及代码
M  README.md
M  config/index.js
M  index.html
M  package.json
M  src/assets/js/AxiosPlugin.js
A  src/assets/js/userMockJsonData.js
A  src/assets/js/userMockJsonData_bak20180126.js
C  src/stores/mutations.js -> src/assets/js/userMockJsonData_bak20180205.js
M  src/components/main/Header.vue
M  src/components/main/Sidebar.vue
A  src/components/main/Sidebar_bak_20180207.vue
M  src/main.js
M  src/stores/actions.js
M  src/stores/getters.js
M  src/stores/index.js
A  src/stores/modules/umUserInfo.js
M  src/stores/mutation-types.js
M  src/stores/mutations.js
A  src/stores/mutations_bak_20180207.js
M  src/views/UserMgmt/login/Login.vue
M  src/views/UserMgmt/login/apis/index.js
M  src/views/UserMgmt/login/mocks/mock.js
A  src/views/UserMgmt/login/pwdedit.vue
M  src/views/UserMgmt/login/routers/index.js

#2018-01-25 
1.修改登录页面样式
2.处理npm引用element ui包路径
 M build/webpack.base.conf.js
 M src/assets/js/AxiosPlugin.js
 M src/views/UserMgmt/login/Login.vue

#2018-01-19
1.修改菜单，将一级菜单减少
2.完善错误处理相关提示
M src/components/main/Index.vue
M src/stores/mutations.js
M src/views/UserMgmt/login/mocks/mock.js
M src/assets/js/AxiosPlugin.js
M src/components/main/Index.vue
M src/components/main/Sidebar.vue
A src/assets/js/util.js

#2018-01-15 
1.修改用户登录与后台联调菜单相关内容
 M README.md
 M config/index.js
 M package.json
 M src/assets/js/AxiosPlugin.js
 M src/components/main/Header.vue
 M src/components/main/Sidebar.vue
 M src/main.js
 M src/stores/mutations.js
 M src/views/UserMgmt/login/Login.vue
 M src/views/UserMgmt/login/apis/index.js
 M src/views/UserMgmt/login/mocks/mock.js
 M src/views/demo/index.vue
 M src/views/demo/index1.vue
 M src/views/demo/routers/index.js
 
 
 #2018-01-10
 1.增加用户登录与后台服务联调，获取相关数据
 M README.md
 M config/index.js
 M src/assets/js/AxiosPlugin.js
 M src/components/main/Header.vue
 M src/components/main/Sidebar.vue
 M src/main.js
 M src/stores/mutations.js
 M src/views/UserMgmt/login/Login.vue
 M src/views/UserMgmt/login/apis/index.js
 M src/views/UserMgmt/login/mocks/mock.js
 M src/views/demo/index1.vue
 M src/views/demo/index.vue
 M package-lock.json
 M package.json

#2018-01-08
1.修改用户信息在vuex中的结构
 M src/components/main/Sidebar.vue
 M src/main.js
 M src/stores/mutations.js

#2018-01-05
1.添加用户信息在vuex中
 M src/components/main/Home.vue
 M src/stores/actions.js
 M src/stores/getters.js
 M src/stores/mutations.js
 M src/views/demo/index1.vue
 M src/views/demo/routers/index.js
 M src/assets/js/AxiosPlugin.js
 M src/main.js

#2018-01-03
1.前端公共框架egsc-admin-UI修改首页的风格
2.前端公共框架egsc-admin-UI调整css引用方式
M  egsc-admin-UI/README.md
M  egsc-admin-UI/src/App.vue
M  egsc-admin-UI/src/assets/css/color-dark.less
A  egsc-admin-UI/src/assets/css/mainheader.less
A  egsc-admin-UI/src/assets/images/header_logo.png
M  egsc-admin-UI/src/components/main/Header.vue
M  egsc-admin-UI/src/components/main/Home.vue
M  egsc-admin-UI/src/components/main/Sidebar.vue



#2017-12-28
1.前端公共框架egsc-admin-UI添加location.search === '?mock'过滤，http://url?mock支持开启mock数据展示
2.修改 [vuex] unknown报错问题
#2017-12-25
1.前端公共框架egsc-admin-UI添加ES6转ES5的支持，支持IE浏览器下可访问
添加了babel-polyfill支持,需要npm install 或 npm update


#2017-12-13
1.前端公共框架egsc-admin-UI页面结构实现菜单的可切换，一级菜单展示，二级，三级菜单可展示及切换



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
