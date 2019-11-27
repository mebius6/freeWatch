import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger"; // 日志调试
import api from "../api";
import { storeKey } from "../data/";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";
const func = {
  setHeader: data => {
    uni.setStorageSync(storeKey.vuexStore, JSON.stringify(data || "[]"));
  }
};
export default new Vuex.Store({
  state: {
    header: uni.getStorageSync(storeKey.vuexStore), //www.1156zy.com
    btHeader: uni.getStorageSync(storeKey.vuexStore), //www.245bt.com
    currentRefresh: true // 是否刷新
  },
  mutations: {
    setHeader(state, header) {
      //单一的改变某一个变量
      console.log(state);
      console.log(header);
      state.header = header || [];
    },
    set245BtHeader(state, header) {
      state.btHeader = header;
    },
    refresh(state, data) {
      state.currentRefresh = data;
    }
  },
  actions: {
    getHeader({ commit, state }, params = {}) {
      return new Promise((resolve, reject) => {
        let header = state.header;
        if (header.length) {
          return resolve(header);
        }
        api.getList(params).then(
          res => {
            if (res.header) {
              func.setHeader(res.header);
              commit("setHeader", res.header);
            }
          },
          err => {
            reject(err);
          }
        );
      });
    },
    get245BtHeader({ commit, state }, params = {}) {
      return new Promise((resolve, reject) => {
        let header = state.btHeader;
        if (header.length) {
          return resolve(header);
        }
        api.get245BtHeader(params).then(
          res => {
            if (res.length) {
              func.setHeader(res);
              commit("set245BtHeader", res);
            }
          },
          err => {
            reject(err);
          }
        );
      });
    },
    // 修改页面状态
    refresh({ commit }, data) {
      commit("refresh", data);
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
