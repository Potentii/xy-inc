<template>
	<div
		class="v-marker-on-map"
		:style="{
			'--var-pos-x': marker.x * grid_size + 'px',
			'--var-pos-y': marker.y * grid_size + 'px',
			'--var-radius': radius * grid_size + 'px'
		}">

		<div class="-central-point"></div>

		<div class="-area"></div>
		<div class="-area-loading" v-if="$states.is('searching')"></div>
		<div class="-border"></div>

		<div class="-marker-container">
			<div class="-marker"></div>
		</div>

	</div>
</template>



<script>
import Marker  from './marker/marker';
import POIRoot from './poi/poi-root';



export default {

	name: 'v-marker-on-map',

	props: {

		marker: {
			type: Marker,
			required: true,
		},

		radius: {
			type: Number,
			required: true,
		},

		grid_size: {
			type: Number,
			required: true,
		},

	},


	watch: {

		radius: {
			async handler(radius){
				this.$states.add('searching');
				setTimeout(async () => {
					if(this.radius == radius){
						await this.search();
						this.$states.remove('searching');
					}
				}, 100);
			},
			immediate: true
		},

	},


	methods: {
		async search(){
			const pois_in_area = await POIRoot.getByProximity(this.marker.x, this.marker.y, this.radius);
			this.$emit('proximity', pois_in_area);
		}
	},
}
</script>



<style>
.v-marker-on-map{
	--var-color: var(--m-blue-500);
	--var-size: 18px;

	--var-pos-x: 0px;
	--var-pos-y: 0px;

	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;

	bottom: var(--var-pos-y);
	left: var(--var-pos-x);

	transform: translate(-50%, 50%);
	z-index: 5;
}

.v-marker-on-map > .-central-point{
	opacity: 0.6;
	width: var(--var-size);
	height: var(--var-size);
	border-radius: 50%;
	background-color: var(--var-color);
	transform: scaleY(0.4);
}


@keyframes v-marker-on-map--inflate{
	from{
		transform: scale(0);
	}
}
@keyframes v-marker-on-map--inflate-loading{
	from{
		opacity: 0.2;
		transform: scale(0);
	}
	to{
		opacity: 0;
	}
}


/**
 * Circle area
 */
.v-marker-on-map > .-area,
.v-marker-on-map > .-area-loading{
	opacity: 0.1;
	position: absolute;
	width: calc(var(--var-radius) * 2);
	height: calc(var(--var-radius) * 2);
	border-radius: 50%;
	background-color: var(--var-color);
}

.v-marker-on-map > .-area{
	animation-name: v-marker-on-map--inflate;
	animation-duration: 0.2s;
	animation-timing-function: ease;
}


/**
 * Circle area loading
 */
.v-marker-on-map > .-area-loading{
	animation-name: v-marker-on-map--inflate-loading;
	animation-duration: 3s;
	animation-timing-function: ease-out;
	animation-iteration-count: infinite;
}



/**
 * Border
 */
.v-marker-on-map > .-border{
	opacity: 0.5;
	position: absolute;
	width: calc(var(--var-radius) * 2);
	height: calc(var(--var-radius) * 2);
	border-radius: 50%;
	border: 3px solid var(--var-color);

	animation-name: v-marker-on-map--inflate;
	animation-duration: 0.2s;
	animation-timing-function: ease;
}



.v-marker-on-map > .-marker-container{
	position: absolute;
	width: max-content;
	height: max-content;
	transform: translateY(calc(-50% + 2px));
	z-index: 2;
}
.v-marker-on-map > .-marker-container > .-marker{
	width: 2rem;
	height: 2rem;
	background-image: url('./@resources/images/marker.svg');
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;

	animation-name: v-marker-on-map--marker-bounce;
	animation-duration: 1.3s;
	animation-timing-function: ease-out;
	animation-iteration-count: infinite;
}

@keyframes v-marker-on-map--marker-bounce{
	0%{
		transform: translateY(0);
	}
	50%{
		transform: translateY(-30%);
	}
}
</style>
