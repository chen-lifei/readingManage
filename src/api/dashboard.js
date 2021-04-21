import request from '@/utils/request'

export function getNumner() {
  return request({
    url: '/dashboard/number',
    method: 'get'
  })
}
