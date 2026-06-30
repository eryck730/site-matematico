// ==================== VERIFICA LOGIN ====================
const usuarioLogado = sessionStorage.getItem('math_user');
if (!usuarioLogado) {
    window.location.href = 'login.html';
}
document.getElementById('userNameDisplay').textContent = `👤 ${usuarioLogado}`;

// ==================== SISTEMA DE HISTÓRICO ====================

function getHistorico() {
    const user = sessionStorage.getItem('math_user');
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`math_history_${user}`) || '[]');
}

function salvarHistorico(historico) {
    const user = sessionStorage.getItem('math_user');
    if (!user) return;
    localStorage.setItem(`math_history_${user}`, JSON.stringify(historico));
}

function adicionarHistorico(ferramenta, questao, resposta) {
    const historico = getHistorico();
    const now = new Date();
    const data = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    
    historico.unshift({
        data: data,
        ferramenta: ferramenta,
        questao: questao,
        resposta: resposta
    });

    if (historico.length > 100) historico.pop();
    salvarHistorico(historico);
    atualizarContadorHistorico();
}

function atualizarContadorHistorico() {
    const historico = getHistorico();
    document.getElementById('historyCount').textContent = historico.length;
}

function abrirHistorico() {
    const historico = getHistorico();
    const listDiv = document.getElementById('historyList');
    const modal = document.getElementById('historyModal');

    if (historico.length === 0) {
        listDiv.innerHTML = '<div class="history-empty">📭 Nenhuma questão resolvida ainda</div>';
    } else {
        listDiv.innerHTML = historico.map(item => `
            <div class="history-item">
                <div class="date">${item.data}</div>
                <div class="question">📌 ${item.ferramenta}: ${item.questao}</div>
                <div class="answer">✅ ${item.resposta}</div>
            </div>
        `).join('');
    }

    modal.classList.add('active');
}

function fecharHistorico() {
    document.getElementById('historyModal').classList.remove('active');
}

function limparHistorico() {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
        salvarHistorico([]);
        atualizarContadorHistorico();
        abrirHistorico();
    }
}

// ==================== NAVEGAÇÃO ====================

function showTab(tabId) {
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => {
        const btnText = b.textContent.toLowerCase();
        if (tabId === 'equacao1' && btnText.includes('1º')) b.classList.add('active');
        else if (tabId === 'equacao2' && btnText.includes('2º')) b.classList.add('active');
        else if (tabId === 'pitagoras' && btnText.includes('pitágoras')) b.classList.add('active');
        else if (tabId === 'regra3' && btnText.includes('regra')) b.classList.add('active');
        else if (tabId === 'porcentagem' && btnText.includes('porcentagem')) b.classList.add('active');
        else if (tabId === 'mmc_mdc' && btnText.includes('mmc')) b.classList.add('active');
        else if (tabId === 'media' && btnText.includes('média')) b.classList.add('active');
        else if (tabId === 'area_quadrado' && btnText.includes('quadrado')) b.classList.add('active');
        else if (tabId === 'area_retangulo' && btnText.includes('retângulo')) b.classList.add('active');
        else if (tabId === 'area_triangulo' && btnText.includes('triângulo')) b.classList.add('active');
        else if (tabId === 'area_circulo' && btnText.includes('círculo')) b.classList.add('active');
        else if (tabId === 'perimetro' && btnText.includes('perímetros')) b.classList.add('active');
        else if (tabId === 'conversor' && btnText.includes('conversor')) b.classList.add('active');
        else if (tabId === 'trigonometria' && btnText.includes('seno')) b.classList.add('active');
        else if (tabId === 'lei_senos' && btnText.includes('senos')) b.classList.add('active');
        else if (tabId === 'lei_cossenos' && btnText.includes('cossenos')) b.classList.add('active');
        else if (tabId === 'funcao1' && btnText.includes('função 1º')) b.classList.add('active');
        else if (tabId === 'funcao2' && btnText.includes('função 2º')) b.classList.add('active');
        else if (tabId === 'ocr' && btnText.includes('ocr')) b.classList.add('active');
    });
}

// ==================== FUNÇÕES PRINCIPAIS ====================

