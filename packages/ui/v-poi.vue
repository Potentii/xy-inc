<template>
	<div
		class="v-poi"
		:class="{
			'--active': active,
		}"
		:style="{
			'--var-pos-x': poi_vo.x * grid_size + 'px',
			'--var-pos-y': poi_vo.y * grid_size + 'px',
		}">

		<div class="-area"></div>
		<div class="-central-point"></div>
		<div class="-border"></div>

		<div class="-name">
			<span class="-value">{{ poi_vo.name }}</span>
		</div>

	</div>
</template>



<script>
import POIVO from '@xy-inc/common/poi-vo';



export default {

	name: 'v-poi',


	components: { },

	props: {

		poi_vo: {
			type: POIVO,
			required: true,
		},

		grid_size: {
			type: Number,
			required: true,
		},

		active: {
			type: Boolean,
			required: false,
			default: false,
		}

	},
}
</script>



<style>
.v-poi{
	--var-color: var(--m-blue-500);
	--var-size: 2.3em;

	--var-pos-x: 0px;
	--var-pos-y: 0px;

	opacity: 0.8;
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;

	bottom: var(--var-pos-y);
	left: var(--var-pos-x);

	transform: translate(-50%, 50%);
	z-index: 4;
}

.v-poi:hover,
.v-poi.--active{
	opacity: 1;
	z-index: 6;
}



/**
 * Point
 */
.v-poi > .-central-point{
	width: 9px;
	height: 9px;
	border-radius: 50%;
	background-color: var(--var-color);
	box-shadow: 0 0 8px -1px rgba(3,169,244,0.7);
	transition: transform 0.2s ease;
}
.v-poi:hover > .-central-point,
.v-poi.--active > .-central-point{
	transform: scale(1.4);
}


/**
 * Circle area
 */
.v-poi > .-area{
	pointer-events: none;
	visibility: hidden;
	opacity: 0;
	position: absolute;
	width: var(--var-size);
	height: var(--var-size);
	border-radius: 50%;
	background-color: var(--var-color);
	transition: opacity, visibility, 0.4s ease;
}
.v-poi:hover > .-area,
.v-poi.--active > .-area{
	visibility: visible;
	opacity: 0.2;
	transition: opacity 0.2s ease;
}



/**
 * Border
 */
.v-poi > .-border{
	pointer-events: none;
	visibility: hidden;
	opacity: 0;
	position: absolute;
	width: var(--var-size);
	height: var(--var-size);
	border-radius: 50%;
	border: 2px solid var(--var-color);
	transition: opacity, visibility, 0.4s ease;
}
.v-poi:hover > .-border,
.v-poi.--active > .-border{
	visibility: visible;
	opacity: 0.7;
	transition: opacity 0.2s ease;
}



/**
 * Name tag
 */
.v-poi > .-name{
	visibility: hidden;
	opacity: 0;
	position: absolute;
	width: max-content;
	right: calc(calc(var(--var-size) / -2) - 0.5em);
	transform: translateX(calc(100% - 0.8em));
	padding: 0.5em 1.2em;
	background-color: var(--m-grey-50);
	border-radius: 5em;
	box-shadow: 0 4px 3px -1px rgba(0,0,0,0.2);
	transition: opacity, visibility, transform, 0.2s ease;
}
.v-poi > .-name > .-value{
	display: inline-flex;
	align-items: center;
	font-family: 'Roboto', sans-serif;
	color: var(--m-grey-800);
	font-size: 14px;
	letter-spacing: 0.08em;
}
.v-poi:hover > .-name{
	visibility: visible;
	opacity: 1;
	transform: translateX(100%);
	transition: opacity, transform, 0.2s ease;
}
</style>
