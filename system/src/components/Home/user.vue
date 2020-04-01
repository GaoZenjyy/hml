<template>
  <div class="List_user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户表格 -->
      <el-table style="width: 99%" border :data="userList">
        <el-table-column type="index" width="180"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scoped">
            <el-switch
              active-color="#13ce66"
              v-model="scoped.row.mg_state"
              @change="
                getupState(scoped.row.id, scoped.row.mg_state, scoped.row)
              "
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scoped">
            <el-tooltip content="修改用户" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="usersEcho(scoped.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="romveUser(scoped.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="角色分配" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="getAssigning(scoped.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的Dialog 框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="30%"
      @close="resetUser"
    >
      <el-form :model="addUserList" :rules="addrules" ref="addFormData">
        <!-- <el-row></el-row> -->
        <el-form-item label="用户名称" prop="username">
          <el-input
            style="width:450px"
            v-model="addUserList.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input
            style="width:450px"
            v-model="addUserList.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input style="width:450px" v-model="addUserList.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input style="width:450px" v-model="addUserList.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserPersonage">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="dialogVisibleEcho"
      width="30%"
      @close="echoresect"
    >
      <el-form :model="EchoList" :rules="addrules" ref="Echoform">
        <el-form-item label="用户名称" prop="username">
          <el-input
            style="width:450px"
            v-model="EchoList.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input style="width:450px" v-model="EchoList.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input style="width:450px" v-model="EchoList.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEcho = false">取 消</el-button>
        <el-button type="primary" @click="addUserEcho">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog
      title="用户角色分配"
      :visible.sync="dialogVisibleAssigning"
      width="30%"
    >
      <p>当前的用户: {{ assigningInfo.username }}</p>
      <p>当前的角色: {{ assigningInfo.role_name }}</p>
      <p>
        分配的角色:
        <el-select v-model="assigningId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAssigning = false">取 消</el-button>
        <el-button type="primary" @click="addAssigning">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let chenckEmail = (rule, value, callback) => {
      if (!value) return callback(new Error("请输入您的邮箱"));
      if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入您的邮箱"));
      }
    };
    return {
      //  用户显示
      userList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      // 总条数
      total: 0,
      // 用户添加框的显示
      dialogVisible: false,
      dialogVisibleEcho: false,
      dialogVisibleAssigning: false,
      // 用户添加
      addUserList: {
        // 用户账号
        username: "",
        //   用户密码
        password: "",
        //   用户邮箱
        email: "",
        //  用户手机号码
        mobile: ""
      },
      // 用回显
      EchoList: {
        // 用户账号
        username: "",
        //   用户邮箱
        email: "",
        //  用户手机号码
        mobile: ""
      },
      // 角色列表
      rolesList: [],
      // 当前的数据
      assigningInfo: {},
      // 选择的角色id
      assigningId: "",
      // 用户添加规则
      addrules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 2, max: 18, message: "长度在 2 到 18 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { validator: chenckEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
          { min: 5, max: 11, message: "长度在 5 到 11 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //   用户列表显示
    async getUserList() {
      // 发起axios请求
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      console.log(res);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //  每页条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
      // console.log(newSize);
    },
    //  第几页
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getUserList();
      // console.log(newNum);
    },
    //  用户状态
    async getupState(id, type, user) {
      //  修改状态时 发起axios的修改状态请求
      const { data: res } = await this.$http.put(`users/${id}/state/${type}`);
      // console.log(res);
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state;
        return this.$message.error("修改用户状态失败");
      }
      this.$message.success("修改用户状态成功");
      this.getUserList();
    },
    //  删除用户
    async romveUser(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // confirmResult 有两个值 一个是取消时的值 一个是确认时的值
      // console.log(confirmResult);
      // 判断confirmResult 的值 等不等于 confirm
      if (confirmResult != "confirm") {
        return this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
      // 要删除的数据
      const { data: res } = await this.$http.delete(`users/${id}`);
      // 判断 如果不等于200 就失败 不可以 删除
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      if (this.userList.length === 1 && this.queryInfo.pagenum > 1) {
        this.queryInfo.pagenum--;
      }
      // 成功时弹出来的框
      this.$message.success("删除成功");
      // 刷新用户列表
      this.getUserList();
    },
    //  重置
    resetUser() {
      //  Dialog 消失
      // this.dialogVisible = !this.dialogVisible;
      // 重置
      this.$refs.addFormData.resetFields();
    },
    //  添加用户
    addUserPersonage() {
      //  添加时的教验规则
      this.$refs.addFormData.validate(async valid => {
        // 判断 是否有数数据
        if (!valid) return;
        //   有就发起axios请求
        const { data: res } = await this.$http.post("users", this.addUserList);
        //   判断添加时候的状态 不等于201 就返回一个失败的弹框
        if (res.meta.status !== 201) return this.$message.error("用户添加失败");
        //   添加成功时的弹框
        this.$message.success("用户添加成功");
        //   让Dialog 隐藏
        this.dialogVisible = false;
        //   刷新用户列表
        this.getUserList();
      });
    },
    //  数据回显
    async usersEcho(id) {
      this.dialogVisibleEcho = !this.dialogVisibleEcho;
      // console.log(id);
      const { data: res } = await this.$http.get(`users/${id}`);
      // console.log(res);
      this.EchoList = res.data;
    },
    //  用户数据修改
    addUserEcho() {
      this.$refs.Echoform.validate(async valid => {
        // 判断 是否有数数据
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.EchoList.id,
          {
            email: this.EchoList.email,
            mobile: this.EchoList.mobile
          }
        );
        //   console.log(res);
        if (res.meta.status !== 200) return this.$message.error("更新用户失败");
        this.$message.success("更新用户成功");
        this.getUserList();
        this.dialogVisibleEcho = false;
      });
    },
    //  回显数据重置
    echoresect() {
      this.$refs.Echoform.resetFields();
    },
    // 角色分配
    async getAssigning(assigningdata) {
      this.dialogVisibleAssigning = true;
      this.assigningInfo = assigningdata;
      // 用户角色分配请求
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      // 把获取到的全部角色  存入一个数组
      this.rolesList = res.data;
    },
    // 角色分配选择
    async addAssigning() {
      // this.dialogVisibleAssigning = false;
      if (!this.assigningId) {
        return this.$message.warning("请选择要分配的新角色");
      }

      // 发起请求
      const { data: res } = await this.$http.put(
        `users/${this.assigningInfo.id}/role`,
        { rid: this.assigningId }
      );
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("修改用户角色失败");
      this.$message.success("修改用户成功");
      this.getUserList();
      this.dialogVisibleAssigning = false;
    }
  },
  // 首屏数据调用
  created() {
    //   调用用户列表
    this.getUserList();
  }
};
</script>

<style>
.el-main {
  background-color: #eaedf2;
}
.el-table {
  margin-top: 30px;
}
.el-pagination {
  margin-top: 30px;
}
</style>
