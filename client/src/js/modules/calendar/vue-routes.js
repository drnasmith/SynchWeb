// Vue Router configuration
// If properties need to be dynamic then use props as a function
// Can also extract values from the route dynamically via route.params

import MarionetteApplication from 'app/views/marionette/singleton.js'
import MarionetteView from 'app/views/marionette/marionette-wrapper.vue'
import Page from 'app/views/page.vue'
import CalendarView from 'modules/calendar/views/calendar.js'
import CurrentView from 'modules/calendar/views/current.js'

export function routes() {
    // Initialize MarionetteApplication if not already existing
    // Potentially we could swap use of app.navigate wuith router.push directly but we still need to 
    // hook into the marionette event bus...
    let application = MarionetteApplication.getInstance()

    console.log("LOADING LEGACY PROPOSAL ROUTES")
  
    application.on('current:show', function() {
      application.navigate('/current')
    })
  
    application.on('go:home', function() {
      application.navigate('/')
    })
  
    return routes = [
    {
        path: '/calendar',
        name: 'calendar',
        component: MarionetteView,
        props: route => ({ 
          mview: CalendarView,
          breadcrumbs: [{ title: 'Calendar' }, { title: app.prop }]
        })
      },
      {
        path: '/current',
        name: 'current',
        component: MarionetteView,
        props: { 
          mview: CurrentView,
          breadcrumbs: [{ title: 'Next and previous visits' }]
        }
      },
      {
        path: '/cal',
        component: Page,
        children: [
          {
            path: '',
            name: 'cal',
            component: MarionetteView,
            props: { 
              mview: CalendarView,
            }
          },
          {
            path: 'bl/:bl',
            component: MarionetteView,
            props: route => ({ 
              mview: CalendarView, 
              options: {
                all: 1, 
                bl: route.params.bl
              }
            })
          }
        ]
      }
  ]
}
