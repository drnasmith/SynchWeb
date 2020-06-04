const _ = Cypress._

// require node's url module
const url = require('url')

const synchweb_url = 'https://192.168.33.10'
const base_url = 'https://192.168.33.10'


describe('SynchWeb Dev Server', () => {

    const getApp = () => cy.window().its('app')

    Cypress.Commands.add('loginByRestApi', (overrides = {}) => {
        Cypress.log({
          name: 'loginByRestApi',
        })
    
        const options = {
          method: 'POST',
          url: synchweb_url + '/api/authenticate',
          form: true, // we are submitting a regular form body
          body: {
            login: 'boaty',
            password: 'mcboatface',
          },
        }

        const staff_user = true
    
        // allow us to override defaults with passed in overrides
        _.extend(options, overrides)
    
        cy.request(options).then(() => {
        getApp().then( app => { app.apiurl = '/api'} )
        // Get user info
        getApp().then( (app) => { app.get_user() })
      })

      getApp().its('user').should('equal', 'boaty')
      getApp().its('personId').should('not.equal', 0)
      getApp().its('isStaff').should('equal', staff_user)
    })


  context('Use rest api to login', function () {

      // Make sure the app is loaded by visiting the root page
      beforeEach(() => {
        cy.visit(synchweb_url)
      })

      it('can authenticate with cy.request', function () {
        // before we start, there should be no session cookie
        cy.getCookie('token').should('not.exist')
  
        cy.loginByRestApi().then(() => {
            let token = cy.getCookie('token')

            expect(token).to.exist
        })
    
        // // you don't need to do this next part but
        // // just to prove we can also visit the page in our app
        cy.visit(synchweb_url + '/proposals')
  
        cy.contains('Proposals')
      })
    })
})