const express = require("express")
const endPoint = require("./controladores/EndPoints")

const rota = express()

rota.get("/contas",endPoint.listarContas)

rota.post("/Contas",endPoint.criarConta)

rota.put ("/contas/:numeroConta/usuario",endPoint.alterarConta)

rota.delete("/contas/:numero_conta",endPoint.excluirConta)

rota.post("/transacoes/depositar",endPoint.depositarMoney)

rota.post("/transacoes/sacar",endPoint.sacarMoney)

rota.post("/transacoes/transferir",endPoint.transferirMoney)

rota.get("/contas/saldo",endPoint.consultarSaldo)

rota.get("/contas/extrato",endPoint.retirarExtrato)


module.exports = rota