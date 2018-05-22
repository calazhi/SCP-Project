import axios from '../../../assets/js/AxiosPlugin'
// 查询设备
export const getCameraPositionData = (params) => { return axios.get('/scp-videogatewayapp/organization/device/getChannelPageList', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 根据摄像头子设备id分页查询已经绑定的摄像头坐标
export const getCameraPositionBindingData = (params) => { return axios.get('/scp-videogatewayapp/camera/coordinate/list', { params: params }, { headers: { 'Content-Type': 'application/json' } }) }
// 给某个摄像头通道增加位置信息
export const postCameraPositionAddData = (params) => { return axios.post('/scp-videogatewayapp/camera/coordinate/insert', params, { headers: { 'enctype': 'application/x-www-form-urlencoded' } }) }
// 修改某个摄像头通道的某个位置信息
export const postCameraPositionModificationData = (params) => { return axios.post('/scp-videogatewayapp/camera/coordinate/update', params, { headers: { 'enctype': 'application/x-www-form-urlencoded' } }) }
// 删除某个摄像头通道的某个位置信息
export const postCameraPositionDeleteData = (params) => { return axios.post('/scp-videogatewayapp/camera/coordinate/delete', params, { headers: { 'enctype': 'application/x-www-form-urlencoded' } }) }
