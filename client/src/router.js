import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'

import Home from 'vuejs/views/home.vue'
import Login from 'vuejs/views/login.vue'
import Visits from 'vuejs/views/visits.vue'
import NoPage from 'vuejs/views/nopage.vue'
import Proposals from 'vuejs/views/proposals.vue'
import Proteins from 'vuejs/views/proteins.vue'
import Dewars from 'vuejs/views/registeredDewars.vue'
// import Feedback from 'vuejs/views/feedback/feedback.vue'

const Feedback = () => import(/* webpackChunkName: "group-feedback" */ 'vuejs/views/feedback/feedback.vue')


import VShipmentRoutes from 'vuejs/views/shipment/routes.js'
import ContactRoutes from 'vuejs/views/contacts/routes.js'
import {routes as CalendarRoutes} from 'modules/calendar/vue-routes.js'

import {routes as LegacyRoutes} from 'modules/contact/vue-routes.js'
import {routes as ProposalRoutes} from 'modules/proposal/vue-routes.js'
import {routes as FeedbackRoutes} from 'modules/feedback/vue-routes.js'
import {routes as TutorialRoutes} from 'modules/docs/vue-routes.js'

import ShipmentRoutes from 'modules/shipment/vue-routes.js'
import AdminRoutes from 'modules/admin/routes.js'
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
]

let router = new Router({
  mode: 'history',
  routes: routes,
})

// Route we will move into their own files
let asyncRoutes = [
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
console.log("ROUTER IMPORTED")

router.addRoutes(asyncRoutes)
router.addRoutes(VShipmentRoutes)
router.addRoutes(ContactRoutes)
router.addRoutes(CalendarRoutes())
router.addRoutes(LegacyRoutes())
router.addRoutes(ProposalRoutes())
router.addRoutes(FeedbackRoutes())
router.addRoutes(TutorialRoutes())
router.addRoutes(ShipmentRoutes)
router.addRoutes(AdminRoutes)

let application = MarionetteApplication.getInstance()

application.initRouteMapping(router)

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
}
  
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) { next('/nopage?url='+to.fullPath); return }
  if (to.path === '/nopage') { next(); return }
  if (to.path === '/') { next(); return }
  if (to.path === '/login' && !to.query.redirect) { next(); return }

  console.log("router.beforeEach to: " + to.path + ", from: " + from.path + ", redirect: " + to.query.redirect)
  console.log("router query params... " + JSON.stringify(to.query))

  store.dispatch('check_auth').then(function(authenticated) {
    if (!authenticated) {
      console.log("Router thinks we are not authenticated for path " + to.path)
    
      if (to.query['ticket']) {
        console.log('Detected CAS redirect')
        next('/nopage?url=' + to.fullPath)
      } else {
          console.log('router.beforeEach redirecting to login to: ' + to.path + ', from: ' + from.path)
          // This helps us redirect to a url if we are not logged in
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })  
        }  
      } else {
        // Check if we should extract proposal from url
        var prop = parseQuery(to.path)
      
        if (prop) store.commit('set_proposal', prop)
     
        store.dispatch('log', to.path)
      
        console.log("router.beforeEach user already logged in")

        next()
    }
  })
})

export default router