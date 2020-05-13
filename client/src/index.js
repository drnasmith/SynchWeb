var Styles = require('./css/main.css')
var FontAwesome = require('font-awesome/css/font-awesome.css')
  
import Vue from 'vue'
import Vuelidate from 'vuelidate'

import App from './js/vuejs/App.vue'
import router from './router'
import store from './store'

import MarionetteApp from './js/vuejs/views/marionette/singleton.js'


Vue.config.productionTip = false

Vue.use(Vuelidate)

const vm = new Vue({
  router,
  store,
  render: h => h(App),
  created: function() {
    console.log("Vue INSTANCE CREATED")

    this.initMarionette()
  },
  methods: {
    initMarionette: function() {
      let application = MarionetteApp.getInstance()

      application.start()
    },
  }
}).$mount('#synchweb-app')
