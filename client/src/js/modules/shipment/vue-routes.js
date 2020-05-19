// import MarionetteApp from 'vuejs/views/marionette/application.js'
import MarionetteApplication from 'vuejs/views/marionette/singleton.js'
import MarionetteView from 'vuejs/views/marionette/marionette-wrapper.vue'
// import Page from 'vuejs/views/page.vue'
const Page = () => import(/* webpackChunkName: "group-shipment" */'vuejs/views/page.vue')

import ProposalLookup from 'models/proplookup.js'

import Shipments from 'collections/shipments.js'
import Shipment from 'models/shipment.js'

// How we import static views...
// import ShipmentsView from 'modules/shipment/views/shipments'
// import ShipmentView from 'modules/shipment/views/shipment'

// Marionette View can deal with being passed a promise or a function
const ShipmentsView = import(/* webpackChunkName: "group-shipment" */ 'modules/shipment/views/shipments')
const ShipmentView = import(/* webpackChunkName: "group-shipment" */ 'modules/shipment/views/shipment')

// Initialize MarionetteApplication if not already existing
let application = MarionetteApplication.getInstance()

console.log("LOADING LEGACY SHIPMENT ROUTES")

application.on('shipments:show', function() {
    application.navigate('/shipments')
})
    
application.on('shipment:show', function(sid) {
    application.navigate('/shipments/sid/'+sid)
})
    
application.on('container:show', function(cid, iid, sid) {
    application.navigate('/containers/cid/'+cid+(iid?'/iid/'+iid:'')+(sid?'/sid/'+sid:''))
})

application.on('rdewar:show', function(fc) {
    application.navigate('/dewars/fc/'+fc)
})

application.on('rcontainer:show', function(crid) {
    application.navigate('/containers/registry/'+crid)
})

var bc = { title: 'Shipments', url: '/shipments' }


var routes = [
  {
    path: '/shipments',
    component: Page,
    children: [
      {
        path: '',
        name: 'legacy-shipments',
        component: MarionetteView,
        props: route => ({
          mview: ShipmentsView,
          breadcrumbs: [{title: 'Shipments'}],
          options: {
            collection: new Shipments(null, { state: { currentPage: route.params.page ? parseInt(route.params.page) : 1}}),
            params: {s: route.params.s}
          },
        }),
      },
      {
        path: 'page/:page',
        component: MarionetteView,
        props: route => ({ 
          mview: ShipmentsView,
          options: {
            collection: new Shipments(null, { 
              state: { currentPage: route.params.page ? parseInt(route.params.page) : 1},
              queryParams: { s: route.params.s }
            }),
            params: {s: route.params.s},
          }
        }),
      },
      {
        path: 'sid/:sid',
        component: MarionetteView,
        props: route => ({ 
          mview: ShipmentView,
          breadcrumbs: [bc],
          breadcrumb_hint: 'SHIPPINGNAME', // If we find a model append to the bc
          options: {
            model: new Shipment({ SHIPPINGID: route.params.sid })
          }
        }),
        beforeEnter: (to, from, next) => {
          // Call the loading state here because we are finding the proposal based on this contact id
          // Prop lookup sets the proposal and type via set application.cookie method which we mapped to the store
          application.loading()
          var lookup = new ProposalLookup({ field: 'SHIPPINGID', value: to.params.sid })
          lookup.find({
            // If OK trigger next 
            success: function() {
              console.log("Calling next - Success. model will be prefetched in marionette view")
              next()
            },
            error: function() {
              console.log("Calling next - Error, no proposal found")
              next('/nopage')
            },
          })
        }
      },
    ],
  }]

export default routes