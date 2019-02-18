define(['backbone',
    'vue',
    'modules/notebook/views/sessions',
    'text!templates/notebook/notebook.html',
    ], function(Backbone, Vue, SessionList, tmpl) {
    
    // Main Vue instance for this module/page
    var VueView = Vue.extend({
        components: {
            'session-list': SessionList,
        },

        // template: "<div id='my-vue-component' class='content'><h1>Vue Notebook!</h1><p>Message: {{msg}}</p></div>",
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
            toggleSessions: function() {
                this.show_sessions = !this.show_sessions
            }
        },

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
    });

    return Backbone.View.extend({
        id: 'vue-wrapper',
        template: '<div id="vue-container"></div>',
        vueView: undefined,

        // Backbone View render - link the Vue instance here
        render: function() {
            this.$el.html(this.template);
            
            this.vueView = new VueView({el: this.$('#vue-container').get(0)});

            return this;
        },
        // Backbone View Lifecycle hook
        remove: function() {
            // Destroy the Vue vm instance
            this.vueView.$destroy()
            // Call the base class method, stopping timers, events etc.
            Backbone.View.prototype.remove.apply(this)
        }
    })
})