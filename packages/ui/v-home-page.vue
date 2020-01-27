<template>
	<div class="v-home-page">

		<div class="-map" :class="{ '--dragging': dragging_marker }">


			<!-- * POI insert form * -->
			<transition name="-fade" :duration="{ enter: 300, leave: 300 }">

				<div class="-poi-insert" v-if="show_form">

					<form class="-form" @submit.prevent="insert_onSubmit">

						<div class="-name">
							<input class="-input" type="text" v-model="form.name" placeholder="New POI name" spellcheck="false" required/>
						</div>


						<button class="-action -cancel" type="button" @click="dismissForm_onClick" title="Dismiss">
							<i class="-icon material-icons">close</i>
						</button>


						<button class="-action -ok" type="submit" title="Create new POI">
							<i class="-icon material-icons">done</i>
						</button>

					</form>

				</div>

			</transition>



			<!-- * Marker radius form * -->
			<transition name="-fade" :duration="{ enter: 300, leave: 300 }">

				<div class="-marker-radius-container" v-if="show_marker_radius">

					<div class="-marker-radius">

						<input class="-radius-in" type="range" min="0" max="50" step="1" orient="vertical" v-model="marker_radius">

						<span class="-radius-out">{{ marker_radius }}m</span>

					</div>

				</div>

			</transition>



			<!-- * Map viewport * -->
			<div class="-viewport" @dragover="map_onDragOver($event)">

				<div class="-draggable" ref="map" @click="map_onClick">

					<!-- * The map image * -->
					<img class="-map-img" width="1700" height="1260" src="./@resources/images/map.svg">


					<!-- * The map grid * -->
					<v-map-grid class="-grid" :grid_size="grid_size"></v-map-grid>


					<!-- * All the POIs in the map * -->
					<v-poi
						class="-poi"
						:key="poi._id"
						:poi_vo="poi"
						:grid_size="grid_size"
						:active="pois_in_proximity.some(p => p._id == poi._id)"
						v-for="poi in poi_vos">
					</v-poi>


					<!-- * Drop zone overlay (only when dragging) * -->
					<div class="-drop-zone" ref="drop_zone" v-if="dragging_marker" @drop="map_onDrop($event)"></div>


					<!-- * Marker on map (only when placed) * -->
					<v-marker-on-map
						class="-marker"
						v-if="marker"
						:grid_size="grid_size"
						:radius="marker_radius"
						:marker="marker"
						@proximity="marker_onProximity($event)">
					</v-marker-on-map>

				</div>

			</div>


			<!-- * Footer with the action buttons * -->
			<footer class="-footer">

				<!-- * The marker button * -->
				<div class="-pin" title="Drag and drop the marker on map">
					<div class="-plane"></div>
					<div
						class="-marker-container"
						draggable="true"
						@dragstart="marker_onDragStart($event)"
						@dragend="marker_onDragEnd($event)">
						<div class="-marker"></div>
					</div>

				</div>

			</footer>

		</div>

	</div>
</template>



<script>
import VPoi         from './v-poi';
import POIRoot      from './poi/poi-root';
import VMapGrid     from './v-map-grid';
import VMarkerOnMap from './v-marker-on-map';
import Marker       from './marker/marker';
import POIVO        from '@xy-inc/common/poi-vo';



export default {

	name: 'v-home-page',


	components: { VMarkerOnMap, VMapGrid, VPoi },


	data(){
		return {
			poi_vos: [],
			grid_size: 15,

			dragging_marker: false,
			marker: null,

			marker_radius: 12,

			pois_in_proximity: [],

			map_height: 0,

			show_form: false,

			show_marker_radius: false,

			form: {
				name: '',
			}
		};
	},


	async beforeMount(){
		await this.updateAllPOIs();
	},


	mounted(){
		setTimeout(() => {
			this.$nextTick(() => {
				this.map_height = this.$refs.map.offsetHeight;
			});
		}, 500);
		// *Updating the height:
		setInterval(() => this.map_height = this.$refs.map.offsetHeight, 4000);
	},




	methods: {

		async updateAllPOIs(){
			this.poi_vos = await POIRoot.getAll();
		},


		marker_onDragStart(e){
			this.show_marker_radius = false;
			this.show_form = false;
			this.marker = null;
			this.dragging_marker = true;
			this.pois_in_proximity = [];
		},

		marker_onDragEnd(e){
			this.dragging_marker = false;
		},


		map_onDrop(e){
			this.marker = new Marker(Math.round(e.offsetX / this.grid_size), Math.round((this.map_height - e.offsetY) / this.grid_size));

			this.form.name = '';
			this.show_form = true;
			this.show_marker_radius = true;
		},


		map_onDragOver(e){
			e.preventDefault();
		},


		map_onClick(){
			this.marker = null;
			this.form.name = '';
			this.show_form = false;
			this.show_marker_radius = false;
			this.pois_in_proximity = [];
		},


		marker_onProximity(pois_in_area){
			if(Array.isArray(pois_in_area))
				this.pois_in_proximity = pois_in_area;
			else
				this.pois_in_proximity = [];
		},


		dismissForm_onClick(){
			this.show_form = false;
		},


		async insert_onSubmit(){
			if(this.form.name && this.form.name.trim() && this.marker){
				await POIRoot.insert(new POIVO(null, this.form.name, this.marker.x, this.marker.y));
				await this.updateAllPOIs();
				this.marker = null;
				this.pois_in_proximity = [];
				this.form.name = '';
				this.show_form = false;
				this.show_marker_radius = false;
			}
		},

	},
}
</script>



