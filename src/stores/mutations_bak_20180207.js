import * as types from './mutation-types'
import getters from './getters'

const state = {
  headerStatus: true,
  windowHeight: window.innerHeight,
  userinfo: {
    'userId': 'linzhong123',
    'userName': 'lz',
    'department': '用户与权限管理',
    'roles': [
      {
        'code': '3e50e1b79469412ea0f0177c0b9ce88c',
        'name': '软件工程师'
      },
      {
        'code': 'c03de7fc47bd4b119f3bdfa12b6bad15',
        'name': '写诗的人'
      }
    ],
    'uiResources': [
      {
        'id': '1',
        'title': '首页',
        'icon': 'el-icon-setting',
        'url': '/home',
        'menus': null
      },
      {
        'id': '2',
        'title': '模型管理',
        'icon': 'el-icon-menu',
        'url': '/modelmgmt/modelmgmtindex',
        'menus': [
          {
            'id': null,
            'title': '模型算法管理',
            'url': '/modelmgmt/modelalgorithmmgmt',
            'icon': null,
            'submenus': [
              {
                'id': null,
                'title': '基本信息管理',
                'url': '/modelmgmt/baseinfomgmt',
                'icon': null,
                'submenus': null,
                'items': null
              }
            ],
            'items': null
          },
          {
            'id': null,
            'title': '模型执行管理',
            'url': '/modelmgmt/modelexcutionmgmt',
            'icon': null,
            'submenus': [
              {
                'id': null,
                'title': '计划管理',
                'url': '/modelmgmt/planmgmt',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '任务管理',
                'url': '/modelmgmt/taskmgmt',
                'icon': null,
                'submenus': null,
                'items': null
              }
            ],
            'items': null
          },
          {
            'id': null,
            'title': '系统管理',
            'url': '/modelmgmt/systemmgmt',
            'icon': null,
            'submenus': [
              {
                'id': null,
                'title': '系统参数管理',
                'url': '/modelmgmt/baseConfigMgmt',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '元数据管理',
                'url': '/modelmgmt/metacatmgmt',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '节点管理',
                'url': '/modelmgmt/dispatchnodemgmt',
                'icon': null,
                'submenus': null,
                'items': null
              }
            ],
            'items': null
          }
        ]
      },
      {
        'id': '4',
        'title': '设备管理',
        'icon': 'el-icon-menu',
        'url': '/devicemgmt/devicemgmtindex',
        'menus': [
          {
            'id': null,
            'title': '设备注册管理',
            'url': '/devicemgmt/deviceregister',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '设备状态监控',
            'url': '/devicemgmt/devicestatusmonitor',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '设备参数配置',
            'url': '/devicemgmt/deviceparamconfig',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '设备固件升级',
            'url': '/devicemgmt/devicefirmwareupdate',
            'icon': null,
            'submenus': null,
            'items': null
          }
        ]
      },
      {
        'id': '5',
        'icon': 'el-icon-menu',
        'url': '/safetyappindex/safetyappindex',
        'title': '事件应用',
        'menus': [
          {
            'id': null,
            'icon': null,
            'url': '/safetyappindex/linkageruleapp',
            'title': '联动规则管理',
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'icon': null,
            'url': '/safetyappindex/eventlogapp',
            'title': '事件管理',
            'submenus': null,
            'items': null
          }
        ]
      },
      {
        'id': '6',
        'title': '地图应用',
        'icon': 'el-icon-menu',
        'url': '/mapapp/mapappindex',
        'menus': [
          {
            'id': null,
            'title': '地图配置',
            'url': '/mapapp/mapconfig',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '地图场景管理',
            'url': '/mapapp/scenemanager',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '业务数据管理',
            'url': '/mapapp/businessmanager',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '停车场管理',
            'url': '/mapapp/parkingmanager',
            'icon': null,
            'submenus': null,
            'items': null
          },
          // {
          //   'id': null,
          //   'title': '电子围栏管理',
          //   'url': '/mapapp/fencemanager',
          //   'icon': null,
          //   'submenus': null,
          //   'items': null
          // },
          {
            'id': null,
            'title': '批量点位管理',
            'url': '/mapapp/batchmanager',
            'icon': null,
            'submenus': null,
            'items': null
          }
        ]
      },
      {
        'id': '7',
        'title': '主数据管理',
        'icon': 'el-icon-menu',
        'url': '/mdmapp/mdmappindex',
        'menus': [
          {
            'id': null,
            'title': '组织管理',
            'url': '/mdmapp/orgmanager',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '房屋管理',
            'url': '/mdmapp/housemanager',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '人员管理',
            'url': '/mdmapp/personmanager',
            'icon': null,
            'submenus': null,
            'items': null
          }
        ]
      },
      {
        'id': '8',
        'title': '个性化广播',
        'icon': 'el-icon-menu',
        'url': '/broadcastapp/broadcastappindex',
        'menus': [
          {
            'id': null,
            'title': '音频管理',
            'url': '/broadcastapp/audiomanager',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '场景管理',
            'url': '/broadcastapp/sceneManager',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '定时任务',
            'url': '/broadcastapp/regulartask',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '即时任务',
            'url': '/broadcastapp/actualtask',
            'icon': null,
            'submenus': null,
            'items': null
          }
        ]
      },
      {
        'id': '9',
        'title': '访客管理',
        'icon': 'el-icon-menu',
        'url': '/visitorapp/visitorappindex',
        'menus': [
          {
            'id': null,
            'title': '访客管理',
            'url': '/visitorapp/visitorapp',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '物业管理',
            'url': '/visitorapp/propertyapp',
            'icon': null,
            'submenus': null,
            'items': null
          }
        ]
      },
      {
        'id': '10',
        'title': '门禁应用',
        'icon': 'el-icon-menu',
        'url': '/accesscontrolapp/accesscontropindex',
        'menus': [
          {
            'id': null,
            'title': '设备组管理',
            'url': '/accesscontrolapp/deviceGroupMgmt',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '门禁权限管理',
            'url': '/accesscontrolapp/auth',
            'icon': null,
            'submenus': null,
            'items': null
          }
        ]
      },
      {
        'id': '12',
        'icon': 'el-icon-menu',
        'url': '/infoapp/infoappindex',
        'title': '信息展示应用',
        'menus': [
          {
            'id': null,
            'icon': null,
            'url': '/infoappindex/materialapp',
            'title': '素材管理',
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'icon': null,
            'url': '/infoappindex/programapp',
            'title': '节目管理',
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'icon': null,
            'url': '/infoappindex/scheduleapp',
            'title': '日程管理',
            'submenus': null,
            'items': null
          }
          // {
          //   'id': null,
          //   'icon': null,
          //   'url': '/infoappindex/scheduleapprelease',
          //   'title': '日程发布记录',
          //   'submenus': null,
          //   'items': null
          // }
        ]
      },
      {
        'id': '13',
        'icon': 'el-icon-menu',
        'url': '/videogatewayapp/videogatewayindex',
        'title': '视频应用',
        'menus': [{
          'id': '',
          'icon': null,
          'url': '/videogatewayapp/videooption',
          'title': '视频参数配置',
          'submenus': null,
          'items': null
        },
        {
          'id': '',
          'icon': null,
          'url': '/videogatewayapp/videotapetemplate',
          'title': '录像计划模板配置',
          'submenus': null,
          'items': null
        },
        {
          'id': '',
          'icon': null,
          'url': '/videogatewayapp/videotapeplan',
          'title': '录像计划配置',
          'submenus': null,
          'items': null
        },
        {
          'id': '',
          'icon': null,
          'url': '/videogatewayapp/customgroup',
          'title': '自定义分组',
          'submenus': null,
          'items': null
        },
        {
          'id': '',
          'icon': null,
          'url': '/videogatewayapp/videodevice',
          'title': '视频设备管理',
          'submenus': null,
          'items': null
        },
        {
          'id': '',
          'icon': null,
          'url': '/videogatewayapp/videoservice',
          'title': '流媒体服务管理',
          'submenus': null,
          'items': null
        }]
      },
      {
        'id': '14',
        'icon': 'el-icon-menu',
        'url': '/laddercontrolapp/ladderappindex',
        'title': '梯控应用',
        'menus': [
          {
            'id': '',
            'icon': null,
            'url': '/ladderappindex/authapp',
            'title': '权限管理',
            'submenus': null,
            'items': null
          },
          {
            'id': '',
            'icon': null,
            'url': '/ladderappindex/eventapp',
            'title': '事件管理',
            'submenus': null,
            'items': null
          }]
      },
      {
        'id': '15',
        'title': '卡片管理',
        'icon': 'el-icon-menu',
        'url': '10',
        'menus': [
          {
            'id': null,
            'title': '卡片管理',
            'url': '/CardMgmtAppIndex',
            'icon': null,
            'submenus': [
              {
                'id': null,
                'title': '卡片入库',
                'url': '/CardMgmtAppIndex/storeCard',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '卡片查询',
                'url': '/CardMgmtAppIndex/queryCard',
                'icon': null,
                'submenus': null,
                'items': null
              }],
            'items': null
          },
          {
            'id': null,
            'title': '二维码管理',
            'url': '/QrCodeMgmtIndex',
            'icon': null,
            'submenus': [
              {
                'id': null,
                'title': '二维码查询',
                'url': '/QrCodeMgmtIndex/qrCodeQuery',
                'icon': null,
                'submenus': null,
                'items': null
              }],
            'items': null
          }
        ]
      },
      {
        'id': '25',
        'title': '物联网总线',
        'icon': 'el-icon-menu',
        'url': '/iotbusmgmt/iotbusmgmtindex',
        'menus': [
          {
            'id': null,
            'title': '应用管理',
            'url': '/iotbusmgmt/appmgmt',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '事件组管理',
            'url': '/iotbusmgmt/eventgroupmgmt',
            'icon': null,
            'submenus': null,
            'items': null
          },
          {
            'id': null,
            'title': '订阅管理',
            'url': '/iotbusmgmt/submgmt',
            'icon': null,
            'submenus': null,
            'items': null
          }
        ]
      },
      {
        'id': '11',
        'title': '系统管理',
        'icon': 'el-icon-menu',
        'url': '11',
        'menus': [
          {
            'id': '3',
            'title': '用户权限管理',
            'icon': 'el-icon-menu',
            'url': '/usermgmt/userauthmgmt',
            'submenus': [
              {
                'id': null,
                'title': '用户管理',
                'url': '/userMgmt/userManagement/user',
                'icon': null,
                'submenus': null,
                'items': null
              },
              // {
              //   'id': null,
              //   'title': '部门管理',
              //   'url': '/userMgmt/userManagement/department',
              //   'icon': null,
              //   'submenus': null,
              //   'items': null
              // },
              {
                'id': null,
                'title': '用户组管理',
                'url': '/userMgmt/userManagement/userGroup',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '角色管理',
                'url': '/userMgmt/userManagement/role',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '资源管理',
                'url': '/userMgmt/userManagement/resource',
                'icon': null,
                'submenus': null,
                'items': null
              }
              // {
              //   'id': null,
              //   'title': '修改密码',
              //   'url': '/usermgmt/pwdedit',
              //   'icon': null,
              //   'submenus': null,
              //   'items': null
              // }
            ]
          },
          {
            'id': '28',
            'title': '短信网关',
            'icon': 'el-icon-menu',
            'url': '28',
            'submenus': [
              {
                'id': null,
                'title': '发送短信',
                'url': '/ismgapp/sendsms',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '发送历史记录查询',
                'url': '/ismgapp/searchsms',
                'icon': null,
                'submenus': null,
                'items': null
              }
            ]
          },
          {
            'id': '18',
            'title': '日志管理',
            'icon': 'el-icon-menu',
            'url': '10',
            'submenus': [{
              'id': null,
              'title': '日志管理',
              'url': '/logservicecomponent/logserviceindex',
              'icon': null,
              'submenus': null,
              'items': null
            }]
          },
          {
            'id': '18',
            'title': '示例',
            'icon': 'el-icon-menu',
            'url': '10',
            'submenus': [
              {
                'id': null,
                'title': '示例',
                'url': '/viewdemo/index',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '示例1',
                'url': '/viewdemo/index1',
                'icon': null,
                'submenus': null,
                'items': null
              },
              {
                'id': null,
                'title': '示例2',
                'url': '/viewdemo/index2',
                'icon': null,
                'submenus': null,
                'items': null
              }
            ]
          }
        ]
      }
    ],
    'token': 'eyJhbGciOiJSUzUxMiJ9.eyJzdWIiOiJsaW56aG9uZzEyMyIsImV4cCI6MTUxNTQ5NDI0Mn0.ERXV7NOoodRngLCVSemsxxJ_pdj3TxF92z5hkb7NMeKMPxJ3HCy4rogD-ndCDLw3A1AhTMxOgfLNCRYZG_vQfLwaFIlbNInmk0Q2wetMgN0EgwIt2LWDjEXkFfIst7aIS_0j6dAQHWnpEiKloyBUWWO-RGbgbbXjqdbaBfFIF98'
  }

}

const mutations = {
  [types.SHOW_HEADER] (state) {
    state.headerStatus = true
  },
  [types.HIDE_HEADER] (state) {
    state.headerStatus = false
  },
  SET_WINDOWHEIGHT (state, innerHeight) {
    state.windowHeight = innerHeight
  },

  SET_USERINFO (state, user) {
    state.userinfo = user
  }

}

export default {
  state,
  mutations,
  getters
}
