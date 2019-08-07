import request from '@/utils/request'

export function login(data) {
  return request({
    // url: '/user/login',
    url: '/test/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/user/info',
    url: '/test/getuserinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
