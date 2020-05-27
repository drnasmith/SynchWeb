// Specify the routes for this module
// Any Marionette View should use the MarionetteView wrapper component with a prop of the actual marionette view class
// Options can be passed into the marionette view class via the options prop
// Models and collections can be specified as props
// If a model or collection is passed in the data will be prefetched before the component is loaded
// Props that make use of the route object should use props: route => ({ ...define prop using route.params object})
import Page from 'app/views/page.vue'
import MarionetteView from 'app/views/marionette/marionette-wrapper.vue'
import TutorialsView from 'modules/docs/views/vue-tutorials'

export function routes() {

  return routes = [
  {
    path: '/docs',
    component: Page,
    children: [
        {
            path: '',
            name: 'docs',
            component: MarionetteView,
            props: {
                mview: TutorialsView,
                breadcrumbs: [{title: 'Tutorials'}]
            }
        },
        {
            path: ':id',
            name: 'docs',
            component: MarionetteView,
            props: route => ({
                mview: TutorialsView,
                breadcrumbs: [{title: 'Tutorials'}],
                options: {id: routes.params.id}
            })
        },
        
    
    ]
  },
]
}
