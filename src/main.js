import Vue from 'vue';

import VueMeta from 'vue-meta';
import VueKonva from 'vue-konva';
import App from './App.vue';

Vue.use(VueMeta);
Vue.use(VueKonva);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
