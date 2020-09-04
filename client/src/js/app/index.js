var Styles = require('css/main.css')
var FontAwesome = require('font-awesome/css/font-awesome.css')
  
import Vue from 'vue'
import Vuelidate from 'vuelidate'

import App from 'js/app/App.vue'
import MaintenanceView from 'js/app/Maintenance.vue'
import store from 'js/app/store/store'
import router from 'js/app/router/router'

import MarionetteApp from 'js/app/views/marionette/singleton.js'

import config from 'js/config.json'

Vue.config.productionTip = false

Vue.use(Vuelidate)

const vm = new Vue({
  store,
  router,
  render: function(h) {
    if (config.maintenance) return h(MaintenanceView, {props: {'message': config.maintenance_message}})
    else return h(App)
  },
  created: function() {
    console.log("Vue INSTANCE CREATED")

    this.$store.dispatch('initialise').then(function(val) {
      console.log("Vue Instance OK WAITED FOR STORE INITIALISE: " + val)
    }, function(val) {
      console.log("Vue Instance Err? WAITED FOR STORE INITIALISE: " + val)
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
