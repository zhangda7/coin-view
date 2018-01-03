<template>
  <div>
    <div class="card-panel-text">{{platform}} - {{sourceCoin}}</div><br/>
    <div class="card-panel-text">最后更新时间：{{lastUpdateDate}}</div>
    <el-table :data="list" style="width: 100%;padding-top: 15px;font-size:12px;">
      <el-table-column label="名称" style="width: 20%" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 'buy'" type="danger">{{scope.row.name}}</el-tag>
          <el-tag v-if="scope.row.type == 'sell'" type="success">{{scope.row.name}}</el-tag>
          
          <!-- <el-tag :type="scope.row.name | statusFilter"> {{scope.row.name}}</el-tag> -->
          <!-- {{scope.row.name}} -->
        </template>
      </el-table-column>
      <el-table-column label="Price" style="width: 40%;" align="center">
        <template slot-scope="scope" >
          ¥{{scope.row.price | toThousandslsFilter}}
        </template>
      </el-table-column>
      <el-table-column label="amount" style="width: 40%" align="center">
        <template slot-scope="scope">
          {{scope.row.amount}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/transaction'
import { fetchPriceRtinfo } from '@/api/transaction'
import { fetchHuobiRtinfo } from '@/api/transaction'

export default {
  props: ['platform', 'sourceCoin'],
  data() {
    return {
      list: null,
      lastUpdateDate:new Date()
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
    }
  },
  created() {
    setInterval(() => {
      this.fetchData()
    }, 2000);
    
  },
  methods: {
    fetchData() {
      fetchPriceRtinfo(this.platform, this.sourceCoin).then(response => {
        // console.log('response:' + response.data.data)
        var allDepth = JSON.parse(response.data.data)["LISTING_PRICE"]
        console.log('allDepth:' + allDepth)
        this.list = allDepth;
        this.lastUpdateDate = new Date();
        // var buyDepth = allDepth["buyDepth"]
        // console.log('buyDepth:' + buyDepth)
      })
      // fetchList().then(response => {
      //   this.list = response.data.items.slice(0, 7)
      // })
      
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
