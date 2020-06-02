var Styles = require('css/main.css')
var FontAwesome = require('font-awesome/css/font-awesome.css')
  
import Vue from 'vue'
import Vuelidate from 'vuelidate'

import App from './App.vue'
import store from './store/store'
import router from './router/router'

import MarionetteApp from './views/marionette/singleton.js'

Vue.config.productionTip = false

Vue.use(Vuelidate)

const vm = new Vue({
  store,
  router,
  render: h => h(App),
  created: function() {
    console.log("Vue INSTANCE CREATED")

    this.$store.dispatch('initialise').then(function(val) {
      console.log("Vue Instance WAITED FOR STORE INITIALISE: " + val)
    }, function(val) {
      console.log("Vue Instance WAITED FOR STORE INITIALISE: " + val)
    })
    
    console.log("Vue Instance Starting Marionette Application")
    // Start the Marionette application
    let application = MarionetteApp.getInstance()
  
    application.start()
  },
}).$mount('#synchweb-app')

// For testing purposes....
if (window.Cypress) {
  window.vm = vm
}
