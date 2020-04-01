export default {
  data() {
    return {
      // 列表数组
      listArray: [],
      // 所有图标
      iconList: [
        "icon-users",
        "icon-tijikongjian",
        "icon-shangpin",
        "icon-danju",
        "icon-baobiao"
      ],
      // 动画折叠
      collapse: false
    };
  },
  methods: {
    // 退出
    loginExit() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
      this.$message.success("退出成功");
    },
    // 渲染菜单栏
    async menuBar() {
      const { data: res } = await this.$http.get("menus");
      // console.log(res);
      if (!res.meta.status == 200)
        return this.$message.error("获取菜单列表失败");
      this.listArray = res.data;
    }
  },
  // 首屏数据
  created() {
    this.menuBar();
  }
};
