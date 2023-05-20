import Vue from 'vue'
import App from './App.vue'
import VueKonva from 'vue-konva';
import vueHeadful from 'vue-headful';
Vue.component('vue-headful', vueHeadful);

Vue.use(VueKonva);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
