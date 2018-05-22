import Axios from '@/assets/js/AxiosPlugin'

// export const getOwners = () => {
//   return Axios.post('/scp-accesscontrolapp/auths/list').then(res => res.data)
// }
export const getOwners = (page, pageSize, personType, form) => {
  return Axios.post('/scp-accesscontrolapp/auths/list?currentPage=' + page + '&pageSize=' + pageSize + '&personType=' + personType, form).then(res => res.data)
}
