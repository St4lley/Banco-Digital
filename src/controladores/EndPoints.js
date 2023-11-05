const { query } = require("express");
const {
    banco,
    contas,
    saques,
    depositos,
    transferencias,
} = require("../bancodedados");
const { verificarCpf, verificarEmail } = require("./functions");

const listarContas = (req, res) => {
    const senha = req.query.senha_banco;
    if (senha !== banco.senha) {
        return res
            .status(403)
            .json({ mensagem: "A senha do banco informada é inválida!" });
    }
    res.status(200).json(contas);
    console.log("teste");
};

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res
            .status(400)
            .json({ mensgame: "Aesencia de informacoes obrigatorias" });
    }

    if (cpf.length !== 11) {
        return res.status(400).json({ mensagem: "CPF invalido" });
    }

    if (!verificarCpf(contas, cpf, res)) {
        return;
    }
    if (!verificarEmail(contas, email, res)) {
        return;
    }

    let numeroConta = 1;

    for (const conta of contas) {
        if (conta.numero >= numeroConta) {
            numeroConta = conta.numero + 1;
        }
    }

    let conta = {
        numero: numeroConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha,
        },
    };
    contas.push(conta);
    res.status(201).json();
};

const alterarConta = (req, res) => {
    const { numero, nome, cpf, data_nascimento, telefone, email, senha } =
        req.body;
    const { numeroConta } = req.params;

    const numero_conta = contas.findIndex(
        (conta) => conta.numero == numeroConta
    );

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res
            .status(400)
            .json({ mensgame: "Aesencia de informacoes obrigatorias" });
    }

    if (!contas.find((conta) => conta.numero == numeroConta)) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    const verificacaoConta = contas.filter(
        (conta) => conta.numero != numeroConta
    );

    if (!verificarCpf(verificacaoConta, cpf, res)) {
        return;
    }
    if (!verificarEmail(verificacaoConta, email, res)) {
        return;
    }

    contas[numero_conta].usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha,
    };
    res.status(204).json();
};

const excluirConta = (req, res) => {
    const { numero_conta } = req.params;

    const numeroConta = contas.findIndex(
        (conta) => conta.numero == numero_conta
    );

    console.log(numeroConta);

    if (!contas.find((conta) => conta.numero == numero_conta)) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    if (contas[numeroConta].saldo !== 0) {
        return res
            .status(403)
            .json({
                mensagem: "A conta só pode ser removida se o saldo for zero!",
            });
    }

    contas.splice(numeroConta, 1);

    res.status(204).json();
};

const depositarMoney = (req, res) => {
    const { numero_conta, valor } = req.body;

    const numeroConta = contas.findIndex(
        (conta) => conta.numero == numero_conta
    );

    if (!numero_conta || !valor) {
        return res
            .status(401)
            .json({
                mensagem: "O número da conta e o valor são obrigatórios!",
            });
    }

    if (!contas.find((conta) => conta.numero == numero_conta)) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    if (valor <= 0) {
        return res
            .status()
            .json({ mensagem: "O valor deve ser maior que 0 reais." });
    }
    contas[numeroConta].saldo += Number(valor);

    const deposito = {
        data: new Date(),
        numero_conta,
        valor,
    };
    depositos.push(deposito);

    res.status(204).json();
};

const sacarMoney = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const numeroConta = contas.findIndex(
        (conta) => conta.numero == numero_conta
    );

    if (!numero_conta || !valor || !senha) {
        return res
            .status(401)
            .json({
                mensagem: "O número da conta,senha e o valor são obrigatórios!",
            });
    }

    if (!contas.find((conta) => conta.numero == numero_conta)) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    if (senha !== contas[numeroConta].usuario.senha) {
        return res
            .status(402)
            .json({ mensagem: "ACESSO NEGADO,senha incorreta" });
    }

    if (valor <= 0) {
        return res
            .status(401)
            .json({ mensagem: "O valor não pode ser menor que zero!" });
    } else if (valor > contas[numeroConta].saldo) {
        return res.status(401).json({ mensagem: "Saldo insuficiente!" });
    }

    contas[numeroConta].saldo -= Number(valor);

    const saque = {
        data: new Date(),
        numero_conta,
        valor,
    };

    saques.push(saque);

    res.status(204).json();
};

