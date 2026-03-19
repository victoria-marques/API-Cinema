const express = require('express')
const pool = require('./config/database')

const app = express()
app.use(express.json())

const queryAsync=(sql, values = []) => {
    return new Promise((resolve, reject) =>{
        pool.query(sql, values, (err, results) =>{
            if(err) reject(err)
                else resolve(results)
        })
    })
}


//Filme

app.get('/', (req,res) => {
    res.send("API CINEMA")
})

app.get('/filmes', async(req,res) => {
    try{
        const filmes = await queryAsync('SELECT * FROM filmes')

        res.json({
            sucesso: true,
            dados: filmes,
            total: filmes.length  
        })
    } catch(erro) {
        console.error('Erro ao listar filmes:', erro)
        res.status(500).json({sucesso: false,
            mensagem: 'Erro ao listar filmes',
            erro: erro.message
        })
            
    }
    })

app.get('/filmes/:id', async (req,res) => {
    try{
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de filme'
            })
        }

        const filme = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])

        if(filme.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })

        }
        res.json({
            sucesso: true,
            dados: filme[0]
        })

    } catch (erro) {
        console.error('Erro ao encontrar filmes:', erro)
        res.status(500).json({sucesso: false,
            mensagem: 'Erro ao encontrar filmes',
            erro: erro.message
        })

    }
})

app.post('/filmes', async (req,res) => {
    try {
       const {titulo, genero, duracao, classificacao, data_lançamento} = req.body
       
       if(titulo || !genero || !duracao){
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Título, genêro e duração são obrigatórios'
        })
       }

       if(typeof duracao !== 'number' || duracao <= 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Duração deve ser um número positivo'
            })
       }

       const novoFilme = {
        titulo: titulo.trim(),
        genero: genero.trim(),
        duracao,
        classificacao: classificacao || null,
        data_lançamento: data_lançamento || null,
       }

       const resultado = await queryAsync('INSERT INTO filme SET ?', [novoFilme])

       res.status(201).json({
        sucesso: true,
        mensagem: 'Filme cadastrado com sucesso',
        id: resultado.insertId
       })

    } catch (erro) {
       console.error('Erro ao salvar filme', erro)
       
       res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao salvar filme',
        erro: erro.message
       })
    }
})

app.put('/filme:id', async (req,res) => {
    try {
        const {id} = req.params
        const{titulo, genero, duracao, classificacao, data_lançamento} = req.body

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        const filmeExiste = await queryAsync ('SELECT * FROM filme WHERE id = ?', [id])

        if(filmeExiste.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        const filmeAtualizado = {}

        if(titulo !== undefined) filmeAtualizado.titulo = titulo.trim()
        if(genero !== undefined) filmeAtualizado.genero = genero.trim()
        if(duracao !== undefined) {
            if(typeof duracao !== 'number || duracao <= 0'){
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Duracao deve ser um número positivo'
                })
            }
            filmeAtualizado.duracao = duracao
        }
        if(classificacao !== undefined) filmeAtualizado.classificacao = classificacao
        if(data_lançamento !== undefined) filmeAtualizado.data_lançamento = data_lançamento 

        if(Object.keys(filmeAtualizado).length === 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar'
            })
        }

        await queryAsync('UPDATE filme SET ? WHERE id= ?', [filmeAtualizado, id])
        res.json({
            sucesso: true,
            mensagem: 'Filme Atualizado'
        })
        
    } catch (erro) {
         console.error('Erro ao atualizar filme', erro)
       
       res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao atualizar filme',
        erro: erro.message
       })
    }
})

app.delete('/filme/:id', async (req,res) => {
    try {
        const{id} = req.params
         if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID filme inválido'
            })
        }

        const filmeExiste = await queryAsync ('SELECT * FROM filme WHERE id = ?', [id])

        if(filmeExiste.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Filme não encontrado'
            })
        }

        await queryAsync('DELETE FROM filme WHERE id = ?', [id])
        res.status(200).json({
            sucesso: true,
            mensagem: 'Filme apagado'
        })
    } catch (erro) {
       console.error('Erro ao apagar filme', erro)
       
       res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao apagar filme',
        erro: erro.message
       }) 
    }
})

//-------------------------------------------------------------------------------------------------------------------------------------

//Salas

app.get('/', (req,res) => {
    res.send("API CINEMA")
})

