const express = require('express')
const server = express()
const cors = require('cors')
const mysql = require('mysql2/promise')
const porta = 3000
const conexao = require('./db')
const crypto = require('crypto')

server.use(express.json())
server.use(cors())

server.listen(porta, () => {
    console.log(`Servidor rodando em: http://localhost:${porta}`)
})

// CONTATO

server.post('/contate', async (req, res) => {
    try {
        const { nome, email, telefone, assunto, mensagem } = req.body

        if (email.length < 10) {
            return res.json({ "resposta": "E-mail inválido" })
        } else if (nome.length < 3) {
            return res.json({ "resposta": "Nome inválido" })
        } else if (assunto.length == 0) {
            return res.json({ "resposta": "Adicione um assunto" })
        } else if (mensagem.length == 0) {
            return res.json({ "resposta": "Adicione uma mensagem" })
        } else if (!email.includes('@')) { // includes verifica se algo existe dentro de uma string
            return res.json({ "resposta": "E-mail inválido" })
        } else if (!email.includes('.')) {  // includes verifica se algo existe dentro de uma string
            return res.json({ "resposta": "E-mail inválido" })
        } else if (email.includes(' ') == true) {  // includes verifica se algo existe dentro de uma string
            return res.json({ "resposta": "E-mail inválido" })
        } else if (telefone.length != 0 && telefone.length < 11) {
            return res.json({ "resposta": "Adicione um número de telefone válido!" })
        }

        const sql = `insert into contatos(nome, email, telefone, assunto, mensagem) values (?,?,?,?,?)`
        const [resposta] = await conexao.query(sql, [nome, email, telefone, assunto, mensagem])

        res.json({
            "resposta": "Sucesso"
        })


    } catch (error) {
        console.log(error)

        return res.json({ "resposta": "Erro inesperado. Tente novamente mais tarde." })
    }
})



// LOGIN E CADASTRO
//apenas para cadastrar com hash no banco
server.post('/cadastro', async (req, res) => {
    try {
        const { nome_user, email } = req.body
        let { senha } = req.body

        //tratando as informações
        senha = senha.trim()
        if (senha == '') {
            return res.json({ "resposta": 'Preencha uma senha válida' })
        } else if (senha.length < 6) {
            return res.json({ "resposta": 'Preencha uma senha com no mínimo 6 caracteres' })
        } else if (email < 6) {
            return res.json({ "resposta": 'Preencha um email' })
        } else if (nome_user.length < 4) {
            return res.json({ "resposta": 'Preencha um nome' })
        } else if (!email.includes('@')) {
            return res.json({ "resposta": 'Preencha um email válido' })
        } else if (email.includes(' ') == true) {
            return res.json({ "resposta": 'Preencha um email válido' })
        } else if (email.includes('.') == false) {
            return res.json({ "resposta": 'Preencha um email válido' })
        }

        //verificar se o email já existe
        let sql = `select * from usuarios where email = ?`
        let [resultado] = await conexao.query(sql, [email])
        if (resultado.length != 0) {
            return res.json({ "resposta": "Email já cadastrado" }) //se isso acontecer eu paro de executar meu código
        }

        //criando a Hash da senha
        const hash = crypto.createHash('sha256').update(senha).digest('hex')

        sql = `insert into usuarios(nome_user, email, senha) values (?,?,?)`
        const [resultado2] = await conexao.query(sql, [nome_user, email, hash])

        if (resultado2.affectedRows == 1) {
            return res.json({ "resposta": "Cadastro efetuado com sucesso!!" })
        } else {
            return res.json({ "resposta": "Erro ao tentar cadastrar" })
        }
    } catch (error) {
        console.log(error)
    }
})

server.post('/login', async (req, res) => {
    try {
        const { email } = req.body
        let { senha } = req.body

        senha = senha.trim()
        if (senha == '') {
            return res.json({ "resposta": "Usuário ou senha inválida" })
        } else if (senha.length < 6) {
            return res.json({ "resposta": "Usuário ou senha inválida" })
        }

        const hash = crypto.createHash('sha256').update(senha).digest('hex')
        const sql = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`
        const [resultado] = await conexao.query(sql, [email, hash])

        if (resultado.length == 1.) {
            res.json({ "resposta": "Você está Conectado" })
        } else {
            res.json({ "resposta": 'Usuário ou Senha inválida' })
        }

    } catch (error) {
        console.log(error)

        return res.json({ "resposta": "Erro inesperado. Tente novamente mais tarde." })
    }
})