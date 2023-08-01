module.exports = {
  typeInput(prefix: string, fieldName: string, value): void {
    if (value === "") {
      cy.get(prefix + `[name="${fieldName}"]`).clear();
    } else {
      cy.get(prefix + `[name="${fieldName}"]`).clear();
      cy.get(prefix + `[name="${fieldName}"]`).type(value, { parseSpecialCharSequences: false });
    }
  }
};