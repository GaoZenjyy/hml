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
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="tabPosition - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tabs区域 -->
      <!-- 一个大的form表单把tabs 包裹住  可以一次性发送所有的tabs的数据 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs
          :tab-position="tabPositions"
          v-model="tabPosition"
          @tab-click="tabClick"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="options"
                :props="optionsProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item, index) in manyData" :key="index" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="subitem"
                  v-for="(subitem, subindex) in item.attr_vals"
                  :key="subindex"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item, index) in onlyData" :key="index" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              list-type="picture"
              :headers="headersToken"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="addQuillEditor"></quill-editor>
            <el-button type="primary" style="margin-top:15px;" @click="addSubmitData">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片弹出框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible">
      <el-image style="width: 100%; height: 100%" :src="dialogVisibleUrl"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      dialogVisible: false,
      // 图片路径
      dialogVisibleUrl: "",
      // tabs 的方向
      tabPositions: "left",
      // 默认选中
      tabPosition: "0",
      // form 表单数据
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: [],
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      // 每一项选项
      options: [],
      // 联机选择器的配置项
      optionsProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover"
      },
      // 校验规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ]
      },
      // 动态参数
      manyData: [],
      // 静态属性
      onlyData: [],
      // 路径
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 请求的token
      headersToken: {
        Authorization: window.sessionStorage.getItem("token")
      }
    };
  },
  methods: {
    // 商品分类
    async getCatName() {
      const { data: res } = await this.$http.get("categories");
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.options = res.data;
    },
    // 监听select 值的变化
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // tabs 切换
    beforeLeave() {
      // console.log(old);
      // console.log(news);
      if (this.tabPosition == 0 && this.categoryId == null) {
        this.$message.error("请选择三级分类");
        return false;
      }
    },
    // tabs 点击切换
    async tabClick() {
      if (this.tabPosition == 1) {
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          { params: { sel: "many" } }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数数据失败");
        }
        res.data.forEach(item => {
          // console.log(item);
          item.attr_vals = item.attr_vals.trim().split(" ");
        });
        // console.log(res);
        this.manyData = res.data;
      } else if (this.tabPosition == 2) {
        const { data: res } = await this.$http.get(
          `categories/${this.categoryId}/attributes`,
          { params: { sel: "only" } }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数数据失败");
        }
        this.onlyData = res.data;
      }
    },
    // 图片预览
    handlePreview(file) {
      // console.log(file);
      // 把要预览的图片路径给到要 显示的image路径中
      this.dialogVisibleUrl = file.response.data.url;
      this.dialogVisible = true;
    },
    // 上传图片
    handleSuccess(response) {
      // console.log(response);
      // console.log(file);
      this.addForm.pics.push({
        pic: response.data.tmp_path
      });
    },
    // 删除图片
    handleRemove(file) {
      // 获取想要删除的图片路径
      let path = file.response.data.tmp_path;
      // 循环数据模型 addForm 查找相同的路径 返回索引 相同的就切割
      let index = this.addForm.pics.findIndex(item => {
        // console.log(item);
        item.pic == path;
      });
      // console.log(index);
      this.addForm.pics.splice(index, 1);
      // console.log(this.addForm);
    },
    // 失败的上传图片
    handleError(error) {
      console.log(error);
    },
    // 提交商品
    addSubmitData() {
      // console.log(this.addForm);
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return this.$message.error("请把数据填写完整");
        const form = _.cloneDeep(this.addForm);
        // console.log(form);
        form.goods_cat = form.goods_cat.join(",");
        // console.log(form);
        // 动态参数
        this.manyData.forEach(item => {
          // console.log(item);
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" ")
          });
        });
        // 静态属性
        this.manyData.forEach(item => {
          // console.log(item);
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          });
        });
        const { data: res } = await this.$http
          .post("goods", form)
          .catch(error => error);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success("创建商品成功");
        this.$router.push("/goods");
      });
    }
  },
  created() {
    this.getCatName();
  },
  computed: {
    categoryId: function() {
      if (this.addForm.goods_cat.length == 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style>
.el-alert,
.el-steps,
.el-breadcrumb {
  margin-bottom: 20px;
}
.ql-editor {
  height: 400px;
}
</style>
