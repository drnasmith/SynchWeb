describe('SynchWeb Dev Server', () => {
    it('Login to CAS Server', () => {
        cy.visit('https://cas/cas/login?service=https://localhost:9000')

        cy.get('input[name=username]').type('boaty')
        cy.get('input[name=password]').type('mcboatface')
        cy.get('input[name=submit').click()
    })
  })