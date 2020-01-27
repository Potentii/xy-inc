<template>
	<div class="v-root">

		<router-view class="-route"></router-view>

	</div>
</template>



<script>
export default {

   name: 'v-root'

}
</script>



<style>
.v-root{

   /**
    * Material colors
    */
	--m-red-a400: #FF1744;

	--m-blue-500: #2196F3;

	--m-green-a400: #00E676;

   --m-grey-50: #FAFAFA;
   --m-grey-100: #F5F5F5;
   --m-grey-200: #EEEEEE;
   --m-grey-300: #E0E0E0;
   --m-grey-400: #BDBDBD;
   --m-grey-500: #9E9E9E;
   --m-grey-600: #757575;
   --m-grey-700: #616161;
   --m-grey-800: #424242;
   --m-grey-900: #212121;

   /**
    * Theme colors
    */
   /* Blank */
   --blank-bg--base: var(--m-grey-50);
   --blank-fg--base: var(--m-grey-900);
   --blank-ic--base: var(--m-grey-700);

   /* Text selection */
   --selection-bg: var(--m-grey-800);
   --selection-fg: var(--m-grey-100);


	display: flex;
	flex-direction: column;

   width: 100%;
   height: 100%;

   background-color: var(--blank-bg--base);
	color: var(--blank-fg--base);

	font-family: 'Roboto', sans-serif;
   font-size: 16px;
	letter-spacing: 0.05em;
   -webkit-font-smoothing: antialiased;

	overflow: hidden;
	scroll-behavior: smooth;
}



/**
 * Material icons
 */
.v-root .material-icons{
	color: var(--blank-ic--base);
   font-display: swap;
}



/**
 * Text selection
 */
.v-root ::selection{
   background-color: var(--selection-bg);
   color: var(--selection-fg);
   text-shadow: inherit;
}



.v-root .--thin-scroll{
	scrollbar-width: thin;
}
.v-root .--thin-scroll::-webkit-scrollbar-track{
	border-radius: 6px;
	background-color: rgba(0,0,0,0.1);
}
.v-root .--thin-scroll::-webkit-scrollbar{
	width: 6px;
	height: 6px;
	/*background-color: var(--m-grey-100);*/
}
.v-root .--thin-scroll.--thin-scroll-2::-webkit-scrollbar{
	width: 10px;
	height: 10px;
}
.v-root .--thin-scroll::-webkit-scrollbar-thumb{
	border-radius: 6px;
	background-color: rgba(0,0,0,0.15);
}
</style>
