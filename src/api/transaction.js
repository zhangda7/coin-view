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
    url: 'http://localhost:8081/listingOkexInfo',
    method: 'get',
  })
}

export function fetchHuobiRtinfo() {
  return request({
    url: 'http://localhost:8081/listingHuobiInfo',
    method: 'get',
  })
}
