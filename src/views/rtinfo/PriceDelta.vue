<template>
  <div style="width: 100%">
    <div class="card-panel-text">归一化盈利总额 {{nomalizeTotalProfit}}</div><br/>
    <div class="card-panel-text">归一化手续费总额 {{nomalizeTotalFee}}</div><br/>
    <div class="card-panel-text">归一化盈利</div><br/>
    <el-table :data="historyList" style="width: 100%;padding-top: 15px;font-size:12px;">
      <el-table-column label="币种" style="width: 40%;height:10px" align="center">
        <template slot-scope="scope" >
          {{scope.row.coinType}}
        </template>
      </el-table-column>
      <el-table-column label="总盈利" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.totalProfit.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="总交易数量" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.totalAmount.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="平均交易盈利" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.averageProfit.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="总手续费" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.totalFee.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.updateDate}}
        </template>
      </el-table-column>
    </el-table>
    <br/>
    <div class="card-panel-text">币差列表</div>
    <br/>
    <el-table :data="list" style="width:100%;padding-top: 15px;font-size:12px;">
      <el-table-column label="币种"  align="center">
        <template slot-scope="scope" >
          {{scope.row.coinType}}
        </template>
      </el-table-column>
      <el-table-column label="差值"  align="center">
        <template slot-scope="scope">
          {{scope.row.delta.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="归一化差值" style="width:10%" align="center">
        <template slot-scope="scope">
          ${{scope.row.normaliseTo10KDelta.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="最大交易数量" style="width: 10%" align="center">
        <template slot-scope="scope">
          {{scope.row.amount.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="高价平台" style="width:30%" align="center">
        <template slot-scope="scope">
          {{scope.row.platform1}} - {{scope.row.targetCoinType1}} - {{scope.row.normalisePrice1.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="低价平台" style="width:30%" align="center">
        <template slot-scope="scope">
          {{scope.row.platform2}} - {{scope.row.targetCoinType2}} - {{scope.row.normalisePrice2.toFixed(2)}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchPriceDelta, fetchMonitorStatus } from '@/api/transaction'
import { formatDate } from '@/api/transaction'

export default {
  props: ['platform', 'sourceCoin'],
  data() {
    return {
      list: null,
      historyList: null,
      nomalizeProfit:null,
      nomalizeTotalFee:null,
      nomalizeTotalProfit:null,
      lastUpdateDate:new Date(),
      lastDataDate:new Date()
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      if(status.inde)
      return statusMap[status]
    },
    formatDate(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss');
        //此处formatDate是一个函数，将其封装在common/js/date.js里面，便于全局使用
    }
  },
  created() {
    setInterval(() => {
      this.fetchData()
    }, 2000);
    
  },
  methods: {
    fetchData() {
      fetchPriceDelta(this.platform).then(response => {
        var retJson = JSON.parse(response.data.data)
        var allDepth = retJson
        console.log('allDepth:' + allDepth)
        this.list = allDepth;
      })
      fetchMonitorStatus().then(response => {
        var retJson = JSON.parse(response.data.data)
        this.nomalizeTotalProfit = retJson["totalNomalizeProfit"]
        this.nomalizeTotalFee = retJson["totalNomalizeFee"]
        this.historyList = retJson["profitHistoryList"]
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.card-panel-text {
        // line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-bottom: 5px;
      }
</style>