// ===== EQUAÇÃO 1º GRAU =====
function resolverEquacao1() {
    const a = parseFloat(document.getElementById('eq1a').value);
    const b = parseFloat(document.getElementById('eq1b').value);
    const c = parseFloat(document.getElementById('eq1c').value);
    const resultDiv = document.getElementById('resultadoEquacao1');

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    if (a === 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ "A" não pode ser zero!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const x = (c - b) / a;
    const questao = `${a}x + ${b} = ${c}`;
    const resposta = `x = ${x}`;

    resultDiv.innerHTML = `
        <div class="success-badge">✅ SOLUÇÃO</div>
        <div class="highlight-result">x = ${x}</div>
        <div class="step-box">
            <b>📌 Passo a passo:</b><br>
            <span class="step-number">1</span> ${a}x + ${b} = ${c}<br>
            <span class="step-number">2</span> ${a}x = ${c} - ${b}<br>
            <span class="step-number">3</span> ${a}x = ${c - b}<br>
            <span class="step-number">4</span> x = ${c - b} ÷ ${a}<br>
            <span class="step-number">✅</span> <span class="highlight-step">x = ${x}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Equação 1º Grau', questao, resposta);
}

function limparEquacao1() {
    document.getElementById('eq1a').value = '';
    document.getElementById('eq1b').value = '';
    document.getElementById('eq1c').value = '';
    document.getElementById('resultadoEquacao1').classList.remove('show');
}

// ===== EQUAÇÃO 2º GRAU =====
function resolverEquacao2() {
    const a = parseFloat(document.getElementById('eq2a').value);
    const b = parseFloat(document.getElementById('eq2b').value);
    const c = parseFloat(document.getElementById('eq2c').value);
    const resultDiv = document.getElementById('resultadoEquacao2');

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    if (a === 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ "A" não pode ser zero!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const delta = b*b - 4*a*c;
    let html = `<div class="success-badge">✅ SOLUÇÃO</div>`;
    html += `<div class="step-box">`;
    html += `<b>📌 Cálculo do Delta:</b><br>`;
    html += `Δ = b² - 4ac<br>`;
    html += `Δ = (${b})² - 4(${a})(${c})<br>`;
    html += `Δ = <span class="highlight-step">${delta}</span>`;
    html += `</div>`;

    let questao = `${a}x² + ${b}x + ${c} = 0`;
    let resposta = '';

    if (delta < 0) {
        html += `<div class="error">⚠️ Δ < 0: Não existem raízes reais.</div>`;
        resposta = 'Sem raízes reais (Δ < 0)';
    } else if (delta === 0) {
        const x = -b / (2*a);
        html += `<div class="highlight-result">x = ${x} (raiz dupla)</div>`;
        html += `<div class="step-box">`;
        html += `<b>📌 Cálculo:</b><br>`;
        html += `x = -b/(2a)<br>`;
        html += `x = -(${b})/(2×${a})<br>`;
        html += `x = <span class="highlight-step">${x}</span>`;
        html += `</div>`;
        resposta = `x = ${x} (raiz dupla)`;
    } else {
        const x1 = (-b + Math.sqrt(delta)) / (2*a);
        const x2 = (-b - Math.sqrt(delta)) / (2*a);
        html += `<div class="function-result">`;
        html += `<div class="card-result"><div class="label">📌 X₁</div><div class="value blue">${x1}</div></div>`;
        html += `<div class="card-result"><div class="label">📌 X₂</div><div class="value green">${x2}</div></div>`;
        html += `</div>`;
        html += `<div class="step-box">`;
        html += `<b>📌 Cálculo:</b><br>`;
        html += `x = (-b ± √Δ)/(2a)<br>`;
        html += `x = (-(${b}) ± √${delta})/(2×${a})<br>`;
        html += `x₁ = <span class="highlight-step">${x1}</span><br>`;
        html += `x₂ = <span class="highlight-step">${x2}</span>`;
        html += `</div>`;
        resposta = `x₁ = ${x1}, x₂ = ${x2}`;
    }

    resultDiv.innerHTML = html;
    resultDiv.classList.add('show');
    adicionarHistorico('Equação 2º Grau', questao, resposta);
}

function limparEquacao2() {
    document.getElementById('eq2a').value = '';
    document.getElementById('eq2b').value = '';
    document.getElementById('eq2c').value = '';
    document.getElementById('resultadoEquacao2').classList.remove('show');
}

// ===== PITÁGORAS =====
function resolverPitagoras() {
    const a = parseFloat(document.getElementById('catA').value);
    const b = parseFloat(document.getElementById('catB').value);
    const h = parseFloat(document.getElementById('hip').value);
    const resultDiv = document.getElementById('resultadoPitagoras');

    const preenchidos = [a, b, h].filter(v => !isNaN(v) && v > 0).length;

    if (preenchidos !== 2) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha exatamente 2 valores!</div>';
        resultDiv.classList.add('show');
        return;
    }

    let html = `<div class="success-badge">✅ RESULTADO</div>`;
    let questao = '';
    let resposta = '';

    if (isNaN(h) || h === 0) {
        const resp = Math.sqrt(a*a + b*b);
        html += `<div class="highlight-result">Hipotenusa = ${resp.toFixed(4)}</div>`;
        html += `<div class="step-box">h² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a + b*b}<br>h = √${a*a + b*b} = <span class="highlight-step">${resp.toFixed(4)}</span></div>`;
        questao = `Catetos: ${a} e ${b}`;
        resposta = `Hipotenusa = ${resp.toFixed(4)}`;
    } else if (isNaN(a) || a === 0) {
        const resp = Math.sqrt(h*h - b*b);
        html += `<div class="highlight-result">Cateto A = ${resp.toFixed(4)}</div>`;
        html += `<div class="step-box">a² = ${h}² - ${b}² = ${h*h} - ${b*b} = ${h*h - b*b}<br>a = √${h*h - b*b} = <span class="highlight-step">${resp.toFixed(4)}</span></div>`;
        questao = `Hipotenusa: ${h}, Cateto B: ${b}`;
        resposta = `Cateto A = ${resp.toFixed(4)}`;
    } else {
        const resp = Math.sqrt(h*h - a*a);
        html += `<div class="highlight-result">Cateto B = ${resp.toFixed(4)}</div>`;
        html += `<div class="step-box">b² = ${h}² - ${a}² = ${h*h} - ${a*a} = ${h*h - a*a}<br>b = √${h*h - a*a} = <span class="highlight-step">${resp.toFixed(4)}</span></div>`;
        questao = `Hipotenusa: ${h}, Cateto A: ${a}`;
        resposta = `Cateto B = ${resp.toFixed(4)}`;
    }

    resultDiv.innerHTML = html;
    resultDiv.classList.add('show');
    adicionarHistorico('Pitágoras', questao, resposta);
}

function limparPitagoras() {
    document.getElementById('catA').value = '';
    document.getElementById('catB').value = '';
    document.getElementById('hip').value = '';
    document.getElementById('resultadoPitagoras').classList.remove('show');
}

// ===== REGRA DE 3 =====
function resolverRegra3() {
    const A = parseFloat(document.getElementById('rA').value);
    const B = parseFloat(document.getElementById('rB').value);
    const C = parseFloat(document.getElementById('rC').value);
    const resultDiv = document.getElementById('resultadoRegra3');

    if (isNaN(A) || isNaN(B) || isNaN(C)) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    if (A === 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Divisão por zero!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const x = (B * C) / A;

    resultDiv.innerHTML = `
        <div class="success-badge">✅ SOLUÇÃO</div>
        <div class="highlight-result">X = ${x}</div>
        <div class="step-box">
            <b>📌 Regra de 3:</b><br>
            ${A} : ${B} = ${C} : X<br>
            ${A}·X = ${B}·${C}<br>
            ${A}·X = ${B*C}<br>
            X = ${B*C} ÷ ${A}<br>
            <span class="highlight-step">X = ${x}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Regra de 3', `${A} : ${B} = ${C} : X`, `X = ${x}`);
}

function limparRegra3() {
    document.getElementById('rA').value = '';
    document.getElementById('rB').value = '';
    document.getElementById('rC').value = '';
    document.getElementById('resultadoRegra3').classList.remove('show');
}

// ===== PORCENTAGEM =====
function resolverPorcentagem() {
    const tipo = document.getElementById('tipoPorcentagem').value;
    const v1 = parseFloat(document.getElementById('p1').value);
    const v2 = parseFloat(document.getElementById('p2').value);
    const resultDiv = document.getElementById('resultadoPorcentagem');

    if (isNaN(v1) || isNaN(v2)) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    let html = `<div class="success-badge">✅ RESULTADO</div>`;
    let questao = '';
    let resposta = '';

    if (tipo === "1") {
        const result = (v1 * v2) / 100;
        html += `<div class="highlight-result">${v1}% de ${v2} = ${result}</div>`;
        html += `<div class="step-box">${v1}% × ${v2} = ${v1/100} × ${v2} = <span class="highlight-step">${result}</span></div>`;
        questao = `${v1}% de ${v2}`;
        resposta = `${result}`;
    } else if (tipo === "2") {
        const result = (v1 / v2) * 100;
        html += `<div class="highlight-result">${v1} é ${result.toFixed(2)}% de ${v2}</div>`;
        html += `<div class="step-box">(${v1} ÷ ${v2}) × 100 = <span class="highlight-step">${result.toFixed(2)}%</span></div>`;
        questao = `${v1} é qual % de ${v2}`;
        resposta = `${result.toFixed(2)}%`;
    } else {
        const result = v1 + (v1 * v2 / 100);
        const sinal = v2 > 0 ? 'aumento' : 'desconto';
        html += `<div class="highlight-result">Valor final = ${result}</div>`;
        html += `<div class="step-box">${v1} ${sinal} de ${Math.abs(v2)}% = ${v1} + (${v1} × ${v2/100}) = <span class="highlight-step">${result}</span></div>`;
        questao = `${v1} com ${sinal} de ${Math.abs(v2)}%`;
        resposta = `${result}`;
    }

    resultDiv.innerHTML = html;
    resultDiv.classList.add('show');
    adicionarHistorico('Porcentagem', questao, resposta);
}

function limparPorcentagem() {
    document.getElementById('p1').value = '';
    document.getElementById('p2').value = '';
    document.getElementById('resultadoPorcentagem').classList.remove('show');
}

