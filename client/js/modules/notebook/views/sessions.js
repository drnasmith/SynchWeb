define(['vue',
    ], function(Vue) {
    // An example of a Vue Component.
    // Pass in a proposal as property...
    // Could move the template to a separate file
    return Vue.component('session-list', {
        template: '<div><h2>(Vue Component) Sessions for Proposal: {{proposal}}</h2><ul><li v-for="item in sessions">{{item}}</li></ul></div>',
        props: ['proposal'],

        data: function() {
            return {
                sessions: ['session 1', 'session 2', 'session 3']
            }
        }
    });
})