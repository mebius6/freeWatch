import http from "../services/http.js";
import parse from "../services/parse.js";

import config from "../config.js";
// 公共接口
const services = config.apiConfig.commonBase;
const services1 = {
  url: "http://api.245bt.chenzhen.work",
  port: 3000
};
const api = {
  /********************* www.1156zy.com api *****************/
  // 列表查询
  getList: params => {
    return new Promise((resolve, reject) => {
      http.get("", params, services).then(
        res => {
          return resolve(parse.parseListHtml(res));
        },
        err => {
          reject(err);
        }
      );
    });
  },
  // 列表搜索
  searchList: params => {
    return new Promise((resolve, reject) => {
      http.get("?m=vod-search", params, services).then(
        res => {
          return resolve(parse.parseListHtml(res).body);
        },
        err => {
          reject(err);
        }
      );
    });
  },
  getListItem: params => {
    return new Promise((resolve, reject) => {
      http.get("", params, services).then(
        res => {
          return resolve(parse.parseItemHtml(res));
        },
        err => {
          reject(err);
        }
      );
    });
  },
  /********************* www.245bt.com api *****************/
  get245BtHeader: params => {
    return new Promise((resolve, reject) => {
      http.get("", params, services1).then(
        res => {
          return resolve(parse.parse245BtHeader(res));
          // return resolve(res)
        },
        err => {
          reject(err);
        }
      );
    });
  },
  get245BtTabData: (prefix, params) => {
    return new Promise((resolve, reject) => {
      http.get(prefix, params, services1).then(
        res => {
          return resolve(parse.parse245BtListHtml(res));
          // return resolve(res)
        },
        err => {
          reject(err);
        }
      );
    });
  },
  get245BtListItem: path => {
    return new Promise((resolve, reject) => {
      http.get(path, {}, services1).then(
        res => {
          return resolve(parse.parse245BtItemHtml(res));
          // return resolve(res)
        },
        err => {
          reject(err);
        }
      );
    });
  },
  get245BtPlayerUrl: path => {
    return new Promise((resolve, reject) => {
      http.get(path, {}, services1).then(
        res => {
          console.log(["get245BtPlayerUrl", res]);
          return resolve(parse.parser245BtPlayerUrl(res));
          // return resolve(res)
        },
        err => {
          reject(err);
        }
      );
    });
  }
};
export default api;
