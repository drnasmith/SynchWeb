import Backbone from 'backbone'
import Marionette from 'backbone.marionette'
import Options from 'models/options'

var MarionetteApplication = (function () {
    var instance;
 
    function createInstance() {
        console.log("Creating Singleton instance of Marionette Application")
        let application = new Marionette.Application()

        initialise(application)

        return application;
    }

    function initialise(application) {
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
          
        // let self = application
        // // We don't need to use marionette router anymoew
        // application.addInitializer(function(options){
        //     // console.log("Marionette::addInitializer from app.js")
        //     // Load options - doing this in store now
        //     // application.options.fetch({
        //     //     data: { t: new Date().getTime() },
        //     //     success: function() {
        //     //         console.log("MarionetteApplication Got Options")
        //     //         self.initializeRegions()
        //     //         // application.getuser()
        //     //     },
        //     //     error: function() {
        //     //         console.log("MarionetteApplication Options not available")
        //     //     }
        //     // })

        // })

        
        // Think this is redundant with Vue managing the marionette views
        application.initializeRegions = function() {
            console.log("MarionetteApplication::Initializing regions...")
            self.addRegions({
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

        // Set the global app variable for legacy code
        window.app = application
        
        //
        // Define a couple of method to track mapping router and store methods to app functions
        //
        // Pass vue-router into this one
        application.initRouteMapping = function(router) {
            // Override Marionette Navigation method - hook into Vue router
            application.navigate = function(url) {
                router.push(url)
            }
        }
        // Pass vuex-store into this one
        application.initStateMapping = function(store) {
            // Map legacy app functions to store mutations and actions
            // application = getInstance()
            
            application.cookie = function(prop, callbackFn) {
                console.log("Saving proposal from legacy cookie fn")
        
                store.dispatch('set_proposal', prop)
        
                if (callbackFn && callbackFn instanceof Function) {
                    callbackFn()
                }
            }
            // Define user permission method - hooked into store
            application.user_can = function(perm) {
                return store.getters.permissions.indexOf(perm) > -1
            }

            // Method to retrieve user information
            // Don't think we need this as we can load from login component
            application.getuser = function(options) {
                if (store.isLoggedIn) {
                    store.dispatch('get_user', options)  
                }
            }

            // Method to retrieve user information
            // Don't think we need this as we can load from login component
            application.alert = function(options) {
                var payload = {message: options.message, level: 'error'}
                store.commit('add_notification', payload)
            }

            application.message = function(options) {
                var payload = {message: options.message, level: 'info'}
                store.commit('add_notification', payload)
            }
        
            application.loading = function() {
                store.commit('loading', true)
            }
        
            application.login = function(xhr) {
                // app.bc.reset([{ title: 'Login' }])
                // app.content.show(new LoginView())
                // We have experienced an error and need to login again
                // Message login session has expired...
                store.commit('add_notification', {message: 'Authentication session has expired, please login again', level: 'error'})
                store.dispatch('logout')
                // Calling mapped function as we don't have a handle to the router in this method
                application.navigate('/login')
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export default MarionetteApplication