import Mock from 'mockjs'

let contextPath = '/scp-broadcastapp'
// 获取音频列表数据
Mock.mock(contextPath + '/audioclip/search', function () {
  console.log('mock audiolist')
  return {
    statue: true,
    code: '00000',
    message: 'success',
    totalCount: 25,
    data: {
      audioClip: [
        {
          audioClipId: '01',
          audioClipName: '小苹果',
          audioClipFormat: 'mp3',
          createTime: '2017-10-10 08:30:00'
        },
        {
          audioClipId: '02',
          audioClipName: '小苹果2',
          audioClipFormat: 'gis',
          createTime: '2017-10-10 08:30:00'
        },
        {
          audioClipId: '03',
          audioClipName: '小苹果3',
          audioClipFormat: 'avi',
          createTime: '2017-10-10 08:30:00'
        },
        {
          audioClipId: '04',
          audioClipName: '小苹果4',
          audioClipFormat: 'mp3',
          createTime: '2017-10-10 08:30:00'
        },
        {
          audioClipId: '05',
          audioClipName: '同桌的你',
          audioClipFormat: 'mp4',
          createTime: '2017-10-10 08:30:00'
        }
      ]
    }
  }
})

// 添加音频
Mock.mock('/broadcast/audioClip/add/', function (data) {
  console.log('mock audioClip add')
  return {
    statue: true,
    code: 200,
    message: 'del success'
  }
})

// 删除音频
Mock.mock('/broadcast/audioClip/del/', function () {
  console.log('mock audioClip del')
  return {
    statue: true,
    code: 200,
    message: 'del success'
  }
})

/**     实时任务       */

// 获取 实时任务  列表数据
Mock.mock(contextPath + '/realtime/getList', function () {
  console.log('mock audiolist')
  return {
    statue: true,
    code: '00000',
    message: 'success',
    totalCount: 25,
    data: {
      broadcast: [
        {
          taskId: '01',
          broadcastName: '新闻广播',
          repetitions: '3',
          taskLevel: '1'
        },
        {
          taskId: '02',
          broadcastName: '天气预报',
          repetitions: '5',
          taskLevel: '2'
        }
      ]
    }
  }
})

// 实时任务添加
Mock.mock('/broadcast/realtime/task/add', function () {
  console.log('mock realtime task add')
  return {}
})
// 实时任务播放
Mock.mock(contextPath + '/task/play', function () {
  console.log('mock realtime task play')
  return {}
})

// 实时任务停止
Mock.mock(contextPath + '/task/pause', function () {
  console.log('mock realtime task pause')
  return {}
})

// 实时任务删除
Mock.mock(contextPath + '/task/del', function () {
  console.log('mock realtime task del')
  return {}
})

/**     定时任务       */

// 获取 定时任务  列表数据
Mock.mock(contextPath + '/timing/getList', function () {
  console.log('mock audiolist')
  return {
    statue: true,
    code: 200,
    message: 'success',
    totalCount: 25,
    list: [
      {
        taskId: '01',
        taskName: '今日说法',
        startDate: '2017-12-15',
        endDate: '2017-12-15',
        startUpTime: '08:30:00',
        times: '4',
        taskLevel: '1'
      },
      {
        taskId: '02',
        taskName: '明日说法',
        startDate: '2017-12-15',
        endDate: '2017-12-16',
        startUpTime: '08:30:00',
        times: '4',
        taskLevel: '1'
      }
    ]
  }
})

// 定时任务添加
Mock.mock('/broadcast/timing/task/add', function () {
  console.log('mock timing task add')
  return {}
})

// 定时任务删除
Mock.mock(contextPath + '/task/del', function () {
  console.log('mock timing task del')
  return {}
})

// 获取 场景管理列表
let timestamp = Date.parse(new Date())
Mock.mock(contextPath + '/scene/getList', function () {
  console.log('mock Scene')
  return {
    code: '00000',
    statue: true,
    message: 'success',
    totalCount: 10,
    data: {
      scene: [
        {
          sceneName: '场景一',
          createTime: timestamp,
          sceneId: 'se001'
        },
        {
          sceneName: '场景2',
          createTime: timestamp,
          sceneId: 'se002'
        },
        {
          sceneName: '场景3',
          createTime: timestamp,
          sceneId: 'se003'
        },
        {
          sceneName: '场景4',
          createTime: timestamp,
          sceneId: 'se004'
        },
        {
          sceneName: '场景5',
          createTime: timestamp,
          sceneId: 'se005'
        },
        {
          sceneName: '场景6',
          createTime: timestamp,
          sceneId: 'se006'
        }
      ]
    }
  }
})

// 场景添加
Mock.mock('/broadcast/timing/task/add', function () {
  console.log('mock scene task add')
  return {}
})

// 设备信息获取
Mock.mock(contextPath + '/device/getList', function () {
  return {
    code: '00000',
    message: 'success',
    data: {
      deviList: [
        {
          deviName: '设备-1001',
          deviId: '1001',
          areas: [
            {
              areaId: '100000001',
              areaName: '区域-A'
            },
            {
              areaId: '100000002',
              areaName: '区域-B'
            }
          ]
        },
        {
          deviName: '设备-1002',
          deviId: '1002',
          areas: [
            {
              areaId: '100000003',
              areaName: '区域-C'
            },
            {
              areaId: '100000004',
              areaName: '区域-D'
            }
          ]
        },
        {
          deviName: '设备-1003',
          deviId: '1003',
          areas: [
            {
              areaId: '100000005',
              areaName: '区域-E'
            },
            {
              areaId: '100000006',
              areaName: '区域-F'
            }
          ]
        },
        {
          deviName: '设备-1004',
          deviId: '1004',
          areas: [
            {
              areaId: '100000007',
              areaName: '区域-G'
            },
            {
              areaId: '100000008',
              areaName: '区域-H'
            }
          ]
        }
      ]
    }
  }
})
