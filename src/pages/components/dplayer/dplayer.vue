<template>
	<view class="dplayer"></view>
</template>

<script>
import DPlayer from 'dplayer'
import 'dplayer/dist/DPlayer.min.css'
export default {
	props: {
		autoplay: {
			type: Boolean,
			default: true
		},

		theme: {
			type: String,

			default: '#FADFA3'
		},

		loop: {
			type: Boolean,

			default: true
		},

		lang: {
			type: String,

			default: 'zh'
		},

		screenshot: {
			type: Boolean,

			default: false
		},

		hotkey: {
			type: Boolean,

			default: true
		},

		preload: {
			type: String,

			default: 'auto'
		},

		contextmenu: {
			type: Array
		},

		logo: {
			type: String
		},

		video: {
			type: Object,

			required: true,

			validator(value) {
				return typeof value.url === 'string'
			}
		}
	},

	data() {
		return {
			dp: null
		}
	},
	computed: {
		playerAutoplay() {
			return this.autoplay
		},

		playerTheme() {
			return this.theme
		},
		playerLoop() {
			return this.loop
		},
		playerLang() {
			return this.lang
		},
		playerScreenshot() {
			return this.screenshot
		},
		playerHotkey() {
			return this.hotkey
		},
		playerPreload() {
			return this.preload
		},
		playerContextmenu() {
			return this.contextmenu
		},
		playerLogo() {
			return this.logo
		}
	},

	mounted() {
		this.initPlayer()
	},
	methods: {
		initPlayer() {
			const player = (this.dp = new DPlayer({
				element: this.$el,

				autoplay: this.playerAutoplay,

				theme: this.playerTheme,

				loop: this.playerLoop,

				lang: this.playerLang,

				screenshot: this.playerScreenshot,

				hotkey: this.playerHotkey,

				preload: this.playerPreload,

				contextmenu: this.playerContextmenu,

				logo: this.playerLogo,

				video: {
					url: this.video.url,

					pic: this.video.pic,

					type: this.video.type
				}
			}))
			player.on('play', () => {
				this.$emit('on-play')
			})

			player.on('pause', () => {
				this.$emit('pause')
			})

			player.on('canplay', () => {
				this.$emit('canplay')
			})

			player.on('playing', () => {
				this.$emit('on-playing', {
					currentTime: player.video.currentTime,
					duration: player.video.duration
				})
			})

			player.on('ended', () => {
				this.$emit('on-ended')
			})

			player.on('error', () => {
				this.$emit('error')
			})
		}
	},
	watch: {
		video: {
			handler(newVal) {
				if (!newVal.url) {
					this.dp.destory()
				}
				this.initPlayer()
			},
			deep: true
		}
		// 'video.url': newProps => {
		// 	console.log(['newProps', newProps, this])
		// 	// if (this.dp) {
		// 	// 	this.dp.destory()
		// 	// }
		// 	this.initPlayer()
		// }
	}
}
</script>
<style scoped></style>
