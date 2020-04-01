<template>
  <div class="rolelist">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-button type="primary" @click="dialogRoles = true"
          >添加角色</el-button
        >
      </el-row>
      <!-- 表格 -->
      <el-table style="width: 99%" border :data="userRoles">
        <!-- 展开行  expand-->
        <el-table-column type="expand">
          <!-- 模板接收数据 -->
          <template slot-scope="scoped">
            <!-- 用一行去进行分配 循环  -->
            <!-- 加边框 判断数组的索引 如果是第一个 他的下标为0 就给他加上边框  -->
            <el-row
              v-for="(item1, index) in scoped.row.children"
              :key="item1.id"
              :style="{
                'border-bottom': '1px solid #eee',
                'border-top': index == 0 ? '1px solid #eee' : ''
              }"
            >
              <!-- 每一行里 有多个数据 就用列来  -->
              <!-- 调用tag 标签的关闭方法 传入两个值 一个是当前用户的id 另一个是选择要删除权限的id -->
              <el-col :span="5">
                <el-tag closable @close="rolesRemove(scoped.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :style="{ 'border-top': index2 == 0 ? '' : '1px solid #eee' }"
                >
                  <el-col :span="5">
                    <el-tag
                      type="success"
                      closable
                      @close="rolesRemove(scoped.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <span v-for="item3 in item2.children" :key="item3.id">
                      <el-tag
                        type="warning"
                        closable
                        @close="rolesRemove(scoped.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <!-- {{scoped.row}} -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="rolesEdit(scoped.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="rolesRome(scoped.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="userPermissionsShow(scoped.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户的弹框 -->
    <el-dialog
      :visible.sync="dialogRoles"
      title="添加用户"
      width="30%"
      @close="rolesRest"
    >
      <el-form :model="addRoles" :rules="rules" ref="addRolesRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input style="width:450px" v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input style="width:450px" v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRoles = false">取 消</el-button>
        <el-button type="primary" @click="addRolesUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户编辑的弹框 -->
    <el-dialog
      :visible.sync="dialogRolesEdit"
      title="修改用户"
      width="30%"
      @close="rolesRests"
    >
      <el-form :model="addRolesInfo" :rules="rules" ref="addRolesRefEdit">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            style="width:450px"
            v-model="addRolesInfo.roleName"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input
            style="width:450px"
            v-model="addRolesInfo.roleDesc"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRolesEdit = false">取 消</el-button>
        <el-button type="primary" @click="rolesEcho">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 用户分配权限 弹出框 -->
    <el-dialog title="用户权限" :visible.sync="userPermissions" width="50%">
      <el-tree
        ref="treeRef"
        :data="showData"
        :props="showProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="keysArrys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userPermissions = false">取 消</el-button>
        <el-button type="primary" @click="severRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRoles: [],
      dialogRoles: false,
      dialogRolesEdit: false,
      userPermissions: false,
      // 用户添加
      addRoles: {
        roleName: "",
        roleDesc: ""
      },
      //用户回显
      addRolesInfo: {
        roleName: "",
        roleDesc: ""
      },
      // 权限数组
      showData: [],
      showProps: {
        label: "authName",
        children: "children"
      },
      // 用户规则
      rules: {
        roleName: [
          { required: true, message: "请输入用户角色名称", trigger: "blur" },
          { min: 2, max: 18, message: "长度在 2 到 18 个字符", trigger: "blur" }
        ],
        roleDesc: [
          { required: true, message: "请输入用户角色描述", trigger: "blur" },
          { min: 0, max: 50, message: "长度在 0 到 50 个字符", trigger: "blur" }
        ]
      },
      keysArrys: [],
      // 用户id
      keyRolesId: ""
    };
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      this.userRoles = res.data;
    },
    //  用户添加
    addRolesUser() {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRoles);
        //   console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("用户添加失败");
        }
        this.$message.success("用户添加成功");
        this.getRoleList();
        this.dialogRoles = false;
      });
    },
    //  表单重置
    rolesRest() {
      this.$refs.addRolesRef.resetFields();
    },
    rolesRests() {
      this.$refs.addRolesRefEdit.resetFields();
    },
    //  用户删除
    async rolesRome(id) {
      const strData = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(error => error);
      // console.log(strData);
      if (strData !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
      const { data: res } = await this.$http.delete(`roles/${id}`);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("用户删除失败");
      }
      this.$message.success("用户删除成功");
      this.getRoleList();
    },
    //  用户回显
    async rolesEdit(id) {
      this.dialogRolesEdit = true;
      const { data: res } = await this.$http.get("roles/" + id);

      // console.log(res);
      this.addRolesInfo = res.data;
    },
    //  用户更新
    rolesEcho() {
      this.$refs.addRolesRefEdit.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.addRolesInfo.roleId,
          {
            roleName: this.addRolesInfo.roleName,
            roleDesc: this.addRolesInfo.roleDesc
          }
        );
        //   console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("用户更新失败");
        }
        this.$message.success("用户更新成功");
        this.getRoleList();
        this.dialogRolesEdit = false;
      });
    },
    // 删除权限
    async rolesRemove(roles, permissionsId) {
      // console.log(roles);
      // console.log(permissionsId);
      // 提示是否删除
      const strdata = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(eer => eer);
      // return console.log(strdata);
      // 判断 是取消还是确定 他要返回一个数据
      if (strdata !== "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
      // 发起delete请求 有两个参数 一个是用户id 一个是要删除权限是id
      const { data: res } = await this.$http.delete(
        `roles/${roles.id}/rights/${permissionsId}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除权限失败");
      // console.log(res);
      // 把返回的数据 直接赋值给用户的children
      roles.children = res.data;
    },
    // 分配权限
    async userPermissionsShow(role) {
      this.userPermissions = true;
      const { data: res } = await this.$http.get("rights/tree");
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取所有权限失败");
      }
      this.showData = res.data;

      const keys = [];
      this.getLeafId(role, keys);
      this.keysArrys = keys;
      this.keyRolesId = role.id;
      // console.log(keys);
    },
    // 递归节点权限
    getLeafId(node, keyArr) {
      if (!node.children) {
        return keyArr.push(node.id);
      }
      node.children.forEach(item => this.getLeafId(item, keyArr));
    },
    // 获取权限节点
    async severRoles() {
      // 调用方法
      // 全选时候的id
      const k1 = this.$refs.treeRef.getCheckedKeys();
      // console.log(k1);
      //半选时候的id
      const k2 = this.$refs.treeRef.getHalfCheckedKeys();
      // console.log(k2);
      // 把获取的id 进行拼接
      const koo = [...k1, ...k2].join(",");
      // console.log(koo);
      const { data: res } = await this.$http.post(
        `roles/${this.keyRolesId}/rights`,
        { rids: koo }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户权限失败");
      }
      this.$message.success("更新用户成功");
      this.getRoleList();
      this.userPermissions = false;
    }
  },
  created() {
    this.getRoleList();
  }
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 25px;
}
.el-tag {
  margin: 10px 10px;
}
</style>
