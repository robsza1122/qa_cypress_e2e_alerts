describe('Cypress application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have the ability to assert automatically resolved alerts', () => {
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('You clicked a button');
    });

    cy.get('#alertButton').click();
  });

  it('should have the ability to assert scheduled allert', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });

    cy.get('#timerAlertButton').click();

    cy.get('@alertStub', { timeout: 6000 })
      .should('have.been.calledOnceWith',
        'This alert appeared after 5 seconds');
  });

  it('should autimatically resolve alerts', () => {
    cy.on('window:confirm', (confirmationText) => {
      expect(confirmationText).to.equal(
        'Do you confirm action?');
    });
    cy.get('#confirmButton')
      .click();
    cy.get('#confirmResult')
      .should('contain', 'Ok');
  });

  it('should have the ability to Cancel alerts', () => {
    cy.on('window:confirm', (confirmationText) => {
      expect(confirmationText).to.equal(
        'Do you confirm action?');
      return false;
    });
    cy.get('#confirmButton')
      .click();
    cy.get('#confirmResult')
      .should('contain', 'Cancel');
  });

  it('should have the ability to enter text to alert', () => {
    cy.window().then((win) => {
      cy.stub(win, 'prompt').as('promptStub').returns('This is prompt message');
    });
    cy.get('#promptButton').click();

    cy.get('@promptStub')
      .should('have.been.calledOnceWith', 'Please enter your name');

    cy.get('#promptResult').should('contain', 'This is prompt message');
  });
});
