import DC from 'modules/dc/DC.vue'
import Debug from 'vuejs/views/Debug.vue'

import MarionetteView from 'vuejs/views/marionette/marionette-wrapper.vue'
import MarionetteApplication from 'vuejs/views/marionette/singleton.js'

// Data Collection Marionette Views
import ImageViewer from 'modules/dc/views/imageviewer'
import MapModelViewer from 'modules/dc/views/mapmodelview'
import ReciprocalSpaceViewer from 'modules/dc/views/reciprocalview'
import Summary from 'modules/dc/views/summary'
import APStatusSummary from 'modules/dc/views/apstatussummary'
import SampleChangerView from 'modules/dc/views/samplechangerfull'
import QueueBuilder from 'modules/dc/views/queuebuilder'

import DataCollection from 'models/datacollection'
import DCCol from 'collections/datacollections'
import Visit from 'models/visit'

import store from '../../../store'

// Initialize MarionetteApplication if not already existing
let application = MarionetteApplication.getInstance()

// Use to check if visit model is OK
let visitModel = {}

app.addInitializer(function() {
  application.on('dclist:show', function(visit) {
      if (visit) {
          application.navigate('/dc/visit/'+visit)
          // controller.dc_list(visit)
      } else {
        application.navigate('/dc')
      //   controller.dc_list()
      }
  })
    
  application.on('dc:show', function(type, id, visit) {
      application.navigate('/dc/'+(visit ? ('visit/'+visit) : '') + '/ty/'+type+'/id/'+id)
  //   controller.dc_list(visit, null, null, null, type, id)
  })
})

// appRoutes: {
//     'dc': 'dc_list',
//     'dc(/visit/:visit)(/dcg/:dcg)(/page/:page)(/s/:search)(/ty/:ty)(/id/:id)(/pjid/:pjid)': 'dc_list',
//     'dc/view/id/:id': 'di_viewer',
//     'dc/map/id/:id(/ty/:ty)(/dt/:dt)(/ppl/:ppl)': 'mapmodelviewer',
//     'dc/rsv/id/:id': 'rsviewer',
//     'dc/summary/visit/:visit': 'summary',
//     'dc/apstatussummary/visit/:visit(/ty/:ty)': 'apstatussummary',
//     'dc/sc/visit/:visit': 'sampleChanger',
//     'dc/queue/visit/:visit': 'queue',
// },

function lookupVisit(visit) {
  app.cookie(visit.split('-')[0])

  return new Promise((resolve, reject) => {
      visitModel = new Visit({ VISIT: visit })

      visitModel.fetch({
          // If OK trigger next
          success: function() {
            console.log("Visit model lookup OK")
            resolve(visitModel)
          },
          // Original controller had no error condition...
          error: function() {
              reject({msg: "Visit model lookup failed for " + visit})
          }
      })
  })
}

