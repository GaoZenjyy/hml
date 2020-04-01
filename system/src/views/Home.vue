<template>
  <div class="home">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="header-box">
          <img src="../assets/image/heima.png" />
          <p>电商后台管理系统</p>
        </div>
        <el-button type="info" @click="loginExit">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左菜单栏 -->
        <el-aside class="container-aside" :width="collapse ? '64px' : '200px'">
          <div class="tog-bar" @click="collapse = !collapse">|||</div>

          <el-menu
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse="collapse"
            :collapse-transition="false"
            :router="true"
          >
            <el-submenu
              :index="'/' + item.path"
              v-for="(item, index) in listArray"
              :key="item.id"
              :style="collapse ? 'width:64px;' : 'width:200px;'"
            >
              <template slot="title">
                <i :class="['iconfont', iconList[index]]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import min from "./Home.js";
export default {
  mixins: [min]
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;
}
.el-container {
  user-select: none;
  height: 100%;
  .el-header {
    background-color: #373d41;
    height: 60px;
    // 元素左右
    display: flex;
    justify-content: space-between;
    // 居中
    align-items: center;
    // 让文本不可以被选中
    padding-right: 20px;
    .header-box {
      display: flex;
      font-size: 22px;
      color: white;
      align-items: center;
      user-select: none;
      img {
        width: 40px;
        height: 40px;
        padding-right: 15px;
      }
    }
  }
}
.container-aside {
  background-color: #373d41;
}
.tog-bar {
  text-align: center;
  font-size: 12px;
  line-height: 25px;
  color: #fff;
  letter-spacing: 0.1em;
  background-color: #4a5064;
  cursor: pointer;
}
</style>
