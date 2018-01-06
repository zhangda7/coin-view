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

export function fetchPriceRtinfo(platform, sourceCoin) {
  return request({
    // url: 'http://http://47.97.127.136:8081/listingPriceInfo?platform=' + platform + '&sourcecoin=' + sourceCoin,
    url: 'http://localhost:8081/listingPriceInfo?platform=' + platform + '&sourcecoin=' + sourceCoin,
    method: 'get',
  })
}

export function fetchAccountInfo(platform) {
  return request({
    // url: 'http://http://47.97.127.136:8081/listingPriceInfo?platform=' + platform + '&sourcecoin=' + sourceCoin,
    url: 'http://localhost:8081/accountInfo?platform=' + platform,
    method: 'get',
  })
}

export function fetchTradeHistory() {
  return request({
    // url: 'http://http://47.97.127.136:8081/listingPriceInfo?platform=' + platform + '&sourcecoin=' + sourceCoin,
    url: 'http://localhost:8081/listingTradeHistory',
    method: 'get',
  })
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
  };
  for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
