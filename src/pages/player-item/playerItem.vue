<template>
	<view class="free-watch-player">
		<!-- #ifndef H5 -->
		<video name="media" muted="muted" autoplay="autoplay" controls="controls" loop="loop" class="free-watch-player-row" :src="url" direction="90" @fullscreenchange="fullscreenchange">
			<source :src="url" type="video/m3u8" />
		</video>
		<!-- #endif-->

		<!-- #ifdef H5 -->
		<dplayer v-if="video.url" class="free-watch-player-row" ref="player" @on-ended="ended" @on-playing="playing" :video="video" :contextmenu="contextmenu"></dplayer>
		<!-- #endif -->
		<view class="tarbar-detail-body-section-item">
			<view :class="title===v.title?'player-title active':'player-title'" v-for="(v, i) in body" :key="i" @click="playerItem(v)">
				<text class="player-title-text">{{ v.title }}</text>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef H5
import dplayer from '../components/dplayer/dplayer'
// #endif
export default {
	// #ifdef H5
	components: {
		dplayer
	},
	// #endif
	data() {
		return {
			// #ifdef H5
			video: {
				url: '',
				defaultQuality: 1,
				type: 'hls'
			},
			autoplay: true,
			player: null,
			body: [],
			contextmenu: [],
			// #endif
			option: {},
			title: '',
			url: '',
			row: true // 竖屏
		}
	},
	async onLoad(option) {
		console.log(['uni', uni])
		uni.showLoading({
			title: this.$config.loadingText
		})

		try {
			console.log(['option', option])
			this.option = JSON.parse(option.data)
			this.title = this.option.title
			await this.getPlayerUrl(this.option)
			//option为object类型，会序列化上个页面传递的参数

			this.body = JSON.parse(option.list)
			console.log(['body', this.body]) //打印出上个页面传递的参数。
			uni.setNavigationBarTitle({
				title: this.option.author
			})
		} catch (error) {
			console.log(error)
		}

		uni.hideLoading()
	},

	methods: {
		async getPlayerUrl(item) {
			let res = await this.api.get245BtPlayerUrl(item.path).catch(err => {
				console.log(err)
			})
			if (!res) return false
			console.log(['res', res])
			// #ifndef H5
			this.url = res.url
			// #endif

			//  #ifdef H5
			this.video.url = res.url
			// #endif
		},
		fullscreenchange(event) {
			// 横屏
			if (event.detail.fullScreen) {
				this.row = false
			} else {
				this.row = true
			}
			console.log(event)
		},
		//播放结束
		async ended() {
			let vm = this
			let index = vm.body.findIndex(v => v.title === vm.title)
			if (index < vm.body.length - 1) {
				console.log(['end'])
				uni.showLoading({
					title: this.$config.loadingText
				})
				let item = vm.body[index + 1]
				vm.title = item.title
				await this.getPlayerUrl(item)
				uni.hideLoading()
			}
		},
		//正在播放
		async playing(data) {
			if (data.duration - data.currentTime < 180) {
				let vm = this
				let index = vm.body.findIndex(v => v.title === vm.title)
				if (index < vm.body.length - 1) {
					console.log(['end'])
					uni.showLoading({
						title: this.$config.loadingText
					})
					let item = vm.body[index + 1]
					vm.title = item.title
					await this.getPlayerUrl(item)
					uni.hideLoading()
				}
			}
		},
		async playerItem(item) {
			uni.showLoading({
				title: this.$config.loadingText
			})
			this.title = item.title
			await this.getPlayerUrl(item)
			uni.hideLoading()
		}
	}
}
</script>

<style lang="less" scoped>
@import '../../styles/main.less';
.free-watch-player {
	&-row {
		width: 100vw;
		height: 40vh;
		transform: rotate(0);
	}
	&-column {
		width: 100vh;
		height: 100vw;
		transform: rotate(90);
	}
	.vjs-big-play-button {
		left: 50% !important;
		top: 50% !important;
	}
}
.tarbar-detail-body-section-item {
	font-size: 14px;
	display: flex;
	justify-content: flex-start;
	padding: 20px 10px;
	flex-wrap: wrap;
	.player-title {
		width: 17vw;
		text-align: center;
		color: #333;
		border: 1px solid #eee;
		border-radius: 2px;
		padding: 2px 5px;
		margin: 2px;
		&.active {
			font-size: 16px;
			color: @free-watch-main-color;
		}
		.textHide();
	}
}
</style>
