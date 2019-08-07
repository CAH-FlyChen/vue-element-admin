import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/PersistedGrant',
    method: 'get',
    params: query
  })
}

export function fetchClient(id) {
  return request({
    url: '/PersistedGrant/' + id,
    method: 'get'
  })
}