const transferirMoney = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } =
        req.body;

    if (!numero_conta_destino || !numero_conta_origem || !valor || !senha) {
        res.status(400).json({
            mensagem: "todas as informacoes devem ser informadas",
        });
    }

    if (!contas.find((conta) => conta.numero == numero_conta_origem)) {
        return res
            .status(404)
            .json({ mensagem: "conta de origem não encontrada" });
    }

    if (!contas.find((conta) => conta.numero == numero_conta_destino)) {
        return res
            .status(404)
            .json({ mensagem: "conta de destino não encontrada" });
    }
    //pegando o indice
    const contaOrigem = contas.findIndex(
        (conta) => conta.numero === numero_conta_origem
    );
    const contaDestino = contas.findIndex(
        (conta) => conta.numero == numero_conta_destino
    );

    if (contas[contaOrigem].usuario.senha !== senha) {
        return res.status(403).json({ mensagem: "Senha incorreta" });
    }
    if (contas[contaOrigem].saldo < valor) {
        return res.status(403).json({ mensagem: "Saldo insuficiente" });
    }

    contas[contaOrigem].saldo -= valor;
    contas[contaDestino].saldo += valor;

    const transferencia = {
        data: new Date(),
        numero_conta_origem,
        numero_conta_destino,
        valor,
    };

    transferencias.push(transferencia);

    res.status(201).json();
};

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const numeroConta = contas.findIndex(
        (conta) => conta.numero == numero_conta
    );

    if (!numero_conta || !senha) {
        return res.status.json({
            mensagem: "Informe corretamente o numero da conta e senha",
        });
    }

    if (!contas.find((conta) => conta.numero == numero_conta)) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
    }

    if (contas[numeroConta].usuario.senha !== senha) {
        return res.status(402).json({ mensagem: "Senha incorreta!" });
    }

    res.status(200).json({ saldo: contas[numeroConta].saldo });
};

const retirarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    const numeroConta = contas.findIndex(
        (conta) => conta.numero == numero_conta
    );

    if (!numero_conta || !senha) {
        return res.status.json({
            mensagem: "Informe corretamente o numero da conta e senha",
        });
    }

    if (!contas.find((conta) => conta.numero == numero_conta)) {
        return res.status(404).json({ mensagem: "Conta não encontrada!" });
    }

    if (contas[numeroConta].usuario.senha !== senha) {
        return res.status(402).json({ mensagem: "Senha incorreta!" });
    }

    const extrato = {
        depositoDaConta: [],
        saqueDaConta: [],
        trasferenciasEnviadas: [],
        trasferenciasRecebidas: [],
    };
    for (const transacao of depositos) {
        if (transacao.numero_conta == numero_conta) {
            extrato.depositoDaConta.push(transacao);
        }
    }
    for (const transacao of saques) {
        if (transacao.numero_conta == numero_conta) {
            extrato.saqueDaConta.push(transacao);
        }
    }
    for (const transacao of transferencias) {
        if (transacao.numero_conta_origem == numero_conta) {
            extrato.trasferenciasEnviadas.push(transacao);
        }
    }
    for (const transacao of transferencias) {
        if (transacao.numero_conta_destino == numero_conta) {
            extrato.trasferenciasRecebidas.push(transacao);
        }
    }

    res.status(200).json({ extrato: extrato });
};

module.exports = {
    listarContas,
    criarConta,
    alterarConta,
    excluirConta,
    depositarMoney,
    sacarMoney,
    transferirMoney,
    consultarSaldo,
    retirarExtrato,
};
