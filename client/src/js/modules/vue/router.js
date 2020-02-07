define(['utils/lazyrouter'], function(LazyRouter) {
        
    var Router = LazyRouter.extend({
        appRoutes: {
            'vue/': 'vueAppController',
        },

        loadModule: function(loadedCallback) {
            import(/* webpackChunkName: "admin" */ 'modules/vue/controller').then(controller => {
                // Trigger the passed callback
                loadedCallback(controller)
            })
        }
    })
       
    return new Router({
        // controller: c,
        rjsController: 'modules/vue/controller',
    })
})