// Dealing with multiple optional parameters is a pain.
// Capturing multiple string type optional parameters is not as useful with vue-router than it was with marionette.
// The path-to-regexp greedily matches text so optional paths can get merged. Using explicit regex conditions is more reliable.
// Looks as though page is a red herring as its not added to the URL on pagination.
// Search probably has no value with an id (i.e. individual data collection ) or probably dcg either
// The DC component handles the prefetching and proposal lookup in a cleaner method than using marionette wrapper directly
let routes = [
  {
    path: '/dc(/visit/)?:visit([a-zA-Z]{2}[0-9]+-[0-9]+)?(/dcg/)?:dcg([0-9]+)?(/page/)?:page([0-9]+)?(/s/)?:search([a-zA-z0-9_-]+)?(/ty/)?:ty([a-zA-z]+)?(/id/)?:id([0-9]+)?(/pjid/)?:pjid([0-9]+)?',
    component: DC,
    props: (route) => ({
        id: route.params.id || '',
        visit: route.params.visit || '',
        dcg: route.params.dcg || '',
        page: route.params.page || '',
        ty: route.params.ty || '',
        search: route.params.search || '',
        pjid: route.params.pjid || '',
    })
  },
  {
    path: '/dc/view/id/:id',
    component: MarionetteView,
    props: (route) => ({
        mview: ImageViewer,
        breadcrumbs: [{ title: 'Data Collections', url: '/dc' }, {title: 'Diffraction Image View for ' + route.params.id}],
        breadcrumb_hint: 'FILETEMPLATE',
        id: route.params.id || '',
        options: {
          model: new DataCollection({ID: route.params.id})
        }
    }),
    beforeEnter: (to, from, next) => {
      // Call the loading state here because we are finding the proposal based on this contact id
      // Prop lookup sets the proposal and type via set app.cookie method which we mapped to the store
      app.loading()

      store.dispatch('proposal_lookup', {field: 'DATACOLLECTIONID', value: to.params.id}).then((response) => {
        console.log("Lookup OK Prop = " + response.get('PROP'))
        next()
      }), (error) => {
        console.log("Calling next - Error " + error)
        next('/')
      }
    }
  },
  // Map Model Viewer
  // If no ty passed - use dimple as default
  {
    path: '/dc/map/id/:id([0-9]+)(/ty/)?:ty?(/dt/)?:dt?(/ppl/)?:ppl?',
    name: 'mapmodelviewer',
    component: Debug,
    props: (route) => ({
        id: route.params.id || '',
        dt: route.params.dt || '',
        ppl: route.params.ppl || '',
        ty: route.params.ty || 'dimple',
        options: {
          model: new DataCollection({ID: route.params.id}),
          params: { ty: route.params.ty, dt: route.params.dt, ppl: route.params.ppl}
        },
        mview: MapModelViewer,
    }),
    beforeEnter: (to, from, next) => {
      // Call the loading state here because we are finding the proposal based on this contact id
      // Prop lookup sets the proposal and type via set app.cookie method which we mapped to the store
      app.loading()

      store.dispatch('proposal_lookup', {field: 'DATACOLLECTIONID', value: to.params.id}).then((response) => {
        console.log("Lookup OK Prop = " + response.get('PROP'))
        next()
      }), (error) => {
        console.log("Calling next - Error, no proposal found")
        next('/')
      }
    }
  },
  {
    path: '/dc/rsv/id/:id([0-9]+)',
    name: 'rsviewer',
    component: MarionetteView,
    props: (route) => ({
        id: route.params.id || '',
        mview: ReciprocalSpaceViewer,
        breadcrumbs: [
          { title: 'Data Collections', url: '/dc' },
          // { title: app.prop+'-'+dc.get('VN'), url: '/dc/visit/'+app.prop+'-'+dc.get('VN') },
          { title: 'Reciprocal Space Viewer' },
        ],
        breadcrumb_hint: 'FILETEMPLATE',
        options: {
          model: new DataCollection({ID: route.params.id}),
        }
    }),
    beforeEnter: (to, from, next) => {
      // Call the loading state here because we are finding the proposal based on this contact id
      // Prop lookup sets the proposal and type via set app.cookie method which we mapped to the store
      app.loading()

      store.dispatch('proposal_lookup', {field: 'DATACOLLECTIONID', value: to.params.id}).then((response) => {
        console.log("Lookup OK Prop = " + response.get('PROP'))
        next()
      }), (error) => {
        console.log("Calling next - Error, no proposal found")
        next('/')
      }
    }
  },
  {
    path: '/dc/summary/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)',
    name: 'summary',
    component: MarionetteView,
    props: (route) => ({
        mview: Summary,
        visit: route.params.visit || '',
        options: {
          model: visitModel,
          collection: new DCCol(null, {
            queryParams: { visit: route.params.visit, t: 'fc', pp: app.mobile() ? 5 : 15 }, running: false
          })
        }
    }),
    beforeEnter: (to, from, next) => {
      // Call the loading state here because we are finding the proposal based on this visit
      // Prop lookup sets the proposal and type via set app.cookie method which we mapped to the store
      console.log('summary')
      app.loading()

      lookupVisit(to.params.visit).then((response) => {
        console.log("Lookup OK Prop = " + response.get('PROPOSAL'))
        next()
      }), (error) => {
        console.log("Calling next - Error, no proposal found")
        next('/')
      }
    }
  },
  // Ty does not seem to be used in this route?
  {
    path: '/dc/apstatussummary/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)(/ty/)?:ty?',
    name: 'apstatussummary',
    component: MarionetteView,
    props: (route) => ({
      mview: APStatusSummary,
      visit: route.params.visit || '',
      ty: route.params.ty || '',
      options: {
        model: visitModel,
        collection: new DCCol(null, {
          queryParams: { visit: route.params.visit, t: 'fc', pp: app.mobile() ? 5 : 15 }, running: false
        })
      }
    }),
    beforeEnter: (to, from, next) => {
      // Call the loading state here because we are finding the proposal based on this contact id
      // Prop lookup sets the proposal and type via set app.cookie method which we mapped to the store
      console.log('summary')
      app.loading()

      lookupVisit(to.params.visit).then((response) => {
        console.log("Lookup OK Prop = " + response.get('PROPOSAL'))
        next()
      }), (error) => {
        console.log("Calling next - Error, no proposal found")
        next('/')
      }
    }
  },
  {
    path: '/dc/sc/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)',
    name: 'sampleChanger',
    component: MarionetteView,
    props: (route) => ({
        visit: route.params.visit || '',
        breadcrumbs: [
          { title: 'Data Collections', url: '/dc' },
          { title: 'Sample Changer' },
          { title: route.params.visit, url: '/dc/visit/'+route.params.visit },
        ],
        mview: SampleChangerView,
        options: {
          visit: route.params.visit,
          bl: visitModel.get('BL')
        }
    }),
    beforeEnter: (to, from, next) => {
      // Call the loading state here because we are finding the proposal based on this contact id
      // Prop lookup sets the proposal and type via set app.cookie method which we mapped to the store
      console.log('samplechanger')

      lookupVisit(to.params.visit).then((response) => {
        console.log("Lookup OK Prop = " + response.get('PROPOSAL'))
        next()
      }), (error) => {
        console.log("Calling next - Error, no proposal found")
        next('/')
      }
    }
  },
  {
    path: '/dc/queue/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)',
    name: 'queue',
    component: MarionetteView,
    props: (route) => ({
        visit: route.params.visit || '',
        breadcrumbs: [
          { title: 'Data Collections', url: '/dc' },
          { title: 'Queue Builder' },
          { title: route.params.visit }
        ],
        mview: QueueBuilder,
        options: {
          visit: route.params.visit,
          bl: visitModel.get('BL')
        }
    }),
    beforeEnter: (to, from, next) => {
      // Call the loading state here because we are finding the proposal based on this contact id
      // Prop lookup sets the proposal and type via set app.cookie method which we mapped to the store
      console.log('samplechanger')

      lookupVisit(to.params.visit).then((response) => {
        console.log("Lookup OK Prop = " + response.get('PROPOSAL'))
        next()
      }), (error) => {
        console.log("Calling next - Error, no proposal found")
        next('/')
      }
    }
  },    
]


export default routes