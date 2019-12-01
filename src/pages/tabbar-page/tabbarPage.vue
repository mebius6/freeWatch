<template>
  <navbar-tabs
    v-if="tabsList.length"
    :tabsList="tabsList"
    :page="page"
    :activeIndex="activeIndex"
    @tabsClickItem="tabsClickItem"
  >
    <view slot="list" class="free-watch-list" v-if="pageList.length">
      <grid :showBorder="false" :list="pageList" @change="gridChange"></grid>
      <uni-load-more
        :status="status"
        :content-text="contentText"
        color="#007aff"
      />
    </view>
  </navbar-tabs>
</template>
<script>
import { uniLoadMore } from '@dcloudio/uni-ui';
import unit from '../../services/unit';
export default {
  components: { uniLoadMore },
  props: {
    checkedPage: {
      type: String,
      default: '电影'
    }
  },
  data() {
    return {
      activeIndex: 0,
      scrollTop: 0,
      page: 4,
      pageIndex: 1,
      tabsList: [],
      list: [],
      params: {},
      status: 'more',
      btHeader: [],
      statusTypes: [
        {
          value: 'more',
          text: '加载前'
        },
        {
          value: 'loading',
          text: '加载中'
        },
        {
          value: 'noMore',
          text: '没有更多'
        }
      ],
      contentText: {
        contentdown: '查看更多',
        contentrefresh: '加载中',
        contentnomore: '没有更多'
      }
    };
  },
  computed: {
    pageList: {
      get() {
        return this.list;
      },
      set(val) {
        return val;
      }
    }
  },
  // watch: {
  //   checkedPage(val,oldVal){
  //     if(val!==oldVal){

  //     }
  //   }
  // },
  onLoad() {
    // uni.startPullDownRefresh()
  },
  mounted() {
    this.reload();
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log(['下拉刷新']);
    let vm = this;
    uni.startPullDownRefresh();
    if (vm.status === 'nomore') {
      return false;
    }
    vm.getList(this.params.path);
    uni.stopPullDownRefresh();
  },
  // 上拉加载
  async onReachBottom() {
    let vm = this;
    if (vm.status === 'nomore') {
      return false;
    }
    uni.showNavigationBarLoading();
    vm.pageIndex += 1;
    let path = vm.params.path.split('.');
    path[0] = `${path[0]}-${vm.pageIndex}`;
    let newPath = path.join('.');
    await vm.getList(newPath);
    uni.hideNavigationBarLoading();
  },

  methods: {
    // 切换顶部tab
    async tabsClickItem(item) {
      let vm = this;
      vm.activeIndex = item.index;
      console.log(['tabsClick', item]);
      vm.pageIndex = 1;
      vm.status = 'more';
      vm.list = [];
      if (item.path) {
        vm.params = {
          path: item.path
        };
        await vm.getList(item.path);
      }
    },
    async getList(path = '') {
      let vm = this;
      if (path) {
        vm.status = 'loading';
        let res = await vm.api.get245BtTabData(path, {}).catch(err => {
          vm.status = 'nomore';
          vm.getList();
        });
        if (!res) return false;
        let tabs = res.tabs.map(v => {
          return {
            title: v.title,
            path: v.path
          };
        });
        tabs.unshift({
          title: '全部',
          path: vm.btHeader.find(v => v.title === vm.checkedPage).path
        });
        vm.tabsList = tabs;
        let list =
          res.body.map(v => {
            return {
              title: v.title,
              imgSrc: v.imgPath,
              path: v.path,
              marker: 'image',
              imgWidth: '25px',
              imgHeight: '50px'
            };
          }) || [];
        vm.status = !list.length || list.length < 12 ? 'noMore' : 'more';

        vm.list = unit.objectArrayReduce([...vm.list, ...list], 'title');

        uni.stopPullDownRefresh();
      }
    },
    async reload() {
      let vm = this;
      console.log(this);
      if (!vm.list.length) {
        try {
          console.log(vm.$store.state.btHeader);
          vm.btHeader = vm.$store.state.btHeader || [];
        } catch (error) {
          vm.btHeader = [];
          console.log(error);
        }
        let header = vm.btHeader.find(v => v.title === vm.checkedPage);
        if (header) {
          vm.params = {
            path: header.path
          };
          // uni.showLoading({
          // 	title: this.$config.loadingText
          // })
          await vm.getList(header.path);
          // uni.hideLoading()
        }
      }
    },
    gridChange(data) {
      let item = JSON.stringify(data.detail.item);
      uni.navigateTo({
        url: `/pages/tabbar-detail/tabbarDetail?data=${item}`
      });
      console.log(['gridClick', item, data]);
    }
  }
};
</script>
