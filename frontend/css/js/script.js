// ==================== RESOLVER QUESTÃO COM IA ====================

// COLOQUE SUA CHAVE AQUI (pegue em https://platform.deepseek.com/)
const DEEPSEEK_API_KEY = 'sk-a3a3d26730794b089dc4421bddc668b3';

// Chave Groq (alternativa)
const GROQ_API_KEY = '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';

async function resolverQuestao(i) {
    const q = ocrQuestoes[i];
    const btn = document.getElementById(`qbtn_${i}`);
    const respDiv = document.getElementById(`qresp_${i}`);
    const statusEl = document.getElementById(`qstatus_${i}`);
    const card = document.getElementById(`qcard_${i}`);

    if (!q || !btn || !respDiv) {
        console.error('Elementos não encontrados para a questão', i);
        return;
    }

    // Destaca o card ativo
    document.querySelectorAll('.questao-card').forEach(c => c.style.borderColor = '#1e293b');
    if (card) card.style.borderColor = '#7c3aed';

    btn.disabled = true;
    btn.textContent = '⏳ Resolvendo...';
    if (statusEl) statusEl.textContent = '🔄 processando...';
    
    respDiv.style.display = 'block';
    respDiv.innerHTML = `
        <div class="ia-loading">
            <div class="ia-dot"></div>
            <div class="ia-dot"></div>
            <div class="ia-dot"></div>
            <span style="color:#94a3b8;font-size:13px;">🧠 IA analisando a questão ${q.numero}...</span>
        </div>
    `;
    
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        let resposta;
        let nomeIA = '';
        
        // Tenta DeepSeek primeiro
        if (DEEPSEEK_API_KEY && DEEPSEEK_API_KEY !== 'SUA_CHAVE_DEEPSEEK_AQUI') {
            try {
                resposta = await resolverComDeepSeek(q.texto);
                nomeIA = 'DeepSeek';
            } catch (deepseekError) {
                console.warn('DeepSeek falhou:', deepseekError);
                // Fallback para Groq
                if (GROQ_API_KEY && GROQ_API_KEY !== 'SUA_CHAVE_GROQ_AQUI') {
                    resposta = await resolverComGroq(q.texto);
                    nomeIA = 'Groq';
                } else {
                    throw new Error('Nenhuma API disponível');
                }
            }
        } else if (GROQ_API_KEY && GROQ_API_KEY !== 'SUA_CHAVE_GROQ_AQUI') {
            resposta = await resolverComGroq(q.texto);
            nomeIA = 'Groq';
        } else {
            throw new Error('Nenhuma API configurada');
        }

        const corIA = nomeIA === 'DeepSeek' ? '#7c3aed' : '#3b82f6';
        
        respDiv.innerHTML = `
            <div style="display:inline-block;background:${corIA};color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;">🤖 Resolvido com ${nomeIA}</div>
            <div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#e2e8f0;">${resposta}</div>
            <button onclick="copiarRespQuestao(${i})" style="margin-top:10px;background:#22c55e;color:white;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">📋 Copiar</button>
        `;
        
        if (statusEl) statusEl.innerHTML = `<span style="color:#22c55e;">✅ resolvida com ${nomeIA}</span>`;
        adicionarHistorico(`OCR - Questão ${q.numero}`, q.texto.substring(0, 60) + '...', `Resolvido com ${nomeIA}`);

    } catch (e) {
        console.error('Erro ao resolver:', e);
        
        // Fallback: resolver localmente
        const fallback = resolverLocalmente(q.texto);
        respDiv.innerHTML = `
            <div style="display:inline-block;background:#f59e0b;color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;">⚡ Modo Offline</div>
            <div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#e2e8f0;">${fallback}</div>
            <p style="color:#94a3b8;font-size:12px;margin-top:8px;">💡 Configure a chave API do DeepSeek para respostas mais inteligentes.</p>
            <button onclick="copiarRespQuestao(${i})" style="margin-top:10px;background:#22c55e;color:white;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">📋 Copiar</button>
        `;
        if (statusEl) statusEl.innerHTML = '<span style="color:#f59e0b;">⚡ offline</span>';
    }

    btn.disabled = false;
    btn.textContent = '🔁 Resolver novamente';
}

// ==================== RESOLVER COM DEEPSEEK ====================

