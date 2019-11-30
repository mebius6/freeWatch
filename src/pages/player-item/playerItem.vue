<template>
	<view class="free-watch-player">
		<!-- #ifndef H5 -->
		<video name="media" muted="muted" autoplay="autoplay" controls="controls" loop="loop" class="free-watch-player-row" :src="url" direction="90" @fullscreenchange="fullscreenchange">
			<source :src="url" type="video/m3u8" />
		</video>
		<!-- #endif-->

		<!-- #ifdef H5 -->
		<dplayer class="free-watch-player-row" ref="player" @on-play="play" :video="video" :contextmenu="contextmenu"></dplayer>
		<!-- #endif -->
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
				quality: [],
				url: 'https://mei.huazuida.com/20191128/17893_5835dd17/index.m3u8',
				defaultQuality: 1,
				type: 'hls'
			},
			autoplay: true,
			player: null,
			contextmenu: [
				{
					text: '博客园',
					link: 'http://www.cnblogs.com/maqingyuan/'
				},
				{
					text: '博客园',
					link: 'http://www.cnblogs.com/maqingyuan/'
				},
				{
					text: '博客园',
					link: 'http://www.cnblogs.com/maqingyuan/'
				}
			],
			// #endif
			option: {},
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
			await this.getPlayerUrl(this.option)
			//option为object类型，会序列化上个页面传递的参数
			console.log(this.option) //打印出上个页面传递的参数。
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
			this.video.quality.push({
				name: this.option.title,
				url: res.url
			})
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
		play() {
			// console.log('开始播放...')
		}
	}
}
</script>

<style lang="less" scoped>
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
</style>
