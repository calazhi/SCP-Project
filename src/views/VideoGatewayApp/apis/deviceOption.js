import Axios from '@/assets/js/AxiosPlugin'

export const getSuperBrainPageList = params => { return Axios.get('/scp-videogatewayapp/organization/device/getSuperBrainPageList', { params, headers: { 'Content-Type': 'application/json' } }) }
export const getChannelListByOrgId = params => { return Axios.get('/scp-videogatewayapp/organization/device/getChannelListByOrgId', { params, headers: { 'Content-Type': 'application/json' } }) }
export const postInsertCamara = (params) => { return Axios.post('/scp-videogatewayapp/super/brain/camera/channel/insert', params, { headers: { 'Content-Type': 'application/json' } }) }
export const postUpdateCamara = (params) => { return Axios.post('/scp-videogatewayapp/super/brain/camera/channel/update', params, { headers: { 'Content-Type': 'application/json' } }) }
export const postDelateCamara = (params) => { return Axios.post('/scp-videogatewayapp/super/brain/camera/channel/delete', params, { headers: { 'Content-Type': 'application/json' } }) }
export const postQueryCamara = params => { return Axios.get('/scp-videogatewayapp/super/brain/camera/channel/get', { params, headers: { 'Content-Type': 'application/json' } }) }
