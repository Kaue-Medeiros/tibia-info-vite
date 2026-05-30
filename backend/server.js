import express from "express"
const app = express()

// HOST 0.0.0.0 para ser ouvido pelo Nginx do frontend
const HOST = '0.0.0.0'
const PORT = 3000

app.get('/api/health', (req, res) => {
    res.json({status: 'ok'})
})

let cache = { dados: null, expiraEm: null } // Declaro a minha variavel de cache fora da rota

app.get('/api/worlds', async (req, res) => {

    if(cache.dados != null && Date.now() < cache.expiraEm){
        console.log('Dados pego da cache!')
        res.json(cache.dados)
        return
    }
    try{
        const response = await fetch('https://api.tibiadata.com/v4/worlds') // Espera a resposta HTTP
        const data = await response.json() // Transforma em json
        const dados = data.worlds.regular_worlds
        cache.dados = dados
        cache.expiraEm = Date.now() + 5*1000*60
        console.log('Dados pego da API!')
        res.json(dados)
    }
    catch(error) {
        res.status(502).json({erro: 'Falha ao buscar dados da TibiaData'})
    }
})

app.listen(PORT, HOST, () => { console.log(`Servidor rodando na porta ${PORT}!`) })