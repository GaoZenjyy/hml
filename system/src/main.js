import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/fonts/iconfont.css";
import ZkTable from "vue-table-with-tree-grid";

Vue.component("tablegrid", ZkTable);
Vue.config.productionTip = false;

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
import "./assets/css/test.css";
// 富文本

import VueQuillEditor from "vue-quill-editor";

// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 配置到Vue中
Vue.use(VueQuillEditor);

import axios from "axios";
Vue.prototype.$http = axios;
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";

axios.interceptors.request.use(config => {
  // console.log(config.headers);
  config.headers["Authorization"] = window.sessionStorage.getItem("token");
  return config;
});
// 全局时间过滤器
Vue.filter("dataFomt", function(originavl) {
  const data = new Date(originavl);
  let n = data.getFullYear();
  let y = (data.getMonth() + 1).toLocaleString().padStart(2, "0");
  let r = data
    .getDate()
    .toLocaleString()
    .padStart(2, "0");

  let hh = data
    .getHours()
    .toLocaleString()
    .padStart(2, "0");
  let mm = data
    .getMinutes()
    .toLocaleString()
    .padStart(2, "0");
  let ss = data
    .getSeconds()
    .toLocaleString()
    .padStart(2, "0");

  return `${n}-${y}-${r} ${hh}:${mm}:${ss}`;
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
