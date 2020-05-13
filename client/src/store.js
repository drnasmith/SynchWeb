import Vue from 'vue'
import Vuex from 'vuex'

import MenuStore from './store.menus.js'

import Backbone from 'backbone'
import Proposal from 'models/proposal.js'
import Options from 'models/options.js'
import MarionetteApplication from './js/vuejs/views/marionette/singleton.js'

Vue.use(Vuex)

var API_ROOT = '/api'


const store = new Vuex.Store({
  modules: {
    menu: MenuStore,
  },
  state: {
    // Flag we use to check if we have already setup prop/token
    initialised: false,
    // Global api prefix
    apiRoot: API_ROOT,
    user: {
      username: '',
      isStaff: false,
      personId: 0,
      defaultType: 'mx',
      permissions: []
    },
    token: '',
    proposal: '',
    proposalType: 'mx',
    visit: '',
    notifications: [],
    loading: false,
    auth: {
      type: 'cas',
      cas_sso: false,
      cas_url: '',
    }
  },
  mutations: {
    //
    // Proposal and visit information
    //
      save_proposal(state, prop) {
        state.proposal = prop
        sessionStorage.setItem('prop', prop)
        // Legacy app
        app.prop = state.proposal
      },
      clear_proposal(state) {
        state.proposal = ''
        sessionStorage.removeItem('prop')
        // Legacy app
        app.prop = state.proposal
      },
      save_proposal_type(state, proposalType) {
        // Save type, default to user type if null passed
        state.proposalType = proposalType ? proposalType : state.user.defaultType
        app.type = state.proposalType
      },
      clear_proposal_type(state) {
        // Save type, default to user type if null passed
        state.proposalType = state.user.defaultType ? state.user.defaultType : 'mx'
        app.type = state.proposalType
      },
      save_visit(state, visit) {
        state.visit = visit
      },
      clear_visit(state) {
        state.visit = ''
      },
      //
      // Notifications and alerts
      //
      add_notification(state, payload) {
        console.log("Adding notification " + payload.message)
        let notification = payload
        notification.id = Date.now() // Using number of miliseconds since 1970 as uid

        state.notifications.push(notification)
      },
      clear_notifications(state) {
        console.log("Clearing notifications")
        state.notifications = []
      },
      clear_notification(state, id) {
        console.log("Store Clearing notification for id " + id)
        state.notifications = state.notifications.filter(notification => notification.id !== id)
      },
      save_options(state, options) {
        state.auth.type = options.get('authentication_type')
        state.auth.cas_sso = options.get('cas_sso')
        state.auth.cas_url = options.get('cas_url')
        console.log("STORE UPDATING OPTIONS " + state.auth.cas_sso)
        console.log("STORE UPDATING OPTIONS " + state.auth.cas_url)
      },
      //
      // Loading screen
      //
      loading(state, status) {
        console.log("STORE set loading to: " + status)
        state.loading = status ? true : false
      },
      //
      // Authorisation status
      //
      auth_request(state){
        state.status = 'loading'
        state.loading = true
      },
      auth_success(state, token, username){
        state.loading = false
        state.status = 'success'
        state.token = token
        state.user.username = username // part of larger user object, we don't have all the info yet
        sessionStorage.setItem('token', token)
        // Preserve legacy app
        app.token = state.token
      },
      auth_error(state){
        state.loading = false
        state.status = 'error'
        state.token = ''
        sessionStorage.removeItem('token')
      },
      update_user(state, user) {
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
        state.status = ''
        state.token = ''
        state.proposal = ''
        state.user = {}
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('prop')
        // Preserve legacy app
        app.token = state.token
        app.prop = state.proposal
      },      
  },
  actions: {
    async initialise({dispatch, commit}) {
      if (!this.state.initialised) {
        console.log("STORE INIITALISE")
        this.state.initialised = true

        app.apiurl = this.state.apiRoot
        
        // Get any stored value from sessionStorage
        var prop = sessionStorage.getItem('prop')
        var token = sessionStorage.getItem('token')
  
        if (token) {
          console.log("Store Initialised token = " + token)
          commit('auth_success', token)
        }

        if (prop) {
          commit('save_proposal', prop)
        }
        await dispatch('get_options').then(() =>{
          console.log("GET OPTIONS HAS FINISHED")
        })
      }
    },
    async get_options({commit}) {
      return new Promise((resolve, reject) => {
        let options = new Options()

        options.fetch({
          data: { t: new Date().getTime() },
          success: function() {
            commit('save_options', options)
            // Let legacy part of app have access to this model
            app.options = options
            resolve()
          },

          error: function() {
            console.log("Error getting options - no authentication information available")
            reject()
          },  
        })
      })
    },
    set_proposal({commit}, prop) {
      console.log("STORE SET PROPOSAL SELECTED: " + prop)
      if (prop) {
        // If we don't do this now - the ProposalModel appends the old proposal code onto the request
        commit('save_proposal', prop)

        return new Promise((resolve, reject) => {
          var proposalModel = new Proposal({ PROPOSAL: prop })

          proposalModel.fetch({
              success: function() {
                var proposalType = proposalModel.get('TYPE')
                commit('save_proposal_type', proposalType)
                resolve()
              },

              error: function() {
                commit('add_notification', { title: 'No such proposal', message: 'The selected proposal does not exist', level: 'error' })
                commit('clear_proposal')
                commit('clear_proposal_type')
                reject()
              },  
          })
        })
      } else {
        commit('clear_proposal')
        commit('clear_proposal_type')
      }
    },
    log({commit}, url) {
      console.log("Store tracking url: " + url)
    },
    login({commit}, credentials) {
      return new Promise((resolve, reject) => {
        commit('auth_request')

        Backbone.ajax({
          url: this.state.apiRoot+'/authenticate',
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

    logout({commit}){
      return new Promise((resolve, reject) => {
        commit('logout')
        resolve()
      })
    },

    get_user({commit}, options) {
      return new Promise((resolve, reject) => {
        // If not already logged in - return
        
        Backbone.ajax({
          url: this.state.apiRoot+'/users/current',
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

            commit('clear_proposal')

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
    proposalType: state => state.proposalType,
    token: function(state) {
      if (!state.token) {
        // Any in storage?
        state.token = sessionStorage.getItem('token')
      }
      return state.token
    },
    isLoading: state => state.loading,
    authStatus: state => state.status,
    apiRoot: state => state.apiRoot,
    currentProposal: function(state) {
      // If we have no proposal set, check if there is one in storage
      if (!state.proposal) {
        let prop = sessionStorage.getItem('prop')
        if (prop) {
          state.proposal = prop
          app.prop = state.proposal
        } else {
          state.proposal = ''
        }
      }
      return state.proposal
    },

    sso: state => state.auth.cas_sso,
    notifications: state => state.notifications,
  }
})

// We need to map marionette functions onto their store mutations/actions
let application = MarionetteApplication.getInstance()

application.initStateMapping(store)

// Make sure the store is initialised when its imported
store.dispatch('initialise')

export default store