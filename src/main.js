import Vue from 'vue'
import App from './App.vue'
import vueTap from 'v-tap';
import Toast from 'vue2-toast';
import 'vue2-toast/lib/toast.css';

Vue.config.productionTip = false
Vue.use(vueTap)
Vue.use(Toast);

const app =  new Vue({
  render: h => h(App)
}).$mount('#app')

export default app