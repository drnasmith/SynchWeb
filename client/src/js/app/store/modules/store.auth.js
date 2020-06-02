import Backbone from 'backbone'

const auth = {
  state: {
    // User and authentication values
    auth: {
      type: 'cas',
      cas_sso: false,
      cas_url: '',
    },
    user: {
      username: '',
      isStaff: false,
      personId: 0,
      defaultType: 'mx',
      permissions: []
    },
    token: '',
  },
  mutations: {
      //
      // Authorisation status
      //
      auth_request(state){
        state.loading = true
      },
      auth_success(state, token, username){
        state.loading = false
        state.token = token
        state.user.username = username // part of larger user object, we don't have all the info yet
        sessionStorage.setItem('token', token)
        // Preserve legacy app
        app.token = state.token
      },
      auth_error(state){
        state.loading = false
        state.token = ''
        sessionStorage.removeItem('token')
      },
      update_user(state, user) {
        console.log("STORE UPDATING USER INFO...")
        // user should be an object with { username, personid, is_staff, givenname, defaultType}
        // Explicit mapping here to catch any errors and avoid unnecessary values
        state.user.username = user.user
        state.user.personId = user.personid
        state.user.isStaff = user.is_staff
        state.user.defaultType = user.ty // default type of layout to show for this user mx, em etc.
        state.user.givenName = user.givenname

        // Now map this to our legacy marionette application
        app.user = user.user
        app.personid = user.personid
        app.givenname = user.givenname
        app.staff = user.is_staff
        // Saving the default type for this user.
        // Needed for resetting the home view
        app.defaultType = user.ty

        if (!app.type) {
          app.type = user.ty
        }
      },
      logout(state){
        state.token = ''
        state.proposal = ''
        state.user = {}
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('prop')
        // Preserve legacy app
        delete app.token
        delete app.prop
        // app.token = state.token
        // app.prop = state.proposal
      },      
  },
  actions: {
    check_auth({state, dispatch, rootState}, ticket) {
      console.log("Check Auth Ticket = " + ticket)
      return new Promise( (resolve) => {
        dispatch('initialise').then(function(ok) {
          console.log('check_auth called initialise : ' + ok)
          if (ticket) {
            Backbone.ajax({
              url: rootState.apiRoot+'/authenticate/check',//?ticket='+ticket,
              type: 'GET',
              success: function(response) {
                console.log(JSON.stringify(response))
                resolve(state.token !== '')
              }
            })
          } else {
            resolve(state.token !== '')
          }
        })
      })
    },


    login({state, commit, rootState}, credentials) {
      return new Promise((resolve, reject) => {
        commit('auth_request')

        Backbone.ajax({
          url: rootState.apiRoot+'/authenticate',
          data: credentials,
          type: 'POST',
          success: function(resp) {
            const token = resp.jwt
            const user = credentials.login // Using passed fed id at the moment
            commit('auth_success', token, user)
            resolve(resp)
          },
          error: function(req, status, error) {
            commit('auth_error')
            reject(req)
          }})
        })
    },

    logout({commit, rootState}){
      return new Promise((resolve, reject) => {
        // If sso need to call the logout URL
        Backbone.ajax({
          url: rootState.apiRoot+'/authenticate/logout',
          type: 'GET',
          success: function(resp) {
            console.log("Logout successful")
            commit('logout')
            resolve()
          },
          error: function(req, status, error) {
            console.log("Error returned from logout URL")
            commit('logout')
            reject()
        }})
      })
    },

    get_user({commit, rootState}, options) {
      return new Promise((resolve, reject) => {
        // If not already logged in - return
        
        Backbone.ajax({
          url: rootState.apiRoot+'/users/current',
          success: function(resp) {
            var payload = {
              user: resp.user,
              personid: resp.personid,
              givenname: resp.givenname,
              is_staff: resp.is_staff,
              ty: resp.ty,
              permissions: resp.permissions,
            }

            commit('update_user', payload)

            //commit('set_proposal', null)

            if (options && options.callback && options.callback instanceof Function) {
              options.callback()
            }
            // Don't wait for the callback
            resolve(resp)
          },

          error: function() {
            console.log("Error getting user information")

            if (options && options.callback && options.callback instanceof Function) {
              options.callback()
            }
            reject()
          }    
        })
      })
    },
  },
  getters: {
    isLoggedIn: function(state) {
      return state.token !== ''
    },
    isStaff: state => state.user.is_staff,
    permissions: state => state.user.permissions,
    token: function(state) {
      if (!state.token) {
        // Any in storage?
        state.token = sessionStorage.getItem('token')
      }
      return state.token
    },
  }
}

export default auth
