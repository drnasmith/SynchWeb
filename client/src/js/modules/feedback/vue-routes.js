import MarionetteView from 'vuejs/views/marionette/marionette-wrapper.vue'

import FeedbackView from 'modules/feedback/views/vue-feedback.js'

export function routes() {

  return routes = [
  {
    path: '/feedback',
    component: MarionetteView,
    name: 'legacy-feedback',
    props: {
        mview: FeedbackView,
        breadcrumbs: [{title: 'Feedback'}]
    }
  },
]
}
