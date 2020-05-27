// import MarionetteApp from 'app/views/marionette/app.js'
import MarionetteApplication from 'app/views/marionette/singleton.js'
import MarionetteView from 'app/views/marionette/marionette-wrapper.vue'
import Page from 'app/views/page.vue'

import ProposalList from 'modules/proposal/list'
import VisitList from 'modules/proposal/visit_list'
import SAXSVisitList from 'modules/types/saxs/proposal/views/visit_list'
import GenVisitList from 'modules/types/gen/proposal/views/visit_list'

import Proposals from 'collections/proposals.js'
import Visits from 'collections/visits.js'
// Need to extend this to deal with visit links for saxs, gen


export function routes() {
  // Initialize MarionetteApplication if not already existing
  let application = MarionetteApplication.getInstance()

  console.log("LOADING LEGACY PROPOSAL ROUTES")

  application.on('proposals:show', function() {
    console.log("Caught proposals:show event")
    application.navigate('/proposal')
      // controller.list()
  })

  application.on('visits:show', function() {
    console.log("Caught visits:show event")
    application.navigate('/visits')
      // controller.visit_list()
  })

  // Determine the correct visit link list to display
  function getVisitProps (route) {
    console.log("Proposal::vue-routes - getVisitProps")
    // The only difference is which action buttons are displayed
    // Could move to the visit list view rather than this somewhat complex approach
    var views = {
      saxs: SAXSVisitList,
      mx: VisitList,
    }
  
    // var ty = application.proposal && application.proposal.get('TYPE')
    var ty = application.proposal && application.type

    var view = GenVisitList

    if (ty in views) view = views[ty]
    else view = GenVisitList

    return {
      mview: view,
      breadcrumbs: [{title: 'Proposals', url: '/proposals'}, {title: 'Visits for ' + application.prop}],
      options: {
        collection: new Visits(null, { state: { currentPage: route.params.page ? parseInt(route.params.page) : 1}}),
        params: {s: route.params.s}
      },
    }
  }

  return routes = [
  {
    path: '/proposals',
    component: Page,
    children: [
      {
        path: '',
        name: 'legacy-proposals',
        component: MarionetteView,
        props: route => ({
          mview: ProposalList,
          breadcrumbs: [{title: 'Proposals'}],
          options: {
            collection: new Proposals(null, { state: { currentPage: route.params.page ? parseInt(route.params.page) : 1}}),
            params: {s: route.params.s}
          },
        }),
      },
      {
        path: 's/:s',
        component: MarionetteView,
        props: route => ({ 
          mview: ProposalList, 
          options: {
            collection: new Proposals(null, { 
              state: { currentPage: route.params.page ? parseInt(route.params.page) : 1},
              queryParams: { s: route.params.s }
            }),
            params: {s: route.params.s},
          }
        }),
      },
      {
        path: 's/:s/page/:page',
        component: MarionetteView,
        props: route => ({ 
          mview: ProposalList,
          options: {
            collection: new Proposals(null, { 
              state: { currentPage: route.params.page ? parseInt(route.params.page) : 1},
              queryParams: { s: route.params.s }
            }),
            params: {s: route.params.s},
          }
        }),
      },  
    ]
  },
  // Replicating the optional visit url page and/or search term
  {
    path: '/visits',
    component: Page,
    children: [
      {
        path: '',
        name: 'legacy-visits',
        component: MarionetteView,
        props: getVisitProps,
      },
      {
        path: 's/:s',
        component: MarionetteView,
        props: getVisitProps,
      },
      // Should figure out the regex to make these params optional
      {
        path: 's/:s/page/:page',
        component: MarionetteView,
        props: getVisitProps,
      },  
      {
        path: 'page/:page',
        component: MarionetteView,
        props: getVisitProps,
      },  
      {
        path: 'page/:page/s/:s',
        component: MarionetteView,
        props: getVisitProps,
      },  
    ]
  },
  ]
}

