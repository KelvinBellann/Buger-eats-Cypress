import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import type { DataTable } from "@badeball/cypress-cucumber-preprocessor";
import type { DeliverData } from "../support/commands";

const SUCCESS_MESSAGE_DESCRIPTION =
  "Recebemos os seus dados. Fique de olho na sua caixa de email, pois em breve retornamos o contato.";

const aiPromptForData =
  "Gere um JSON com dados realistas para cadastro de entregador (nome completo, cpf, email, whatsapp, " +
  "endereço completo, método de entrega e nome de um arquivo de CNH já existente em cypress/fixtures/images).";

const ensureDeliverAlias = () => {
  cy.get<DeliverData | undefined>("@deliverData").then((current) => {
    if (!current) {
      cy.requestAiSignupData(aiPromptForData).as("deliverData");
    }
  });
};

const overrideDeliverField = (field: string, value: string) => {
  ensureDeliverAlias();
  cy.get<DeliverData>("@deliverData").then((deliver) => {
    const updated: DeliverData = { ...deliver };

    if (field === "cpf") updated.cpf = value;
    if (field === "email") updated.email = value;
    if (field === "whatsapp") updated.whatsapp = value;
    if (field === "nome" || field === "name") updated.name = value;
    if (field === "metodo" || field === "método" || field === "delivery") {
      updated.deliveryMethod = value as DeliverData["deliveryMethod"];
    }

    cy.wrap(updated).as("deliverData");
  });
};

Given("que estou na página de cadastro", () => {
  cy.visitSignupPage();
});

Then('vejo o título {string}', (title: string) => {
  cy.get("#page-deliver form h1").should("contain.text", title);
});

Then('vejo o link "Voltar para home"', () => {
  cy.contains('a[href="/"]', "Voltar para home").should("be.visible");
});

Then("vejo os campos principais de cadastro", () => {
  const fields = [
    'input[name="fullName"]',
    'input[name="cpf"]',
    'input[name="email"]',
    'input[name="whatsapp"]',
    'input[name="postalcode"]',
    'input[name="address-number"]',
    'input[name="address-details"]',
    ".dropzone"
  ];

  fields.forEach((selector) => cy.get(selector).should("be.visible"));
});

When("peço para a IA gerar um entregador válido", () => {
  cy.requestAiSignupData(aiPromptForData).as("deliverData");
});

When('defino o método de entrega como {string}', (method: string) => {
  overrideDeliverField("metodo", method);
});

When("altero o {string} para {string}", (field: string, value: string) => {
  overrideDeliverField(field, value);
});

When("preencho o formulário com os dados da IA", () => {
  ensureDeliverAlias();
  cy.get<DeliverData>("@deliverData").then((deliver) => {
    cy.fillSignupForm(deliver);
  });
});

When("envio o cadastro", () => {
  cy.submitSignupForm();
});

Then("a mensagem de sucesso deve ser validada pela IA", () => {
  cy.expectSuccessMessageWithAi(SUCCESS_MESSAGE_DESCRIPTION);
});

Then("vejo o alerta {string}", (message: string) => {
  cy.expectAlertMessage(message);
});

When("envio o cadastro sem preencher o formulário", () => {
  cy.submitSignupForm();
});

Then("vejo os alertas obrigatórios:", (table: DataTable) => {
  table.raw().forEach(([message]) => {
    cy.expectAlertMessage(message);
  });
});
