<template>
  <div>
    <!-- <h1>gaga</h1> -->
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-row>
        <el-col :span="5">
          <el-button type="primary" @click="addClassification"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 树形结构 -->
      <tablegrid
        :data="cateData"
        :columns="columns"
        class="tables"
        show-index
        index-text="#"
        border
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 状态 -->
        <template slot="states" slot-scope="scoped">
          <!-- {{scoped.row}} -->
          <i
            class="el-icon-circle-check"
            v-if="scoped.row.cat_deleted == false"
            style="color:green"
          ></i>
          <i class="el-icon-circle-close" v-else style="color:red"></i>
        </template>
        <!-- 等级 -->
        <template slot="sorting" slot-scope="scoped">
          <el-tag v-if="scoped.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scoped.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation" slot-scope="scoped">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="echoClass(scoped.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="addClassDelete(scoped.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tablegrid>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="cateInfoData.pagenum"
        :page-size="cateInfoData.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加分类 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogData"
        width="38%"
        @close="cateRest"
      >
        <el-form :model="addClassData" :rules="addClassRules" ref="addClassRef">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input
              style="width:600px"
              v-model="addClassData.cat_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              :props="addClassProps"
              v-model="addClassSelect"
              :options="addClassList"
              @change="addClassChange"
              style="width:600px"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogData = false">取 消</el-button>
          <el-button type="primary" @click="addFormData">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="echoDialogData"
        width="38%"
        @close="echoRest"
      >
        <el-form :model="echoData" ref="echoClassRef" :rules="echoClassRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input
              style="width:600px"
              v-model="echoData.cat_name"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="echoDialogData = false">取 消</el-button>
          <el-button type="primary" @click="saveEcho">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //  数据
      cateData: [],
      // 获取数据时候的参数
      cateInfoData: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //总条数
      total: 0,
      // 定义表格中有哪些列
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "states"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "sorting"
        },
        { label: "操作", type: "template", template: "operation" }
      ],
      // 添加框
      addDialogData: false,
      // 编辑框
      echoDialogData: false,
      // 添加分类
      addClassData: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      // 添加时的教验
      addClassRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      echoClassRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // 选中的数据
      addClassSelect: [],
      // 回显的数据
      addClassList: [],
      // 添加分类列表级联列表配置项
      addClassProps: {
        label: "cat_name",
        children: "children",
        checkStrictly: true,
        value: "cat_id"
      },
      //回显时的数据
      echoData: {
        cat_name: ""
      }
    };
  },
  methods: {
    //   获取数据
    async getCateData() {
      const { data: res } = await this.$http.get("categories", {
        params: this.cateInfoData
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cateData = res.data.result;
      this.total = res.data.total;
    },
    //  页码
    handleCurrentChange(newsize) {
      // console.log(newsize);
      this.cateInfoData.pagenum = newsize;
      this.getCateData();
    },
    // 添加分类
    async addClassification() {
      this.addDialogData = true;
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      // console.log(res);
      this.addClassList = res.data;
    },
    // 监听用户的选择时候的数据
    addClassChange() {
      if (this.addClassSelect.length == 0) {
        this.addClassData.cat_pid = 0;
        this.addClassData.cat_level = 0;
      } else {
        this.addClassData.cat_pid = this.addClassSelect[
          this.addClassSelect.length - 1
        ];
        this.addClassData.cat_level = this.addClassSelect.length;
      }
    },
    // 添加分类
    addFormData() {
      this.$refs.addClassRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          "categories",
          this.addClassData
        );
        console.log(res);
        this.addDialogData = false;
        this.getCateData();
      });
    },
    // 编辑分类
    async echoClass(id) {
      this.echoDialogData = true;
      const { data: res } = await this.$http.get(`categories/${id}`);
      // console.log(res);
      this.echoData = res.data;
    },
    // 保存编辑的分类
    saveEcho() {
      this.$refs.echoClassRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          `categories/${this.echoData.cat_id}`,
          this.echoData
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新分类失败");
        }
        this.$message.success("更新分类成功");
        this.echoDialogData = false;
        this.getCateData();
      });
    },
    // 删除
    async addClassDelete(id) {
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
      // console.log(str);
      if (str !== "confirm") {
        return this.$message.info("取消删除");
      }
      // 没有取消就发起请求删除数据
      const { data: res } = await this.$http.delete(`categories/${id}`);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败");
      }
      this.$message.success("删除分类成功");
      this.getCateData();
    },
    // 重置表单数据
    cateRest() {
      this.addDialogData = false;
      this.$refs.addClassRef.resetFields();
    },
    echoRest() {
      this.echoDialogData = false;
      this.$refs.echoClassRef.resetFields();
    }
  },
  created() {
    this.getCateData();
  }
};
</script>

<style lang="less" scoped>
.tables,
.el-pagination {
  margin-top: 30px;
}
</style>
