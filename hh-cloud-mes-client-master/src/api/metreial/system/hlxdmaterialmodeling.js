import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/material/hlxdmaterialmodeling/page',
    method: 'get',
    params: query
  })
}
export function tree(query) {
  return request({
    url: '/material/hlxdmaterialmodeling/tree',
    method: 'get',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/material/hlxdmaterialmodeling',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/material/hlxdmaterialmodeling/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/material/hlxdmaterialmodeling/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/material/hlxdmaterialmodeling',
    method: 'put',
    data: obj
  })
}
