<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <div ref="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {};
  },
  async mounted() {
    let myChart = echarts.init(this.$refs.main);
    const { data: res } = await this.$http.get("reports/type/1");
    let options = {
      title: {
        text: "用户来源"
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#E9EEF3"
          }
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: "value"
        }
      ]
    };
    //  console.log(res.data);

    const option = _.merge(res.data, options);
    myChart.setOption(option);
    //  myChart.setOption(options);
  }
};
</script>

<style>
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>
