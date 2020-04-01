<template>
  <div class="about">
    <el-card class="card">
      <div class="avatar">
        <img src="../assets/image/logo.png" />
      </div>
      <el-form :model="userLong" :rules="rules" ref="ruleForms">
        <el-form-item prop="username">
          <el-input v-model="userLong.username">
            <i slot="prefix" class="iconfont icon-yonghu"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="userLong.password"
            type="password"
            @keyup.enter.native="loginUser"
          >
            <i slot="prefix" class="iconfont icon-mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="loginUser">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // form 数据
      userLong: {
        username: "admin",
        password: "123456"
      },
      // form 规则
      rules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 重置
    resetForm() {
      this.userLong.username = this.userLong.password = "";
      this.$refs.ruleForms.resetFields();
      this.$message.success("重置成功");
    },
    //登录
    loginUser() {
      this.$refs.ruleForms.validate(async valid => {
        if (!valid) false;
        const { data: res } = await this.$http.post("login", this.userLong);
        // console.log(res);
        if (res.meta.status == 400) {
          window.sessionStorage.removeItem("token");
          return alert(res.meta.msg);
        }
        if (res.meta.status == 200) {
          window.sessionStorage.setItem("token", res.data.token);
          this.$message.success("登录成功");
          this.$router.push("/home");
        }
      });
    }
  }
};
</script>

<style scoped>
.about {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
}
.card {
  width: 450px;
  height: 304px;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  overflow: initial;
}
.avatar {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  background-color: #fff;
  padding: 8px;
  left: 50%;
  transform: translate(-50%, -60%);
  overflow: hidden;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.el-form {
  margin-top: 95px;
}
</style>
