<template>
	<view class="free-watch-player">

		<video v-if="(systemInfo.platform==='android'||systemInfo.platform==='ios')&&url" name="media" :muted="true" :autoplay="true" :controls="true" :loop="true" :enable-progress-gesture="true" :show-center-play-btn="true" :show-play-btn="true" :show-fullscreen-btn="true" :show-progress="true" :page-gesture="true" initial-time="60" class="free-watch-player-row" :src="url" direction="90" @fullscreenchange="fullscreenchange">
			<cover-view class="controls-title">简单的自定义 controls</cover-view>
		</video>

		<view>{{systemInfo.platform}}{{`url:${url}`}}</view>

		<dplayer v-if="systemInfo.platform==='other'&&video.url" class="free-watch-player-row" ref="player" @on-ended="ended" @on-playing="playing" :video="video" :contextmenu="contextmenu"></dplayer>

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
			systemInfo: {},
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

	watch: {
		systemInfo: {
			handler(newVal) {
				this.systemInfo = newVal
			},
			deep: true
		},
		url(newVal) {
			this.url = newVal
		}
	},
	async onLoad(option) {
		console.log(['uni', uni])
		uni.showLoading({
			title: this.$config.loadingText
		})
		this.systemInfo = this.$store.state.systemInfo
		console.log(['systemInfo', this.systemInfo])
		try {
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
			if (!this.systemInfo.platform || this.systemInfo.platform === 'other') {
				this.video.url = res.url
			} else {
				this.url = res.url
			}
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
		},
		renderNativeVideo() {
			let vm = this
			let h = vm.$createElement
			if (
				(vm.systemInfo.platform === 'android' ||
					vm.systemInfo.platform === 'ios') &&
				vm.url
			) {
				return h(
					'video',
					{
						props: {
							name: 'media',
							muted: 'muted',
							autoplay: 'autoplay',
							controls: 'controls',
							loop: 'loop',
							src: url,
							direction: '90'
						},
						attrs: {
							class: 'free-watch-player-row'
						},
						on: {
							fullscreenchange: this.fullscreenchange
						}
					},
					[
						h('source', {
							props: {
								src: url,
								type: 'video/m3u8'
							}
						})
					]
				)
			}
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
