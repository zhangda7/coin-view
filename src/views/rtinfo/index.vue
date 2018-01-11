<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>

    <el-row :gutter="8">
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <account-info-table platform="BITHUMB"></account-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <account-info-table platform="BINANCE"></account-info-table>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 36}" :sm="{span: 36}" :md="{span: 36}" :lg="{span: 18}" :xl="{span: 18}" style="padding-right:8px;margin-bottom:30px;">
        <price-delta-table platform="BITHUMB"></price-delta-table>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BITHUMB" sourceCoin="BTC"></price-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BITHUMB" sourceCoin="ETH"></price-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BITHUMB" sourceCoin="LTC"></price-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BITHUMB" sourceCoin="QTUM"></price-info-table>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BINANCE" sourceCoin="BTC"></price-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BINANCE" sourceCoin="ETH"></price-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BINANCE" sourceCoin="LTC"></price-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BINANCE" sourceCoin="QTUM"></price-info-table>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BITHUMB" sourceCoin="EOS"></price-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BITHUMB" sourceCoin="BTG"></price-info-table>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BINANCE" sourceCoin="EOS"></price-info-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-right:8px;margin-bottom:30px;">
        <price-info-table platform="BINANCE" sourceCoin="BTG"></price-info-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanelGroup from '../dashboard/admin/components/PanelGroup'
import PriceInfoTable from './PriceInfoTable'
import AccountInfoTable from './AccountInfo'
import PriceDeltaTable from './PriceDelta'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
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

export default {
  name: 'rtinfo',
  components: {
    PanelGroup,
    PriceInfoTable,
    AccountInfoTable,
    PriceDeltaTable
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
