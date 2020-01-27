import Vue       from 'vue'
import VueRouter from 'vue-router'


// *Getting the app's pages:
import HomePage from './v-home-page'


// *Registering vue-router:
Vue.use(VueRouter);

// *Building the router:
const router = new VueRouter({
   mode: 'history',
   routes: [
      { path: '/', name: 'home', component: HomePage }
   ]
});


export default router;
