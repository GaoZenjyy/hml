<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="orderInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe style="width:99%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scoped">
            <el-tag type="danger" v-if="scoped.row.order_pay == 0"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scoped">{{
            scoped.row.create_time | dataFomt
          }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              title="修改订单地址"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              title="物流信息"
              @click="getWlInfo"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 物流信息弹框 -->
    <el-dialog title="查看物流进度" :visible.sync="dialogVisible" width="40%">
      <el-steps direction="vertical" :active="0">
        <el-step
          v-for="(item, index) in orderWl"
          :key="index"
          :title="item.time"
          :description="item.context"
        ></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      orderList: [],
      // 订单列表参数
      orderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 总条数
      total: 0,
      // 弹框
      dialogVisible: false,
      // 物流信息查询
      orderWl: []
    };
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.orderInfo
      });
      // console.log(res);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    //  页数
    handleCurrentChange(newNum) {
      // console.log(newNum);
      // console.log("页数");
      this.orderInfo.pagenum = newNum;
      this.getOrderList();
    },
    //  一页多少条
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.orderInfo.pagesize = newSize;
      this.getOrderList();
    },
    //  物流信息查看
    async getWlInfo() {
      this.dialogVisible = true;
      const { data: res } = await this.$http.get("/kuaidi/1106975712662");
      // console.log(res);
      this.orderWl = res.data;
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>

<style>
.el-card,
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
