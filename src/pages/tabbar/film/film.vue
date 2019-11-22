<template>
	<view>
		<navbar-tabs v-if="tabsList.length" :tabsList="tabsList" :page="page" :activeIndex="activeIndex" @tabsClickItem="tabsClickItem">
			<view slot="list">
				<grid :showBorder="false" :data="list" @change="gridChange"></grid>
				<!-- <uni-load-more :status="status" :content-text="contentText" color="#007aff" /> -->
			</view>
		</navbar-tabs>

	</view>
</template>

<script>
import grid from '../../components/grid/grid'
import { uniLoadMore } from '@dcloudio/uni-ui'
import unit from '../../../services/unit'
export default {
	components: { grid, uniLoadMore },
	props: {
		navigationBarTextStyle: {
			type: String,
			defalut: '电影'
		}
	},
	data() {
		return {
			activeIndex: 0,
			scrollTop: 0,
			page: 4,
			pageIndex: 1,
			tabsList: [],
			list: [],
			params: {},
			status: 'more',
			statusTypes: [
				{
					value: 'more',
					text: '加载前'
				},
				{
					value: 'loading',
					text: '加载中'
				},
				{
					value: 'noMore',
					text: '没有更多'
				}
			],
			contentText: {
				contentdown: '查看更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多'
			}
		}
	},
	onLoad() {
		// uni.startPullDownRefresh()
	},
	async onShow() {
		let vm = this
		if (!vm.list.length) {
			let header = vm.$store.state.btHeader.find(v => v.title === '电影')

			console.log(['header', header, vm.$store.state.btHeader])
			if (header) {
				vm.params = {
					path: header.path
				}
				await vm.getList(header.path)
			}
		}
	},
	// 下拉刷新
	async onPullDownRefresh() {
		await this.getList(this.params.path)
	},
	// 上拉加载
	async onReachBottom() {
		let vm = this
		if (vm.status === 'nomore') {
			return false
		}

		uni.showNavigationBarLoading()
		vm.pageIndex += 1
		let path = vm.params.path.split('.')
		path[0] = `${path[0]}-${vm.pageIndex}`
		let newPath = path.join('.')
		console.log(['newPath', newPath])
		await vm.getList(newPath)
		// let lists = unit.objectArrayReduce([...vm.data, ...list], 'title')
		// vm.$set(vm, 'data', lists)
		uni.hideNavigationBarLoading()
	},
	// 切换底部tab
	onTabItemTap(item) {},
	methods: {
		// 切换顶部tab
		async tabsClickItem(item) {
			let vm = this
			vm.activeIndex = item.index
			console.log(['tabsClick', item])
			vm.pageIndex = 1
			vm.status = 'more'
			vm.list = []
			if (item.path) {
				vm.params = {
					path: item.path
				}
				await vm.getList(item.path)
			}
		},
		async getList(path = '') {
			let vm = this
			if (path) {
				uni.startPullDownRefresh()
				vm.status = 'loading'
				let res = await vm.api.get245BtTabData(path, {}).catch(err => {
					vm.status = 'nomore'
					uni.stopPullDownRefresh()
					vm.getList()
					console.log(['err', err])
				})
				if (!res) return false
				let tabs = res.tabs.map(v => {
					return {
						title: v.title,
						path: v.path
					}
				})
				tabs.unshift({
					title: '全部',
					path: vm.$store.state.btHeader.find(v => v.title === '电影').path
				})
				vm.tabsList = tabs
				let list =
					res.body.map(v => {
						return {
							title: v.title,
							imgSrc: v.imgPath,
							path: v.path,
							marker: 'image',
							imgWidth: '25px',
							imgHeight: '50px'
						}
					}) || []
				vm.status = !list.length || list.length < 12 ? 'noMore' : 'more'
				let pages=getCurrentPages()
				let _this=pages[pages.length-1].$vm
				_this.list=unit.objectArrayReduce([...vm.list, ...list], 'title')
				// _this.$set(_this,'list',unit.objectArrayReduce([...vm.list, ...list], 'title'))
				// vm.list = Object.assign(unit.objectArrayReduce([...vm.list, ...list], 'title'))
				console.log(['data', _this.list])
				uni.stopPullDownRefresh()
			}
		},
		// 滚动到顶部(左边)
		upper(e) {
			console.log(e)
		},
		// 滚动到底部(右边)
		lower(e) {
			console.log(['滚动到底部', e])
		},
		//滚动时触发
		scroll(e) {
			console.log(['滚动时触发', e])
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
		},
		gridChange(data) {
			let item = JSON.stringify(data.detail.item)
			uni.navigateTo({
				url: `/pages/tabbar-detail/tabbarDetail?data=${item}`
			})
			console.log(['gridClick', item])
		}
	}
}
</script>

<style>
.content {
	text-align: center;
	height: 400upx;
	margin-top: 200upx;
}
</style>
