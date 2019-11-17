<template>
  <view>
    <navbar-tabs
      v-if="tabsList.length"
      :tabsList="tabsList"
      :page="page"
      :activeIndex="activeIndex"
      @tabsClickItem="tabsClickItem"
    ></navbar-tabs>
    <scroll-view
      :scroll-top="scrollTop"
      scroll-y="true"
      class="scroll-Y"
      @scrolltoupper="upper"
      @scrolltolower="lower"
      @scroll="scroll"
    >
      <view class="list-item" v-for="(item,index) in data" :key="index" @click="goDetail(item)">
        <view class="list-item-left">{{item.time}}</view>
        <view class="list-item-center">{{item.content}}</view>
        <view class="list-item-right">{{item.sort}}</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    navigationBarTextStyle: {
      type: String,
      defalut: "电影"
    }
  },
  data() {
    return {
      activeIndex: 0,
      scrollTop: 0,
      page: 4,
      tabsList: [
        
      ],
      data: [],
      params: {}
    };
  },
  onLoad() {},
  onShow() {
    if (!this.data.length) {
      this.getList();
    }
  },
  onTabItemTap(item) {
    console.log(item);
  },
  methods: {
    tabsClickItem(item) {
      this.activeIndex = item.index;
    },
    getList() {
      let vm = this;
      let header = vm.$store.state.btHeader.find(v => v.title === "电影");
      console.log(["header", header, vm.$store.state.btHeader]);
      if (header) {
        vm.api.get245BtTabData(header.path, {}).then(
          res => {
            if(res){
				let tabs=res.tabs.map(v=>{
					return {
						title:v.title,
						path:v.path
					}
				})
				tabs.unshift({title:'全部',path:''})
				vm.tabsList=tabs
				vm.data=res.body
				console.log(res.body)
			}
          },
          err => {
            vm.getList();
            console.log(["err", err]);
          }
        );
      }
    },
    // 滚动到顶部(左边)
    upper(e) {
      console.log(e);
    },
    // 滚动到底部(右边)
    lower(e) {
      console.log(e);
    },
    //滚动时触发
    scroll(e) {
      console.log(e);
      // this.old.scrollTop = e.detail.scrollTop
    },
    goTop(e) {
      this.scrollTop = this.old.scrollTop;
      this.$nextTick(function() {
        this.scrollTop = 0;
      });
      uni.showToast({
        icon: "none",
        title: "纵向滚动 scrollTop 值已被修改为 0"
      });
    },
    goDetail(item) {
      console.log(["item", item]);
      let data = JSON.stringify(item);
      uni.navigateTo({
        url: `/pages/tabbar-detail/tabbarDetail?data=${data}`
      });
    }
  }
};
</script>

<style>
.content {
  text-align: center;
  height: 400upx;
  margin-top: 200upx;
}
</style>
