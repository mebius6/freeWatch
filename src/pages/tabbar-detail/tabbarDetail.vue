<template>
	<view class="tarbar-detail">
		<view class="tarbar-detail-title">
			<view class="tarbar-detail-title-left">
				<image class="tarbar-detail-title-left-img" mode="aspectFit" :src="getImgPath" @error="imageError"></image>
			</view>
			<view class="tarbar-detail-title-right">
				<view class="tarbar-detail-title-right-item" v-for="(item,index) in getRightTitle" :key="index">
					{{item.label}}{{item.value}}
				</view>
			</view>
		</view>
		<view class="tarbar-detail-body">
			<view class="tarbar-detail-body-section" v-for="(item,index) in body" :key="`section-${index}`">
				<view class="tarbar-detail-body-section-item" v-for="(v,i) in item" :key="`item-${i}`">
					<view>
						<text>{{v.text}}</text>
					</view>
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
			body: []
		}
	},
	onLoad(option) {
		this.data = JSON.parse(option.data)
		//option为object类型，会序列化上个页面传递的参数
		console.log(this.data) //打印出上个页面传递的参数。
		uni.setNavigationBarTitle({
			title: this.data.title
		})
		this.getDetailList()
	},
	computed: {
		getImgPath: {
			get() {
				return this.data.imgSrc
			},
			set(val) {
				return val
			}
		},
		getRightTitle: {
			get() {
				return this.title
			},
			set(val) {
				return val
			}
		}
	},
	methods: {
		getDetailList() {
			this.api.get245BtListItem(this.data.path).then(
				res => {
					this.title = res.header || []
					this.body = res.body || []
					console.log(['detailRes', res])
				},
				err => {
					this.getDetailList()
					console.log(['detailerr', err])
				}
			)
		},
		imageError() {}
	}
}
</script>

<style lang="less" scoped>
@import '../../styles/main.less';
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