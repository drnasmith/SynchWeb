define(['vue',
    'utils/vuewrapper',
    'modules/vue/components/App.vue',
    'templates/vue/beta/index.html',
    ], function(Vue, VueWrapper, App, template) {

    return VueWrapper.extend({
        vueView: Vue.extend({
            template: template,
            components: {
                'main-app': App.default,
            },

            data: function() {
                return {
                    name: '',
                    email: '',
                    message: 'Hello from Vue App' 
                }
            },
            mounted: function() {
                console.log("Vue Index App loaded")
            },
            methods: {
                // With new build and (IE polyfill) we could use
                // Object.assign() to reset all data to initial state
                // Using the method below is simple alternative that
                // allows us to clear form data after submission
            }
        })
    })
})