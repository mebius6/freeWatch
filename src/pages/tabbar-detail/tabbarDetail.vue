<template>
  <view class="tarbar-detail">
    <view class="tarbar-detail-title">
      <view class="tarbar-detail-title-left">
        <image
          class="tarbar-detail-title-left-img"
          mode="aspectFit"
          :src="getImgPath"
          @error="imageError"
        ></image>
      </view>
      <view class="tarbar-detail-title-right">
        <view
          class="tarbar-detail-title-right-item"
          v-for="(item, index) in getRightTitle"
          :key="index"
        >
          {{ item.label }}{{ item.value }}
        </view>
      </view>
    </view>
    <view class="tarbar-detail-body">
      <view
        class="tarbar-detail-body-section"
        v-for="(item, index) in body"
        :key="`section-${index}`"
      >
        <view>
          <text>{{ item.source }}</text>
        </view>
        <view
          class="tarbar-detail-body-section-item"
          v-for="(v, i) in item.list"
          :key="`item-${i}`"
          @click="playerItem(v)"
        >
          <text>{{ v.title }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      data: {},
      title: [],
      body: [],
      value: [],
      author: ""
    };
  },
  async onLoad(option) {
    uni.showLoading({
      title: this.$config.loadingText
    });
    await this.getDetailList();
    try {
      this.data = JSON.parse(option.data);
      //option为object类型，会序列化上个页面传递的参数
      console.log(this.data); //打印出上个页面传递的参数。
      uni.setNavigationBarTitle({
        title: this.data.title || this.author
      });
    } catch (error) {
      console.log(error);
    }
    uni.hideLoading();
  },
  computed: {
    getImgPath: {
      get() {
        return this.data.imgSrc;
      },
      set(val) {
        return val;
      }
    },
    getRightTitle: {
      get() {
        return this.title;
      },
      set(val) {
        return val;
      }
    },
    bodyList: {
      get() {
        return this.body;
      },
      set(val) {
        return val;
      }
    }
  },
  methods: {
    async getDetailList() {
      let res = await this.api.get245BtListItem(this.data.path).catch(err => {
        this.getDetailList();
        console.log(["detailerr", err]);
      });
      if (!res) return false;
      this.title = res.header || [];
      this.body = res.body || [];
      this.author = res.author || "";
      console.log(["detailRes", res]);
    },
    imageError() {},
    playerItem(item) {
      this.api.get245BtPlayerUrl(item.path).then(res => {
        console.log(["res", res]);
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../styles/main.less";
.tarbar-detail {
  &-title {
    display: flex;
    align-items: center;
    justify-content: center;
    &-left {
      flex: 0.3;
      padding: 0 15rpx;
      &-img {
        width: 100%;
        img {
          width: 80%;
          height: auto;
        }
      }
    }
    &-right {
      flex: 0.7;
      font-size: 28rpx;
      color: @free-watch-from-gray-color;
    }
  }
}
</style>
