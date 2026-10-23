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
const { DatabaseSync } = require('node:sqlite');

const app = express();
app.use(express.json());



const db = new DatabaseSync('treinos.db');


db.exec(`
    CREATE TABLE IF NOT EXISTS treinos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        duracao INTEGER NOT NULL
    )
`);

function validarTreino(corpo) {
if (typeof corpo.nome !== 'string'  || corpo.nome.trim() === ''){
    return 'O campo nome e obrigatorio e deve ser um texto .';
}
if (typeof corpo.duracao !== 'number' || corpo.duracao <= 0) {
    return 'O campo duracao e obrigatorio e deve ser um numero maior que zero .';
}
    return null ;
}


// 7. contagem
app.get('/treinos/total', (req, res) => {
    const resultado = db.prepare('SELECT COUNT(*) AS total FROM treinos').get();
    res.status(200).json(resultado);
});

// 11. resumo
app.get('/treinos/resumo', (req, res) => {
    const resultado = db
        .prepare(`
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(duracao), 0) AS minutos,
                AVG(duracao) AS media
            FROM treinos
        `)
        .get();

    res.status(200).json(resultado);
});

// 2. lista com SELECT e all().
// 8. filtro
// 9. ordenacao
// 10. busca por nome
app.get('/treinos', (req, res) => {
    const minimo = req.query.minimo;
    const busca = req.query.busca;
    const filtros = [];
    const parametros = [];

    if (minimo !== undefined) {
        const duracaoMinima = Number(minimo);
        if (typeof minimo !== 'string' || minimo.trim() === '' || !Number.isFinite(duracaoMinima)) {
            return res.status(400).json({ erro: 'O parametro minimo deve ser um numero valido.' });
        }

        filtros.push('duracao >= ?');
        parametros.push(duracaoMinima);
    }

    if (busca !== undefined) {
        if (typeof busca !== 'string') {
            return res.status(400).json({ erro: 'O parametro busca deve ser um texto.' });
        }

        filtros.push('nome LIKE ?');
        parametros.push(`%${busca}%`);
    }

    const where = filtros.length > 0 ? ` WHERE ${filtros.join(' AND ')}` : '';
    const treinos = db
        .prepare(`SELECT * FROM treinos${where} ORDER BY duracao DESC`)
        .all(...parametros);

    res.status(200).json(treinos);
});


// 12. id invalido
app.get('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ erro: 'O id deve ser um numero inteiro.' });
    }

    const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);

    if (treino === undefined) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }

    res.status(200).json(treino);
});


// 3.insere
app.post('/treinos', (req, res) => {
    const erro = validarTreino(req.body);
    if (erro !== null){
        return res.status(400).json({ erro: erro });
    }

    const resultado = db
    .prepare('INSERT INTO treinos (nome, duracao) VALUES (?, ?)')
    .run(req.body.nome, req.body.duracao);

// busca o treino criado e devolve com id
    const novo = db
        .prepare('SELECT * FROM treinos WHERE id = ?')
        .get(resultado.lastInsertRowid);

    res.status(201).json(novo);
});

// 5. atualiza 
app.put('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);

    const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    if (treino === undefined) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }

    const erro = validarTreino(req.body);
    if (erro !== null){
        return res.status(400).json({ erro: erro });
    }

    db.prepare('UPDATE treinos SET nome = ?, duracao = ? WHERE id = ?')
    .run(req.body.nome, req.body.duracao, id);

    const atualizado = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    res.status(200).json(atualizado);
});

// 5. remove um treino
app.delete('/treinos/:id', (req, res) => {
    const id = Number(req.params.id);

    const treino = db.prepare('SELECT * FROM treinos WHERE id = ?').get(id);
    if (treino === undefined) {
        return res.status(404).json({ erro: 'Treino nao encontrado.' });
    }

    db.prepare('DELETE FROM treinos WHERE id = ?').run(id);

    res.status(204).end();
});


// ------------------------------------------------------------
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