// ===== MMC e MDC =====
function calcularMMCMDC() {
    const num1 = parseInt(document.getElementById('mmc1').value);
    const num2 = parseInt(document.getElementById('mmc2').value);
    const resultDiv = document.getElementById('resultadoMMCMDC');

    if (isNaN(num1) || isNaN(num2) || num1 <= 0 || num2 <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Digite números inteiros positivos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    function gcd(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    }

    const mdc = gcd(num1, num2);
    const mmc = (num1 * num2) / mdc;

    function fatoracao(n) {
        let fatores = [];
        let divisor = 2;
        let temp = n;
        while (temp > 1) {
            if (temp % divisor === 0) {
                fatores.push(divisor);
                temp /= divisor;
            } else {
                divisor++;
            }
        }
        return fatores.join(' × ');
    }

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="function-result">
            <div class="card-result"><div class="label">📌 MMC</div><div class="value blue">${mmc}</div></div>
            <div class="card-result"><div class="label">📌 MDC</div><div class="value green">${mdc}</div></div>
        </div>
        <div class="step-box">
            <b>📌 Fatoração:</b><br>
            ${num1} = ${fatoracao(num1)}<br>
            ${num2} = ${fatoracao(num2)}<br><br>
            <b>MDC:</b> Multiplica os fatores comuns = <span class="highlight-step">${mdc}</span><br>
            <b>MMC:</b> Multiplica todos os fatores = <span class="highlight-step">${mmc}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('MMC e MDC', `MMC e MDC de ${num1} e ${num2}`, `MMC = ${mmc}, MDC = ${mdc}`);
}

function limparMMCMDC() {
    document.getElementById('mmc1').value = '';
    document.getElementById('mmc2').value = '';
    document.getElementById('resultadoMMCMDC').classList.remove('show');
}

// ===== MÉDIA ESCOLAR =====
function calcularMedia() {
    const n1 = parseFloat(document.getElementById('n1').value);
    const n2 = parseFloat(document.getElementById('n2').value);
    const n3 = parseFloat(document.getElementById('n3').value);
    const resultDiv = document.getElementById('resultadoMedia');

    const notas = [n1, n2, n3];
    if (notas.some(isNaN)) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todas as notas!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const media = notas.reduce((a, b) => a + b, 0) / notas.length;
    let situacao, cor, emoji;

    if (media >= 7) {
        situacao = 'Aprovado';
        cor = '#22c55e';
        emoji = '🎉';
    } else if (media >= 5) {
        situacao = 'Recuperação';
        cor = '#fbbf24';
        emoji = '📚';
    } else {
        situacao = 'Reprovado';
        cor = '#ef4444';
        emoji = '❌';
    }

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result" style="border-color: ${cor}; color: ${cor};">Média = ${media.toFixed(2)}</div>
        <div style="text-align: center; font-size: 32px; margin: 10px 0;">${emoji}</div>
        <div style="text-align: center; font-size: 24px; font-weight: 700; color: ${cor};">${situacao}</div>
        <div class="step-box">
            <b>📌 Cálculo:</b><br>
            Média = (${notas.join(' + ')}) ÷ 3<br>
            Média = ${notas.reduce((a,b) => a+b, 0)} ÷ 3<br>
            Média = <span class="highlight-step">${media.toFixed(2)}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Média Escolar', `Notas: ${notas.join(', ')}`, `Média = ${media.toFixed(2)} - ${situacao}`);
}

function limparMedia() {
    document.getElementById('n1').value = '';
    document.getElementById('n2').value = '';
    document.getElementById('n3').value = '';
    document.getElementById('n4').value = '';
    document.getElementById('resultadoMedia').classList.remove('show');
}

// ===== MÓDULO 2 - GEOMETRIA =====

function calcularAreaQuadrado() {
    const lado = parseFloat(document.getElementById('quadradoLado').value);
    const resultDiv = document.getElementById('resultadoQuadrado');

    if (isNaN(lado) || lado <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Digite um valor válido para o lado!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const area = lado * lado;
    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">Área = ${area}</div>
        <div class="step-box">
            <b>📌 Cálculo:</b><br>
            Área = Lado²<br>
            Área = ${lado}²<br>
            Área = <span class="highlight-step">${area}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Área do Quadrado', `Lado = ${lado}`, `Área = ${area}`);
}

function limparAreaQuadrado() {
    document.getElementById('quadradoLado').value = '';
    document.getElementById('resultadoQuadrado').classList.remove('show');
}

function calcularAreaRetangulo() {
    const base = parseFloat(document.getElementById('retBase').value);
    const altura = parseFloat(document.getElementById('retAltura').value);
    const resultDiv = document.getElementById('resultadoRetangulo');

    if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Digite valores válidos para base e altura!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const area = base * altura;
    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">Área = ${area}</div>
        <div class="step-box">
            <b>📌 Cálculo:</b><br>
            Área = Base × Altura<br>
            Área = ${base} × ${altura}<br>
            Área = <span class="highlight-step">${area}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Área do Retângulo', `Base = ${base}, Altura = ${altura}`, `Área = ${area}`);
}

function limparAreaRetangulo() {
    document.getElementById('retBase').value = '';
    document.getElementById('retAltura').value = '';
    document.getElementById('resultadoRetangulo').classList.remove('show');
}

function calcularAreaTriangulo() {
    const base = parseFloat(document.getElementById('triBase').value);
    const altura = parseFloat(document.getElementById('triAltura').value);
    const resultDiv = document.getElementById('resultadoTriangulo');

    if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Digite valores válidos para base e altura!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const area = (base * altura) / 2;
    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">Área = ${area}</div>
        <div class="step-box">
            <b>📌 Cálculo:</b><br>
            Área = (Base × Altura) / 2<br>
            Área = (${base} × ${altura}) / 2<br>
            Área = <span class="highlight-step">${area}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Área do Triângulo', `Base = ${base}, Altura = ${altura}`, `Área = ${area}`);
}

function limparAreaTriangulo() {
    document.getElementById('triBase').value = '';
    document.getElementById('triAltura').value = '';
    document.getElementById('resultadoTriangulo').classList.remove('show');
}

function calcularAreaCirculo() {
    const raio = parseFloat(document.getElementById('circuloRaio').value);
    const resultDiv = document.getElementById('resultadoCirculo');

    if (isNaN(raio) || raio <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Digite um valor válido para o raio!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const area = Math.PI * raio * raio;
    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">Área = ${area.toFixed(4)}</div>
        <div class="step-box">
            <b>📌 Cálculo:</b><br>
            Área = π × Raio²<br>
            Área = π × ${raio}²<br>
            Área = <span class="highlight-step">${area.toFixed(4)}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Área do Círculo', `Raio = ${raio}`, `Área = ${area.toFixed(4)}`);
}

function limparAreaCirculo() {
    document.getElementById('circuloRaio').value = '';
    document.getElementById('resultadoCirculo').classList.remove('show');
}

function calcularPerimetro() {
    const tipo = document.getElementById('tipoPerimetro').value;
    const v1 = parseFloat(document.getElementById('perim1').value);
    const v2 = parseFloat(document.getElementById('perim2').value);
    const resultDiv = document.getElementById('resultadoPerimetro');

    let resultado = 0;
    let formula = '';
    let questao = '';

    if (isNaN(v1) || v1 <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Digite um valor válido!</div>';
        resultDiv.classList.add('show');
        return;
    }

    switch(tipo) {
        case 'quadrado':
            resultado = 4 * v1;
            formula = `Perímetro = 4 × Lado = 4 × ${v1} = ${resultado}`;
            questao = `Quadrado com lado ${v1}`;
            break;
        case 'retangulo':
            if (isNaN(v2) || v2 <= 0) {
                resultDiv.innerHTML = '<div class="error">⚠️ Digite a altura!</div>';
                resultDiv.classList.add('show');
                return;
            }
            resultado = 2 * (v1 + v2);
            formula = `Perímetro = 2 × (Base + Altura) = 2 × (${v1} + ${v2}) = ${resultado}`;
            questao = `Retângulo com base ${v1} e altura ${v2}`;
            break;
        case 'triangulo':
            if (isNaN(v2) || v2 <= 0) {
                resultDiv.innerHTML = '<div class="error">⚠️ Digite a altura!</div>';
                resultDiv.classList.add('show');
                return;
            }
            const hip = Math.sqrt(v1*v1 + v2*v2);
            resultado = v1 + v2 + hip;
            formula = `Perímetro = Base + Altura + Hipotenusa = ${v1} + ${v2} + ${hip.toFixed(2)} = ${resultado.toFixed(2)}`;
            questao = `Triângulo com base ${v1} e altura ${v2}`;
            break;
        case 'circulo':
            resultado = 2 * Math.PI * v1;
            formula = `Circunferência = 2 × π × Raio = 2 × π × ${v1} = ${resultado.toFixed(4)}`;
            questao = `Círculo com raio ${v1}`;
            break;
    }

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">${resultado.toFixed(4)}</div>
        <div class="step-box">${formula}</div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Perímetro', questao, `${resultado.toFixed(4)}`);
}

function limparPerimetro() {
    document.getElementById('perim1').value = '';
    document.getElementById('perim2').value = '';
    document.getElementById('resultadoPerimetro').classList.remove('show');
}

function converterMedida() {
    const tipo = document.getElementById('tipoConversor').value;
    const valor = parseFloat(document.getElementById('convValor').value);
    const direcao = document.getElementById('convDirecao').value;
    const resultDiv = document.getElementById('resultadoConversor');

    if (isNaN(valor) || valor <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Digite um valor válido!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const conversoes = {
        'cm_m': { ida: valor / 100, volta: valor * 100, nome: 'cm ↔ m' },
        'm_km': { ida: valor / 1000, volta: valor * 1000, nome: 'm ↔ km' },
        'mm_cm': { ida: valor / 10, volta: valor * 10, nome: 'mm ↔ cm' },
        'g_kg': { ida: valor / 1000, volta: valor * 1000, nome: 'g ↔ kg' },
        'ml_l': { ida: valor / 1000, volta: valor * 1000, nome: 'ml ↔ l' }
    };

    const conv = conversoes[tipo];
    const resultado = direcao === 'ida' ? conv.ida : conv.volta;
    const direcaoTexto = direcao === 'ida' ? 'Primeiro → Segundo' : 'Segundo → Primeiro';

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">${valor} → ${resultado}</div>
        <div class="step-box">
            <b>📌 Conversão:</b><br>
            Tipo: ${conv.nome}<br>
            Direção: ${direcaoTexto}<br>
            Resultado: <span class="highlight-step">${resultado}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Conversor de Medidas', `${valor} ${conv.nome} (${direcaoTexto})`, `${resultado}`);
}

function limparConversor() {
    document.getElementById('convValor').value = '';
    document.getElementById('resultadoConversor').classList.remove('show');
}

// ===== MÓDULO 3 - TRIGONOMETRIA =====

function calcularTrig() {
    const angulo = parseFloat(document.getElementById('anguloTrig').value);
    const resultDiv = document.getElementById('resultadoTrig');

    if (isNaN(angulo)) {
        resultDiv.innerHTML = '<div class="error">⚠️ Digite um ângulo válido!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const rad = angulo * Math.PI / 180;
    const sen = Math.sin(rad);
    const cos = Math.cos(rad);
    const tan = Math.tan(rad);

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="function-result">
            <div class="card-result"><div class="label">📌 Seno</div><div class="value blue">${sen.toFixed(4)}</div></div>
            <div class="card-result"><div class="label">📌 Cosseno</div><div class="value green">${cos.toFixed(4)}</div></div>
            <div class="card-result" style="grid-column: 1 / -1;"><div class="label">📌 Tangente</div><div class="value" style="color: #fbbf24;">${tan.toFixed(4)}</div></div>
        </div>
        <div class="step-box">
            <b>📌 Detalhes:</b><br>
            Ângulo: ${angulo}°<br>
            Radianos: ${rad.toFixed(4)}<br>
            sen(${angulo}°) = <span class="highlight-step">${sen.toFixed(4)}</span><br>
            cos(${angulo}°) = <span class="highlight-step">${cos.toFixed(4)}</span><br>
            tan(${angulo}°) = <span class="highlight-step">${tan.toFixed(4)}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Trigonometria', `Ângulo = ${angulo}°`, `sen = ${sen.toFixed(4)}, cos = ${cos.toFixed(4)}, tan = ${tan.toFixed(4)}`);
}

function limparTrig() {
    document.getElementById('anguloTrig').value = '';
    document.getElementById('resultadoTrig').classList.remove('show');
}

function calcularLeiSenos() {
    const a = parseFloat(document.getElementById('senoA').value);
    const b = parseFloat(document.getElementById('senoB').value);
    const angA = parseFloat(document.getElementById('senoAngA').value);
    const resultDiv = document.getElementById('resultadoLeiSenos');

    if (isNaN(a) || isNaN(b) || isNaN(angA) || a <= 0 || b <= 0 || angA <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos com valores válidos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const angRad = angA * Math.PI / 180;
    const senA = Math.sin(angRad);
    const razao = a / senA;
    const senB = b / razao;
    const angB = Math.asin(senB) * 180 / Math.PI;
    const angC = 180 - angA - angB;
    const senC = Math.sin(angC * Math.PI / 180);
    const c = razao * senC;

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="function-result">
            <div class="card-result"><div class="label">📌 Ângulo B</div><div class="value blue">${angB.toFixed(2)}°</div></div>
            <div class="card-result"><div class="label">📌 Ângulo C</div><div class="value green">${angC.toFixed(2)}°</div></div>
            <div class="card-result" style="grid-column: 1 / -1;"><div class="label">📌 Lado c</div><div class="value" style="color: #fbbf24;">${c.toFixed(4)}</div></div>
        </div>
        <div class="step-box">
            <b>📌 Lei dos Senos:</b><br>
            a/sen(A) = b/sen(B) = c/sen(C)<br>
            ${a}/sen(${angA}°) = ${razao.toFixed(4)}<br>
            sen(B) = ${b}/${razao.toFixed(4)} = ${senB.toFixed(4)}<br>
            Ângulo B = <span class="highlight-step">${angB.toFixed(2)}°</span><br>
            Ângulo C = <span class="highlight-step">${angC.toFixed(2)}°</span><br>
            Lado c = <span class="highlight-step">${c.toFixed(4)}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Lei dos Senos', `a = ${a}, b = ${b}, A = ${angA}°`, `B = ${angB.toFixed(2)}°, C = ${angC.toFixed(2)}°, c = ${c.toFixed(4)}`);
}

function limparLeiSenos() {
    document.getElementById('senoA').value = '';
    document.getElementById('senoB').value = '';
    document.getElementById('senoAngA').value = '';
    document.getElementById('resultadoLeiSenos').classList.remove('show');
}

function calcularLeiCossenos() {
    const b = parseFloat(document.getElementById('cosB').value);
    const c = parseFloat(document.getElementById('cosC').value);
    const angA = parseFloat(document.getElementById('cosAngA').value);
    const resultDiv = document.getElementById('resultadoLeiCossenos');

    if (isNaN(b) || isNaN(c) || isNaN(angA) || b <= 0 || c <= 0 || angA <= 0) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos com valores válidos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const angRad = angA * Math.PI / 180;
    const a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(angRad));

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">Lado a = ${a.toFixed(4)}</div>
        <div class="step-box">
            <b>📌 Lei dos Cossenos:</b><br>
            a² = b² + c² - 2bc·cos(A)<br>
            a² = ${b}² + ${c}² - 2×${b}×${c}×cos(${angA}°)<br>
            a² = ${b*b} + ${c*c} - ${2*b*c*Math.cos(angRad).toFixed(4)}<br>
            a² = ${(b*b + c*c - 2*b*c*Math.cos(angRad)).toFixed(4)}<br>
            a = <span class="highlight-step">${a.toFixed(4)}</span>
        </div>
    `;
    resultDiv.classList.add('show');
    adicionarHistorico('Lei dos Cossenos', `b = ${b}, c = ${c}, A = ${angA}°`, `a = ${a.toFixed(4)}`);
}

function limparLeiCossenos() {
    document.getElementById('cosB').value = '';
    document.getElementById('cosC').value = '';
    document.getElementById('cosAngA').value = '';
    document.getElementById('resultadoLeiCossenos').classList.remove('show');
}

// ==================== FUNÇÃO 1º GRAU COM GRÁFICO CANVAS ====================
function calcularFuncao1() {
    const a = parseFloat(document.getElementById('func1a').value);
    const b = parseFloat(document.getElementById('func1b').value);
    const x = parseFloat(document.getElementById('func1x').value);
    const resultDiv = document.getElementById('resultadoFuncao1');

    if (isNaN(a) || isNaN(b) || isNaN(x)) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const resultado = a * x + b;
    const sinalB = b >= 0 ? '+' : '';

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">f(${x}) = ${resultado}</div>
        <div class="function-result">
            <div class="card-result"><div class="label">📌 Inclinação (a)</div><div class="value blue">${a}</div></div>
            <div class="card-result"><div class="label">📌 Intercepto (b)</div><div class="value green">${b}</div></div>
        </div>
        <div class="step-box">
            <b>📌 Passo a passo:</b><br>
            <span class="step-number">1</span> f(x) = ${a}x ${sinalB} ${b}<br>
            <span class="step-number">2</span> f(${x}) = ${a} × ${x} ${sinalB} ${b}<br>
            <span class="step-number">3</span> f(${x}) = ${a*x} ${sinalB} ${b}<br>
            <span class="step-number">✅</span> <span class="highlight-step">f(${x}) = ${resultado}</span>
        </div>
    `;
    resultDiv.classList.add('show');

    // Mostrar canvas e botão IA
    document.getElementById('canvasWrapper1').style.display = 'block';
    document.getElementById('iaWrapper1').style.display = 'block';
    document.getElementById('iaRespF1').classList.remove('show');
    document.getElementById('iaRespF1').textContent = '';

    // Desenhar gráfico
    setTimeout(() => desenharGrafico1(a, b, x, resultado), 50);

    adicionarHistorico('Função 1º Grau', `f(x) = ${a}x ${sinalB} ${b}, x = ${x}`, `f(${x}) = ${resultado}`);
}

function desenharGrafico1(a, b, xDest, yDest) {
    const canvas = document.getElementById('grafico1');
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 30 || 500;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const pad = 50;

    // Calcular range
    const xMin = xDest - 10, xMax = xDest + 10;
    const yVals = [a*xMin+b, a*xMax+b, yDest];
    const yMin = Math.min(...yVals) - 5;
    const yMax = Math.max(...yVals) + 5;

    function toCanvasX(x) { return pad + (x - xMin) / (xMax - xMin) * (W - 2*pad); }
    function toCanvasY(y) { return H - pad - (y - yMin) / (yMax - yMin) * (H - 2*pad); }

    // Fundo
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Grade
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let gx = Math.ceil(xMin); gx <= xMax; gx++) {
        const cx = toCanvasX(gx);
        ctx.beginPath(); ctx.moveTo(cx, pad); ctx.lineTo(cx, H-pad); ctx.stroke();
    }
    for (let gy = Math.ceil(yMin); gy <= yMax; gy++) {
        const cy = toCanvasY(gy);
        ctx.beginPath(); ctx.moveTo(pad, cy); ctx.lineTo(W-pad, cy); ctx.stroke();
    }

    // Eixos
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    // Eixo Y (x=0)
    if (xMin <= 0 && xMax >= 0) {
        const cx0 = toCanvasX(0);
        ctx.beginPath(); ctx.moveTo(cx0, pad); ctx.lineTo(cx0, H-pad); ctx.stroke();
    }
    // Eixo X (y=0)
    if (yMin <= 0 && yMax >= 0) {
        const cy0 = toCanvasY(0);
        ctx.beginPath(); ctx.moveTo(pad, cy0); ctx.lineTo(W-pad, cy0); ctx.stroke();
    }

    // Labels eixo X
    ctx.fillStyle = '#64748b';
    ctx.font = '11px Poppins, sans-serif';
    ctx.textAlign = 'center';
    const stepX = Math.ceil((xMax - xMin) / 8);
    for (let gx = Math.ceil(xMin/stepX)*stepX; gx <= xMax; gx += stepX) {
        const cx = toCanvasX(gx);
        ctx.fillText(gx, cx, H - pad + 16);
    }
    ctx.textAlign = 'right';
    const stepY = Math.ceil((yMax - yMin) / 6);
    for (let gy = Math.ceil(yMin/stepY)*stepY; gy <= yMax; gy += stepY) {
        const cy = toCanvasY(gy);
        ctx.fillText(gy, pad - 6, cy + 4);
    }

    // Linha da função
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(59,130,246,0.4)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= W - 2*pad; px++) {
        const xVal = xMin + px / (W - 2*pad) * (xMax - xMin);
        const yVal = a * xVal + b;
        const cx = toCanvasX(xVal), cy = toCanvasY(yVal);
        if (first) { ctx.moveTo(cx, cy); first = false; }
        else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Ponto destacado
    const cx = toCanvasX(xDest), cy = toCanvasY(yDest);
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.6)';
    ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Linhas tracejadas para o ponto
    ctx.strokeStyle = 'rgba(251,191,36,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, H-pad); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pad, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Label do ponto
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`(${xDest}, ${yDest})`, cx + 10, cy - 8);

    // Título
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`f(x) = ${a}x ${b >= 0 ? '+' : ''} ${b}`, W/2, pad - 10);

    document.getElementById('canvasLabel1').textContent = `Gráfico: f(x) = ${a}x ${b >= 0 ? '+' : ''} ${b} | Ponto: (${xDest}, ${yDest})`;
}

function limparFuncao1() {
    document.getElementById('func1a').value = '';
    document.getElementById('func1b').value = '';
    document.getElementById('func1x').value = '';
    document.getElementById('resultadoFuncao1').classList.remove('show');
    document.getElementById('canvasWrapper1').style.display = 'none';
    document.getElementById('iaWrapper1').style.display = 'none';
}
// ==================== FUNÇÃO 2º GRAU COM GRÁFICO CANVAS ====================
function calcularFuncao2() {
    const a = parseFloat(document.getElementById('func2a').value);
    const b = parseFloat(document.getElementById('func2b').value);
    const c = parseFloat(document.getElementById('func2c').value);
    const x = parseFloat(document.getElementById('func2x').value);
    const resultDiv = document.getElementById('resultadoFuncao2');

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(x)) {
        resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>';
        resultDiv.classList.add('show');
        return;
    }

    const resultado = a * x * x + b * x + c;
    const delta = b*b - 4*a*c;
    const xV = -b / (2*a);
    const yV = a*xV*xV + b*xV + c;
    let raizes = '';
    let x1 = null, x2 = null;

    if (delta > 0) {
        x1 = (-b + Math.sqrt(delta)) / (2*a);
        x2 = (-b - Math.sqrt(delta)) / (2*a);
        raizes = `x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`;
    } else if (delta === 0) {
        x1 = x2 = -b / (2*a);
        raizes = `x = ${x1.toFixed(2)} (raiz dupla)`;
    } else {
        raizes = 'Sem raízes reais (Δ < 0)';
    }

    const sinalB = b >= 0 ? '+' : '';
    const sinalC = c >= 0 ? '+' : '';

    resultDiv.innerHTML = `
        <div class="success-badge">✅ RESULTADO</div>
        <div class="highlight-result">f(${x}) = ${resultado}</div>
        <div class="function-result">
            <div class="card-result"><div class="label">📌 Delta (Δ)</div><div class="value blue">${delta.toFixed(4)}</div></div>
            <div class="card-result"><div class="label">📌 Vértice</div><div class="value" style="color:#8b5cf6;font-size:15px;">(${xV.toFixed(2)}, ${yV.toFixed(2)})</div></div>
            <div class="card-result" style="grid-column:1/-1"><div class="label">📌 Raízes</div><div class="value green" style="font-size:15px;">${raizes}</div></div>
        </div>
        <div class="step-box">
            <b>📌 Passo a passo:</b><br>
            <span class="step-number">1</span> f(x) = ${a}x² ${sinalB} ${b}x ${sinalC} ${c}<br>
            <span class="step-number">2</span> Δ = (${b})² - 4×${a}×${c} = <span class="highlight-step">${delta.toFixed(4)}</span><br>
            <span class="step-number">3</span> Vértice: xV = -b/2a = <span class="highlight-step">${xV.toFixed(2)}</span><br>
            <span class="step-number">4</span> f(${x}) = ${a}×${x}² ${sinalB} ${b}×${x} ${sinalC} ${c}<br>
            <span class="step-number">✅</span> <span class="highlight-step">f(${x}) = ${resultado}</span>
        </div>
    `;
    resultDiv.classList.add('show');

    document.getElementById('canvasWrapper2').style.display = 'block';
    document.getElementById('iaWrapper2').style.display = 'block';
    document.getElementById('iaRespF2').classList.remove('show');
    document.getElementById('iaRespF2').textContent = '';

    setTimeout(() => desenharGrafico2(a, b, c, x, resultado, x1, x2, xV, yV), 50);

    adicionarHistorico('Função 2º Grau', `f(x) = ${a}x² ${sinalB} ${b}x ${sinalC} ${c}, x = ${x}`, `f(${x}) = ${resultado}, Δ = ${delta.toFixed(2)}`);
}

