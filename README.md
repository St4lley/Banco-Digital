# Descrição do projeto

- Esse projeto foi feito junto ao curso da @cubos academy como finalizacao do modulo 2
- É um projeto piloto de um banco digital com todos os sitemas e verificaçoes basicas de um banco
  que será atualizado aos poucos de acordo com o aprendizado.

# Requisitos minimos para iniciar a  API

- Programa GIT ou similar (https://git-scm.com/downloads)
- Programa NodeJS ou similar (https://nodejs.org/en/download/)
- Programa VScode ou similar (https://code.visualstudio.com/download)
- Programa Insomnia ou similar (https://insomnia.rest/download)

# Passo a passo

[1] Após ter esses programas instalados, Devera fazer um fork no repositorio e fazer um clone para a sua maquina.

[2] Execute a pasta clonada *Banco-Digital* com o Vscode.

[3] Inicie um terminal e utilize o comando -npm intall- para fazer o dowload da pasta node_modules.

[4] Execute o comando -npm run dev- para executar a API.

[5] Utilizando o programa Insomnia faça as requisicoes com a rota 5000 (http://localhost:5000/) para a API.

#### `Listar contas` - `/contas?senha_banco=Cubos123Bank`

-   **Requisição** - query params (respeitando este nome)

    -   senha_banco
      
#### `criar conta` - `/contas`

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

 #### `Att conta` - `/contas/:numeroConta/usuario`

- **Requisição** - O corpo (body) deverá possuir um objeto com todas as seguintes propriedades (respeitando estes nomes):

    -   nome
    -   cpf
    -   data_nascimento
    -   telefone
    -   email
    -   senha

#### `Excluir Conta` - `/contas/:numeroConta`

-   **Requisição**

    -   Numero da conta bancária (passado como parâmetro na rota)

#### `Depositar` - `/transacoes/depositar` 

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor
 
#### `Sacar` - `/transacoes/sacar`

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta
    -   valor
    -   senha

#### `Tranferir` `/transacoes/transferir` 

-   **Requisição** - O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

    -   numero_conta_origem
    -   numero_conta_destino
    -   valor
    -   senha
 
#### `Saldo` `/contas/saldo?numero_conta=123&senha=123`

-   **Requisição** - query params

    -   numero_conta
    -   senha
 
#### `Extrato` `/contas/extrato?numero_conta=123&senha=123`

-   **Requisição** - query params

    -   numero_conta
    -   senha