<style>
.v-home-page{
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}

.v-home-page > .-map{
	display: grid;
	justify-content: center;
	grid-template-columns: auto;
	grid-template-rows: auto 1fr auto;
	grid-template-areas:
		'insert'
		'...'
		'footer';

	width: 100%;
	height: 100%;
}
.v-home-page > .-map > .-poi-insert{
	grid-area: insert;
}
.v-home-page > .-map > .-footer{
	grid-area: footer;
}




/**
 * Insert form
 */
.v-home-page > .-map > .-poi-insert{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 1.5em;
	padding: 0.8em 1em;
	border-radius: 10em;
	background-color: var(--m-grey-50);
	box-shadow: 0 4px 18px -2px rgba(0,0,0,0.2);
	z-index: 9;
}
.v-home-page > .-map > .-poi-insert.-fade-enter-active{
	animation-name: v-home-page--insert-form-fade-in;
	animation-duration: 0.3s;
	animation-timing-function: ease;
	animation-fill-mode: both;
}
.v-home-page > .-map > .-poi-insert.-fade-leave-active{
	animation-name: v-home-page--insert-form-fade-out;
	animation-duration: 0.3s;
	animation-timing-function: ease;
	animation-fill-mode: both;
}
@keyframes v-home-page--insert-form-fade-in{
	from{
		opacity: 0;
		transform: translateY(-3em);
	}
}
@keyframes v-home-page--insert-form-fade-out{
	to{
		opacity: 0;
		transform: translateY(-3em);
	}
}

.v-home-page > .-map > .-poi-insert > .-form{
	display: flex;
	align-items: center;
	justify-content: center;
}
.v-home-page > .-map > .-poi-insert > .-form > .-name{
	flex: 1 1 auto;
	margin-right: 2em;
	margin-left: 1em;
}
.v-home-page > .-map > .-poi-insert > .-form > .-name > .-input{
	padding: 0.4em 0.6em;
	font-size: 14px;
	font-family: 'Roboto', sans-serif;
	letter-spacing: 0.08em;
}
.v-home-page > .-map > .-poi-insert > .-form:invalid > .-name > .-input{
	color: var(--m-red-a400);
}
.v-home-page > .-map > .-poi-insert > .-form > .-name::after{
	content: '';
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 1px;
	background-color: rgba(0,0,0,0.06);
	transition: background-color 0.2s ease;
}
.v-home-page > .-map > .-poi-insert > .-form > .-name:focus-within::after{
	background-color: rgba(0,0,0,0.16);
}
.v-home-page > .-map > .-poi-insert > .-form:invalid > .-name:focus-within::after{
	background-color: var(--m-red-a400);
}

.v-home-page > .-map > .-poi-insert > .-form > .-action{
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 3em;
	height: 3em;
	border-radius: 50%;
	border: 1px solid var(--m-grey-400);
	transition: border, background-color, 0.2s ease;
}
.v-home-page > .-map > .-poi-insert > .-form > .-action:active{
	background-color: rgba(0,0,0,0.04);
}
.v-home-page > .-map > .-poi-insert > .-form > .-action + .-action{
	margin-left: 1em;
}
.v-home-page > .-map > .-poi-insert > .-form > .-action > .-icon.material-icons{
	color: var(--m-grey-700);
	font-size: 20px;
	transition: color 0.2s ease;
}
.v-home-page > .-map > .-poi-insert > .-form > .-action.-ok{
	--var-accent-color: var(--m-green-a400);
}
.v-home-page > .-map > .-poi-insert > .-form > .-action.-cancel{
	--var-accent-color: var(--m-red-a400);
}

.v-home-page > .-map > .-poi-insert > .-form > .-action:hover{
	border-color: var(--var-accent-color);
}
.v-home-page > .-map > .-poi-insert > .-form > .-action:hover > .-icon.material-icons{
	color: var(--var-accent-color);
}



