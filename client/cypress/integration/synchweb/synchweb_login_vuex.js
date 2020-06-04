const _ = Cypress._

const base_url = 'https://localhost:9000'


describe('SynchWeb Dev Server', () => {
    const getStore = () => cy.window().its('vm.$store')

    Cypress.Commands.add('loginByVuex', (overrides = {}) => {
        Cypress.log({
            name: 'loginByVuex',
        })

        const credentials = {
            login: 'boaty',
            password: 'mcboatface',
        }
        // Should this be a staff user or not?
        const staff_user = true

        // Clear out any old authentication information
        getStore().then(store => { store.commit('logout') })

        cy.getCookie('token').should('not.exist')

        getStore().then(store => {
            store.dispatch('login', credentials).then( (resp) => {
                expect(resp.jwt).to.exist
                store.dispatch('get_user')
            })
        })
        // Waiting until we have both the user logged in and type information loaded
        // We know if the user info is loaded when a valid person id is set
        getStore().its('state.auth.user.username').should('equal', 'boaty')
        getStore().its('state.auth.user.personId').should('not.equal', 0)
        getStore().its('state.auth.user.isStaff').should('equal', staff_user)
    })

  context('Use Vuex store to login', function () {
      // Make sure the app is loaded by visiting the root page
      beforeEach(() => {
        cy.visit(base_url)
      })

      it('can authenticate via Vuex methods', function () {
        // before we start, there should be no session cookie
        cy.getCookie('token').should('not.exist')
  
        cy.loginByVuex().then(() => {
            let token = cy.getCookie('token')

            expect(token).to.exist
            // you don't need to do this next part but
            // just to prove we can also visit the page in our app
            cy.visit(base_url + '/proposals')
    
            cy.contains('Proposals')

            cy.wait(3000)

        })

 
      })
    })
})