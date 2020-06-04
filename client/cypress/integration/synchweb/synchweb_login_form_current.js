describe('SynchWeb Dev Server', () => {
    it('Login to SynchWeb', () => {
        cy.visit('https://192.168.33.10')

        cy.get('input[name=login]').type('boaty')
        cy.get('input[name=password]').type('mcboatface')
        cy.get('button').click()

        cy.contains('Current').wait(3000)
        // cy.visit('http://localhost:9000/contacts/cid/2')
    })
  })