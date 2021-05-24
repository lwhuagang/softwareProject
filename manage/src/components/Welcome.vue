<template>
	<div class="demo-image">
		<div class="block" >
			<span class="demonstration">小程序二维码</span>
			<img src="../assets/app.png" class="appImg"/>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				fits: ['fill'],
			}
		}
	}
</script>

<style scoped>
	.block{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.appImg{
		width: 500px;
		height: 500px
	}
	.demonstration{
		margin-bottom: 50px;
		font-size: large;
	}
</style>
