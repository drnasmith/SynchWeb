import Vue from 'vue'
import Vuex from 'vuex'

import MenuStore from './modules/store.menus.js'
import AuthStore from './modules/store.auth.js'

import Backbone from 'backbone'
import Proposal from 'models/proposal.js'
import Options from 'models/options.js'
import ProposalLookup from 'models/proplookup.js'

import MarionetteApplication from 'app/views/marionette/singleton.js'

Vue.use(Vuex)

var API_ROOT = '/api'


const store = new Vuex.Store({
  modules: {
    menu: MenuStore,
    auth: AuthStore,
  },
  state: {
    // Flag we use to check if we have already setup options
    initialised: false,
    // Global api prefix
    apiRoot: API_ROOT,
    // Proposal / visit info
    proposal: '',
    proposalType: 'mx',
    visit: '',
    // Notifications and events
    notifications: [],
    loading: false,
  },
  mutations: {
    //
    // Proposal and visit information
    //
    set_proposal(state, prop) {
      if (prop) {
        state.proposal = prop
        sessionStorage.setItem('prop', prop)
      } else {
        state.proposal = ''
        sessionStorage.removeItem('prop')

        // Reset the proposal Type as well
        state.proposalType = state.auth.user.defaultType ? state.auth.user.defaultType : null
        app.type = state.proposalType
      }
      // Legacy app
      app.prop = state.proposal
    },
    set_proposal_type(state, proposalType) {
      // Save type, default to user type if null passed
      state.proposalType = proposalType ? proposalType : state.user.defaultType
      app.type = state.proposalType
    },
    set_visit(state, visit) {
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
    set_options(state, options) {
      console.log("STORE UPDATING OPTIONS SSO: " + state.auth.cas_sso)

      state.auth.type = options.get('authentication_type')
      state.auth.cas_sso = options.get('cas_sso')
      state.auth.cas_url = options.get('cas_url')

      app.options = options
    },
    //
    // Loading screen
    //
    loading(state, status) {
      console.log("STORE set loading to: " + status)
      state.loading = status ? true : false
    },
  },
  actions: {
    // Initialise the Store
    // This will set the app object with values from prop and token on start
    // Also initialise marionette methods that require access to the store
    initialise({dispatch, commit}) {
      return new Promise((resolve, reject) => {
        // First guard for the case we are already initialised
        if (this.state.initialised) { resolve(true); return }

        console.log("STORE INIITALISE")
        this.state.initialised = true

        // We need to map marionette functions onto their store mutations/actions
        let application = MarionetteApplication.getInstance()

        application.initStateMapping(store)
        
        // Get any stored value from sessionStorage and set the app object
        var prop = sessionStorage.getItem('prop')
        var token = sessionStorage.getItem('token')
        
        if (token) commit('auth_success', token)
        if (prop) commit('set_proposal', prop)

        // We need to know if we should use single sign on etc.
        // Get options then we can determine if we need to check user info
        dispatch('get_options')
        .then(function(val) {
          resolve(val)
        }, function(val) {
          reject(val)
        }).then(() => {
          // If we have a token but no user info - get this now
          if (token && !app.user ) dispatch('get_user').then(() => { resolve() })
        }, () => { console.log("Error getting app options") })
      })
    },
    get_options({commit}) {
        let options = new Options()

        return new Promise((resolve, reject) => {
          options.fetch({
            data: { t: new Date().getTime() },
            success: function() {
              commit('set_options', options)
              resolve(true)
            },

            error: function() {
              console.log("Error getting options - no authentication information available")
              reject(false)
            },  
          })
        })
    },
    set_proposal({commit}, prop) {
      console.log("STORE SET PROPOSAL SELECTED: " + prop)
      
      return new Promise((resolve, reject) => {
        if (prop) {
          // If we don't do this now - the ProposalModel appends the old proposal code onto the request
          commit('set_proposal', prop)
  
          var proposalModel = new Proposal({ PROPOSAL: prop })

          proposalModel.fetch({
              success: function() {
                var proposalType = proposalModel.get('TYPE')
                commit('set_proposal_type', proposalType)
                resolve()
              },

              error: function() {
                commit('add_notification', { title: 'No such proposal', message: 'The selected proposal does not exist', level: 'error' })
                commit('set_proposal', null)
                reject()
              },
          })
        } else {
          commit('set_proposal', null)
          resolve()
        }
      })
    },
    log({commit}, url) {
      console.log("Store tracking url: " + url)
    },
    // Set the proposal based on looking up a collection/contact id
    // 
    proposal_lookup(state, params) {
      return new Promise((resolve, reject) => {
        var lookup = new ProposalLookup({ field: params.field, value: params.value })
        
        lookup.find({
            success: function() {
              // If ok then ProposalLookup has set a new proposal for us
              // We might need to do other things here - refresh proposal type?
              console.log(JSON.stringify(lookup))
              resolve(lookup)
            },
            error: function() {
              reject({msg: 'Error looking up proposal from ' + params.field})
            }
        })
      })
    },

  },
  getters: {
    proposalType: state => state.proposalType,
    isLoading: state => state.loading,
    apiRoot: state => state.apiRoot,
    currentProposal: function(state) {
      // If we have no proposal set, check if there is one in storage
      // Should not need to do this now.... TODO - simplify this
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
    sso_url: state => state.auth.cas_url,
    notifications: state => state.notifications,
  }
})

export default store
