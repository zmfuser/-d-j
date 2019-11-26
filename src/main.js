import Vue from 'vue'
import iView from 'iview'
import EasySlider from 'vue-easy-slider'
import App from './App.vue'
import router from './router'
import store from './store/index'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
 

// import { Table, Button, Select, Input, Pagination, TableColumn, Form, FormItem, Option, Cascader, DatePicker, Steps, Step, Scrollbar, Upload, Icon, Image } from "element-ui"
// import 'element-ui/lib/theme-chalk/index.css';
import './axios.config'

import 'iview/dist/styles/iview.css'
import '@/styles/theme.less'
import '@/styles/global.less'

import '@babel/polyfill';

Vue.config.productionTip = false

Vue.use(iView);
Vue.use(EasySlider);

Vue.use(ElementUI)

// Vue.use(Table);
// Vue.use(Button);
// Vue.use(Select);
// Vue.use(Input);
// Vue.use(Pagination);
// Vue.use(TableColumn);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Option);
// Vue.use(Cascader);
// Vue.use(DatePicker);
// Vue.use(Steps);
// Vue.use(Step);
// Vue.use(Scrollbar);
// Vue.use(Upload);
// Vue.use(Icon);
// Vue.use(Image)

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach(route => {
    window.scrollTo(0, 0);
    iView.LoadingBar.finish();
});

window.$eventBus = new Vue();

window.$app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