function desenharGrafico2(a, b, c, xDest, yDest, x1, x2, xV, yV) {
    const canvas = document.getElementById('grafico2');
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 30 || 500;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const pad = 50;

    // Range
    const xs = [xDest, xV, x1 || xDest, x2 || xDest];
    const xMin = Math.min(...xs) - 5, xMax = Math.max(...xs) + 5;
    const yPoints = [a*xMin*xMin+b*xMin+c, a*xMax*xMax+b*xMax+c, yDest, yV];
    const yMin = Math.min(...yPoints) - 3, yMax = Math.max(...yPoints) + 3;

    function toCanvasX(x) { return pad + (x - xMin) / (xMax - xMin) * (W - 2*pad); }
    function toCanvasY(y) { return H - pad - (y - yMin) / (yMax - yMin) * (H - 2*pad); }

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Grade
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const sX = Math.max(1, Math.round((xMax - xMin) / 10));
    for (let gx = Math.ceil(xMin/sX)*sX; gx <= xMax; gx += sX) {
        const cx = toCanvasX(gx);
        ctx.beginPath(); ctx.moveTo(cx, pad); ctx.lineTo(cx, H-pad); ctx.stroke();
    }
    const sY = Math.max(1, Math.round((yMax - yMin) / 6));
    for (let gy = Math.ceil(yMin/sY)*sY; gy <= yMax; gy += sY) {
        const cy = toCanvasY(gy);
        ctx.beginPath(); ctx.moveTo(pad, cy); ctx.lineTo(W-pad, cy); ctx.stroke();
    }

    // Eixos
    ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
    if (xMin <= 0 && xMax >= 0) {
        const cx0 = toCanvasX(0);
        ctx.beginPath(); ctx.moveTo(cx0, pad); ctx.lineTo(cx0, H-pad); ctx.stroke();
    }
    if (yMin <= 0 && yMax >= 0) {
        const cy0 = toCanvasY(0);
        ctx.beginPath(); ctx.moveTo(pad, cy0); ctx.lineTo(W-pad, cy0); ctx.stroke();
    }

    // Labels
    ctx.fillStyle = '#64748b'; ctx.font = '11px Poppins, sans-serif';
    ctx.textAlign = 'center';
    for (let gx = Math.ceil(xMin/sX)*sX; gx <= xMax; gx += sX) {
        ctx.fillText(gx, toCanvasX(gx), H - pad + 16);
    }
    ctx.textAlign = 'right';
    for (let gy = Math.ceil(yMin/sY)*sY; gy <= yMax; gy += sY) {
        ctx.fillText(gy, pad - 6, toCanvasY(gy) + 4);
    }

    // Parábola
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#8b5cf6'); grad.addColorStop(1, '#3b82f6');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(139,92,246,0.5)'; ctx.shadowBlur = 8;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= W - 2*pad; px++) {
        const xVal = xMin + px / (W - 2*pad) * (xMax - xMin);
        const yVal = a*xVal*xVal + b*xVal + c;
        const cx = toCanvasX(xVal), cy = toCanvasY(yVal);
        if (cy < pad - 5 || cy > H - pad + 5) { first = true; continue; }
        if (first) { ctx.moveTo(cx, cy); first = false; }
        else ctx.lineTo(cx, cy);
    }
    ctx.stroke(); ctx.shadowBlur = 0;

    // Raízes
    if (x1 !== null) {
        [x1, x2].forEach(rx => {
            if (rx === null) return;
            const cx = toCanvasX(rx), cy = toCanvasY(0);
            ctx.fillStyle = '#22c55e';
            ctx.shadowColor = 'rgba(34,197,94,0.6)'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI*2); ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#22c55e'; ctx.font = 'bold 11px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(`x=${rx.toFixed(1)}`, cx, cy - 12);
        });
    }

    // Vértice
    const cvx = toCanvasX(xV), cvy = toCanvasY(yV);
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = 'rgba(245,158,11,0.6)'; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(cvx, cvy, 6, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 11px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(`V(${xV.toFixed(1)},${yV.toFixed(1)})`, cvx, cvy + 18);

    // Ponto de x escolhido
    const cpx = toCanvasX(xDest), cpy = toCanvasY(yDest);
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(251,191,36,0.6)'; ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(cpx, cpy, 7, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Linhas tracejadas
    ctx.strokeStyle = 'rgba(251,191,36,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(cpx, cpy); ctx.lineTo(cpx, H-pad); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cpx, cpy); ctx.lineTo(pad, cpy); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 12px Poppins'; ctx.textAlign = 'left';
    ctx.fillText(`(${xDest}, ${yDest})`, cpx + 10, cpy - 8);

    // Título
    ctx.fillStyle = '#94a3b8'; ctx.font = '12px Poppins'; ctx.textAlign = 'center';
    ctx.fillText(`f(x) = ${a}x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c}`, W/2, pad - 10);

    document.getElementById('canvasLabel2').textContent = `🟣 Curva  🟢 Raízes  🟡 Vértice  🌕 Ponto escolhido`;
}

