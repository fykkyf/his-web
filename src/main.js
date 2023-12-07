import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import moment from 'moment';

Vue.use(ElementUI);
Vue.use({
  install(Vue) {
    Vue.prototype.$moment = moment;
  }
});


Vue.config.productionTip = false

import axios from 'axios';
//取别名
Vue.prototype.$axios = axios;


//添加请求拦截器
axios.interceptors.request.use(function (config) {
  //在发送请求之前做些什么
  let token = window.localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  let refresh = window.localStorage.getItem("refresh");
  if (refresh) {
    config.headers.refresh = refresh;
  }
  return config;
}, function (error) {
  //对请求错误做些什么
  // return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use(function (response) {
  //对响应数据做点什么
  let token = response.headers.token;
  if (token) {
    window.localStorage.setItem("token", token);
  }
  let refresh = response.headers.refresh;
  if (refresh) {
    window.localStorage.setItem("refresh", refresh);
  }
  if (response.data.code == 401) {
    router.push("/login")
  }
  return response;
}, function (error) {
  //对响应错误做点什么
  // return Promise.reject(error);
});

// router.beforeEach((to, from, next) => {
//   let token = localStorage.getItem("token");
//   if (!token) {
//     if (to.path !== '/login') {
//       next({ path: "/login" })
//     } else {
//       next()
//     }
//   } else {
//     next()
//   }
// })



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
