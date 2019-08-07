import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/APIResource',
    method: 'get',
    params: query
  })
}

export function fetchClient(id) {
  return request({
    url: '/APIResource/' + id,
    method: 'get'
  })
}
