<template>
	<view class="free-watch-grid">
		<uni-grid :column="gridColumn" :showBorder="gridShowBorder" :borderColor="gridBorderColor" :hor="gridHor" :ver="gridVer" :square="gridSquare" :highlight="gridHighlight" @change="_change">
			<uni-grid-item v-for="(item,index) in gridData" :key="index" :img-width="item.imgWidth" :src="item.imgSrc" :hor="item.hor" :ver="item.ver" :marker="item.marker||'image'">
				<text>{{item.title}}</text>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
import { uniGrid, uniGridItem } from '@dcloudio/uni-ui'

export default {
	props: {
		data: {
			type: Array,
			default: () => []
		},
		//每列显示个数
		column: {
			type: Number,
			default: () => 3
		},
		//是否显示边框
		showBorder: {
			type: Boolean,
			default: () => true
		},
		//边框颜色
		borderColor: {
			type: String,
			default: () => '#d0dee5'
		},
		//全局 marker 水平方向移动距离 ，起点为中心，负数为左移动，正数为右移动
		hor: {
			type: Number,
			default: () => 0
		},
		//全局 marker 垂直方向移动距离 ，起点为中心，负数为上移动，正数为下移
		ver: {
			type: Number,
			default: () => 0
		},
		//是否方形显示
		square: {
			type: Boolean,
			default: () => true
		},
		//点击背景是否高亮
		highlight: {
			type: Boolean,
			default: () => true
		},
		//点击 grid 触发
		change: {
			type: Function
		}
	},
	components: {
		'uni-grid': uniGrid,
		'uni-grid-item': uniGridItem
	},
	computed: {
		gridData: {
			get() {
				return this.data
			},
			set(val) {
				return val
			}
		},
		//每列显示个数
		gridColumn: {
			get() {
				return this.column
			},
			set(val) {
				return val
			}
		},
		//是否显示边框
		gridShowBorder: {
			get() {
				return this.showBorder
			},
			set(val) {
				return val
			}
		},
		//边框颜色
		gridBorderColor: {
			get() {
				return this.borderColor
			},
			set(val) {
				return val
			}
		},
		//全局 marker 水平方向移动距离 ，起点为中心，负数为左移动，正数为右移动
		gridHor: {
			get() {
				return this.hor
			},
			set(val) {
				return val
			}
		},
		//全局 marker 垂直方向移动距离 ，起点为中心，负数为上移动，正数为下移
		gridVer: {
			get() {
				return this.ver
			},
			set(val) {
				return val
			}
		},
		//是否方形显示
		gridSquare: {
			get() {
				return this.square
			},
			set(val) {
				return val
			}
		},
		//点击背景是否高亮
		gridHighlight: {
			get() {
				return this.highlight
			},
			set(val) {
				return val
			}
		}
	},
	data() {
		return {}
	},
	methods: {
		_change(data) {
			this.$emit('change', data)
		}
	}
}
</script>

<style>
</style>