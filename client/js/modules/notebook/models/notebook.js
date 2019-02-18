define(['backbone'], function(Backbone) {
    
    return Backbone.Model.extend({
        urlRoot: '/notebook',
        validation: {
            name: {
                required: true,
            },
            text: {
                required: true,
                pattern: 'word',
            },
            id: {
                required: true,
            },
        },
        
    })

})
