import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/material/hlxdindexconfigure/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/material/hlxdindexconfigure',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/material/hlxdindexconfigure/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/material/hlxdindexconfigure/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/material/hlxdindexconfigure',
    method: 'put',
    data: obj
  })
}
