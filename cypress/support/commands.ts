import "cypress-file-upload";

export interface DeliverAddress {
  postalCode: string;
  street: string;
  number: string;
  details?: string;
  district: string;
  cityState: string;
}

export interface DeliverData {
  name: string;
  cpf: string;
  email: string;
  whatsapp: string;
  address: DeliverAddress;
  deliveryMethod: "Moto" | "Bike Elétrica" | "Van/Carro";
  cnh: string;
}

export interface LlmChatResponse<T = unknown> {
  content: string;
  data?: T;
  verdict?: boolean;
  reason?: string;
}

const SELECTORS = {
  linkToSignup: 'a[href="/deliver"]',
  formTitle: "#page-deliver form h1",
  successModal: ".swal2-container .swal2-html-container",
  alertError: ".alert-error",
};

/**
 * Navega até o fluxo de cadastro, validando que a tela foi carregada.
 */
Cypress.Commands.add("visitSignupPage", () => {
  cy.visit("/");
  cy.get(SELECTORS.linkToSignup).click();
  cy.get(SELECTORS.formTitle).contains("Cadastre-se");
});

/**
 * Preenche o formulário de cadastro usando um objeto tipado.
 */
Cypress.Commands.add("fillSignupForm", (deliver: DeliverData) => {
  cy.get('input[name="fullName"]').clear().type(deliver.name);
  cy.get('input[name="cpf"]').clear().type(deliver.cpf);
  cy.get('input[name="email"]').clear().type(deliver.email);
  cy.get('input[name="whatsapp"]').clear().type(deliver.whatsapp);

  cy.get('input[name="postalcode"]').clear().type(deliver.address.postalCode);
  cy.get('input[type=button][value="Buscar CEP"]').click({force: true});

  cy.get('input[name="address-number"]').clear().type(deliver.address.number);
  cy.get('input[name="address-details"]').clear().type(deliver.address.details || "");

  cy.get('input[name="address"]').should("have.value", deliver.address.street);
  cy.get('input[name="district"]').should("have.value", deliver.address.district);
  cy.get('input[name="city-uf"]').should("have.value", deliver.address.cityState);

  cy.contains(".delivery-method li", deliver.deliveryMethod).click();
  cy.get('input[accept^="image"]').attachFile(`/images/${deliver.cnh}`);
});

/**
 * Envia o formulário.
 */
Cypress.Commands.add("submitSignupForm", () => {
  cy.get('form button[type="submit"]').click();
});

/**
 * Verifica um alerta de erro exibido na tela.
 */
Cypress.Commands.add("expectAlertMessage", (expectedMessage: string) => {
  cy.contains(SELECTORS.alertError, expectedMessage).should("be.visible");
});

/**
 * Pede ajuda da IA (mockada via task) para validar o texto de sucesso.
 */
Cypress.Commands.add(
  "expectSuccessMessageWithAi",
  (expectedDescription: string) => {
    cy.get(SELECTORS.successModal)
      .should("be.visible")
      .invoke("text")
      .then((textFromScreen) => {
        const prompt = `Valide se a mensagem "${textFromScreen.trim()}" confirma: "${expectedDescription}". Responda JSON { "verdict": true|false, "reason": "..." }.`;

        cy.task<LlmChatResponse>("llmChat", { prompt }).then((response) => {
          const verdict = response.verdict ?? false;
          expect(verdict, response.reason || response.content).to.be.true;
        });
      });
  }
);

/**
 * Pede para a IA gerar massa de teste. Usamos um mock local para ser determinístico em aula.
 */
Cypress.Commands.add(
  "requestAiSignupData",
  (prompt: string): Cypress.Chainable<DeliverData> => {
    return cy
      .task<LlmChatResponse<DeliverData>>("llmChat", { prompt })
      .then((response) => {
        if (response.data) {
          return response.data;
        }

        const parsed = JSON.parse(response.content) as DeliverData;
        return parsed;
      });
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      visitSignupPage(): Chainable<void>;
      fillSignupForm(deliver: DeliverData): Chainable<void>;
      submitSignupForm(): Chainable<void>;
      expectAlertMessage(expectedMessage: string): Chainable<void>;
      expectSuccessMessageWithAi(expectedDescription: string): Chainable<void>;
      requestAiSignupData(prompt: string): Chainable<DeliverData>;
    }
  }
}
