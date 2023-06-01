import { createApp } from 'vue';
import { createMetaManager } from 'vue-meta';

import VueKonva from 'vue-konva';
import App from './App.vue';

const app = createApp(App);
app.use(VueKonva)
  .use(createMetaManager());

app.mount('#app');