function limparFuncao2() {
    ['func2a','func2b','func2c','func2x'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('resultadoFuncao2').classList.remove('show');
    document.getElementById('canvasWrapper2').style.display = 'none';
    document.getElementById('iaWrapper2').style.display = 'none';
}
// ==================== OCR ====================
let ocrTextoExtraido = '';
let ocrImagem = null;
let streamCamera = null;
let ocrQuestoes = [];
let modoOCR = 'groq';

const dropArea = document.getElementById('ocrDropArea');
if (dropArea) {
    dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('dragover'); });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault(); dropArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) processarArquivo(file);
    });
}

function setModoOCR(modo) {
    modoOCR = modo;
    const btnGroq = document.getElementById('modoGroqBtn');
    const btnLocal = document.getElementById('modoLocalBtn');
    if (btnGroq) btnGroq.classList.toggle('active', modo === 'groq');
    if (btnLocal) btnLocal.classList.toggle('active', modo === 'local');
    const desc = document.getElementById('modoDesc');
    if (desc) {
        desc.innerHTML = modo === 'groq' 
            ? '🧠 A IA do Groq resolve qualquer questão matemática com passo a passo detalhado.'
            : '⚡ Modo offline — resolve apenas questões simples (equações, funções básicas).';
    }
}

function processarOCR(event) {
    const file = event.target.files[0];
    if (file) processarArquivo(file);
}

