import request from '@/utils/request'

export function createBook(data) {
  return request({
    url: '/book/create',
    method: 'post',
    data
  })
}

export function fetchBook(data) {
  return request({
    url: '/book/info',
    method: 'get',
    params: data
  })
}

export function getCurrentBook(id) {
  return request({
    url: '/book/current',
    method: 'get',
    params: { id }
  })
}

export function updateBook(data) {
  return request({
    url: '/book/update',
    method: 'post',
    data
  })
}
