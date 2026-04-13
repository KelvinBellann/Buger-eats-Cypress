import { securityPayloads } from "../../support/security";
import type { DeliverData } from "../../support/commands";

const aiPromptForData =
  "Gere um JSON com dados realistas para cadastro de entregador (nome completo, cpf, email, whatsapp, " +
  "endereco completo, metodo de entrega e nome de um arquivo de CNH ja existente em cypress/fixtures/images).";

describe("Security | Signup validation", () => {
  beforeEach(() => {
    cy.visitSignupPage();
  });

  it("should reject injection-like CPF payloads", () => {
    cy.requestAiSignupData(aiPromptForData).then((deliver) => {
      const maliciousDeliver: DeliverData = {
        ...deliver,
        cpf: securityPayloads.sqlInjection
      };

      cy.fillSignupForm(maliciousDeliver);
      cy.submitSignupForm();
      cy.expectAlertMessage("CPF");
      cy.get("body").should("not.contain.text", "ReferenceError");
    });
  });

  it("should reject malformed email payloads without exposing stack traces", () => {
    cy.requestAiSignupData(aiPromptForData).then((deliver) => {
      const maliciousDeliver: DeliverData = {
        ...deliver,
        email: securityPayloads.invalidEmail
      };

      cy.fillSignupForm(maliciousDeliver);
      cy.submitSignupForm();
      cy.expectAlertMessage("Email com formato");
      cy.get("body").should("not.contain.text", "Error:");
    });
  });

  it("should keep file upload mandatory on empty submissions", () => {
    cy.submitSignupForm();
    cy.expectAlertMessage("CNH");
  });
});
