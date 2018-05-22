// This is a karma config file. For more details see
//   http://karma-runner.github.io/0.13/config/configuration-file.html
// we are also using it with karma-webpack
//   https://github.com/webpack/karma-webpack

var webpackConfig = require('../../build/webpack.test.conf')

module.exports = function (config) {
  config.set({
    // to run in additional browsers:
    // 1. install corresponding karma launcher
    //    http://karma-runner.github.io/0.13/config/browsers.html
    // 2. add it to the `browsers` array below.
    browsers: ['Chrome'],
    frameworks: ['mocha', 'chai'],
    reporters: ['spec', 'coverage'],
    files: ['./index.js'],
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'html' },
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    proxies: {
      '/scp-communitysafetyapp': {
        target: 'http://172.16.10.174:9065/scp-communitysafetyapp',
        changeOrigin: true
      },
      '/scp-informationreleaseapp': {
        target: 'http://172.16.10.123:8082/scp-informationreleaseapp',
        changeOrigin: true
      },
      '/scp-laddercontrolapp': {
        target: 'http://172.16.10.41:8082/scp-laddercontrolapp',
        changeOrigin: true
      },
      '/scp-patrolapp': {
        target: 'http://172.16.10.121:8082/scp-patrolapp',
        changeOrigin: true
      },
      // '/demo2': {
      //   target: 'http://192.168.0.242:30940/'
      // },
      // '/demo': {
      //   target: 'http://192.168.0.21:8082/demo',
      //   changeOrigin: true
      // },
      '/scp-devicemgmtcomponent': {
        target: 'http://192.168.0.242:30081/scp-devicemgmtcomponent',
        changeOrigin: true
      },
      '/scp-usermgmtcomponent': {
        target: 'http://192.168.0.242:30081/scp-usermgmtcomponent',
        changeOrigin: true
      },
      '/scp-iotbusconsoleapp': {
        target: 'http://192.168.0.247:8001/scp-iotbusconsoleapp',
        changeOrigin: true
      },
      '/scp-visitorapp': {
        target: 'http://172.16.10.73:9044/scp-visitorapp',
        changeOrigin: true
      },
      '/scp-mapapp/mapService': {
        target: 'http://192.168.0.242:39035/scp-mapapp/mapService',
        changeOrigin: true
      },
      '/scp-mapapp/mapapp': {
        target: 'http://192.168.0.242:39035/scp-mapapp/mapapp',
        changeOrigin: true
      },
      '/mapService': {
        target: 'http://192.168.0.242:39035/mapService',
        changeOrigin: true
      },
      '/mapapp': {
        target: 'http://192.168.0.242:39035/mapapp',
        changeOrigin: true
      },
      '/scp-mdmapp': {
        target: 'http://172.16.10.29:8082/scp-mdmapp',
        changeOrigin: true
      },
      '/scp-broadcastcomponent/broadcast': {
        target: 'http://172.16.10.3:8082/scp-broadcastcomponent/broadcast',
        changeOrigin: true
      },
      '/scp-broadcastapp': {
        target: 'http://192.168.0.242:30940/scp-broadcastapp',
        changeOrigin: true
      },
      '/scp-accesscontrolapp': {
        target: 'http://localhost:8082/scp-accesscontrolapp',
        changeOrigin: true
      },
      '/scp-parkinglotapp': {
        target: 'http://localhost:8082/scp-parkinglotapp',
        changeOrigin: true
      },
      '/scp-cardmgmtapp': {
        target: 'http://localhost:8082/scp-cardmgmtapp'
      },
      '/scp-videogatewayapp': {
        target: 'http://192.168.0.242:30081/scp-videogatewayapp',
        changeOrigin: true
      },
      '/scp-ismgcomponent': {
        target: 'http://192.168.0.242:30081/scp-ismgcomponent'
      }
    }
  })
}
