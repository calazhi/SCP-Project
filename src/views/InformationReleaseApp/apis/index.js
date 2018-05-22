import axios from '../../../assets/js/AxiosPlugin'
// 素材管理分页
export const postMaterialsData = (params) => { return axios.post('/scp-informationreleaseapp/media/list', params, { headers: { 'Content-Type': 'application/json' } }) }
// 素材管理上传
export const postMaterialsAddData = (params) => { return axios.post('/scp-informationreleaseapp/media/uploadMedia', params, { headers: { 'enctype': 'application/x-www-form-urlencoded' } }) }
// 获取素材上传服务器接口
export const getUploadServerData = (params) => { return axios.get('/scp-informationreleaseapp/media/file/getConfig', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 检查素材是否重名
export const getIsDuplicationData = (params) => { return axios.get('/scp-informationreleaseapp/media/is/repeat', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 获取素材类型接口
export const getMaterialsTypeData = (params) => { return axios.get('/scp-informationreleaseapp/media/type/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 素材保存接口
export const postMaterialsSaveData = (params) => { return axios.post('/scp-informationreleaseapp/media/insertMedia', params, { headers: { 'Content-Type': 'application/json' } }) }
// 获取节目状态接口
export const getItemStateData = (params) => { return axios.get('/scp-informationreleaseapp/item/status/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 获取分辨率接口
export const getResolutionData = (params) => { return axios.get('/scp-informationreleaseapp/item/resolution/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 节目添加
export const postItemAddData = (params) => { return axios.post('/scp-informationreleaseapp/item/insert', params, { headers: { 'Content-Type': 'application/json' } }) }
// 节目删除
export const getItemDeleteData = (params) => { return axios.get('/scp-informationreleaseapp/item/delete', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 编辑节目
export const postEditorItemData = (params) => { return axios.post('/scp-informationreleaseapp/item/update', params, { headers: { 'Content-Type': 'application/json' } }) }
// 根据id获取节目信息
export const getItemMessageData = (params) => { return axios.get('/scp-informationreleaseapp/item/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 节目批量删除
export const postItemBatchDeleteData = (params) => { return axios.post('/scp-informationreleaseapp/item/deletePatch', params, { headers: { 'Content-Type': 'application/json' } }) }
// 节目获取主设备
export const getChooseEquipmentData = (params) => { return axios.get('/scp-informationreleaseapp/item/primaryDevice/list', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 获取日程状态接口
export const getScheduleStateData = (params) => { return axios.get('/scp-informationreleaseapp/schedule/status/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 获取日程播放类型接口
export const getSchedulePlayTypeData = (params) => { return axios.get('/scp-informationreleaseapp/schedule/play/type/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 日程管理分页
export const postSchedulePageData = (params) => { return axios.post('/scp-informationreleaseapp/schedule/list', params, { headers: { 'Content-Type': 'application/json' } }) }
// 获取发布状态接口
export const getIssueStateData = (params) => { return axios.get('/scp-informationreleaseapp/schedule/publish/type/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 取节目列表
export const getItemListData = (params) => { return axios.get('/scp-informationreleaseapp/item/listAll', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 删除日程
export const getDeleteScheduleData = (params) => { return axios.get('/scp-informationreleaseapp/schedule/delete', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 批量删除日程
export const postBatchDeleteScheduleData = (params) => { return axios.post('/scp-informationreleaseapp/schedule/deletePatch', params, { headers: { 'Content-Type': 'application/json' } }) }
// 素材删除
export const getMaterialDeleteData = (params) => { return axios.get('/scp-informationreleaseapp/media/delete', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 素材批量删除
export const postMaterialBatchDeleteData = (params) => { return axios.post('/scp-informationreleaseapp/media/deletePatch', params, { headers: { 'Content-Type': 'application/json' } }) }
// 添加日程
export const postAddScheduleData = (params) => { return axios.post('/scp-informationreleaseapp/schedule/insert', params, { headers: { 'Content-Type': 'application/json' } }) }
// 根据id获取日程信息
export const getScheduleByIdData = (params) => { return axios.get('/scp-informationreleaseapp/schedule/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 编辑日程
export const postEditorScheduleData = (params) => { return axios.post('/scp-informationreleaseapp/schedule/update', params, { headers: { 'Content-Type': 'application/json' } }) }
// 屏幕配置
export const getScreenConfigData = (params) => { return axios.get('/scp-informationreleaseapp/item/getScreenConfig', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 获取设备信息
export const getDeviceListData = (params) => { return axios.get('/scp-informationreleaseapp/schedule/device/list', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 节目分页查询
export const postPagingQueryData = (params) => { return axios.post('/scp-informationreleaseapp/item/list', params, { headers: { 'Content-Type': 'application/json' } }) }
// 日程发布记录查询
export const postScheduleReleasesQueriesData = (params) => { return axios.post('/scp-informationreleaseapp/schedule/list/scheduleHistory', params, { headers: { 'Content-Type': 'application/json' } }) }
// 日程设备关联分页查询
export const postScheduleEquipmentData = (params) => { return axios.post('/scp-informationreleaseapp/schedule/list/scheduleDevice', params, { headers: { 'Content-Type': 'application/json' } }) }
// 上传发布信息
export const postSendIssueData = (params) => { return axios.post('/scp-informationreleaseapp/schedule/publish', params, { headers: { 'Content-Type': 'application/json' } }) }
export const deleteMaterial = (params) => { return axios.get('/infoApp/material/delete', { params: params }) }
// 素材管理列表假数据
export const materialList = (params) => { return axios.get('/infoApp/material/list', { params: params }) }
// 节目管理列表假数据
export const programList = (params) => { return axios.get('/infoApp/program/list', { params: params }) }
// 节目管理获取屏幕配置假数据
// export const programScreenConfig = (params) => { return axios.get('/infoApp/program/getScreenConfig', { params: params }) }
export const customMaterial = (params) => { return axios.get('/infoApp/material/custom', { params: params }) }
// 日程管理更新获取原有信息
export const getScheduleById = (params) => { return axios.get('/scp-informationreleaseapp/schedule/get', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 日程管理分页 mock数据
// export const getSchedulePage = (params) => { return axios.post('/infoApp/material/Pagelist', params, { headers: { 'Content-Type': 'application/json' } }) }
// 取节目列表 mock数据
// export const getItemList = (params) => { return axios.get('/infoApp/material/listAll', { params: params, headers: { 'Content-Type': 'application/json' } }) }
// 获取设备信息 mock数据
// export const getDeviceList = (params) => { return axios.get('/scp-informationreleaseapp/schedule/device/list/demo', params, { headers: { 'Content-Type': 'application/json' } }) }
