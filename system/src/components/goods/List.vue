<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="25">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            clearable
            @clear="getListDate"
            v-model="listInfoData.query"
            @keyup.enter.native="getListDate"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getListDate"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品区域 -->
        <el-col :span="5">
          <el-button type="primary" @click="topath">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table border stripe :data="goodsList" style="width:99%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="150px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="150px"
        ></el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scoped">{{
            scoped.row.add_time | dataFomt
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scoped">
            <el-button
              :cc="scoped"
              icon="el-icon-edit"
              type="primary"
              size="mini"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="romoveData(scoped.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listInfoData.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="listInfoData.pagesize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
  <!-- <router-view></router-view> -->
</template>

<script>
export default {
  data() {
    return {
      //  表格数据
      goodsList: [],
      listInfoData: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 总条数
      total: 0
    };
  },
  methods: {
    //获取数据
    async getListDate() {
      const { data: res } = await this.$http.get("goods", {
        params: this.listInfoData
      });
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      // console.log(res);
    },
    //  一页多少数据
    handleSizeChange(newSize) {
      this.listInfoData.pagesize = newSize;
      this.getListDate();
    },
    //  哪一页
    handleCurrentChange(newNum) {
      this.listInfoData.pagenum = newNum;
      this.getListDate();
    },
    //  删除数据
    async romoveData(id) {
      // console.log(id);
      const str = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      if (str != "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) {
        this.$message.error("删除商品失败");
      }
      this.$message.success("删除商品成功");
      this.getListDate();
      // console.log(res);
    },
    // 点击按钮跳转页面
    topath() {
      this.$router.push("/goods/add");
    }
  },
  created() {
    this.getListDate();
  }
};
</script>

<style>
.el-card,
.el-table {
  margin-top: 20px;
}
</style>
