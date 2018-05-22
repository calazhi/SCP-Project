import Axios from '@/assets/js/AxiosPlugin'

// 接口地址
let contextPath = '/scp-broadcastapp'
let uploadContextPath = '/zuul/scp-broadcastapp'

/**
 * 获取音频列表数据
 * @param {Object} data
 */
export const getAudioList = data => {
  return Axios({
    method: 'get',
    url: contextPath + '/audioclip/search',
    params: data
  })
}
/**
 * 添加音频
 * @param {Object} data
 */
export const addAudio = data => {
  return Axios({
    method: 'post',
    timeout: 0,
    url: uploadContextPath + '/audioclip/batchCreate',
    data
  })
}

/**
 * 删除音频
 * @param {Object} data
 */
export const delAudioClip = data => {
  return Axios({
    method: 'get',
    url: '/scp-broadcastapp/audioclip/search',
    params: data
  })
}
/**
 * 批量 删除音频
 * @param {Object} data
 */
export const delMutipAudioClip = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/audioclip/batchDelete',
    data
  })
}
/**
 * 获取 实时任务 列表数据
 * @param {Object} data
 */
export const getRealtimeList = data => {
  return Axios({
    method: 'get',
    url: contextPath + '/task/search',
    params: data
  })
}
/**
 * 添加实时任务
 * @param {Object} data
 */
export const addRealtimeTask = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/task/batchCreate',
    data
  })
}
/**
 * 播放 实时任务
 * @param {Object} data
 */
export const playRealtimeTask = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/task/startOrStop',
    data
  })
}
/**
 * 停止 实时任务
 * @param {Object} data
 */
export const pauseRealtimeTask = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/task/startOrStop',
    data
  })
}

/**
 * 删除实时任务
 * @param {Object} data
 */
export const delRealtimeTask = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/task/batchDelete',
    data
  })
}

/**
 * 即时任务修改保存
 * @param {Object} data
 */
export const updateRealtimeTask = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/task/batchUpdate',
    data
  })
}

/**
 * 获取 定时任务 列表数据
 * @param {Object} data
 */
export const getTimingList = data => {
  return Axios({
    method: 'get',
    url: contextPath + '/task/search',
    params: data
  })
}
/**
 * 添加 定时 任务
 * @param {Object} data
 */
export const addTimingTask = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/task/batchCreate',
    data
  })
}
/**
 * 删除 定时 任务
 * @param {Object} data
 */
export const delTimingTask = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/task/batchDelete',
    data
  })
}

/**
 * 查看任务详情
 * @param {Object} data
 */
export const getTaskDetail = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/task/detail',
    data
  })
}

/**
 * 获取 场景管理 列表数据
 * @param {Object} data
 */
export const getSceneList = data => {
  return Axios({
    method: 'get',
    url: contextPath + '/scene/search',
    params: data
  })
}
/**
 *  添加 场景
 * @param {Object} data
 */
export const addScene = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/scene/batchCreate',
    data
  })
}
/**
 *  删除场景
 *  @param {Object} data
 */
export const delScene = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/scene/batchDelete',
    data
  })
}
/**
 *  查看场景详情
 *  @param {Object} data
 */
export const detailScene = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/scene/detail',
    data
  })
}

/**
 *  场景修改
 *  @param {Object} data
 */
export const updScene = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/scene/update',
    data
  })
}

/**
 *  设备树信息查询
 *  @param {Object} data
 */
export const getDevicesList = data => {
  return Axios({
    method: 'get',
    url: contextPath + '/device/listBroadcasts',
    params: data
  })
}
/**
 *  日志信息查询
 *  @param {Object} data
 */
export const getLogMsg = data => {
  return Axios({
    method: 'get',
    url: contextPath + '/log/search',
    params: data
  })
}
/**
 *  联动配置 查询列表
 *  @param {Object} data
 */
export const getLinkageList = data => {
  return Axios({
    method: 'get',
    url: contextPath + '/config/queryConfigByPage',
    params: data
  })
}
/**
 *  联动配置 新增
 *  @param {Object} data
 */
export const addConfig = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/config/insertConfig',
    data
  })
}
/**
 *  联动配置 删除
 *  @param {Object} data
 */
export const delLinkageConfig = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/config/batchDeleteConfigs',
    data
  })
}
/**
 *  联动配置 修改
 *  @param {Object} data
 */
export const updateConfig = data => {
  return Axios({
    method: 'post',
    url: contextPath + '/config/updateConfig',
    data
  })
}
/**
 * 查询 全部任务
 * @param {Object} data
 */
export const getAllTask = data => {
  return Axios({
    method: 'get',
    url: contextPath + '/task/searchAll',
    params: data
  })
}
