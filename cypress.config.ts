import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

interface LlmChatInput {
  prompt: string;
}

interface LlmChatResponse<T = unknown> {
  content: string;
  data?: T;
  verdict?: boolean;
  reason?: string;
}

const buildFakeDeliverData = () => ({
  name: "Aluno Demo",
  cpf: "02624487040",
  email: "aluno.demo@buger-eats.test",
  whatsapp: "51987654321",
  address: {
    postalCode: "93800036",
    street: "Rua Padre Reus",
    number: "451",
    details: "Floricultura",
    district: "Centro",
    cityState: "Sapiranga/RS",
  },
  deliveryMethod: "Moto" as const,
  cnh: "cnh-digital.jpg",
});

const mockLlm = <T>(prompt: string): LlmChatResponse<T> => {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("massa") || normalized.includes("cadastro")) {
    return {
      content: "Dados ficticios gerados localmente para fins de demonstracao.",
      data: buildFakeDeliverData() as unknown as T,
    };
  }

  if (normalized.includes("valide") || normalized.includes("mensagem")) {
    return {
      content: "Validacao de texto feita pela IA local.",
      verdict: true,
      reason: "O texto exibido na tela confere com o esperado.",
    };
  }

  return {
    content: `IA local apenas ecoou o prompt: ${prompt}`,
  };
};

export default defineConfig({
  projectId: "7jr6zv",
  viewportWidth: 1440,
  viewportHeight: 900,
  e2e: {
    baseUrl: "https://buger-eats-qa.vercel.app",
    specPattern: "cypress/e2e/**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      // Define explicit pattern de steps para evitar depender de argumentos de CLI.
      config.env.stepDefinitions =
        "cypress/e2e/**/*.steps.{ts,tsx,js,jsx,mjs,cjs}";

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      on("task", {
        llmChat: async ({ prompt }: LlmChatInput) => mockLlm(prompt),
      });

      return config;
    },
  },
});
