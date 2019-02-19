define(['utils/vuewrapper',
        'vue',
        'modules/notebook/views/sessions',
        'text!templates/notebook/notebook.html',
        ], function(VueWrapper, Vue, SessionList, tmpl) {

    return VueWrapper.extend({
        vueView: Vue.extend({
            components: {
                'session-list': SessionList,
            },

            template: tmpl,

            // Data needs to be a function as we are defining a Vue component here
            data: function() {
                return {
                    msg: "Hello from Vue App ",
                    show_sessions: true,
                    proposal: app.prop
                }
            },

            methods: {
                // Example method that binds to a button press
                // shows/hides the session list component
                toggleSessions: function() {
                    this.show_sessions = !this.show_sessions
                }
            },
            // Vue lifecycle methods
            created: function() {
                console.log("Vue component created")
            },
            mounted: function() {
                console.log("Vue component mounted")
            },
            beforeDestroy: function() {
                console.log("Vue component before destroyed")
            },
            destroyed: function() {
                console.log("Vue component destroyed")
            }
        })
    })
})