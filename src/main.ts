import { createSSRApp } from 'vue';
import App from './App.vue';

import pinia from './store';
import * as VantUI from 'vant';

import 'vant/lib/index.css';

export function createApp() {
  const app = createSSRApp(App);
  app.use(VantUI);
  app.use(pinia);
  return {
    app,
  };
}
