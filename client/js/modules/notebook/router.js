define(['marionette', 'modules/notebook/controller'], function(Marionette, c) {
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            'notebook': 'notebook',
        }
    })
       
    return new Router({
        controller: c
    })
})