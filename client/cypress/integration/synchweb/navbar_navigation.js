describe('SynchWeb Dev Server', () => {
    const base_url = 'https://localhost:9000'

    // Login first then we will check navigation
    before( () => {
        cy.visit(base_url)
        cy.get('#vue-header').contains('Login').click()
        cy.get('input[name=login]').type('boaty')
        cy.get('input[name=password]').type('mcboatface')
        cy.get('button').click()
        cy.wait(3000)

        // Proposal heading should say No Proposal
        cy.get('[data-cy=navbar] a').eq(1).contains('No Proposal')
        // Select a proposal
        cy.get('[data-cy=navbar] a').eq(0).click().contains('Proposals')

        // Find first table entry and navigate to that
        const row = cy.get('table.proposals')
            .get('tbody>tr')
            .eq(0)
            
        row.click()

        cy.wait(3000)
        
    })

    it('Test Navbar Menu', () => {
        // Proposal heading should say No Proposal
        var proposal_menu;
        
        proposal_menu = cy.get('[data-cy=navbar] a').eq(1)
        proposal_menu.trigger('mouseover')
        // proposal_menu.get('[data-cy=navbar-proposal-menu] li').eq(i).click()
        proposal_menu.get('[data-cy=navbar-proposal-menu] li')
            .contains('Calendar')
            .click()
            .contains('Calendar')

        proposal_menu = cy.get('[data-cy=navbar] a').eq(1)
        proposal_menu.trigger('mouseover')
        // proposal_menu.get('[data-cy=navbar-proposal-menu] li').eq(i).click()
        proposal_menu.get('[data-cy=navbar-proposal-menu] li')
            .contains('Statistics')
            .click()
            .contains('Statistics')

    })
    
  })