export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    let str = o[k] + ''
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

export function getChartOptions (valueX, valueY, Max) {
  // var myChart = chart
  if (valueX.length === 0) {
    var optionsWithoutValue = ({
      xAxis: {
        max: new Date(),
        min: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
        type: 'time',
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: function (a) {
            var date = new Date(a)
            var t1 = function (num) { return num < 10 ? '0' + num : num }
            return [t1(date.getHours()), t1(date.getMinutes()), t1(date.getSeconds())].join(':')
          }
        }
      },
      yAxis: {
        max: 1,
        min: 0,
        type: 'value',
        splitLine: {
          show: false
        }
      },
      // tooltip: {
      //   trigger: 'axis',
      // },
      dataZoom: [{
      }, {
        type: 'inside'
      }],
      series: {
        markLine: {
          silent: true,
          data: []
        }
      },
      graphic: [
        {
          type: 'group',
          left: 'center',
          top: 'center',
          children: [
            {
              type: 'text',
              z: 100,
              left: '33%',
              top: 'middle',
              style: {
                fill: '#333',
                text: '暂无历史数据\n\n（如需获取数据，请先在参数配置页面开启监控任务）',
                font: '15px Microsoft YaHei',
                textAlign: 'center'
              }
            }
          ]
        }
      ]
    })
    return optionsWithoutValue
  } else {
    var listX = valueX
    var listY = valueY
    var ThresholdMax = Max
    var options = ({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {data: listX},
      yAxis: {
        splitLine: {
          show: false
        }
      },
      toolbox: {
        left: 'center',
        feature: {
          restore: {},
          saveAsImage: {}
        }
      },
      dataZoom: [{
      }, {
        type: 'inside'
      }],
      visualMap: {
        top: 10,
        right: 80,
        pieces: [{
          gt: 0,
          lte: ThresholdMax,
          color: '#096'
        }, {
          gt: ThresholdMax,
          color: '#cc0033'
        }],
        outOfRange: {
          color: '#999'
        }
      },
      series: {
        data: listY,
        markLine: {
          silent: true,
          data: [{
            name: '阈值',
            yAxis: ThresholdMax
          }]
        }
      }
    })
    return options
  }
}
