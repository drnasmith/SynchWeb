describe('SynchWeb Dev Server', () => {
    const base_url = 'https://localhost:9000'
    const proposal = 'cm14451'

    // Login first then we will check navigation
    before( () => {
        cy.visit(base_url)

        cy.get('#vue-header').contains('Login').click()

        cy.get('input[name=login]').type('boaty')
        cy.get('input[name=password]').type('mcboatface')
        cy.get('button').click()
        cy.wait(3000)

    })

    it('Test Admin Groups navigation', () => {
        cy.visit(base_url + '/admin/groups')

        cy.get('#marionette-view h1').contains('Manage Groups')
        cy.wait(3000)
    })

    it('Test Admin Proposal navigation', () => {
        cy.visit(base_url + '/admin/proposals')

        cy.get('#marionette-view h1').contains('Proposals')

        cy.wait(3000)
        // Find first table entry and navigate to that
        cy.get('table.proposals')
            .get('tbody>tr')
            .eq(0).click()
        cy.contains('View Proposal')

        cy.wait(3000)
    })
    
    it('Test Admin Visits navigation', () => {
        cy.visit(base_url + '/admin/proposals/visit/add/' + proposal)

        cy.get('#marionette-view h1').contains('Add New Visits')
        cy.wait(3000)
    })

  })