import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}

export function fetchRtinfo() {
  return request({
    url: 'http://localhost:8081/listingBuyInfo',
    method: 'get',
  })
}
