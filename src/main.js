import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import axios from 'axios'
import Api from './api/index'
import 'element-ui/lib/theme-chalk/index.css';
// axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios
Vue.prototype.$api = Api
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
