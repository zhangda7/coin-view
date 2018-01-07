<template>
  <div>
    <div class="card-panel-text">币差</div><br/>
    <el-table :data="list" style="width: 100%;padding-top: 15px;font-size:12px;">
      <el-table-column label="币种" style="width: 40%;" align="center">
        <template slot-scope="scope" >
          {{scope.row.coinType}}
        </template>
      </el-table-column>
      <el-table-column label="差值" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.delta.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="归一化差值" style="width: 40%" align="center">
        <template slot-scope="scope">
          ¥{{scope.row.normaliseDelta.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="最大交易数量" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.amount.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="源平台" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.platform1}}
        </template>
      </el-table-column>
      <el-table-column label="目标平台" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.platform2}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchPriceDelta } from '@/api/transaction'
import { formatDate } from '@/api/transaction'

export default {
  props: ['platform', 'sourceCoin'],
  data() {
    return {
      list: null,
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
