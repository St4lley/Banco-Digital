function verificarCpf(contas,cpf,res){
    if(contas.find(conta => conta.usuario.cpf === cpf)){
        res.status(400).json({mensagem:"Já existe uma conta com este CPF"})
        return false
    }else{
        return true
    }
}

function verificarEmail(contas,email,res){
    if(contas.find(conta => conta.usuario.email === email)){
        res.status(400).json({mensagem:"Já existe uma conta com este EMAIL"})
        return false
    }else{
        return true
    }
}
    

module.exports ={
    verificarCpf,
    verificarEmail
}