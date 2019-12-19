import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
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
    currentRefresh: true, // 是否刷新
    systemInfo: {} // 系统信息
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
    },
    setSystemInfo(state, data) {
      if (data) {
        state.systemInfo = data;
      }
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
    },
    getSystemInfo({ commit }) {
      let data = uni.getSystemInfoSync();
      commit("setSystemInfo", data);
    }
  },
  strict: debug,
  plugins: debug
    ? [
        createLogger(),
        new VuexPersistence({
          reducer: state => ({
            header: state.header, //www.1156zy.com
            btHeader: state.btHeader, //www.245bt.com
            currentRefresh: state.currentRefresh, // 是否刷新
            systemInfo: state.systemInfo // 系统信息 //这个就是存入localStorage的值
          })
        }).plugin
      ]
    : []
});
