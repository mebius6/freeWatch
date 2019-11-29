<template>
	<view class="free-watch-player">
		<video height="400" width="100%" name="media" muted="muted" controls="controls" loop="loop" id="video" :src="url" direction="0">
			<source src="https://hong.tianzhen-zuida.com/20191128/14913_8aa1d17d/index.m3u8" type="video/mp4" />
		</video>
	</view>
</template>

<script>
export default {
	data() {
		return {
			option: {},
			url: ''
		}
	},
	async onLoad(option) {
		uni.showLoading({
			title: this.$config.loadingText
		})

		try {
			console.log(['option', option])
			this.option = JSON.parse(option.data)
			//option为object类型，会序列化上个页面传递的参数
			console.log(this.option) //打印出上个页面传递的参数。
			uni.setNavigationBarTitle({
				title: this.option.title
			})
			await this.getPlayerUrl(this.option)
		} catch (error) {
			console.log(error)
		}

		uni.hideLoading()
	},
	methods: {
		getPlayerUrl(item) {
			this.api.get245BtPlayerUrl(item.path).then(res => {
				if (res) {
					this.url = res.url
				}
			})
		}
	}
}
</script>

<style>
</style>