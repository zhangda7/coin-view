<template>
  <div>
    <label>最后更新时间：{{lastUpdateDate}}</label>
    <el-table :data="list" style="width: 100%;padding-top: 15px;">
      <el-table-column label="名称" width="195" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 'buy'" type="danger">{{scope.row.name}}</el-tag>
          <el-tag v-if="scope.row.type == 'sell'" type="success">{{scope.row.name}}</el-tag>
          
          <!-- <el-tag :type="scope.row.name | statusFilter"> {{scope.row.name}}</el-tag> -->
          <!-- {{scope.row.name}} -->
        </template>
      </el-table-column>
      <el-table-column label="Price" width="195" align="center">
        <template slot-scope="scope">
          ¥{{scope.row.price | toThousandslsFilter}}
        </template>
      </el-table-column>
      <el-table-column label="amount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.amount}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/transaction'
import { fetchRtinfo } from '@/api/transaction'
import { fetchHuobiRtinfo } from '@/api/transaction'

export default {
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
      fetchHuobiRtinfo().then(response => {
        console.log('response:' + response.data.data)
        var allDepth = JSON.parse(response.data.data)["HUOBI_COIN_COIN_BTC_ETH_"]
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
