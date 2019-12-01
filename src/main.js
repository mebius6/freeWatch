import Vue from 'vue';
import App from './App';
import navBarTabs from './components/navBarTabs/navBarTabs';
import grid from './pages/components/grid/grid';
import store from './store';
import api from './api';
import config from './config';
import './styles/main.less';
Vue.component('navbar-tabs', navBarTabs);
Vue.component('grid', grid);
Vue.config.productionTip = false;
Vue.prototype.api = api;
Vue.prototype.$store = store;
Vue.prototype.$config = config;
App.mpType = 'app';

const app = new Vue({
  store,
  ...App
});
app.$mount();
