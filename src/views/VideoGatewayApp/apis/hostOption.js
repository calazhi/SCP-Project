import axios from '../../../assets/js/AxiosPlugin'
// 取节报警主机列表
export const getalarmList = () => { return axios.get('/scp-securityapp/defensezone/listAlarmHosts ', { headers: { 'Content-Type': 'application/json' } }) }
// 分页查询电子围栏防区列表
export const postHostData = (params) => { return axios.post('/scp-securityapp/defensezone/listDefenseZonePage', params, { headers: { 'Content-Type': 'application/json' } }) }
// 布防撤防接口
export const postDefence = (params) => { return axios.post('/scp-securityapp/defensezone/setupAlarmZone', params, { headers: { 'Content-Type': 'application/json' } }) }
