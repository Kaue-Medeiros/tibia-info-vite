import express from "express"
const app = express()

// HOST 0.0.0.0 para ser ouvido pelo Nginx do frontend
const HOST = '0.0.0.0'
const PORT = 3000

app.get('/api/health', (req, res) => {
    res.json({status: 'ok'})
})



// Cache contendo os dados dos mundos, com tempo de vida de 5 minutos
let cacheMundos = new Map() 


// Rota para checar se a API esta rodando
app.get('/api/health', (req, res) => {
    res.json({status: 'Ok!'})
})

// Rota para pegar todos os mundos
app.get('/api/worlds/', async (req, res) => {

    const entrada = cacheMundos.get('worlds')

    // Checa se é válido pegar os dados da Cache ou não
    if(entrada != undefined && Date.now() < entrada.expiraEm){
        console.log('Pegando dados de Worlds pelo Cache')
        res.json(entrada.dados)
        return
    }

    // Pega os dados da API
    try {
        const response = await fetch(`https://api.tibiadata.com/v4/worlds/`)
        const data = await response.json() // Transforma em json
        const dados = data.worlds
        cacheMundos.set('worlds', {dados: dados, expiraEm: Date.now() + 5*60*1000})
        console.log('Pegando dados de Worlds pela API')
        res.json(dados)
    }catch(error) {
        res.status(502).json({erro: `Falha ao buscar dados da TibiaData: ${error}`})
    }
})


// Rota para pegar informacoes de um mundo especifico
app.get('/api/world/:nome', async (req, res) => {

    // Pega o nome do mundo e mantém com a primeira letra maiúscula e o resto em minúsculo
    const nomeRaw = req.params.nome.toLowerCase()
    const nome = nomeRaw[0].toUpperCase() + nomeRaw.slice(1)

    const url = `https://api.tibiadata.com/v4/world/${nome}`
    const entrada = cacheMundos.get(nome)
    

    // Checa se é válido pegar os dados da Cache ou não
    if(entrada != undefined && Date.now() < entrada.expiraEm){
        console.log(`Dados do mundo ${nome} pegos da cache!`)
        res.json(entrada.dados)
        return
    }

    // Pede os dados da API
    try{
        const response = await fetch(url) // Espera a resposta HTTP
        const data = await response.json() // Transforma em json
        const dados = data.world

        cacheMundos.set(nome, { dados: dados, expiraEm: Date.now() + 5*60*1000 })
        console.log(`Dados do mundo ${nome} pegos da API!`)
        res.json(dados)
    }
    catch(error) {
        res.status(502).json({erro: 'Falha ao buscar dados da TibiaData'})
    }


})

app.listen(PORT, HOST, () => { console.log(`Servidor rodando na porta ${PORT}!`) })