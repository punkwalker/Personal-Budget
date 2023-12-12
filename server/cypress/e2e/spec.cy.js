var assert = require('assert');

describe('Navigate to homepage', () => {
  it('Should navigate to homepage', () => {
    // Visit the homepage
    cy.visit('http://localhost:4200');

    // Assert something (replace with your actual assertions)
    cy.get('.hero').should('contain', 'Personal Budget Tracker');
  });
});