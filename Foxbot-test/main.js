import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false 

import popWindow from './wxcomponents/uni-popup/uni-popup.vue'
import transition from './wxcomponents/uni-transition/uni-transition.vue'
import forms from './wxcomponents/uni-forms/uni-forms.vue'
import formsItem from './wxcomponents/uni-forms-item/uni-forms-item.vue'
import formsGrounp from './wxcomponents/uni-group/uni-group.vue'
import easyinput from './wxcomponents/uni-easyinput/uni-easyinput.vue'
import icons from './wxcomponents/uni-icons/uni-icons.vue'
import dialog from './wxcomponents/uni-popup-dialog/uni-popup-dialog.vue'
import swiper from './wxcomponents/uni-swiper-dot/uni-swiper-dot.vue'
import tag from './wxcomponents/uni-tag/uni-tag.vue'
import indexedList from './wxcomponents/uni-indexed-list/uni-indexed-list.vue'
import calendar from './wxcomponents/uni-calendar/uni-calendar.vue'
Vue.component('uni-popup',popWindow);
Vue.component('uni-transition',transition);
Vue.component('uni-forms',forms);
Vue.component('uni-forms-item',forms);
Vue.component('uni-group',formsGrounp); 
Vue.component('uni-easyinput',easyinput); 
Vue.component('uni-icons',icons); 
Vue.component('uni-popup-dialog',dialog); 
Vue.component('uni-swiper-dot',swiper); 
Vue.component('uni-tag',tag); 
Vue.component('uni-indexed-list',indexedList); 
Vue.component('uni-calendar',calendar); 

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
