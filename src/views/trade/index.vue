<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('交易平台')" v-model="listQuery.tradePlatform">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('交易方向')" v-model="listQuery.direction">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('开始时间')" v-model="listQuery.startTime">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('结束时间')" v-model="listQuery.endTime">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>

    <div class="filter-container">
      <label>总盈利: ${{stat.totalProfit}} &nbsp;&nbsp;&nbsp;</label>
      <label>总手续费: ${{stat.totalFee}} &nbsp;&nbsp;&nbsp;</label>
      <label>交易次数: ${{stat.totalCount}}</label>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column width="50px" align="center" :label="$t('交易对ID')">
        <template slot-scope="scope">
          {{scope.row.pairId}}
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" :label="$t('交易平台')">
        <template slot-scope="scope">
          <span>{{scope.row.tradePlatform}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="50px" :label="$t('币种')">
        <template slot-scope="scope">
          <span>{{scope.row.coinType}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="170px" :label="$t('交易状态')">
        <template slot-scope="scope">
          <span>动作：{{scope.row.tradeAction}}</span><br/>
           <span>方向：{{scope.row.direction}}</span><br/>
            <span>结果：{{scope.row.result}}</span><br/>
        </template>
      </el-table-column>
      <el-table-column width="90px" align="center" :label="$t('归一化盈利(USD)')">
        <template slot-scope="scope">
          <span>{{scope.row.profit.toFixed(3)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('价格')">
        <template slot-scope="scope">
          <span>{{scope.row.price.toFixed(3)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('归一化价格')">
        <template slot-scope="scope">
          <span>{{scope.row.normalizePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('交易数量')">
        <template slot-scope="scope">
          <span>{{scope.row.amount.toFixed(6)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('手续费')">
        <template slot-scope="scope">
          <span>{{scope.row.normalizeFee.toFixed(6)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('币数量变化')">
        <template slot-scope="scope">
          <span>{{scope.row.preAccountSourceAmount.toFixed(4)}} -> {{scope.row.afterAccountSourceAmount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('对标币种变化')">
        <template slot-scope="scope">
          <span>{{scope.row.targetCoinType}}</span><br/>
          <span>{{scope.row.preAccountTargetAmount.toFixed(6)}} -> {{scope.row.afterAccountTargetAmount.toFixed(6)}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" :label="$t('交易时间')">
        <template slot-scope="scope">
          <span>{{scope.row.gmtCreated}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchTradeHistory } from '@/api/transaction'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

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

export default {
  name: 'trade',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      stat:null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        startTime:new Date(new Date().getTime() - 1 * 24 * 3600 * 1000).Format("yyyy-MM-dd hh:mm:ss"),
        endTime:new Date().Format("yyyy-MM-dd hh:mm:ss")
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
      fetchTradeHistory(this.listQuery).then(response => {
        // console.log('response:' + response.data.data)
        // var retJson = JSON.parse(response.data.data)
        // this.list = allDepth;
        // this.list = JSON.parse(response.data.data)
        this.list = JSON.parse(JSON.parse(response.data.data).tableData)
        this.stat = JSON.parse(response.data.data).stat
        console.log('==>' + this.list)
        this.total = response.data.count
        this.listLoading = false
      })
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
      
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
      //     this.temp.author = 'vue-element-admin'
      //     createArticle(this.temp).then(() => {
      //       this.list.unshift(this.temp)
      //       this.dialogFormVisible = false
      //       this.$notify({
      //         title: '成功',
      //         message: '创建成功',
      //         type: 'success',
      //         duration: 2000
      //       })
      //     })
      //   }
      // })
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
