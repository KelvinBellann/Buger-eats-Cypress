# Teste de GUI com Cypress

#### O projeto de testes foi realizado sobre a aplicação [Buger Eats](https://buger-eats-qa.vercel.app), desenvolvida pelo [Fernando Papito](https://www.linkedin.com/in/papitoio/)

## Conceitos Apresentados no Módulo
- Introdução ao Javascript
- Checkpoints
- Page Objects
- Teste multibrowser
- Refatoração
- Evidências


## Tecnologias Utilizadas
- [Cypress](https://www.cypress.io/)
- [Node.js](https://nodejs.org/en/)
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)


## Como Executar o Projeto
```bash
# Clone este repositório
$ git clone https://github.com/KelvinBellanBorges/cypress_discovery_qaninja.git
```
A execução pode ser feita através da linha de comando ou do próprio framework.
- Através da linha de comando:
```bash
# Na pasta cypress_discovery_qaninja, execute:
$ npx cypress open
```
- Através do framework:
Basta abrir o Cypress e através da interface dele escolher a pasta do projeto.

Após isso, é só escolher a "SPEC" desejada e assistir a execução dos testes.


![running test](https://user-images.githubusercontent.com/71460952/114319822-7ec79a80-9ae9-11eb-951e-66e0c20e730a.gif)

OU

```bash
# Na pasta cypress_discovery_qaninja, execute:
$ npx cypress run
```

## Suite de seguranca

Foi adicionada uma lane de seguranca focada no que este repositorio realmente cobre: validacao de entrada no cadastro publico, upload obrigatorio, ausencia de erro sensivel na tela e higiene de configuracao do proprio repositorio.

### Escopo coberto

- `cypress/e2e/security`: cenarios de input tampering no formulario de cadastro
- `cypress/support/security.ts`: payloads reutilizaveis
- `scripts/security/repo-config-check.js`: prevencao de secrets hardcoded e `.env` versionado

### Como executar

```bash
npm run test:security
```

### Limitacoes

- Como o codigo da aplicacao alvo nao esta neste repositorio, controles de backend como auth, sessao, rate limiting, CORS, headers e upload server-side ficam como recomendacao manual
- Os testes automatizados usam apenas o comportamento de UI realmente observado no fluxo de cadastro

O baseline de risco segue OWASP Top 10 2025, com referencia a ASVS e WSTG. O detalhamento completo esta em [SECURITY_TEST_PLAN.md](./SECURITY_TEST_PLAN.md).


##
Feito com carinho por Kelvin Bellan Borges. Entre em contato!
<div> 
  <a href = "mailto:contatorafaballerini@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white" target="_blank"></a>
  <a href="https://www.linkedin.com/in/kelvin-bellan-68273a15a/" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank"></a> 

</div>