function processarArquivo(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('ocrPreview');
        if (preview) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        ocrImagem = e.target.result;
    };
    reader.readAsDataURL(file);

    const progressDiv = document.getElementById('ocrProgress');
    const statusSpan = document.getElementById('ocrStatus');
    const progressBar = document.getElementById('ocrProgressBar');
    if (progressDiv) {
        progressDiv.classList.add('show');
        statusSpan.textContent = 'Iniciando...';
        progressBar.style.width = '10%';
    }

    Tesseract.recognize(file, 'por', {
        logger: (m) => {
            if (m.status === 'recognizing text') {
                const p = Math.round(m.progress * 100);
                if (statusSpan) statusSpan.textContent = `${p}%`;
                if (progressBar) progressBar.style.width = `${p}%`;
            }
        }
    }).then(({ data: { text } }) => {
        if (progressBar) progressBar.style.width = '100%';
        if (statusSpan) statusSpan.textContent = 'Concluído! ✅';
        ocrTextoExtraido = text.trim();

        const ocrResult = document.getElementById('ocrResult');
        const ocrTexto = document.getElementById('ocrTexto');
        if (ocrResult) ocrResult.classList.add('show');
        if (ocrTexto) ocrTexto.textContent = ocrTextoExtraido;

        if (ocrTextoExtraido.length > 0) {
            detectarQuestoes(ocrTextoExtraido);
        } else if (ocrTexto) {
            ocrTexto.innerHTML = '<div class="error">⚠️ Nenhum texto reconhecido.</div>';
        }
        setTimeout(() => { if (progressDiv) progressDiv.classList.remove('show'); }, 1200);
    }).catch((err) => {
        const ocrResult = document.getElementById('ocrResult');
        const ocrTexto = document.getElementById('ocrTexto');
        if (ocrResult) ocrResult.classList.add('show');
        if (ocrTexto) ocrTexto.innerHTML = `<div class="error">⚠️ Erro: ${err.message}</div>`;
        if (progressDiv) progressDiv.classList.remove('show');
    });
}

