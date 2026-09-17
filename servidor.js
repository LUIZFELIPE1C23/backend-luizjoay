// ============================================================
// API do Diario de Treinos
// Back-End I - CEEP Pedro Boaretto Neto
// ============================================================
// Este arquivo esta quase vazio DE PROPOSITO.
// Hoje voce vai escrever as rotas, uma de cada vez, conferindo
// no testes.http se cada uma responde o status certo.
// O que cada rota deve fazer esta no README.md.
// ============================================================

const express = require('express');
const app = express();

// Faz o Express entender JSON no corpo das requisicoes
app.use(express.json());

// ------------------------------------------------------------
// Os dados moram aqui, na memoria. Somem quando o servidor cai.
// (Na Aula 03 isso vira banco de dados.)
// ------------------------------------------------------------
const treinos = [];
let proximoId = 1;

function validarTreino(corpo) {
if (typeof corpo.nome !== 'string'  || corpo.nome.trim() === ''){
    return 'O campo nome e obrigatorio e deve ser um texto .';
}
if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
    return 'O campo duracao e obrigatorio e deve ser um numero maior que zero .';
}
    return null ;
}



app.get('/treinos', (req,res) => {
    res.status(200).json(treinos);
});


// [PROF] Faltou os dois pontos: eh /treinos/:id. E essa rota ainda nao responde nada, falta buscar o treino e devolver.
app.get('/treinos/id', (req,res) => {
        const id = Number(req.params.id);
    

});


app.post('/treinos', (req,res) => {
    const erro = validarTreino(req.body);


    if(erro !== null ){
        return res.status(400).json({ erro: erro });
    }

// ------------------------------------------------------------
// [PROF] POST, PUT e DELETE ainda estao vazios. Olha a tabela do README e o testes.http e vai fazendo uma de cada vez.
// POST /treinos - cria um treino (400 se os dados forem invalidos)
// ------------------------------------------------------------


    const treino = {
        id: proximoId,
        nome: req.body.nome,
        duracao: req.body.duracao
    };
    proximoId = proximoId + 1;
    treinos.push(treino);

    res.status(201).json(treino);
});


// ------------------------------------------------------------
// PUT /treinos/:id - substitui um treino
// ------------------------------------------------------------



// ------------------------------------------------------------
// DELETE /treinos/:id - remove um treino
// ------------------------------------------------------------



// ------------------------------------------------------------
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
