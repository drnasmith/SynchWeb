define(['modules/vue/views/index',
    ], function(VueApp) {

    // Breadcrumb data
    var bc = { title: 'Vue Beta Site', url: '/vue/' }
    
    var controller = {
        
        // Demo site
        vueAppController: function() {
            app.bc.reset([bc])
            app.content.show(new VueApp())
        },
                   
    }
       
    return controller
})