'use strict'
// Template version: 1.2.0
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/scp-': {
      //   target: 'http://192.168.0.242:30940/', // 开发机
      //   // target: 'http://172.16.10.116:8083', //王云
      //   changeOrigin: true
      // },
      '/scp-securityapp': {
        target: 'http://192.168.0.242:30940',
        // target: 'http://172.16.10.64:8082/',
        // target: 'http://172.16.10.77:8082/',
        // target: 'http://172.16.10.78:8082/', // 周星
        // target: 'http://172.16.10.45:8082/',  // 石伟森
        changeOrigin: true
      },
      '/scp-eventapp': {
        target: 'http://172.16.10.44:9065',   // 张鹏程
        // target: 'http://192.168.0.242:30081/', // 测试环境
        // target: 'http://192.168.0.161:30940', // (线上242用户管理)
        changeOrigin: true
      },
      '/scp-informationreleaseapp': {
        // target: 'http://172.16.10.91:8082',
        target: 'http://192.168.0.242:30081/',
        changeOrigin: true
      },
      '/scp-laddercontrolapp': {
        // target: 'http://172.16.10.41:8082',
        target: 'http://172.16.10.37:8082',
        // target: 'http://192.168.0.242:30081/',    // 测试环境
        changeOrigin: true
      },
      '/scp-patrolapp': {
        target: 'http://192.168.0.108:8040',
        // target: 'http://172.16.10.124:8083',
        // target: 'http://172.16.10.124:9066/',
        // target: 'http://172.16.10.127:8084', //全海飞
        // target: 'http://172.16.10.90:8083', //王伟
        // target: 'http://192.168.0.161:30940/', //公共
        // target: 'http://172.16.10.1:8083',//李漫成
        // target: 'http://172.16.10.80:8083/', //蒋路飞
        // target: 'http://172.16.10.138:8082',
        // target: 'http://172.16.10.138:8082',//潘尚砖
        // target: 'http://172.16.10.116:8083', //王云
        // target: 'http://172.16.10.149:8082',//叶果
        // target: 'http://172.16.10.10:8083',//刘永
        changeOrigin: true
      },
      '/demo2': {
        target: 'http://192.168.0.242:30940/'
      },
      // dev: {
      '/demo': {
        // target: 'http://localhost:8088/',        //mock
        // target: 'http://192.168.0.235:8040/',    // 服务器
        // target: 'http://192.168.0.235:8082/', // 郭峰
        target: 'http://192.168.0.21:8082/', // 王洪奔(框架Demo)
        changeOrigin: true
      },
      '/scp-devicemgmtcomponent': {
        // target: 'http://192.168.0.242:30081/', // 王珂(设备管理)
        target: 'http://192.168.0.108:8040/', // 王珂(设备管理)
        changeOrigin: true
      },
      '/scp-usermgmtcomponent': {
        target: 'http://192.168.0.108:8040', // (线上108用户管理)
        // target: 'http://192.168.0.242:30940', // (线上242用户管理)
        // target: 'http://192.168.0.161:30940',  // (线上242用户管理)
        changeOrigin: true
      },
      '/scp-iotbusconsoleapp': {
        // 物联网总线（杨晓波）
        // '/api': {
        // target: 'http://172.16.10.55:8001/',   //iot组内测试环境
        target: 'http://192.168.0.207:8001/', // 测试组207环境
        changeOrigin: true
      },
      '/scp-visitorapp': {
        target: 'http://172.16.10.75:9044/', // 植梅健(访客管理)
        changeOrigin: true
      },
      // '/scp-mapapp/mapService': {
      //  target: 'http://172.16.10.77:8082/', // 陈伟波(地图应用)
      //  changeOrigin: true
      // },
      // '/scp-mapapp/mapapp': {
      //   target: 'http://172.16.10.77:8082/', // 陈伟波(地图应用) wagger: http://192.168.0.236:9036/
      //   changeOrigin: true
      // },
      // '/mapService': {
      //   target: 'http://172.16.10.80:8082/', // 陈伟波(地图应用)
      //   changeOrigin: true
      // },
      // '/mapapp': {
      //   target: 'http://172.16.10.80:8082/', // 陈伟波(地图应用) wagger: http://192.168.0.236:9036/
      //   changeOrigin: true
      // },
      '/scp-mapapp/mapService': {
        target: 'http://192.168.0.108:8040/', // 陈伟波(地图应用)
        changeOrigin: true
      },
      '/scp-mapapp/mapapp': {
        target: 'http://192.168.0.108:8040/', // 陈伟波(地图应用) wagger: http://192.168.0.236:9036/
        changeOrigin: true
      },
      // '/scp-mapapp/mapService': {
      //   target: 'http://192.168.0.109:9035/', // 陈伟波(地图应用)
      //   changeOrigin: true
      // },
      // '/scp-mapapp/mapapp': {
      //   target: 'http://192.168.0.109:9035/', // 陈伟波(地图应用)
      //   changeOrigin: true
      // },
      // '/scp-mapapp/mapService': {
      //   target: 'http://172.16.10.3:8082/', // 陈伟波(地图应用)
      //   changeOrigin: true
      // },
      // '/scp-mapapp/mapapp': {
      //   target: 'http://172.16.10.3:8082/', // 陈伟波(地图应用) wagger: http://192.168.0.236:9036/
      //   changeOrigin: true
      // },
      // '/mapService': {
      //   target: 'http://192.168.0.242:39035/', // 陈伟波(地图应用)
      //   changeOrigin: true
      // },
      // '/mapapp': {
      //   target: 'http://192.168.0.242:39035/', // 陈伟波(地图应用) wagger: http://192.168.0.236:9036/
      //   changeOrigin: true
      // },
      // '/scp-mdmcomponent': {
      //   target: 'http://172.16.10.33:8182/', // 邓代超（主数据管理-人员管理）
      //   changeOrigin: true
      // },
      '/scp-mdmapp': {
        // target: 'http://192.168.0.242:30940/',
        // target: 'http://192.168.0.161:30940/',
        target: 'http://172.16.10.34:8082/', // 李显琪(主数据管理：房屋管理、组织管理)
        changeOrigin: true
      },
      '/scp-broadcastapp': {
        // target: 'http://192.168.0.242:30940/', // 蔡洽渠(个性化广播)
        // target: 'http://172.16.10.203:8082/',
        target: 'http://192.168.0.108:8040/',
        // target: 'http://192.168.0.161:30940/', // 服务器地址
        changeOrigin: true
      },
      '/zuul/scp-broadcastapp': {
        // target: 'http://192.168.0.242:30940/', // 音频上传 蔡洽渠(个性化广播)
        target: 'http://192.168.0.108:8040/',
        // target: 'http://192.168.0.161:30940/',
        // target: 'http://172.16.10.203:8082/',
        changeOrigin: true
      },
      '/scp-accesscontrolapp': {
        target: 'http://localhost:8082/', // 汪熙
        changeOrigin: true
      },
      // '/scp-accesscontrolapp': {
      //   target: 'http://localhost:8082/',  // 汪熙
      //   changeOrigin: true
      // },
      '/scp-parkinglotapp': {
        target: 'http://localhost:8082/',
        // target: 'http://172.16.10.11:8082/',
        changeOrigin: true
      },
      '/scp-cardmgmtapp': {
        target: 'http://localhost:8082/' // tlb
      },
      '/scp-videogatewayapp': {
        // target: 'http://172.16.10.71:9061/', // 视频应用
        // target: 'http://192.168.0.242:30081/', // 视频应用
        // target: 'http://172.16.10.81:9061/', // 邢海
        // target: 'http://172.16.10.29:9061/', // 胡敏
        target: 'http://192.168.0.108:8040/', // 网关
        changeOrigin: true
      },
      '/scp-ismgcomponent': {
        // target: 'http:// 172.16.10.12:8082/',  // 张勇(短信网关)
        // target: 'http://192.168.0.242:30081/' // 张勇(短信网关)
        target: 'http://172.16.30.75:9013/'
      },
      '/scp-videointercomapp': {
        target: 'http://192.168.0.108:9021/',
        changeOrigin: true,
        pathRewrite: {}
      },
      '/scp-businesscommonapp': {
        target: 'http://192.168.0.108:8040',
        changeOrigin: true,
      }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.HOST, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * SourceMap
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
