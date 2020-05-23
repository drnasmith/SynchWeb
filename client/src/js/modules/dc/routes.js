import Page from 'vuejs/views/page.vue'
import DC from 'modules/dc/DC.vue'
import Debug from 'modules/dc/Debug.vue'

import MarionetteApplication from 'vuejs/views/marionette/singleton.js'

// Initialize MarionetteApplication if not already existing
let application = MarionetteApplication.getInstance()

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

// let routes = [
//   {
//     path: '/dc(/visit/)?:visit([a-zA-Z]{2}[0-9]+-[0-9]+)?',
//     //?(/dcg/)?:dcg(\\d+)?(/page/)?:page(\\d+)?(/s/)?:search(\\w+)?(/ty/)?:ty(\\w+)?(/id/)?:id(\\d+)?(/pjid/)?:pjid(\\d+)?',
//     component: MarionetteView,
//     props: route => ({ 
//       mview: dc_options.mview,
//       breadcrumbs: [bc],
//       options: {
//           collection: new DCCol(null, {
//               state: { currentPage: route.params.page ? parseInt(route.params.page) : 1, pageSize: app.mobile() ? 5 : 15},
//               queryParams: { visit: route.params.visit, s: route.params.search, t: route.params.type, id: route.params.id, dcg: route.params.dcg, PROCESSINGJOBID: route.params.pjid }
//           }),
//           model: dc_options.model,
//           params: { visit: route.params.visit, search: route.params.search, type: route.params.type, id: route.params.id, dcg: route.params.dcg },
//       }
//     }),
//     beforeEnter: (to, from, next) => {
//       // Prop lookup sets the proposal and type via set application.cookie method which we mapped to the store
//       application.loading()

//       lookupView(to.params).then(() => {
//         console.log("Lookup DC View OK")
//         next()
//       }, (error) => { 
//           console.log(error)
//           app.alert({message: error})
//           next('/nopage')
//       })
//     }
//   },
// ]


// let routes = [
//   {
//     path: '/dc',
//     // '/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)(/dcg/)?:dcg(\\d+)?(/page/)?:page(\\d+)?(/s/)?:search(\\S+)?(/ty/)?:ty(\\w+)?(/id/)?:id(\\d+)?(/pjid/)?:pjid(\\d+)?',
//     name: 'dc-list-view',
//     component: MarionetteView,
//     props: getDCListProps,
//     beforeEnter: (to, from, next) => {
//       // Prop lookup sets the proposal and type via set application.cookie method which we mapped to the store
//       application.loading()

//       lookupView(to.params).then(() => {
//         console.log("Lookup DC View OK")
//         next()
//       }, (error) => { 
//           console.log(error)
//           app.alert({message: error})
//           next('/nopage')
//       })
//     }
//   },
// ]
// Dealing with multiple optional parameters is a pain.
// Looks as though page is a red herring as its not added to the URL.
// Search probably has no value with an id (i.e. individual data collection ) or probably dcg either
let routes = [
  // { path: '/dc(/s/:search)?', component: DC, props: true },
  { path: '/dc(/visit/)?:visit([a-zA-Z]{2}[0-9]+-[0-9]+)?(/dcg/)?:dcg([0-9]+)?(/page/)?:page([0-9]+)?(/s/)?:search([a-zA-z0-9_-]+)?(/ty/)?:ty([a-zA-z]+)?(/id/)?:id([0-9]+)?(/pjid/)?:pjid([0-9]+)?',
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
  // { path: '/dc/page/:page(\\d+)(/s/)?:search?', component: DC, props: true },
  // { path: '/dc/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)(/s/)?:search?', component: DC, props: true },
  // { path: '/dc/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)/page/:page(/s/)?:search?', component: DC, props: true  },
  // { path: '/dc/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)/id/:id', component: DC, props: true },
  // { path: '/dc/visit/:visit([a-zA-Z]{2}[0-9]+-[0-9]+)/ty/:ty(/id/)?:id?', component: DC, props: true }
]


export default routes