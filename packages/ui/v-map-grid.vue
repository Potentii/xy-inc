<template>
	<div class="v-map-grid" @drop="$emit('drop', $event)">

		<div class="-bar -hor" :style="{ '--var-offset': i*grid_size + 'px' }" v-for="i in h_grids"></div>
		<div class="-bar -ver" :style="{ '--var-offset': i*grid_size + 'px' }" v-for="i in v_grids"></div>

	</div>
</template>



<script>
export default {

	name: 'v-map-grid',


	props: {

		grid_size: {
			type: Number,
			required: true,
		}

	},


	data(){
		return {
			h_grids: 0,
			v_grids: 0,
		};
	},


	mounted(){
		setTimeout(() => {
			this.$nextTick(() => {
				const width = this.$el.offsetWidth;
				const height = this.$el.offsetHeight;
				this.v_grids = Math.floor(width / this.grid_size);
				this.h_grids = Math.floor(height / this.grid_size);
			});
		}, 500);
	},
}
</script>



<style>
.v-map-grid{
	opacity: 0.03;
	position: absolute;

	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}
.v-map-grid > .-bar{
	position: absolute;
	background-color: #000;
}
.v-map-grid > .-bar.-hor{
	left: 0;
	bottom: var(--var-offset);
	width: 100%;
	height: 2px;
}
.v-map-grid > .-bar.-ver{
	left: var(--var-offset);
	bottom: 0;
	width: 2px;
	height: 100%;
}
</style>