app.get('/salas', async(req,res) => {
    try{
        const salas = await queryAsync('SELECT * FROM salas')

        res.json({
            sucesso: true,
            dados: salas,
            total: salas.length  
        })
    } catch(erro) {
        console.error('Erro ao listar salas:', erro)
        res.status(500).json({sucesso: false,
            mensagem: 'Erro ao listar salas',
            erro: erro.message
        })
            
    }
    })

app.get('/salas/:id', async (req,res) => {
    try{
        const {id} = req.params

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID das salas'
            })
        }

        const salas = await queryAsync('SELECT * FROM salas WHERE id = ?', [id])

        if(salas.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala não encontrada pelo seu ID'
            })

        }
        res.json({
            sucesso: true,
            dados: salas[0]
        })

    } catch (erro) {
        console.error('Erro ao encontrar as Salas:', erro)
        res.status(500).json({sucesso: false,
            mensagem: 'Erro ao encontrar as Salas',
            erro: erro.message
        })

    }
})

app.post('/salas', async (req,res) => {
    try {
       const {id, qtd_poltronas, sala_vip, acessibilidade, cap_pessoas} = req.body
       
       if(id || !acessibilidade || !sala_vip){
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Título, genêro e duração são obrigatórios'
        })
       }

       if(typeof qtd_poltronas !== 'number' || qtd_poltronas <= 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'A quantidade de poltronas para cada pessoas tende a ser positivo'
            })
       }

       const novaSalas = {
        id: id.trim(),
        qtd_poltronas: qtd_poltronas.trim(),
        cap_pessoas,
        acessibilidade: acessibilidade || null,
        sala_vip: sala_vip || null,
       }

       const resultado = await queryAsync('INSERT INTO salas SET ?', [novaSalas])

       res.status(201).json({
        sucesso: true,
        mensagem: 'Sala cadastrada com sucesso',
        id: resultado.insertId
       })

    } catch (erro) {
       console.error('Erro ao cadastrar Sala nova', erro)
       
       res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao cadastrar Sala nova',
        erro: erro.message
       })
    }
})

app.put('/salas', async (req,res) => {
    try {
        const{id, qtd_poltronas, sala_vip, acessibilidade, cap_pessoas} = req.body

        if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID da Sala está inválido'
            })
        }

        const salaExistente = await queryAsync ('SELECT * FROM salas WHERE id = ?', [id])

        if(salaExistente.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala específica não encontrada'
            })
        }

        const salaAtualizada = {}

        if(id !== undefined) filmeAtualizado.id = id.trim()
        if(qtd_poltronas !== undefined) filmeAtualizado.qtd_poltronas = qtd_poltronas.trim()
        if(sala_vip !== undefined) {
            if(typeof sala_vip !== 'number || salaDisponível <= 0'){
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Salas Vips disponíveis abaixo de 0 (positivo)'
                })
            }
            salaAtualizada.sala_vip = sala_vip
        }
        if(acessibilidade !== undefined) filmeAtualizado.acessibilidade = acessibilidade
        if(qtd_poltronas !== undefined) filmeAtualizado.qtd_poltronas =   qtd_poltronas

        if(Object.keys(salaAtualizada).length === 0){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar'
            })
        }

        await queryAsync('UPDATE sala SET ? WHERE id= ?', [salaAtualizada, id])
        res.json({
            sucesso: true,
            mensagem: 'Salas Atualizadas'
        })
        
    } catch (erro) {
         console.error('Erro ao atualizar as salas', erro)
       
       res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao atualizar as salas',
        erro: erro.message
       })
    }
})

app.delete('/salas', async (req,res) => {
    try {
        const{id} = req.params
         if(!id || isNaN(id)){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID sala inválido'
            })
        }

        const salaExistente = await queryAsync ('SELECT * FROM sala WHERE id = ?', [id])

        if(salaExistente.length === 0){
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Sala específica não encontrada'
            })
        }

        await queryAsync('DELETE FROM salas WHERE id = ?', [id])
        res.status(200).json({
            sucesso: true,
            mensagem: 'ID da sala apagada'
        })
    } catch (erro) {
       console.error('Erro ao apagar ID da sala', erro)
       
       res.status(500).json({
        sucesso: false,
        mensagem: 'Sala inexistente',
        erro: erro.message
       }) 
    }
})




module.exports = app
