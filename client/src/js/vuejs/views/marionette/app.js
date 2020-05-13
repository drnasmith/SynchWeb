import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import Options from 'models/options'

export default function MarionetteApp() {
    if (window.app) {       
        // Already initialised
        return window.app
    } else {
        console.log("Creating new Marionette Application")
        let application = new Marionette.Application()

        application.options = new Options()

        // Initialize Sync
        // let self = this
        // Allow us to set a global base url for the API
        var oldSync = Backbone.sync;
    
        Backbone.sync = function(method, model, options) {
          var url = _.isFunction(model.url) ? model.url() : model.url;
    
          options = options || {};
          if (url) {
              options.url = app.apiurl+url
          }

          return oldSync.call(this, method, model, options);
        }

        // Pass prop to Backbone.ajax
        var oldAjax = Backbone.ajax
    
        Backbone.ajax = function(options) {
            var prop = window.app.prop
            var token = window.app.token
    
            // Automatically add the proposal to each request if we have one
            if (prop !== '' ){
                // FormData
                if (options.data instanceof FormData) {
                    options.data.append('prop', prop)
        
                // JSON content
                } else if (options.contentType == 'application/json' || options.type == 'DELETE') {
                    if (options.data) var tmp = JSON.parse(options.data)
                    else var tmp = {}
        
                    if (Array.isArray(tmp)) tmp[0].prop = prop
                    else {
                        if (!tmp.prop) tmp.prop = prop
                    }
                    options.data = JSON.stringify(tmp)
        
                // Append to object for anything else
                } else {
                    if (!options.data) options.data = {}
                    if (!options.data.prop) options.data.prop = prop
                }
            }
    
            // Send token with requst
            if (token) {
                options.beforeSend = function(request){
                    request.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }
    
            return oldAjax.call(this, options)
        }

        // Handle ajax errors in a generic way
        $(document).ajaxError(_.debounce(function(event, xhr, settings, error) {
            console.log('ajax error', 'status', xhr.status, 'code', settings, error)
        
            var json;
            if (xhr.responseText) {
                try {
                    json = $.parseJSON(xhr.responseText)
                } catch(err) {
        
                }
            }
            var msg = json && (json.error || json.msg) ? (json.error ? json.error : json.msg) : error
        
            if (xhr.readyState == 0) {
                app.alert({ message: 'A network request failed', persist: 'network' })
                
            }
        
            if (xhr.status == 401) {
                // Need to hook login into vue-router...
                app.login(xhr)
            }
            if (xhr.status == 500) {
                app.alert({ message: 'An application error has occurred <pre>'+msg+'</pre>', persist: 'e500' })
            }
            if (xhr.status == 503) {
                if (json) app.alert({ message: 'A database error has occurred <pre>'+msg+'</pre>', persist: 'e503' })
                else  app.alert({ message: 'A server error has occurred <pre>'+msg+'</pre>', persist: 'e503' })
            }
        }, 300))
          
        // We don't need to use marionette router anymoew
        application.addInitializer(function(options){
            console.log("Marionette::addInitializer from app.js")
            // Load options 
            application.options.fetch({
                data: { t: new Date().getTime() },
                success: function() {
                    console.log("MarionetteApplication Got Options")
                    application.initializeRegions()
                    // application.getuser()
                },
                error: function() {
                    console.log("MarionetteApplication Options not available")
                }
            })

        })

        
        // This is redundant with Vue managing the marionette views
        application.initializeRegions = function() {
            console.log("MarionetteApplication::Initializing regions...")
            application.addRegions({
                content: '#marionette-wrapper'
            })
        }

        application.mobile = function() {
            return $(window).width() <= 600
        }

        /*
        Log message to console
        */
        application.log = function() {
            console.log.apply(console, arguments)
        },

        window.app = application
            
        return application
    }
}

