<template>
	<view>
		<navbar-tabs v-if="tabsList.length" :tabsList="tabsList" :page="page" :activeIndex="activeIndex" @tabsClickItem="tabsClickItem">
			<view slot="list">
				<grid :showBorder="false" :data="pageList" @change="gridChange"></grid>
				<uni-load-more :status="status" :content-text="contentText" color="#007aff" />
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
			btHeader: [],
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
	computed: {
		pageList: {
			get() {
				return this.list
			},
			set(val) {
				return val
			}
		}
	},
	onLoad() {
		// uni.startPullDownRefresh()
	},
	async onShow() {
		let vm = this
		if (!vm.list.length) {
			try {
				console.log(vm.$store.state.btHeader)
				vm.btHeader = vm.$store.state.btHeader
			} catch (error) {
				vm.btHeader = []
				console.log(error)
			}
			let header = vm.btHeader.find(v => v.title === '电影')
			if (header) {
				vm.params = {
					path: header.path
				}
				uni.showLoading({
					title: this.$config.loadingText
				})
				await vm.getList(header.path)
				uni.hideLoading()
			}
		}
	},
	// 下拉刷新
	async onPullDownRefresh() {
		uni.showLoading({
			title: this.$config.loadingText
		})
		await this.getList(this.params.path)
		uni.hideLoading()
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
				uni.showLoading({
					title: this.$config.loadingText
				})
				vm.params = {
					path: item.path
				}
				await vm.getList(item.path)
				uni.hideLoading()
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
					path: vm.btHeader.find(v => v.title === '电影').path
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

				vm.list = unit.objectArrayReduce([...vm.list, ...list], 'title')

				uni.stopPullDownRefresh()
			}
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
			console.log(['gridClick', item, data])
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