async function resolverComDeepSeek(pergunta) {
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'SUA_CHAVE_DEEPSEEK_AQUI') {
        throw new Error('Chave DeepSeek não configurada');
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `Você é um professor de matemática brasileiro. Responda em português do Brasil. Seja claro, didático e use emojis para organizar a resposta.`
                },
                {
                    role: 'user',
                    content: `Resolva a seguinte questão matemática passo a passo:

${pergunta}

Estruture sua resposta assim:
📌 O que a questão pede
📐 Resolução (com cálculos detalhados)
✅ Resposta final em destaque`
                }
            ],
            temperature: 0.2,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Erro ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Não foi possível obter resposta.';
}

// ==================== RESOLVER COM GROQ ====================

async function resolverComGroq(pergunta) {
    if (!GROQ_API_KEY || GROQ_API_KEY === 'SUA_CHAVE_GROQ_AQUI') {
        throw new Error('Chave Groq não configurada');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `Você é um professor de matemática brasileiro. Responda em português do Brasil.`
                },
                {
                    role: 'user',
                    content: `Resolva a questão passo a passo:\n\n${pergunta}`
                }
            ],
            temperature: 0.2,
            max_tokens: 1500
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Erro ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Não foi possível obter resposta.';
}

// ==================== RESOLVER LOCALMENTE (FALLBACK) ====================

function resolverLocalmente(pergunta) {
    const texto = pergunta.toLowerCase();
    
    // Equação do 1º grau
    const eq1Match = texto.match(/([0-9.]+)\s*x\s*([+\-])\s*([0-9.]+)\s*=\s*([0-9.]+)/i);
    if (eq1Match) {
        const a = parseFloat(eq1Match[1]);
        const sinal = eq1Match[2] === '+' ? 1 : -1;
        const b = parseFloat(eq1Match[3]) * sinal;
        const c = parseFloat(eq1Match[4]);
        const x = (c - b) / a;
        return `
📌 **O que a questão pede:** Resolver a equação do 1º grau.

📐 **Resolução:**
${a}x ${eq1Match[2]} ${Math.abs(b)} = ${c}
${a}x = ${c} - ${b}
${a}x = ${c - b}
x = ${c - b} ÷ ${a}

✅ **Resposta final:** x = ${x}`;
    }
    
    // Função do 1º grau
    const funcMatch = texto.match(/([0-9.]+)\s*x\s*([+\-])\s*([0-9.]+)/i);
    if (funcMatch && (texto.includes('f(x)') || texto.includes('função'))) {
        const a = parseFloat(funcMatch[1]);
        const sinal = funcMatch[2] === '+' ? 1 : -1;
        const b = parseFloat(funcMatch[3]) * sinal;
        const xMatch = texto.match(/x\s*=\s*([0-9.]+)/i);
        const x = xMatch ? parseFloat(xMatch[1]) : 15;
        const resultado = a * x + b;
        const sinalB = b >= 0 ? '+' : '';
        return `
📌 **O que a questão pede:** Calcular f(${x}) para f(x) = ${a}x ${sinalB} ${b}.

📐 **Resolução:**
f(${x}) = ${a} × ${x} ${sinalB} ${b}
f(${x}) = ${a*x} ${sinalB} ${b}

✅ **Resposta final:** f(${x}) = ${resultado}`;
    }
    
    // Raiz quadrada
    const raizMatch = texto.match(/√\s*([0-9.]+)/i);
    if (raizMatch) {
        const valor = parseFloat(raizMatch[1]);
        const resultado = Math.sqrt(valor);
        return `
📌 **O que a questão pede:** Calcular a raiz quadrada de ${valor}.

📐 **Resolução:**
√${valor} = ${resultado.toFixed(4)}

✅ **Resposta final:** ${resultado.toFixed(4)}`;
    }
    
    return `
📌 **Não foi possível reconhecer automaticamente.**

📝 **Texto extraído:**
${pergunta.substring(0, 300)}${pergunta.length > 300 ? '...' : ''}

💡 **Dicas:**
1. Configure a chave API do DeepSeek para respostas mais inteligentes
2. Tire uma foto com boa iluminação
3. Escreva a questão manualmente em uma das ferramentas`;
}

// ===== FUNÇÃO PARA COPIAR RESPOSTA =====
function copiarRespQuestao(i) {
    const respDiv = document.getElementById(`qresp_${i}`);
    if (respDiv) {
        navigator.clipboard.writeText(respDiv.innerText).then(() => {
            const btn = event.target;
            btn.textContent = '✅ Copiado!';
            setTimeout(() => btn.textContent = '📋 Copiar', 2000);
        });
    }
}
