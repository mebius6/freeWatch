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
			<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
						<view class="uni-input">{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}</view>
					</picker>
			<!-- <view class="tarbar-detail-body-section" v-for="(item,index) in body" :key="`section-${index}`">
					<view>
						<text>{{item.source}}</text>
					</view>
				<view class="tarbar-detail-body-section-item" v-for="(v,i) in item.list" :key="`item-${i}`">
					<view>
						<text>{{v.title}}</text>
					</view>
				</view>
			</view> -->
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
			value:[],
			multiIndex: [0, 0, 0],
					multiArray: [
					['亚洲', '欧洲'],
					['中国', '日本'],
					['北京', '上海', '广州']
				],
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
		imageError() {},
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						switch (this.multiIndex[0]) {
							case 0:
								this.multiArray[1] = ['中国', '日本']
								this.multiArray[2] = ['北京', '上海', '广州']
								break
							case 1:
								this.multiArray[1] = ['英国', '法国']
								this.multiArray[2] = ['伦敦', '曼彻斯特']
								break
						}
						this.multiIndex.splice(1, 1, 0)
						this.multiIndex.splice(2, 1, 0)
						break
					case 1: //拖动第2列
						switch (this.multiIndex[0]) { //判断第一列是什么
							case 0:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['北京', '上海', '广州']
										break
									case 1:
										this.multiArray[2] = ['东京','北海道']
										break
								}
								break
							case 1:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['伦敦', '曼彻斯特']
										break
									case 1:
										this.multiArray[2] = ['巴黎', '马赛']
										break
								}
								break
						}
						this.multiIndex.splice(2, 1, 0)
						break
				}
				this.$forceUpdate()
			},
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