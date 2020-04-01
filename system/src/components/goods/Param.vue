<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 按钮提示 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
      <!-- 商品分类 -->
      <p>
        选择商品分类：
        <el-cascader
          v-model="addParamData"
          :options="addParamOptions"
          :props="addParamProps"
          @change="addParamChange"
        ></el-cascader>
      </p>
      <!-- 商品属性 -->
      <el-tabs v-model="activeName" @tab-click="addParamTab">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            :disabled="isDisabled"
            @click="paramsDialog = true"
          >添加参数</el-button>
          <el-table :data="manyList" style="width: 99%" border>
            <el-table-column width="50px" type="expand">
              <template slot-scope="scoped">
                <el-tag
                  :key="index"
                  v-for="(item, index) in scoped.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="removeTag(scoped.row, index)"
                >{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scoped.row)"
                  @blur="handleInputConfirm(scoped.row)"
                  style="width:90px"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column label width="50px" type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <!-- {{scoped.row}} -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="paramsEdit(scoped.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="paramsDelete(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            size="mini"
            type="primary"
            :disabled="isDisabled"
            @click="paramsDialog = true"
          >添加属性</el-button>
          <el-table :data="onlyList" style="width: 99%" border>
            <el-table-column width="50px" type="expand"></el-table-column>
            <el-table-column label width="50px" type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scoped">
                <!-- {{scoped.row}} -->
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="paramsEdit(scoped.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="paramsDelete(scoped.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加时的弹框 -->
    <el-dialog
      :title="activeName == 'many' ? '添加动态参数' : '添加静态属性'"
      :visible.sync="paramsDialog"
      width="40%"
      @close="resetDialog"
    >
      <el-form :model="paramForm" :rules="paramRules" ref="paramRef">
        <el-form-item :label="activeName == 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input style="width:640px" v-model="paramForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialog = false">取 消</el-button>
        <el-button type="primary" @click="sevaData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹框 -->
    <el-dialog
      :title="activeName == 'many' ? '修改动态参数' : '修改静态属性'"
      :visible.sync="paramsDialogEdit"
      width="40%"
      @close="resetDialogEdit"
    >
      <el-form :model="paramFormEdit" :rules="paramRulesEdit" ref="paramRefEdit">
        <el-form-item :label="activeName == 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input style="width:640px" v-model="paramFormEdit.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="paramEditData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "many",
      addParamData: [],
      addParamOptions: [],
      addParamProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover"
      },
      // 表格数据
      manyList: [],
      onlyList: [],
      // 弹框
      paramsDialog: false,
      paramsDialogEdit: false,
      // 表单数据
      paramForm: {
        attr_name: ""
      },
      paramFormEdit: {
        attr_name: ""
      },
      // 表单验证
      paramRules: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      paramRulesEdit: {
        attr_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ]
      },
      attrId: "",
      //下拉选项
      tagData: [],
      // 控制文本框显示隐藏
      inputVisible: false,
      // 文本框输入的值
      inputValue: ""
    };
  },
  methods: {
    //  下拉列表的请求
    async getParamList() {
      const { data: res } = await this.$http.get("categories");
      // console.log(res);
      this.addParamOptions = res.data;
    },
    //  满足条件就发起请求
    async getParamData() {
      const { data: res } = await this.$http.get(
        `categories/${this.categoryId}/attributes`,
        { params: { sel: this.activeName } }
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败");
      }
      if (this.activeName == "many") {
        this.manyList = res.data;
      } else {
        this.onlyList = res.data;
      }
      // console.log(res);
      res.data.forEach(item => {
        // console.log(item);
        const arrt = item.attr_vals.split(" ");
        item.attr_vals = arrt;
        // console.log(arr);
      });
      // console.log(res);
      // this.tagData = res.attr_vals;
    },
    addParamTab() {
      this.getParamData();
    },
    //  监听select选择的值
    addParamChange() {
      if (this.addParamData.length !== 3) {
        this.addParamData = [];
        this.manyList = [];
        this.onlyList = [];
      } else {
        this.getParamData();
      }
    },
    // 添加
    sevaData() {
      this.$refs.paramRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return false;
        const { data: res } = await this.$http.post(
          `categories/${this.categoryId}/attributes`,
          {
            attr_name: this.paramForm.attr_name,
            attr_sel: this.activeName
          }
        );
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        // 提示成功
        this.$message.success("添加成功");
        // 关闭弹框
        this.paramsDialog = false;
        // 刷新数据
        this.getParamData();
      });
    },
    // 回显
    async paramsEdit(id) {
      console.log(id);

      this.paramsDialogEdit = true;
      const { data: res } = await this.$http.get(
        `categories/${id.cat_id}/attributes/${id.attr_id}`,
        {
          params: {
            attr_sel: id.attr_sel
          }
        }
      );
      // console.log(res);
      this.paramFormEdit = res.data;
      this.attrId = res.data.attr_id;
    },
    // 删除
    async paramsDelete(id) {
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
        return this.$message({
          type: "info",
          message: "以取消删除"
        });
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.categoryId}/attributes/${id}`
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      // 刷新列表
      this.getParamData();
    },
    // 重置
    resetDialog() {
      this.paramsDialog = false;
      this.$refs.paramRef.resetFields();
    },
    // 更新
    paramEditData() {
      this.$refs.paramRefEdit.validate(async valid => {
        // console.log(valid);
        if (!valid) return false;
        const { data: res } = await this.$http.put(
          `categories/${this.categoryId}/attributes/${this.attrId}`,
          {
            attr_name: this.paramFormEdit.attr_name,
            attr_sel: this.activeName
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("更新失败");
        }
        this.$message.success("更新成功");
        // 刷新页面
        this.getParamData();
        // 隐藏弹框
        this.paramsDialogEdit = false;
      });
    },
    resetDialogEdit() {
      this.paramsDialogEdit = false;
      this.$refs.paramRefEdit.resetFields();
    },
    // 输入框显示隐藏
    async handleInputConfirm(row) {
      // 如果失去焦点的时候文本框没有值 就 return 如果没有值就清空输入框 隐藏输入框 然后 return 不执行下面代码 如果有值就不return 就执行下面代码
      if (this.inputValue.trim().length == 0) {
        // 清空文本框
        this.inputValue = "";
        // 隐藏文本框
        this.inputVisible = false;

        return;
      }
      // 把值添加到attr_vals中
      row.attr_vals.push(this.inputValue.trim());
      // 清空文本宽框的值
      this.inputValue = "";
      // 隐藏文本框
      this.inputVisible = false;
      // console.log(row);
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );

      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("添加标签失败");
      }
    },
    // 按钮显示隐藏
    showInput() {
      this.inputVisible = true;
      // 自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        console.log(_);
      });
    },
    // 删除
    async removeTag(row, index) {
      row.attr_vals.splice(index, 1);
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" ")
        }
      );

      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("添加标签失败");
      }
    }
  },
  // 首屏数据
  created() {
    this.getParamList();
  },
  computed: {
    isDisabled: function() {
      if (this.addParamData.length == 3) {
        return false;
      } else {
        return true;
      }
    },
    categoryId: function() {
      if (this.addParamData.length == 3) {
        return this.addParamData[2];
      }
      return null;
    }
  }
};
</script>

<style>
.el-card,
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 5px 10px;
}
</style>
