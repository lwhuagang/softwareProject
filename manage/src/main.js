import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import axios from 'axios';
Vue.prototype.$http = axios;

import tree from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//全局注册组件
Vue.use(VueQuillEditor);
Vue.component('tree', tree)
//基础地址
// axios.defaults.baseURL = 'http://localhost:8888';
axios.defaults.baseURL = 'https://fund-we-1.zhouyc.cc:8089';
import './assets/css/global.css';

import './assets/fonts/iconfont.css';

//this.$route
axios.interceptors.request.use(config=>{
	config.headers.Authorization = window.sessionStorage.getItem('token');//将token发送给后端
	return config;
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
