define(['modules/notebook/views/notebook',
    ], function(NotebookView) {
    
    var bc = { title: 'Notebook' }
    
    var controller = {
        
        notebook:  function() {
            app.loading()
            app.bc.reset([bc]),
            app.content.show(new NotebookView())
        },
        
    }

    return controller
})