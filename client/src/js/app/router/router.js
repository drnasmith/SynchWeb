/*
* This is the main router using vue-router
*
* Core routes are added first, then we load other modules getting their routes array.
* Routes should be specified in a modules/<name>/routes.js file.
* In principle we could automatically add these routes for each modules, however we may want to configure them manually.
* Dynamic loading modules can be done using syntax like:
* const Feedback = () => import(/* webpackChunkName: "group-feedback" *\/ 'app/views/feedback/feedback.vue')
*/
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store.js'

import MarionetteApplication from 'app/views/marionette/singleton.js'

import Home from 'app/views/home.vue'
import Login from 'app/views/login.vue'
import Visits from 'app/views/visits.vue'
import NoPage from 'app/views/nopage.vue'
import Proposals from 'app/views/proposals.vue'
import Proteins from 'app/views/proteins.vue'
import Dewars from 'app/views/registeredDewars.vue'
// import Feedback from 'app/views/feedback/feedback.vue'

// How you can dynamically import a child component
const Feedback = () => import(/* webpackChunkName: "group-feedback" */ 'app/views/feedback/feedback.vue')

import VShipmentRoutes from 'app/views/shipment/routes.js'
import VContactRoutes from 'app/views/contacts/routes.js'
import CalendarRoutes from 'modules/calendar/routes.js'

import ContactRoutes from 'modules/contact/routes.js'
import ProposalRoutes from 'modules/proposal/routes.js'
import TutorialRoutes from 'modules/docs/routes.js'

import FeedbackRoutes from 'modules/feedback/routes.js'
import ShipmentRoutes from 'modules/shipment/routes.js'
import AdminRoutes from 'modules/admin/routes.js'
import DCRoutes from 'modules/dc/routes.js'
import StatsRoutes from 'modules/blstats/routes.js'
import ProjectRoutes from 'modules/projects/routes.js'


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
    name: 'nopage',
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

// Loading all the modules routes
router.addRoutes(asyncRoutes)
router.addRoutes(VShipmentRoutes)
router.addRoutes(ContactRoutes)
router.addRoutes(CalendarRoutes)
router.addRoutes(ContactRoutes)
router.addRoutes(ProposalRoutes)
router.addRoutes(TutorialRoutes)
router.addRoutes(FeedbackRoutes)
router.addRoutes(ShipmentRoutes)
router.addRoutes(DCRoutes)
router.addRoutes(StatsRoutes)
router.addRoutes(ProjectRoutes)
router.addRoutes(AdminRoutes)

// Hook the marionette navigation methods into vue-router methods
let application = MarionetteApplication.getInstance()

application.initRouteMapping(router)

// Function to extract the proposal from a path
// Used when users navigate via typing in an address directly
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

/*
* Main Router guard
*/
router.beforeEach((to, from, next) => {
  console.log("Router beforeEach " + to.path)
  if (to.matched.length === 0) { next('/nopage?url='+to.fullPath); return }
  if (to.path === '/nopage') { next(); return }
  if (to.path === '/') { next(); return }
  if (to.path === '/login' && !to.query.redirect) { next(); return }

  // console.log("router.beforeEach to: " + to.path + ", from: " + from.path + ", redirect: " + to.query.redirect)
  // console.log("router query params... " + JSON.stringify(to.query))

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
      
        next()
    }
  })
})

export default router