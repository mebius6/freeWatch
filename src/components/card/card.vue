<template>
  <view class="free-watch-card">
    <view class="card-left" v-if="showImg">
      <view v-if="image.path">
        <img :src="image.path" />
      </view>
    </view>
    <view class="card-right">
      <view
        v-for="(item, index) in data"
        :key="index"
        class="free-watch-card-right"
      >
        <view class="card-right-item" v-if="!item.render">
          <view v-if="(item.list || []).length">
            <text v-for="(v, i) in item.list || []" :key="i"
              >{{ v }}<text v-if="v" class="dot"></text
            ></text>
          </view>
        </view>
        <view class="card-right-item" v-else>
          <Expand
            :row="item.data || {}"
            :index="index"
            :render="item.render"
          ></Expand>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Expand from './expand';

export default {
  name: 'graphic-text',
  components: { Expand },
  props: {
    showImg: {
      type: Boolean,
      default: true
    },
    image: {
      type: Object,
      default: () => {
        return { path: '' };
      }
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less">
@import '../../styles/main';
.free-watch-card {
  margin: 10px 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 0 10px;
  .card-left {
    width: 25vw;
    height: 25vw;
    border: 1px solid #dbdbdb;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-width: 25vw;
      max-height: 25vw;
    }
  }
  .card-right {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;
    color: @free-watch-from-gray-color;
    &-item {
      text-align: left;
      width: 100%;
      .textHide();
      & > view {
        width: 100%;
        .textHide();
        .dot {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
