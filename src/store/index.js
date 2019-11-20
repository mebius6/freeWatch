import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger' // 日志调试
import api from '../api'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    header: [], //www.1156zy.com
    btHeader: [] //www.245bt.com
  },
  mutations: {
    setHeader(state, header) {
      //单一的改变某一个变量
      console.log(state)
      console.log(header)
      state.header = header || []
    },
    set245BtHeader(state, header) {
      state.btHeader = header
    }
  },
  actions: {
    getHeader({ commit, state }, params = {}) {
      return new Promise((resolve, reject) => {
        let header = state.header
        if (header.length) {
          return resolve(header)
        }
        api.getList(params).then(
          res => {
            if (res.header) {
              commit('setHeader', res.header)
            }
          },
          err => {
            reject(err)
          }
        )
      })
    },
    get245BtHeader({ commit, state }, params = {}) {
      return new Promise((resolve, reject) => {
        let header = state.btHeader
        if (header.length) {
          return resolve(header)
        }
        api.get245BtHeader(params).then(
          res => {
            if (res.length) {
              commit('set245BtHeader', res)
            }
          },
          err => {
            reject(err)
          }
        )
      })
    }
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
