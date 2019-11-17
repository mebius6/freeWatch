<template>
	<view class="content">
		页面 - 5
	</view>
</template>

<script>
export default {
	props: {
		navigationBarTextStyle: {
			type: String,
			default: '动漫'
		}
	},
	data() {
		return {
			title: 'Hello'
		}
	},
	onLoad() {},

	onTabItemTap(item) {
		console.log(item)
	},
	methods: {}
}
</script>

<style>
.content {
	text-align: center;
	height: 400upx;
	margin-top: 200upx;
}
</style>
