<template>
  <div class="dashboard-editor-container">
    <br/>
    <label>历史价格变化</label><br/>
    <label>采样点个数：{{count}}</label>
    
    <!-- <depth-panel-group @handleSetLineChartData="handleSetLineChartData"></depth-panel-group> -->
    <!-- <el-row class="panel-group" :gutter="40"> -->
    <div class="card-panel-col">
      <el-select style="width: 140px; paddingLeft:20px" class="filter-item" v-model="listQuery.sourceCoin">
        <el-option label="BTC" value="BTC"></el-option>
        <el-option label="ETH" value="ETH"></el-option>
        <el-option label="LTC" value="LTC"></el-option>
        <el-option label="EOS" value="EOS"></el-option>
        <el-option label="BTG" value="BTG"></el-option>
        <el-option label="QTUM" value="QTUM"></el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('开始时间')" v-model="listQuery.startTime">
      </el-input>
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('结束时间')" v-model="listQuery.endTime">
    </el-input>
    <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSetLineChartData">{{$t('table.search')}}</el-button>
    </div>
  <!-- </el-row> -->
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <depth-line-chart :chart-data="lineChartData"></depth-line-chart>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <depth-delta-line-chart :chart-data="lineChartDeltaData"></depth-delta-line-chart>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import DepthLineChart from './DepthLineChart'
import DepthDeltaLineChart from './DepthDeltaLineChart'
import DepthPanelGroup from './DepthPanelGroup'
import { fetchDepthHistory } from '@/api/transaction'

const lineChartDataDemo = {
  newVisitis: {
    binanceData: [100, 120, 161, 134, 105, 160, 165],
    bithumbData: [120, 82, 91, 154, 162, 140, 145],
    xaxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    miny:0,
    maxy:100
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

Array.min=function(array)
{
    return Math.min.apply(Math,array);
}

Array.max=function(array)
{
    return Math.max.apply(Math,array);
}

export default {
  name: 'depthhistory',
  components: {
    DepthLineChart,
    DepthDeltaLineChart,
    DepthPanelGroup
  },
  data() {
    return {
       lineChartData: lineChartDataDemo.newVisitis,
       lineChartDeltaData: lineChartDataDemo.newVisitis,
       count:0,
       listQuery: {
        platform: undefined,
        sourceCoin: "BTC",
        startTime:new Date(new Date().getTime() - 1 * 24 * 3600 * 1000).Format("yyyy-MM-dd hh:mm:ss"),
        endTime:new Date().Format("yyyy-MM-dd hh:mm:ss")
      },
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  created() {
    // this.getList()
    this.handleSetLineChartData("BTC")
  },
  methods: {
    getDepthList() {
      var query1 = {}
      query1.sourceCoin = this.listQuery.sourceCoin
      query1.startTime = this.listQuery.startTime
      query1.endTime = this.listQuery.endTime
      fetchDepthHistory(query1).then(response => {
        // this.list = JSON.parse(JSON.parse(response.data.data).tableData)
        // this.stat = JSON.parse(response.data.data).stat
        // console.log('==>' + this.response.data)
        this.lineChartData.binanceData = JSON.parse(response.data.data).binance
        this.lineChartData.bithumbData = JSON.parse(response.data.data).bithumb
        this.lineChartDeltaData.deltaData = JSON.parse(response.data.data).delta
        this.lineChartData.xaxis = JSON.parse(response.data.data).xaxis
        this.count = JSON.parse(response.data.data).count
        var min1 = Array.min(this.lineChartData.binanceData)
        var min2 = Array.min(this.lineChartData.bithumbData)
        this.lineChartData.miny = Math.min(min1, min2)

        this.lineChartDeltaData.deltaData = JSON.parse(response.data.data).delta
        this.lineChartDeltaData.xaxis = JSON.parse(response.data.data).xaxis
        var deltaMin = Array.min(this.lineChartDeltaData.deltaData)
        var deltaMax = Array.max(this.lineChartDeltaData.deltaData)
        this.lineChartDeltaData.miny = deltaMin
        this.lineChartDeltaData.maxy = deltaMax
      })
    },
    handleSetLineChartData() {
      this.getDepthList()
      // this.lineChartData = lineChartData[type]
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
