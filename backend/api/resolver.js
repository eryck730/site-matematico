// ==================== BACKEND - API RESOLVER ====================

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ===== ROTA PRINCIPAL =====
app.post('/api/resolver', async (req, res) => {
    const { pergunta, modelo } = req.body;

    if (!pergunta) {
        return res.status(400).json({ error: 'Pergunta não fornecida.' });
    }

    try {
        let resposta;

        switch (modelo) {
            case 'deepseek':
                resposta = await resolverDeepSeek(pergunta);
                break;
            case 'groq':
                resposta = await resolverGroq(pergunta);
                break;
            default:
                try {
                    resposta = await resolverDeepSeek(pergunta);
                } catch (e) {
                    resposta = await resolverGroq(pergunta);
                }
        }

        res.json({ sucesso: true, resposta });

    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({
            sucesso: false,
            error: error.message
        });
    }
});

// ===== FUNÇÕES DE RESOLUÇÃO =====

async function resolverDeepSeek(pergunta) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error('Chave DeepSeek não configurada.');

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: 'Você é um professor de matemática brasileiro.' },
                { role: 'user', content: `Resolva a questão passo a passo:\n\n${pergunta}` }
            ],
            temperature: 0.2,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Erro ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Não foi possível obter resposta.';
}

async function resolverGroq(pergunta) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('Chave Groq não configurada.');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'Você é um professor de matemática brasileiro.' },
                { role: 'user', content: `Resolva a questão passo a passo:\n\n${pergunta}` }
            ],
            temperature: 0.2,
            max_tokens: 1500
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `Erro ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Não foi possível obter resposta.';
}

// ===== ROTA DE SAÚDE =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🧠 POST /api/resolver`);
    console.log(`❤️  GET /api/health`);
});
