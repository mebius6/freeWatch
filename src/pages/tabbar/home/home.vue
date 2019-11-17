<template>
	<view>
		<navbar-tabs v-if="tabsList.length" :tabsList="tabsList" :page="page" :activeIndex="activeIndex" @tabsClickItem="tabsClickItem"></navbar-tabs>
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
			<view class="list-item" v-for="(item,index) in data" :key="index" @click="goDetail(item)">
				<view class="list-item-left">{{item.time}}</view>
				<view class="list-item-center">{{item.content}}</view>
				<view class="list-item-right">{{item.sort}}</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	props: {
		navigationBarTextStyle: {
			type: String,
			defalut: '首页'
		}
	},
	data() {
		return {
			activeIndex: 0,
			scrollTop: 0,
			page: 3,
			tabsList: [
				{
					title: '待审批'
				},
				{
					title: '已批准'
				},
				{
					title: '已失效'
				}
			],
			data: [],
			params: {}
		}
	},
	onLoad() {},
	async onShow() {
		if (!this.data.length) {
			await this.getList()
		}
	},
	onHide() {
		this.data = []
	},
	methods: {
		tabsClickItem(item) {
			this.activeIndex = item.index
		},
		getList() {
			let vm = this
			let header = vm.$store.state.header.find(v => v.content === '首页')
			vm.tabsList = header
				? header.slide
				: [].map(v => {
						return {
							title: v.content,
							params: v.params || {}
						}
				  })
			let params = header ? header.params || {} : {}
			vm.api.getList(params).then(
				res => {
					vm.data = res.body || []
					console.log(['body', res.body])
				},
				err => {
					vm.getList()
					console.log(['err', err])
				}
			)
		},
		// 滚动到顶部(左边)
		upper(e) {
			console.log(e)
		},
		// 滚动到底部(右边)
		lower(e) {
			console.log(e)
		},
		//滚动时触发
		scroll(e) {
			console.log(e)
			// this.old.scrollTop = e.detail.scrollTop
		},
		goTop(e) {
			this.scrollTop = this.old.scrollTop
			this.$nextTick(function() {
				this.scrollTop = 0
			})
			uni.showToast({
				icon: 'none',
				title: '纵向滚动 scrollTop 值已被修改为 0'
			})
		},
		goDetail(item) {
			console.log(['item', item])
			let data = JSON.stringify(item)
			uni.navigateTo({
				url: `/pages/tabbar-detail/tabbarDetail?data=${data}`
			})
		}
	}
}
</script>

<style lang="less" scoped>
</style>
