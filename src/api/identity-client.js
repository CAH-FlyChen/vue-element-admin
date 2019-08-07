import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/client',
    method: 'get',
    params: query
  })
}

export function fetchClient(id) {
  return request({
    url: '/client/' + id,
    method: 'get'
  })
}