/**
 * Marker radius controller
 */

.v-home-page > .-map > .-marker-radius-container{
	position: absolute;

	display: flex;
	align-items: center;
	justify-content: center;

	width: max-content;
	height: 100%;
	z-index: 9;
}

.v-home-page > .-map > .-marker-radius-container.-fade-enter-active{
	animation-name: v-home-page--marker-radius-fade-in;
	animation-duration: 0.3s;
	animation-timing-function: ease;
	animation-fill-mode: both;
}
.v-home-page > .-map > .-marker-radius-container.-fade-leave-active{
	animation-name: v-home-page--marker-radius-fade-out;
	animation-duration: 0.3s;
	animation-timing-function: ease;
	animation-fill-mode: both;
}
@keyframes v-home-page--marker-radius-fade-in{
	from{
		opacity: 0;
		transform: translateX(-3em);
	}
}
@keyframes v-home-page--marker-radius-fade-out{
	to{
		opacity: 0;
		transform: translateX(-3em);
	}
}
.v-home-page > .-map > .-marker-radius-container > .-marker-radius{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	padding: 2em 1em;
	margin-left: 1em;

	border-radius: 10em;

	background-color: var(--m-grey-50);
	box-shadow: 0 4px 18px -2px rgba(0,0,0,0.2);
}

.v-home-page > .-map > .-marker-radius-container > .-marker-radius > .-radius-in{
	width: 2em;
	height: 13em;
	-webkit-appearance: slider-vertical;
	writing-mode: bt-lr;
	margin-bottom: 1.4em;
}

.v-home-page > .-map > .-marker-radius-container > .-marker-radius > .-radius-out{
	display: block;
	width: 2.5em;
	font-size: 14px;
	text-align: center;
}




/**
 * Map
 */
.v-home-page > .-map > .-viewport{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: var(--m-grey-50);
}
.v-home-page > .-map > .-viewport > .-draggable{
	position: absolute;
	width: min-content;
	height: min-content;
}
.v-home-page > .-map > .-viewport > .-draggable > .-map-img{
	opacity: 0.6;
	width: 1700px;
	height: 1260px;
	filter: hue-rotate(230deg);
}



/**
 * Drop zone overlay
 */
.v-home-page > .-map > .-viewport > .-draggable > .-drop-zone{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(100,50,180,0.05);
	z-index: 9;
}



.v-home-page > .-map > .-footer{
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 2em;
}



/**
 * Marker button
 */
.v-home-page > .-map > .-footer > .-pin{
	cursor: default;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 4.5rem;
	height: 4.5rem;
	z-index: 10;
}

.v-home-page > .-map > .-footer > .-pin > .-plane{
	position: absolute;
	width: 100%;
	height: 100%;
	background-color: var(--m-grey-100);
	border: 2px solid var(--m-grey-400);

	border-radius: 50%;
	box-shadow:
		0 6px 20px -1px rgba(0,0,0,0.4),
		0 0 50px 20px rgba(255,255,255,0.7);
	transition: background-color, box-shadow, transform,  0.2s ease-in-out;
}
.v-home-page > .-map:not(.--dragging) > .-footer > .-pin:hover > .-plane{
	background-color: var(--m-blue-500);
	box-shadow:
		0 8px 25px -1px rgba(0,0,0,0.4),
		0 0 50px 20px rgba(255,255,255,0.7);
	transform: translateY(40%) scale(0.9, 0.4);
}

.v-home-page > .-map > .-footer > .-pin > .-marker-container{
	cursor: grab;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	transition: opacity, filter, transform, 0.2s ease;
}
.v-home-page > .-map:not(.--dragging) > .-footer > .-pin> .-marker-container:hover{
	animation-name: v-home-page--marker-bounce;
	animation-duration: 0.8s;
	animation-timing-function: ease-out;
	animation-iteration-count: infinite;
}
.v-home-page > .-map.--dragging > .-footer > .-pin > .-marker-container{
	opacity: 0.2;
	filter: grayscale(1);
	transform: scale(0.8);
}
.v-home-page > .-map > .-footer > .-pin > .-marker-container:active{
	cursor: grabbing;
}

.v-home-page > .-map > .-footer > .-pin > .-marker-container > .-marker{
	width: 70%;
	height: 70%;
	background-image: url('./@resources/images/marker.svg');
	background-position: center;
	background-repeat: no-repeat;
	background-size: contain;
}


@keyframes v-home-page--marker-bounce{
	0%{
		transform: translateY(5%) scale(0.9);
	}
	50%{
		transform: translateY(-10%) scale(1.2);
	}
	100%{
		transform: translateY(5%) scale(0.9);
	}
}
</style>
