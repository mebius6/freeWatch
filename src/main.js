import Vue from 'vue'
import App from './App'
import navBarTabs from './components/navBarTabs/navBarTabs'
import store from './store'
import api from './api'
import './styles/main.less'
Vue.component('navbar-tabs', navBarTabs)
Vue.config.productionTip = false
Vue.prototype.api = api
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
