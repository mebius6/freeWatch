<template>
	<view class="tarbar-detail">

		<view class="tarbar-detail-title">

			<view class="tarbar-detail-title-left">
				<image class="tarbar-detail-title-left-img" mode="aspectFit" :src="getImgPath" @error="imageError"></image>
			</view>
			<view class="tarbar-detail-title-right">
				<view class="tarbar-detail-title-right-item" v-for="(item, index) in getRightTitle" :key="index">
					{{ item.label }}{{ item.value }}
				</view>
			</view>
		</view>
		<view class="tarbar-detail-body">
			<view class="tarbar-detail-body-section" v-for="(item, index) in body" :key="item.source">
				<view class="tarbar-detail-body-section-source">
					<text>{{ item.source }}</text>
				</view>
				<view class="tarbar-detail-body-section-item">
					<view class="player-title" v-for="(v, i) in item.list" :key="i" @click="playerItem(v,item.list)">
						<text class="player-title-text">{{ v.title }}</text>
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
			body: [],
			value: [],
			author: ''
		}
	},
	async onLoad(option) {
		uni.showLoading({
			title: this.$config.loadingText
		})

		try {
			console.log(['option', option])
			this.data = JSON.parse(option.data)
			//option为object类型，会序列化上个页面传递的参数
			console.log(this.data) //打印出上个页面传递的参数。
			uni.setNavigationBarTitle({
				title: this.data.title || this.author
			})
			await this.getDetailList()
		} catch (error) {
			console.log(error)
		}

		uni.hideLoading()
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
		},
		bodyList: {
			get() {
				return this.body
			},
			set(val) {
				return val
			}
		}
	},
	methods: {
		async getDetailList() {
			let res = await this.api.get245BtListItem(this.data.path).catch(err => {
				this.getDetailList()
				console.log(['detailerr', err])
			})
			if (!res) return false
			this.title = res.header || []
			this.body = res.body || []
			this.author = res.author || ''
			console.log(['body', res.body])
		},
		imageError() {},
		playerItem(item, list) {
			let data = Object.assign(item)
			data.author = this.data.title || this.author

			console.log(['data', data])
			let datas = JSON.stringify(data)
			let lists = JSON.stringify(list)
			uni.navigateTo({
				url: `/pages/player-item/playerItem?data=${datas}&list=${lists}`
			})
		}
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
			font-size: 14px;
			color: @free-watch-from-gray-color;
		}
	}
	&-body {
		padding: 0 15px;
		&-section {
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			&-source {
				font-size: 15px;
				margin-bottom: 10px;
			}
			&-item {
				font-size: 14px;
				display: flex;
				justify-content: flex-start;
				padding: 0 10px;
				flex-wrap: wrap;
				.player-title {
					width: 17vw;
					text-align: center;
					color: #333;
					border: 1px solid #eee;
					border-radius: 2px;
					padding: 2px 5px;
					margin: 2px;
					.textHide();
				}
			}
		}
	}
}
</style>
