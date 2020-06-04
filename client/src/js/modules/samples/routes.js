// Specify the routes for this module
// Any Marionette View should use the MarionetteView wrapper component with a prop of the actual marionette view class
// Options can be passed into the marionette view class via the options prop
// Models and collections can be specified as props
// If a model or collection is passed in the data will be prefetched before the component is loaded
// Props that make use of the route object should use props: route => ({ ...define prop using route.params object})
import Page from 'app/views/page.vue'
import Debug from 'app/views/debug.vue'
import MarionetteView from 'app/views/marionette/marionette-wrapper.vue'

import GetView from 'modules/samples/views/getsampleview'

import ProteinList from 'modules/samples/views/proteinlist'
import ProteinView from 'modules/samples/views/proteinview'
import AddProteinView from 'modules/samples/views/proteinadd'

import ProteinClone from 'modules/samples/views/proteinclone'
// import ProteinClone from 'modules/samples/views/cloneprotein'

import Protein from 'models/protein'
import Proteins from 'collections/proteins'

import ProposalLookup from 'models/proplookup.js'
// 'proteins(/s/:s)(/page/:page)': 'proteinlist',
// 'proteins/pid/:pid': 'proteinview',
// 'proteins/add': 'proteinadd',

// proteinlist: function(s, page) {
//     app.loading()
//     var title = GetView.ProteinList.title(app.type)

//     app.bc.reset([{ title: title+'s', url: '/'+title.toLowerCase()+'s' }])
//     page = page ? parseInt(page) : 1
//     var params = { s : s }
//     if (app.type == 'xpdf') params.seq = 1
//     var proteins = new Proteins(null, { state: { currentPage: page }, queryParams: params })
//     proteins.fetch().done(function() {
//         app.content.show(GetView.ProteinList.get(app.type, { collection: proteins, params: { s: s } }))
//     })
// },


app.addInitializer(function() {
  app.on('samples:show', function() {
    app.navigate('/samples')
  })
    
  app.on('proteins:show', function() {
    app.navigate('/proteins')
  })

  app.on('samples:view', function(sid) {
    app.navigate('/samples/sid/'+sid)
  })

  app.on('instances:view', function(sid) {
    app.navigate('/instances/sid/'+sid)
  })

  app.on('crystals:view', function(cid) {
    app.navigate('/crystals/cid/'+cid)
  })

  app.on('xsamples:view', function(cid) {
    app.navigate('/xsamples/cid/'+cid)
  })
    
  app.on('proteins:view', function(pid) {
    app.navigate('/proteins/pid/'+pid)
  })

  app.on('phases:view', function(pid) {
    app.navigate('/phases/pid/'+pid)
  })

  app.on('protein:clone', function(pid) {
    app.navigate('/proteins/clone/pid/'+pid)
  })
})

let bc = { title: 'Proteins', url: '/samples' }
let pbc = { title: 'Proteins', url: '/proteins' }

const routes = [
  {
    path: '/proteins',
    component: Page,
    children: [
        {
            // We need to pass the regex to allow capture of the second optional parameter
            path: '',
            name: 'protein-list',
            component: MarionetteView,
            props: (route) => ({
                mview: ProteinList,
                breadcrumbs: [bc],
                options: {
                  collection:  new Proteins(null, { state: { currentPage: route.params.page ? parseInt(route.params.page) : 1}}),
                  queryParams: { s: route.params.s || ''},
                  params: { s: route.params.s || ''}, // ? Why both, one for collection and view?
                }
            })
        },
        {
          path: 'pid/:pid',
          component: MarionetteView,
          props: route => ({ 
            mview: ProteinView,
            breadcrumbs: [bc],
            breadcrumb_hint: 'NAME',
            options: {
              model: new Protein({ PROTEINID: route.params.pid })
            }
          }),
          beforeEnter: (to, from, next) => {
            // Call the loading state here because we are finding the proposal based on this contact id
            // Prop lookup sets the proposal and type via set app.cookie method which we mapped to the store
            app.loading()
  
            var lookup = new ProposalLookup({ field: 'PROTEINID', value: to.params.pid })
            lookup.find({
              // If OK trigger next 
              success: function() {
                console.log("Calling next - Success. model will be prefetched in marionette view")
                next()
              },
              error: function() {
                console.log("Calling next - Error, no proposal found")
                next('/')
              },
            })
          }
        },        
        {
          path: 'add',
          name: 'protein-add',
          component: MarionetteView,
          props: (route) => ({
              pid: route.params.pid,
              mview: AddProteinView,
              breadcrumbs: [pbc,  { title: 'Add Protein' }],
            })
      },
      {
        path: 'clone/pid/:pid',
        name: 'protein-clone',
        component: MarionetteView,
        props: (route) => ({
            pid: route.params.pid,
            mview: ProteinClone,
            breadcrumbs: [bc],
            breadcrumb_hint: 'NAME',
            options: {
              model: new Protein({ PROTEINID: route.params.pid })
            }
          })
    },
]
  },
]

export default routes