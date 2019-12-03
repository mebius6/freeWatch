<template>
	<view class="search-result">
		<uni-search-bar @confirm="search" @input="input" @cancel="cancel" />
		<view class="search-result-list">
			<card v-for="(item, index) in pageList" :key="index" :image="item.image" :columns="item.data"></card>
			<uni-load-more :status="status" :content-text="contentText" color="#007aff" />
		</view>
	</view>
</template>
<script>
import { uniSearchBar, uniLoadMore } from '@dcloudio/uni-ui'
import unit from '../../services/unit'
import card from '../../components/card/card'
export default {
	components: {
		uniSearchBar,
		uniLoadMore,
		card
	},
	data() {
		return {
			list: [],
			searchword: '', //搜索词
			pageIndex: 1, //页码
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
	// 下拉刷新
	onPullDownRefresh() {
		console.log(['下拉刷新'])
		let vm = this
		if (!vm.searchword) {
			return false
		}
		uni.startPullDownRefresh()
		if (vm.status === 'nomore') {
			return false
		}
		vm.getList(1)
		uni.stopPullDownRefresh()
	},

	// 上拉加载
	async onReachBottom() {
		let vm = this
		if (vm.status === 'nomore') {
			return false
		}
		uni.showNavigationBarLoading()
		vm.pageIndex += 1
		await vm.getList(vm.pageIndex)
		uni.hideNavigationBarLoading()
	},

	methods: {
		search(e) {
			let vm = this
			let searchword = e.value.replace(/(^\s*)|(\s*$)/, '')
			if (searchword) {
				vm.searchword = searchword
				vm.getList(1)
			}
		},
		async getList(page = 1) {
			let vm = this
			vm.status = 'loading'
			uni.showLoading({
				title: this.$config.loadingText
			})
			let res = await vm.api
				.search245BtBykeywords('/search.php', {
					searchword: vm.searchword,
					page
				})
				.catch(err => {
					vm.status = 'nomore'
					vm.getList()
				})
			if (!res || !res.length) return false
			let list = []
			for (let i = 0; i < res.length; i++) {
				const item = res[i]
				let obj = {
					image: {
						path: item.imgPath
					},
					title: item.title,
					data: []
				}
				for (let j = 0; j < item.desc.length; j++) {
					const jItem = item.desc[j]
					obj.data.push({
						list: [jItem.title]
					})
				}
				obj.data.unshift({
					data: item,
					render: (h, params) => {
						return h(
							'view',
							{
								attrs: {
									class: 'search-result-title'
								}
							},
							item.title
						)
					}
				})
				for (let j = 0; j < item.btn.length; j++) {
					const jItem = item.btn[j]
					obj.data.push({
						data: jItem,
						render: (h, params) => {
							return h(
								'view',
								{
									attrs: {
										class: 'search-result-btn'
									},
									on: {
										click: () => {
											if (jItem.title === '查看详情') {
												let items = Object.assign({}, jItem)
												items.imgSrc = obj.image.path
												items.title = obj.data[0].data.title
												let item = JSON.stringify(items)
												uni.navigateTo({
													url: `/pages/tabbar-detail/tabbarDetail?data=${item}`
												})
											}

											if (jItem.title === '立即播放') {
												let data = Object.assign({}, jItem)
												data.author = item.title
												let datas = JSON.stringify(data)
												uni.navigateTo({
													url: `/pages/player-item/playerItem?data=${datas}`
												})
											}
										}
									}
								},
								params.row.title
							)
						}
					})
				}

				list.push(obj)
			}
			vm.status = !list.length || list.length < 6 ? 'noMore' : 'more'
			vm.list = unit.objectArrayReduce([...vm.list, ...list], 'title')
			uni.hideLoading()
		},
		input(e) {
			console.log(['input', e])
		},
		cancel(e) {
			console.log(['cancel', e])
		}
	}
}
</script>

<style lang="less" scoped>
@import '../../styles/main';
.search-result {
	/deep/ .free-watch-card {
		.card-right {
			position: relative;
			.search-result-title {
				color: @free-watch-orange1-color;
				font-size: 16px;
			}
			.search-result-btn {
				border: 1px solid #333;
				color: @free-watch-main-color;
				border-radius: 2px;
				height: 30px;
				margin: 2px 0;
			}
			.free-watch-card-right {
				&:nth-child(7),
				&:nth-child(6) {
					width: 30%;
					height: 30px;
					text-align: center;
					line-height: 30px;

					.search-result-btn {
						border: 1px solid #eee;
						padding: 2px 5px;
						border-radius: 2px;
					}
				}
				&:nth-child(6) {
					display: inline-block;
				}
				&:nth-child(7) {
					position: absolute;
					left: 32%;
					bottom: 0;
				}
			}
		}
	}
}
</style>
