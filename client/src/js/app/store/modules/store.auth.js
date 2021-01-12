import Backbone from 'backbone'

// Module to deal with authentication
// Should handle any Single sign on requests and deal with login/logout actions
const auth = {
  state: {
    type: 'cas',
    cas_sso: false,
    cas_url: '',
    token: '',
  },
  mutations: {
      //
      // Authorisation status
      //
      auth_success(state, token){
        state.token = token
        sessionStorage.setItem('token', token)
        // Preserve legacy app
        app.token = state.token
      },
      auth_error(state){
        console.log("store.auth - error trying to authenticate")
        state.token = ''
        sessionStorage.removeItem('token')
        // Preserve legacy app
        delete app.token
      },
      // Mutation to set state info back to defaults after successful logout action
      logout(state){
        state.token = ''
        sessionStorage.removeItem('token')
        // Preserve legacy app
        delete app.token
      },      
  },
  actions: {
    check_auth({state, rootState}, ticket) {
      console.log("Store check_auth Ticket: " + ticket)
      return new Promise( (resolve) => {
        // If we have a token return
        if (state.token) resolve(true)
        else {
          Backbone.ajax({
              url: rootState.apiUrl+'/authenticate/check',
              type: 'GET',
              success: function(response) {
                console.log("Store check_auth success: " + JSON.stringify(response))
                const token = response.jwt
                commit('auth_success', token)
                resolve(true)
              },
              error: function(response) { 
                console.log("Store check auth warning - no previous session")
                resolve(false)
              }
          })
        }
      })
    },

    validate({state, rootState}, ticket) {
      console.log("Store validate Ticket: " + ticket)
      return new Promise( (resolve) => {
        // If we have a token return
        if (state.token) resolve(true)

        Backbone.ajax({
            url: rootState.apiUrl+'/authenticate/check',
            type: 'GET',
            success: function(response) {
              console.log("Store validate success: " + JSON.stringify(response))
              const token = response.jwt
              commit('auth_success', token)
              resolve(true)
            },
            error: function(response) { 
              console.log("Store validate warning - no previous session")
              resolve(false)
            }
        })
      })
    },

    login({state, commit, rootState}, credentials) {
      return new Promise((resolve, reject) => {
        commit('loading', true)

        Backbone.ajax({
          url: rootState.apiUrl+'/authenticate',
          data: credentials,
          type: 'POST',
          success: function(resp) {
            const token = resp.jwt
            console.log("Authentication success for " + credentials.login) // Using passed fed id at the moment
            commit('auth_success', token)
            commit('loading', false)
            resolve(resp)
          },
          error: function(req, status, error) {
            commit('auth_error')
            commit('loading', false)
            reject(error)
          }})
        })
    },

    logout({commit, rootState}){
      return new Promise((resolve, reject) => {
        // If sso need to call the logout URL
        Backbone.ajax({
          url: rootState.apiUrl+'/authenticate/logout',
          type: 'GET',
          success: function(resp) {
            console.log("Logout successful")
            commit('logout')
            commit('set_proposal', null)
            commit('update_user', {})
            resolve()
          },
          error: function(req, status, error) {
            // Even if an error we can set our local properties to logged out
            console.log("Error returned from logout URL")
            commit('logout')
            commit('set_proposal', null)
            commit('update_user', {})
            reject()
        }})
      })
    },
  },
  getters: {
    isLoggedIn: function(state) {
      return state.token !== ''
    },
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
