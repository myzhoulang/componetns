import Vue from 'vue';
import ViewUI from 'view-design';

import App from './App.vue';
import 'view-design/dist/styles/iview.css';

import EditTableCell from '@/components/EditTableCell';

Vue.use(ViewUI);
Vue.use(EditTableCell);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
