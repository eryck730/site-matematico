// ==================== BACKEND - APENAS HEALTH CHECK ====================

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ===== ROTA DE SAÚDE =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        message: 'Backend funcionando, mas IA desativada.'
    });
});

// ===== ROTA PRINCIPAL (retorna aviso) =====
app.post('/api/resolver', (req, res) => {
    res.json({
        sucesso: false,
        error: 'IA desativada. Use o modo offline.',
        mensagem: 'Para usar IA, ative as chaves API no backend.'
    });
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`❤️  GET /api/health`);
    console.log(`📴 IA desativada - Modo offline`);
});