function toggleTextoOCR() {
    const textoDiv = document.getElementById('ocrTexto');
    const btn = document.getElementById('toggleTextoBtn');
    if (textoDiv) {
        if (textoDiv.style.display === 'none') {
            textoDiv.style.display = 'block';
            if (btn) btn.textContent = '▲ Ocultar';
        } else {
            textoDiv.style.display = 'none';
            if (btn) btn.textContent = '▼ Ver';
        }
    }
}

function detectarQuestoes(texto) {
    const linhas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    let questoes = [];
    let atual = '';
    let numAtual = 1;
    
    for (const linha of linhas) {
        if (linha.match(/^(\d+[\.\)]\s*|Questão\s*\d+|Q\.\s*\d+|[a-eA-E][\.\)]\s*)/i) ||
            linha.match(/^(EXERCÍCIO|PROBLEMA|CALCULAR|DETERMINAR|ENCONTRAR|RESOLVA)/i)) {
            if (atual.trim().length > 10) {
                questoes.push({ numero: numAtual++, texto: atual.trim() });
            }
            atual = linha;
        } else {
            atual += ' ' + linha;
        }
    }
    if (atual.trim().length > 10) questoes.push({ numero: numAtual++, texto: atual.trim() });
    
    if (questoes.length === 0) {
        const blocos = texto.split(/\n\s*\n/).map(b => b.trim()).filter(b => b.length > 20);
        questoes = blocos.length > 1 ? blocos.map((b, i) => ({ numero: i + 1, texto: b })) : [{ numero: 1, texto: texto.trim() }];
    }
    
    ocrQuestoes = questoes;
    renderizarListaQuestoes(questoes);
}

function renderizarListaQuestoes(questoes) {
    const area = document.getElementById('ocrQuestoesArea');
    const lista = document.getElementById('ocrQuestoesList');
    const count = document.getElementById('ocrQuestoesCount');
    if (count) count.textContent = questoes.length;
    if (area) area.style.display = 'block';
    
    const resultadoOCR = document.getElementById('resultadoOCR');
    if (resultadoOCR) {
        resultadoOCR.classList.remove('show');
        resultadoOCR.innerHTML = '';
    }

    if (lista) {
        lista.innerHTML = questoes.map((q, i) => `
            <div class="questao-card" id="qcard_${i}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
                    <div style="flex:1;">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                            <span style="background:#2563eb;color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;">Questão ${q.numero}</span>
                            <span id="qstatus_${i}" style="font-size:12px;color:#64748b;"></span>
                        </div>
                        <p style="color:#cbd5e1;font-size:13px;line-height:1.6;margin:0;max-height:80px;overflow:hidden;text-overflow:ellipsis;" id="qtexto_${i}">
                            ${q.texto.substring(0, 200)}${q.texto.length > 200 ? '...' : ''}
                        </p>
                        <button onclick="toggleExpandQuestao(${i})" style="background:none;border:none;color:#64748b;font-size:11px;cursor:pointer;margin-top:4px;padding:0;" id="qexpand_${i}">
                            ${q.texto.length > 200 ? '▼ Ver mais' : ''}
                        </button>
                    </div>
                    <button class="btn btn-purple" style="white-space:nowrap;font-size:13px;padding:8px 16px;flex-shrink:0;" id="qbtn_${i}" onclick="resolverQuestao(${i})">🤖 Resolver</button>
                </div>
                <div id="qresp_${i}" style="display:none;margin-top:14px;border-top:1px solid #1e293b;padding-top:14px;"></div>
            </div>
        `).join('');
    }
}

