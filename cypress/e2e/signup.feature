Feature: Cadastro de entregadores
  Para garantir entregas ágeis
  Jovens entregadores precisam de um cadastro simples e validado por IA

  Background:
    Given que estou na página de cadastro

  @ui
  Scenario: Validar primeira tela
    Then vejo o título "Cadastre-se para  fazer entregas"
    And vejo o link "Voltar para home"
    And vejo os campos principais de cadastro

  @happy @entrega
  Scenario Outline: Cadastro feliz por método de entrega
    When peço para a IA gerar um entregador válido
    And defino o método de entrega como "<metodo>"
    And preencho o formulário com os dados da IA
    And envio o cadastro
    Then a mensagem de sucesso deve ser validada pela IA

    Examples:
      | metodo         |
      | Moto           |
      | Bike Elétrica  |
      | Van/Carro      |

  @required
  Scenario: Campos obrigatórios
    When envio o cadastro sem preencher o formulário
    Then vejo os alertas obrigatórios:
      | É necessário informar o nome                |
      | É necessário informar o CPF                 |
      | É necessário informar o email               |
      | É necessário informar o CEP                 |
      | É necessário informar o número do endereço  |
      | Selecione o método de entrega               |
      | Adicione uma foto da sua CNH                |

  @negative
  Scenario Outline: Validações de erro
    When peço para a IA gerar um entregador válido
    And altero o "<campo>" para "<valor>"
    And preencho o formulário com os dados da IA
    And envio o cadastro
    Then vejo o alerta "<mensagem>"

    Examples:
      | campo | valor       | mensagem                          |
      | cpf   | x00479610FA | Oops! CPF inválido                |
      | email | user.com.br | Oops! Email com formato inválido. |
