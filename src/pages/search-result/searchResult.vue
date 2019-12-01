<template>
  <view class="search-result">
    <uni-search-bar @confirm="search" @input="input" @cancel="cancel" />
    <view class="search-result-list">
      <card
        v-for="(item, index) in list"
        :key="index"
        :image="item.image"
        :data="item.data"
      ></card>
    </view>
  </view>
</template>
<script>
import { uniSearchBar, uniLoadMore } from '@dcloudio/uni-ui';
import card from '../../components/card/card';
export default {
  components: {
    uniSearchBar,
    uniLoadMore,
    card
  },
  data() {
    return {
      list: []
    };
  },
  methods: {
    async search(e) {
      let vm = this;
      if (e.value) {
        let res = await vm.api
          .search245BtBykeywords('/search.php', { searchword: e.value })
          .catch(err => {
            console.log(err);
          });
        if (!res || !res.length) return false;
        let list = [];
        for (let i = 0; i < res.length; i++) {
          const item = res[i];
          let obj = {
            image: {
              path: item.imgPath
            },
            data: []
          };
          for (let j = 0; j < item.desc.length; j++) {
            const jItem = item.desc[j];
            obj.data.push({
              list: [jItem.title]
            });
          }

          for (let j = 0; j < item.btn.length; j++) {
            const jItem = item.btn[j];
            obj.data.push({
              data: jItem,
              render: (h, params) => {
                return h(
                  'view',
                  {
                    attrs: {
                      class: 'search-result-btn'
                    },
                    on: {
                      click: () => {
                        if (jItem.title === '查看详情') {
                          console.log(['item', obj]);
                          jItem.imgSrc = obj.image.path;
                          let item = JSON.stringify(jItem);
                          uni.navigateTo({
                            url: `/pages/tabbar-detail/tabbarDetail?data=${item}`
                          });
                        }

                        if (jItem.title === '立即播放') {
                          let data = Object.assign({}, jItem);
                          data.author = item.title;
                          let datas = JSON.stringify(data);
                          uni.navigateTo({
                            url: `/pages/player-item/playerItem?data=${datas}`
                          });
                        }
                      }
                    }
                  },
                  params.row.title
                );
              }
            });
          }
          obj.data.unshift({
            data: item,
            render: (h, params) => {
              return h(
                'view',
                {
                  attrs: {
                    class: 'search-result-title'
                  }
                },
                item.title
              );
            }
          });
          list.push(obj);
        }
        vm.list = list;
      }
    },
    input(e) {
      console.log(['input', e]);
    },
    cancel(e) {
      console.log(['cancel', e]);
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../styles/main';
.search-result {
  /deep/ .free-watch-card {
    .card-right {
      position: relative;
      .search-result-title {
        color: @free-watch-orange1-color;
        font-size: 16px;
      }
      .search-result-btn {
        border: 1px solid #333;
        color: @free-watch-main-color;
        border-radius: 2px;
        height: 30px;
        margin: 2px 0;
      }
      .free-watch-card-right {
        &:nth-child(7),
        &:nth-child(6) {
          width: 30%;
          height: 30px;
          text-align: center;
          line-height: 30px;

          .search-result-btn {
            border: 1px solid #eee;
            padding: 2px 5px;
            border-radius: 2px;
          }
        }
        &:nth-child(6) {
          display: inline-block;
        }
        &:nth-child(7) {
          position: absolute;
          left: 32%;
          bottom: 0;
        }
      }
    }
  }
}
</style>