function toggleExpandQuestao(i) {
    const q = ocrQuestoes[i];
    const textoEl = document.getElementById(`qtexto_${i}`);
    const btn = document.getElementById(`qexpand_${i}`);
    if (textoEl) {
        if (textoEl.style.maxHeight === 'none') {
            textoEl.style.maxHeight = '80px';
            textoEl.textContent = q.texto.substring(0, 200) + (q.texto.length > 200 ? '...' : '');
            if (btn) btn.textContent = '▼ Ver mais';
        } else {
            textoEl.style.maxHeight = 'none';
            textoEl.textContent = q.texto;
            if (btn) btn.textContent = '▲ Ver menos';
        }
    }
}

async function resolverQuestao(i) {
    const q = ocrQuestoes[i];
    const btn = document.getElementById(`qbtn_${i}`);
    const respDiv = document.getElementById(`qresp_${i}`);
    const statusEl = document.getElementById(`qstatus_${i}`);
    const card = document.getElementById(`qcard_${i}`);

    document.querySelectorAll('.questao-card').forEach(c => c.style.borderColor = '#1e293b');
    if (card) card.style.borderColor = '#7c3aed';

    if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Resolvendo...';
    }
    if (statusEl) statusEl.textContent = '🔄 processando...';
    if (respDiv) {
        respDiv.style.display = 'block';
        respDiv.innerHTML = `<div class="ia-loading"><div class="ia-dot"></div><div class="ia-dot"></div><div class="ia-dot"></div><span>🧠 IA analisando a questão ${q.numero}...</span></div>`;
    }
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
        const resposta = resolverLocalmente(q.texto);
        if (respDiv) {
            respDiv.innerHTML = `
                <div style="display:inline-block;background:#f59e0b;color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;">⚡ Modo Offline</div>
                <div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#e2e8f0;">${resposta}</div>
                <button onclick="copiarRespQuestao(${i})" style="margin-top:10px;background:#22c55e;color:white;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">📋 Copiar</button>
            `;
        }
        if (statusEl) statusEl.innerHTML = '<span style="color:#f59e0b;">⚡ offline</span>';
        adicionarHistorico(`OCR - Questão ${q.numero}`, q.texto.substring(0, 60) + '...', 'Resolvido offline');
    } catch (e) {
        const fallback = resolverLocalmente(q.texto);
        if (respDiv) {
            respDiv.innerHTML = `
                <div style="display:inline-block;background:#ef4444;color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;">⚠️ Erro</div>
                <div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#e2e8f0;">${fallback}</div>
            `;
        }
        if (statusEl) statusEl.textContent = '❌ erro';
    }

    if (btn) {
        btn.disabled = false;
        btn.textContent = '🔁 Resolver novamente';
    }
}

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

function resolverLocalmente(pergunta) {
    const texto = pergunta.toLowerCase();
    
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
1. Ative o modo "IA (Groq)" para resolver questões complexas
2. Tire uma foto com boa iluminação
3. Escreva a questão manualmente em uma das ferramentas`;
}

// ==================== CÂMERA ====================

function abrirCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('⚠️ Câmera indisponível. Use upload.');
        return;
    }
    const video = document.getElementById('videoCamera');
    const preview = document.getElementById('ocrPreview');
    const icon = document.getElementById('ocrIcon');
    if (preview) preview.style.display = 'none';
    if (video) video.style.display = 'block';
    if (icon) icon.textContent = '📹';
    if (dropArea) dropArea.querySelector('p').innerHTML = '<strong>📸 Aponte e toque para fotografar</strong>';

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then(stream => {
            streamCamera = stream;
            if (video) {
                video.srcObject = stream;
                video.play();
            }
            if (dropArea) dropArea.onclick = tirarFoto;
        })
        .catch(() => { alert('⚠️ Câmera indisponível.'); fecharCamera(); });
}

function tirarFoto() {
    const video = document.getElementById('videoCamera');
    const canvas = document.getElementById('canvasCamera');
    const preview = document.getElementById('ocrPreview');
    if (video && canvas) {
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        if (preview) {
            preview.src = dataUrl;
            preview.style.display = 'block';
        }
        ocrImagem = dataUrl;
        const icon = document.getElementById('ocrIcon');
        if (icon) icon.textContent = '📸';
        if (dropArea) dropArea.querySelector('p').innerHTML = '<strong>✅ Foto tirada!</strong>';
        fecharCamera();
        fetch(dataUrl).then(r => r.blob()).then(blob => processarArquivo(new File([blob], 'foto.jpg', { type: 'image/jpeg' })));
        if (dropArea) dropArea.onclick = abrirCamera;
    }
}

function fecharCamera() {
    if (streamCamera) { streamCamera.getTracks().forEach(t => t.stop()); streamCamera = null; }
    const video = document.getElementById('videoCamera');
    if (video) { video.srcObject = null; video.style.display = 'none'; }
}

function limparOCR() {
    const input = document.getElementById('ocrInput');
    const preview = document.getElementById('ocrPreview');
    const ocrResult = document.getElementById('ocrResult');
    const resultadoOCR = document.getElementById('resultadoOCR');
    const ocrProgress = document.getElementById('ocrProgress');
    const ocrQuestoesArea = document.getElementById('ocrQuestoesArea');
    const ocrQuestoesList = document.getElementById('ocrQuestoesList');
    const ocrTexto = document.getElementById('ocrTexto');
    
    if (input) input.value = '';
    if (preview) { preview.style.display = 'none'; preview.src = ''; }
    if (ocrResult) ocrResult.classList.remove('show');
    if (resultadoOCR) resultadoOCR.classList.remove('show');
    if (ocrProgress) ocrProgress.classList.remove('show');
    if (ocrQuestoesArea) ocrQuestoesArea.style.display = 'none';
    if (ocrQuestoesList) ocrQuestoesList.innerHTML = '';
    if (ocrTexto) ocrTexto.style.display = 'none';
    ocrTextoExtraido = ''; ocrImagem = null; ocrQuestoes = [];
    fecharCamera();
    if (dropArea) dropArea.querySelector('p').innerHTML = '<strong>Clique ou arraste</strong> uma imagem aqui';
    const icon = document.getElementById('ocrIcon');
    if (icon) icon.textContent = '📸';
}

// ==================== LOGOUT ====================

function fazerLogout() {
    sessionStorage.removeItem('math_user');
    window.location.href = 'login.html';
}



// ==================== INICIALIZAÇÃO ====================

atualizarContadorHistorico();
console.log('✅ Math Solver Pro carregado!');
console.log('👤 Usuário:', sessionStorage.getItem('math_user'));