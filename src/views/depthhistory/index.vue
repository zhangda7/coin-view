<template>
  <div class="dashboard-editor-container">
    <br/>
    <label>历史价格变化</label>
    <depth-panel-group @handleSetLineChartData="handleSetLineChartData"></depth-panel-group>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <depth-line-chart :chart-data="lineChartData"></depth-line-chart>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import DepthLineChart from './DepthLineChart'
import DepthPanelGroup from './DepthPanelGroup'
import { fetchDepthHistory } from '@/api/transaction'

const lineChartDataDemo = {
  newVisitis: {
    binanceData: [100, 120, 161, 134, 105, 160, 165],
    bithumbData: [120, 82, 91, 154, 162, 140, 145],
    xaxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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

export default {
  name: 'depthhistory',
  components: {
    DepthLineChart,
    DepthPanelGroup
  },
  data() {
    return {
       lineChartData: lineChartDataDemo.newVisitis,
       listQuery: {
        platform: undefined,
        sourceCoin: undefined,
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
    getDepthList(sourceCoin) {
      this.listQuery.sourceCoin = sourceCoin
      var query1 = {}
      query1.platform = "BINANCE"
      query1.sourceCoin = sourceCoin
      query1.startTime = this.listQuery.startTime
      query1.endTime = this.listQuery.endTime
      fetchDepthHistory(query1).then(response => {
        // this.list = JSON.parse(JSON.parse(response.data.data).tableData)
        // this.stat = JSON.parse(response.data.data).stat
        // console.log('==>' + this.response.data)
        this.lineChartData.binanceData = JSON.parse(response.data.data).binance
        this.lineChartData.bithumbData = JSON.parse(response.data.data).bithumb
        this.lineChartData.xaxis = JSON.parse(response.data.data).xaxis
        var min1 = Array.min(this.lineChartData.binanceData)
        var min2 = Array.min(this.lineChartData.bithumbData)
        this.lineChartData.miny = Math.min(min1, min2)
      })
    },
    handleSetLineChartData(type) {
      this.getDepthList(type)
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
