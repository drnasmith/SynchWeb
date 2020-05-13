import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'

import MarionetteApp from 'vuejs/views/marionette/singleton.js'

import Home from 'vuejs/views/home.vue'
import Login from 'vuejs/views/login.vue'
import Visits from 'vuejs/views/visits.vue'
import NoPage from 'vuejs/views/nopage.vue'
import Proposals from 'vuejs/views/proposals.vue'
import Proteins from 'vuejs/views/proteins.vue'
import Dewars from 'vuejs/views/registeredDewars.vue'
import Feedback from 'vuejs/views/feedback/feedback.vue'

import ShipmentRoutes from 'vuejs/views/shipment/routes.js'
import ContactRoutes from 'vuejs/views/contacts/routes.js'
import {routes as CalendarRoutes} from 'modules/calendar/vue-routes.js'

import {routes as LegacyRoutes} from 'modules/contact/vue-routes.js'
import {routes as ProposalRoutes} from 'modules/proposal/vue-routes.js'
import {routes as FeedbackRoutes} from 'modules/feedback/vue-routes.js'
import {routes as TutorialRoutes} from 'modules/docs/vue-routes.js'
import MarionetteApplication from './js/vuejs/views/marionette/singleton.js'

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/ispyb/ispyb',
    name: 'ispybHome',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    props: true, // this will mean redirect query also passed to login as prop
    component: Login,
  },
  {
    path: '/nopage',
    name: 'nothing',
    component: NoPage,
    props: route => ({url: route.query.url})
  },
  {
      path: '/vuevisits',
      name: 'visits',
      component: Visits
  },
  {
      path: '/vueproposals',
      name: 'proposals',
      component: Proposals,
      meta: { 
        requiresAuth: true // For testing with secure routes below
      }
  },
  {
    path: '/proteins',
    name: 'proteins',
    component: Proteins,
  },
  {
    path: '/dewars',
    name: 'dewars',
    component: Dewars,
  },
  {
    path: '/vuefeedback',
    name: 'feedback',
    component: Feedback,
  },
]

let router = new Router({
  mode: 'history',
  routes: routes,
  initialised: false
})

router.addRoutes(ShipmentRoutes)
router.addRoutes(ContactRoutes)
router.addRoutes(CalendarRoutes())
router.addRoutes(LegacyRoutes())
router.addRoutes(ProposalRoutes())
router.addRoutes(FeedbackRoutes())
router.addRoutes(TutorialRoutes())

var parseQuery = function(path) {
  var str = path.replace(/\?/, '').split(/&/)
  var pairs = {}
  _.each(str, function(v) {
      var kv = v.split(/=/)
      pairs[kv[0]] = kv[1]
  })

  console.log('pairs', pairs)

  if ('prop' in pairs) {
    return pairs.prop
  }
  // sessionStorage.setItem('prop', pairs.prop)
}
  
// Make sure the store is initialised when its imported
store.dispatch('initialise').then(() => {
  
  // Everything is protected apart from / and /login
  router.beforeEach((to, from, next) => {
    console.log("router.beforeEach to: " + to.path + ", from: " + from.path)
    console.log("router.beforeEach to.redirect: " + to.query.redirect)
    console.log("router query params... " + JSON.stringify(to.query))
  
    if (to.query['ticket'] && store.state.sso) {
      // Redirecting from CAS login...
      console.log("Redirecting from CAS Login for Single Sign on")
  
    }
  
    if (to.matched.length === 0) {
      console.log("Page Not Found " + to.fullPath)
      var url = '/nopage?url=' + to.path
      next(url)
    }
  
    // Check if we should extract proposal from url
    var prop = parseQuery(to.path)
  
    if (prop) {
      store.commit('save_proposal', prop)
    }
  
    store.dispatch('log', to.path)
  
    // Are we authenticated
    if ( ! store.state.token ) {
      // If we are on the main page or a login page that's ok 
      if (to.path === '/' || to.path === '/login') {
        console.log("router.beforeEach normal navigation to login")
        next()
      } else {
        console.log('router.beforeEach redirecting to login to: ' + to.path + ', from: ' + from.path)
        // next({
        //   path: '/login',
        //   query: { redirect: to.fullPath }
        // })  
        next()
      }
    } else {
      console.log("router.beforeEach user already logged in")
      next()
    }
  })
  
  router.afterEach((to, from) => {
    // If we have been redirected to the login page, go back to the referrer
    if (to.path === '/login' && from.path !== '/') {
      console.log("Router.afterEach login redirect...")
    }
  })
  
  let application = MarionetteApplication.getInstance()
  
  application.initRouteMapping(router)

})



export default router