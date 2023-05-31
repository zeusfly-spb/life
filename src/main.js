import Vue from 'vue'
import App from './App.vue'

import VueMeta from 'vue-meta';
import VueKonva from 'vue-konva';

import vueHeadful from 'vue-headful';
Vue.component('vue-headful', vueHeadful);

Vue.use(VueMeta);
Vue.use(VueKonva);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app')
