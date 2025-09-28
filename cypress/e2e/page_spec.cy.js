describe("Name of the group", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  describe("example page", () => {
    it("contains example text", () => {
      cy.get("h1").should("be.visible").should("include.text", "Recent posts");
    });
  });
});
