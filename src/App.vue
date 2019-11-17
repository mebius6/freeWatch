<script>
export default {
	onLaunch() {
		console.log('App Launch')
	},

	async onShow() {
		await this.$store.dispatch('get245BtHeader')
		// let res = await this.api.get245BtHeader().catch(err => {
		// 	console.log(['bterr', err])
		// })
		// console.log(['btres', res])
	},
	onHide() {}
}
</script>

<style>
/*每个页面公共css */
</style>
