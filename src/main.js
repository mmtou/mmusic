// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import theme from 'muse-ui/lib/theme';
import Loading from 'muse-ui-loading';
import Helpers from 'muse-ui/lib/Helpers';
import axios from 'axios'
import {Encrypt} from "./utils/crypto.js";
import querystring from 'querystring';
import './assets/iconfont/iconfont.js'
import IconSvg from '@/components/iconsvg'
import {post,get} from './utils/http'

Vue.component('iconsvg', IconSvg)

Vue.config.productionTip = false
Vue.use(MuseUI);
Vue.use(Loading);
Vue.use(Helpers);
Vue.prototype.querystring = querystring
Vue.prototype.encrypt = Encrypt
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$http = axios

// 自定义主题
theme.add('red', {
  primary: '#d43c33',
  secondary: '#FFFFFF',
  success: '#4caf50',
  warning: '#ffeb3b',
}, 'light');
theme.use('red');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
