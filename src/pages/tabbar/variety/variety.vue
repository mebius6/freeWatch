<template>
	<view class="content">
		页面 - 4
	</view>
</template>

<script>
export default {
	props: {
		navigationBarTextStyle: {
			type: String,
			defalut: '综艺'
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
