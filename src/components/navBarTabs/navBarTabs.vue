<template>
  <view class="free-watch-tabs">
    <view class="nav-tabs">
      <view
        :class="
          active === index
            ? 'nav-tabs-con nav-tabs-item-active'
            : 'nav-tabs-con'
        "
        v-for="(item, index) in tabList"
        :key="item.title"
        :style="style"
        @click="tabsClick(index)"
      >
        <text class="nav-tabs-item">
          {{ item.title }}
        </text>
      </view>
      <text class="nav-tabs-move" :style="moveClass"> </text>
    </view>
    <slot name="list">
      <view class="free-watch-list"></view>
    </slot>
  </view>
</template>

<script>
export default {
  props: {
    tabsList: {
      type: Array,
      defalut: []
    },
    page: {
      type: Number,
      defalut: 4
    },
    activeIndex: {
      type: Number,
      defalut: 0
    },
    tabsClickItem: {
      type: Function
    }
  },
  data() {
    return {
      moveClass: {},
      style: {}
    };
  },
  mounted() {
    this.lineStyleFun(this.active);
  },
  computed: {
    tabList: {
      get() {
        return this.tabsList;
      },
      set(val) {
        return val;
      }
    },
    active: {
      get() {
        return this.activeIndex;
      },
      set(val) {
        return val;
      }
    },
    pages: {
      get() {
        return this.page;
      },
      set(val) {
        return val;
      }
    }
  },

  methods: {
    getTextWidth() {
      let textWidth = 0;
      uni
        .createSelectorQuery()
        .select(".nav-tabs-item")
        .fields(
          {
            size: true
          },
          data => {
            textWidth = data.width;
          }
        )
        .exec();
      return textWidth;
    },
    // 获取tabs文字的宽度和划线left
    widthFun(index) {
      // tabs元素文字的宽度
      let textWidth = this.getTextWidth();

      // 屏幕的宽度
      const { windowWidth } = uni.getSystemInfoSync();
      //下划线宽度
      // let textWidth = document.body.windowWidth / 15;
      // tabs的Item宽度
      let itemWidth = 100 / this.pages;
      let left =
        itemWidth * index + (itemWidth - (textWidth / windowWidth) * 100) / 2;
      return { textWidth, left };
    },
    // 设置tabs下划线样式
    lineStyleFun(index) {
      // tabs宽度
      const style = {
        minWidth: 100 / this.pages + "%"
      };

      let { textWidth, left } = this.widthFun(index);
      const moveClass = {
        width: textWidth + "px",
        left: left + "%"
      };
      this.style = style;
      this.moveClass = moveClass;
    },
    tabsClick(index) {
      // 获取tabs文字的宽度和划线left
      let { textWidth, left } = this.widthFun(index);
      const moveClass = {
        width: textWidth + "px",
        left: left + "%"
      };
      this.moveClass = moveClass;
      this.active = index;

      let params = this.tabList[index];
      params["index"] = index;
      // 事件
      this.$emit("tabsClickItem", params);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../styles/colors.less";
.nav-tabs {
  width: 100%;
  height: 80rpx;
  background: @free-watch-white-color;
  display: flex;
  overflow-x: auto;
  font-size: 22rpx;
  color: rgba(33, 33, 51, 0.8);
  position: relative;
  flex-direction: row;
  border-bottom: 1rpx solid @free-watch-gray2-color;
  /* 滚动条整体部分 */
  &::-webkit-scrollbar {
    width: 1rpx;
    height: 8rpx;
    background-color: #ffffff;
  }
  /* scroll轨道背景 */
  &::-webkit-scrollbar-track {
    //-webkit-box-shadow: inset 0 0 4rpx rgba(255, 255, 255, 0.1);
    border-radius: 2rpx;
    //border-left: 1rpx solid #cccccc;
    background-color: @free-watch-gray2-color;
  }
  /* 滚动条中能上下移动的小块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 2rpx;
    //-webkit-box-shadow: inset 0 0 4rpx rgba(0, 0, 0, 0.2);
    background-color: @free-watch-gray2-color;
  }
  &-con {
    text-align: center;
    flex-shrink: 0;
    flex: 1;
    .nav-tabs-item {
      line-height: 80rpx;
    }
  }

  .nav-tabs-item-active {
    font-size: 28rpx;
    color: @free-watch-black-color;
  }

  .nav-tabs-move {
    width: 100rpx;
    height: 5rpx;
    background-color: @free-watch-main-color;
    position: absolute;
    left: 0;
    bottom: 0;
    transition: left 0.2s;
  }
}
</style>
