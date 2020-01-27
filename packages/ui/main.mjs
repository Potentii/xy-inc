import Vue    from 'vue'
import VState from 'v-state'

import store  from './store'
import router from './router'
import VRoot  from './v-root'

Vue.config.productionTip = process.env.NODE_ENV === 'development';
Vue.config.performance = process.env.NODE_ENV === 'development';

Vue.use(VState);

new Vue({
   router,
   store,
   render: h => h(VRoot)
}).$mount('#app');
