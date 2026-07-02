// ==================== CONFIGURAÇÃO DO BACKEND ====================
// Troque pela URL real do seu projeto na Vercel após o deploy
const BACKEND_URL = 'https://site-matematico-nu.vercel.app/api/resolver';

// ==================== VERIFICA LOGIN ====================
const usuarioLogado = sessionStorage.getItem('math_user');
if (!usuarioLogado) {
    window.location.href = 'login.html';
}
document.getElementById('userNameDisplay').textContent = `👤 ${usuarioLogado}`;

// ==================== VARIÁVEIS GLOBAIS ====================
let ocrTextoExtraido = '';
let ocrImagem = null;
let streamCamera = null;
let ocrQuestoes = [];
let modoOCR = 'groq';
let dropArea = null;

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
    historico.unshift({ data, ferramenta, questao, resposta });
    if (historico.length > 100) historico.pop();
    salvarHistorico(historico);
    atualizarContadorHistorico();
}

function atualizarContadorHistorico() {
    const el = document.getElementById('historyCount');
    if (el) el.textContent = getHistorico().length;
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

// ==================== FUNÇÕES MATEMÁTICAS ====================

function resolverEquacao1() {
    const a = parseFloat(document.getElementById('eq1a').value);
    const b = parseFloat(document.getElementById('eq1b').value);
    const c = parseFloat(document.getElementById('eq1c').value);
    const resultDiv = document.getElementById('resultadoEquacao1');
    if (isNaN(a) || isNaN(b) || isNaN(c)) { resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>'; resultDiv.classList.add('show'); return; }
    if (a === 0) { resultDiv.innerHTML = '<div class="error">⚠️ "A" não pode ser zero!</div>'; resultDiv.classList.add('show'); return; }
    const x = (c - b) / a;
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
        </div>`;
    resultDiv.classList.add('show');
    adicionarHistorico('Equação 1º Grau', `${a}x + ${b} = ${c}`, `x = ${x}`);
}
function limparEquacao1() { ['eq1a','eq1b','eq1c'].forEach(id => document.getElementById(id).value = ''); document.getElementById('resultadoEquacao1').classList.remove('show'); }

function resolverEquacao2() {
    const a = parseFloat(document.getElementById('eq2a').value);
    const b = parseFloat(document.getElementById('eq2b').value);
    const c = parseFloat(document.getElementById('eq2c').value);
    const resultDiv = document.getElementById('resultadoEquacao2');
    if (isNaN(a) || isNaN(b) || isNaN(c)) { resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>'; resultDiv.classList.add('show'); return; }
    if (a === 0) { resultDiv.innerHTML = '<div class="error">⚠️ "A" não pode ser zero!</div>'; resultDiv.classList.add('show'); return; }
    const delta = b*b - 4*a*c;
    let html = `<div class="success-badge">✅ SOLUÇÃO</div><div class="step-box"><b>📌 Delta:</b><br>Δ = (${b})² - 4×${a}×${c} = <span class="highlight-step">${delta}</span></div>`;
    let resposta = '';
    if (delta < 0) { html += `<div class="error">⚠️ Δ < 0: Sem raízes reais.</div>`; resposta = 'Sem raízes reais'; }
    else if (delta === 0) { const x = -b/(2*a); html += `<div class="highlight-result">x = ${x} (raiz dupla)</div>`; resposta = `x = ${x}`; }
    else {
        const x1 = (-b+Math.sqrt(delta))/(2*a), x2 = (-b-Math.sqrt(delta))/(2*a);
        html += `<div class="function-result"><div class="card-result"><div class="label">X₁</div><div class="value blue">${x1.toFixed(4)}</div></div><div class="card-result"><div class="label">X₂</div><div class="value green">${x2.toFixed(4)}</div></div></div>`;
        resposta = `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
    }
    resultDiv.innerHTML = html; resultDiv.classList.add('show');
    adicionarHistorico('Equação 2º Grau', `${a}x² + ${b}x + ${c} = 0`, resposta);
}
function limparEquacao2() { ['eq2a','eq2b','eq2c'].forEach(id => document.getElementById(id).value = ''); document.getElementById('resultadoEquacao2').classList.remove('show'); }

function resolverPitagoras() {
    const a = parseFloat(document.getElementById('catA').value);
    const b = parseFloat(document.getElementById('catB').value);
    const h = parseFloat(document.getElementById('hip').value);
    const resultDiv = document.getElementById('resultadoPitagoras');
    const preenchidos = [a,b,h].filter(v => !isNaN(v) && v > 0).length;
    if (preenchidos !== 2) { resultDiv.innerHTML = '<div class="error">⚠️ Preencha exatamente 2 valores!</div>'; resultDiv.classList.add('show'); return; }
    let html = `<div class="success-badge">✅ RESULTADO</div>`, questao, resposta;
    if (isNaN(h)||h===0) { const r=Math.sqrt(a*a+b*b); html+=`<div class="highlight-result">Hipotenusa = ${r.toFixed(4)}</div><div class="step-box">h = √(${a}² + ${b}²) = <span class="highlight-step">${r.toFixed(4)}</span></div>`; questao=`Catetos: ${a} e ${b}`; resposta=`h = ${r.toFixed(4)}`; }
    else if (isNaN(a)||a===0) { const r=Math.sqrt(h*h-b*b); html+=`<div class="highlight-result">Cateto A = ${r.toFixed(4)}</div><div class="step-box">a = √(${h}² - ${b}²) = <span class="highlight-step">${r.toFixed(4)}</span></div>`; questao=`h=${h}, b=${b}`; resposta=`a = ${r.toFixed(4)}`; }
    else { const r=Math.sqrt(h*h-a*a); html+=`<div class="highlight-result">Cateto B = ${r.toFixed(4)}</div><div class="step-box">b = √(${h}² - ${a}²) = <span class="highlight-step">${r.toFixed(4)}</span></div>`; questao=`h=${h}, a=${a}`; resposta=`b = ${r.toFixed(4)}`; }
    resultDiv.innerHTML = html; resultDiv.classList.add('show');
    adicionarHistorico('Pitágoras', questao, resposta);
}
function limparPitagoras() { ['catA','catB','hip'].forEach(id => document.getElementById(id).value = ''); document.getElementById('resultadoPitagoras').classList.remove('show'); }

function resolverRegra3() {
    const A = parseFloat(document.getElementById('rA').value), B = parseFloat(document.getElementById('rB').value), C = parseFloat(document.getElementById('rC').value);
    const resultDiv = document.getElementById('resultadoRegra3');
    if (isNaN(A)||isNaN(B)||isNaN(C)) { resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>'; resultDiv.classList.add('show'); return; }
    if (A===0) { resultDiv.innerHTML = '<div class="error">⚠️ Divisão por zero!</div>'; resultDiv.classList.add('show'); return; }
    const x = (B*C)/A;
    resultDiv.innerHTML = `<div class="success-badge">✅ SOLUÇÃO</div><div class="highlight-result">X = ${x}</div><div class="step-box">${A} : ${B} = ${C} : X<br>${A}·X = ${B*C}<br>X = ${B*C} ÷ ${A}<br><span class="highlight-step">X = ${x}</span></div>`;
    resultDiv.classList.add('show');
    adicionarHistorico('Regra de 3', `${A}:${B}=${C}:X`, `X = ${x}`);
}
function limparRegra3() { ['rA','rB','rC'].forEach(id => document.getElementById(id).value = ''); document.getElementById('resultadoRegra3').classList.remove('show'); }

function resolverPorcentagem() {
    const tipo = document.getElementById('tipoPorcentagem').value;
    const v1 = parseFloat(document.getElementById('p1').value), v2 = parseFloat(document.getElementById('p2').value);
    const resultDiv = document.getElementById('resultadoPorcentagem');
    if (isNaN(v1)||isNaN(v2)) { resultDiv.innerHTML = '<div class="error">⚠️ Preencha todos os campos!</div>'; resultDiv.classList.add('show'); return; }
    let html = `<div class="success-badge">✅ RESULTADO</div>`, questao, resposta;
    if (tipo==="1") { const r=(v1*v2)/100; html+=`<div class="highlight-result">${v1}% de ${v2} = ${r}</div><div class="step-box">${v1}/100 × ${v2} = <span class="highlight-step">${r}</span></div>`; questao=`${v1}% de ${v2}`; resposta=`${r}`; }
    else if (tipo==="2") { const r=(v1/v2)*100; html+=`<div class="highlight-result">${v1} é ${r.toFixed(2)}% de ${v2}</div><div class="step-box">(${v1}÷${v2})×100 = <span class="highlight-step">${r.toFixed(2)}%</span></div>`; questao=`${v1} é qual % de ${v2}`; resposta=`${r.toFixed(2)}%`; }
    else { const r=v1+(v1*v2/100), s=v2>0?'aumento':'desconto'; html+=`<div class="highlight-result">Valor final = ${r}</div><div class="step-box">${v1} com ${s} de ${Math.abs(v2)}% = <span class="highlight-step">${r}</span></div>`; questao=`${v1} com ${s} de ${Math.abs(v2)}%`; resposta=`${r}`; }
    resultDiv.innerHTML = html; resultDiv.classList.add('show');
    adicionarHistorico('Porcentagem', questao, resposta);
}
function limparPorcentagem() { ['p1','p2'].forEach(id => document.getElementById(id).value = ''); document.getElementById('resultadoPorcentagem').classList.remove('show'); }

function calcularMMCMDC() {
    const num1 = parseInt(document.getElementById('mmc1').value), num2 = parseInt(document.getElementById('mmc2').value);
    const resultDiv = document.getElementById('resultadoMMCMDC');
    if (isNaN(num1)||isNaN(num2)||num1<=0||num2<=0) { resultDiv.innerHTML = '<div class="error">⚠️ Digite números inteiros positivos!</div>'; resultDiv.classList.add('show'); return; }
    function gcd(a,b) { while(b!==0){[a,b]=[b,a%b];} return a; }
    function fat(n) { let f=[],d=2,t=n; while(t>1){if(t%d===0){f.push(d);t/=d;}else d++;} return f.join(' × '); }
    const mdc = gcd(num1,num2), mmc = (num1*num2)/mdc;
    resultDiv.innerHTML = `<div class="success-badge">✅ RESULTADO</div><div class="function-result"><div class="card-result"><div class="label">MMC</div><div class="value blue">${mmc}</div></div><div class="card-result"><div class="label">MDC</div><div class="value green">${mdc}</div></div></div><div class="step-box"><b>Fatoração:</b><br>${num1} = ${fat(num1)}<br>${num2} = ${fat(num2)}<br>MDC = <span class="highlight-step">${mdc}</span> | MMC = <span class="highlight-step">${mmc}</span></div>`;
    resultDiv.classList.add('show');
    adicionarHistorico('MMC e MDC', `${num1} e ${num2}`, `MMC=${mmc}, MDC=${mdc}`);
}
function limparMMCMDC() { ['mmc1','mmc2'].forEach(id => document.getElementById(id).value = ''); document.getElementById('resultadoMMCMDC').classList.remove('show'); }

function calcularMedia() {
    const notas = ['n1','n2','n3'].map(id => parseFloat(document.getElementById(id).value));
    const resultDiv = document.getElementById('resultadoMedia');
    if (notas.some(isNaN)) { resultDiv.innerHTML = '<div class="error">⚠️ Preencha todas as notas!</div>'; resultDiv.classList.add('show'); return; }
    const media = notas.reduce((a,b) => a+b, 0) / notas.length;
    const [situacao, cor, emoji] = media>=7 ? ['Aprovado','#22c55e','🎉'] : media>=5 ? ['Recuperação','#fbbf24','📚'] : ['Reprovado','#ef4444','❌'];
    resultDiv.innerHTML = `<div class="success-badge">✅ RESULTADO</div><div class="highlight-result" style="border-color:${cor};color:${cor};">Média = ${media.toFixed(2)}</div><div style="text-align:center;font-size:32px;margin:10px 0;">${emoji}</div><div style="text-align:center;font-size:24px;font-weight:700;color:${cor};">${situacao}</div><div class="step-box">Média = (${notas.join('+')}) ÷ 3 = <span class="highlight-step">${media.toFixed(2)}</span></div>`;
    resultDiv.classList.add('show');
    adicionarHistorico('Média Escolar', `Notas: ${notas.join(', ')}`, `${media.toFixed(2)} - ${situacao}`);
}
function limparMedia() { ['n1','n2','n3'].forEach(id => document.getElementById(id).value = ''); document.getElementById('resultadoMedia').classList.remove('show'); }

function calcularAreaQuadrado() {
    const lado = parseFloat(document.getElementById('quadradoLado').value), r = document.getElementById('resultadoQuadrado');
    if (isNaN(lado)||lado<=0) { r.innerHTML='<div class="error">⚠️ Valor inválido!</div>'; r.classList.add('show'); return; }
    const area = lado*lado;
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">Área = ${area}</div><div class="step-box">Área = ${lado}² = <span class="highlight-step">${area}</span></div>`;
    r.classList.add('show'); adicionarHistorico('Área Quadrado',`Lado=${lado}`,`${area}`);
}
function limparAreaQuadrado() { document.getElementById('quadradoLado').value=''; document.getElementById('resultadoQuadrado').classList.remove('show'); }

function calcularAreaRetangulo() {
    const base=parseFloat(document.getElementById('retBase').value), alt=parseFloat(document.getElementById('retAltura').value), r=document.getElementById('resultadoRetangulo');
    if (isNaN(base)||isNaN(alt)||base<=0||alt<=0) { r.innerHTML='<div class="error">⚠️ Valores inválidos!</div>'; r.classList.add('show'); return; }
    const area=base*alt;
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">Área = ${area}</div><div class="step-box">Área = ${base} × ${alt} = <span class="highlight-step">${area}</span></div>`;
    r.classList.add('show'); adicionarHistorico('Área Retângulo',`${base}x${alt}`,`${area}`);
}
function limparAreaRetangulo() { ['retBase','retAltura'].forEach(id=>document.getElementById(id).value=''); document.getElementById('resultadoRetangulo').classList.remove('show'); }

function calcularAreaTriangulo() {
    const base=parseFloat(document.getElementById('triBase').value), alt=parseFloat(document.getElementById('triAltura').value), r=document.getElementById('resultadoTriangulo');
    if (isNaN(base)||isNaN(alt)||base<=0||alt<=0) { r.innerHTML='<div class="error">⚠️ Valores inválidos!</div>'; r.classList.add('show'); return; }
    const area=(base*alt)/2;
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">Área = ${area}</div><div class="step-box">Área = (${base} × ${alt}) ÷ 2 = <span class="highlight-step">${area}</span></div>`;
    r.classList.add('show'); adicionarHistorico('Área Triângulo',`${base}x${alt}`,`${area}`);
}
function limparAreaTriangulo() { ['triBase','triAltura'].forEach(id=>document.getElementById(id).value=''); document.getElementById('resultadoTriangulo').classList.remove('show'); }

function calcularAreaCirculo() {
    const raio=parseFloat(document.getElementById('circuloRaio').value), r=document.getElementById('resultadoCirculo');
    if (isNaN(raio)||raio<=0) { r.innerHTML='<div class="error">⚠️ Valor inválido!</div>'; r.classList.add('show'); return; }
    const area=Math.PI*raio*raio;
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">Área = ${area.toFixed(4)}</div><div class="step-box">Área = π × ${raio}² = <span class="highlight-step">${area.toFixed(4)}</span></div>`;
    r.classList.add('show'); adicionarHistorico('Área Círculo',`Raio=${raio}`,`${area.toFixed(4)}`);
}
function limparAreaCirculo() { document.getElementById('circuloRaio').value=''; document.getElementById('resultadoCirculo').classList.remove('show'); }

function calcularPerimetro() {
    const tipo=document.getElementById('tipoPerimetro').value, v1=parseFloat(document.getElementById('perim1').value), v2=parseFloat(document.getElementById('perim2').value), r=document.getElementById('resultadoPerimetro');
    if (isNaN(v1)||v1<=0) { r.innerHTML='<div class="error">⚠️ Valor inválido!</div>'; r.classList.add('show'); return; }
    let res=0, formula='', questao='';
    switch(tipo) {
        case 'quadrado': res=4*v1; formula=`4 × ${v1} = ${res}`; questao=`Quadrado L=${v1}`; break;
        case 'retangulo': if(isNaN(v2)||v2<=0){r.innerHTML='<div class="error">⚠️ Digite a altura!</div>';r.classList.add('show');return;} res=2*(v1+v2); formula=`2×(${v1}+${v2}) = ${res}`; questao=`Retângulo ${v1}x${v2}`; break;
        case 'triangulo': if(isNaN(v2)||v2<=0){r.innerHTML='<div class="error">⚠️ Digite a altura!</div>';r.classList.add('show');return;} const hip=Math.sqrt(v1*v1+v2*v2); res=v1+v2+hip; formula=`${v1}+${v2}+${hip.toFixed(2)} = ${res.toFixed(2)}`; questao=`Triângulo ${v1}x${v2}`; break;
        case 'circulo': res=2*Math.PI*v1; formula=`2π × ${v1} = ${res.toFixed(4)}`; questao=`Círculo R=${v1}`; break;
    }
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">${res.toFixed(4)}</div><div class="step-box">${formula}</div>`;
    r.classList.add('show'); adicionarHistorico('Perímetro',questao,`${res.toFixed(4)}`);
}
function limparPerimetro() { ['perim1','perim2'].forEach(id=>document.getElementById(id).value=''); document.getElementById('resultadoPerimetro').classList.remove('show'); }

function converterMedida() {
    const tipo=document.getElementById('tipoConversor').value, valor=parseFloat(document.getElementById('convValor').value), dir=document.getElementById('convDirecao').value, r=document.getElementById('resultadoConversor');
    if (isNaN(valor)||valor<=0) { r.innerHTML='<div class="error">⚠️ Valor inválido!</div>'; r.classList.add('show'); return; }
    const conv={'cm_m':{ida:valor/100,volta:valor*100,nome:'cm ↔ m'},'m_km':{ida:valor/1000,volta:valor*1000,nome:'m ↔ km'},'mm_cm':{ida:valor/10,volta:valor*10,nome:'mm ↔ cm'},'g_kg':{ida:valor/1000,volta:valor*1000,nome:'g ↔ kg'},'ml_l':{ida:valor/1000,volta:valor*1000,nome:'ml ↔ l'}};
    const c=conv[tipo], res=dir==='ida'?c.ida:c.volta;
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">${valor} → ${res}</div><div class="step-box">${c.nome}: <span class="highlight-step">${res}</span></div>`;
    r.classList.add('show'); adicionarHistorico('Conversor',`${valor} ${c.nome}`,`${res}`);
}
function limparConversor() { document.getElementById('convValor').value=''; document.getElementById('resultadoConversor').classList.remove('show'); }

function calcularTrig() {
    const angulo=parseFloat(document.getElementById('anguloTrig').value), r=document.getElementById('resultadoTrig');
    if (isNaN(angulo)) { r.innerHTML='<div class="error">⚠️ Ângulo inválido!</div>'; r.classList.add('show'); return; }
    const rad=angulo*Math.PI/180, sen=Math.sin(rad), cos=Math.cos(rad), tan=Math.tan(rad);
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="function-result"><div class="card-result"><div class="label">Seno</div><div class="value blue">${sen.toFixed(4)}</div></div><div class="card-result"><div class="label">Cosseno</div><div class="value green">${cos.toFixed(4)}</div></div><div class="card-result" style="grid-column:1/-1"><div class="label">Tangente</div><div class="value" style="color:#fbbf24">${tan.toFixed(4)}</div></div></div>`;
    r.classList.add('show'); adicionarHistorico('Trigonometria',`${angulo}°`,`sen=${sen.toFixed(4)}, cos=${cos.toFixed(4)}, tan=${tan.toFixed(4)}`);
}
function limparTrig() { document.getElementById('anguloTrig').value=''; document.getElementById('resultadoTrig').classList.remove('show'); }

function calcularLeiSenos() {
    const a=parseFloat(document.getElementById('senoA').value), b=parseFloat(document.getElementById('senoB').value), angA=parseFloat(document.getElementById('senoAngA').value), r=document.getElementById('resultadoLeiSenos');
    if (isNaN(a)||isNaN(b)||isNaN(angA)||a<=0||b<=0||angA<=0) { r.innerHTML='<div class="error">⚠️ Preencha todos os campos!</div>'; r.classList.add('show'); return; }
    const rad=angA*Math.PI/180, senA=Math.sin(rad), razao=a/senA, senB=b/razao, angB=Math.asin(senB)*180/Math.PI, angC=180-angA-angB, c=razao*Math.sin(angC*Math.PI/180);
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="function-result"><div class="card-result"><div class="label">Ângulo B</div><div class="value blue">${angB.toFixed(2)}°</div></div><div class="card-result"><div class="label">Ângulo C</div><div class="value green">${angC.toFixed(2)}°</div></div><div class="card-result" style="grid-column:1/-1"><div class="label">Lado c</div><div class="value" style="color:#fbbf24">${c.toFixed(4)}</div></div></div>`;
    r.classList.add('show'); adicionarHistorico('Lei dos Senos',`a=${a},b=${b},A=${angA}°`,`B=${angB.toFixed(2)}°,c=${c.toFixed(4)}`);
}
function limparLeiSenos() { ['senoA','senoB','senoAngA'].forEach(id=>document.getElementById(id).value=''); document.getElementById('resultadoLeiSenos').classList.remove('show'); }

function calcularLeiCossenos() {
    const b=parseFloat(document.getElementById('cosB').value), c=parseFloat(document.getElementById('cosC').value), angA=parseFloat(document.getElementById('cosAngA').value), r=document.getElementById('resultadoLeiCossenos');
    if (isNaN(b)||isNaN(c)||isNaN(angA)||b<=0||c<=0||angA<=0) { r.innerHTML='<div class="error">⚠️ Preencha todos os campos!</div>'; r.classList.add('show'); return; }
    const a=Math.sqrt(b*b+c*c-2*b*c*Math.cos(angA*Math.PI/180));
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">Lado a = ${a.toFixed(4)}</div><div class="step-box">a² = ${b}² + ${c}² - 2×${b}×${c}×cos(${angA}°)<br>a = <span class="highlight-step">${a.toFixed(4)}</span></div>`;
    r.classList.add('show'); adicionarHistorico('Lei dos Cossenos',`b=${b},c=${c},A=${angA}°`,`a=${a.toFixed(4)}`);
}
function limparLeiCossenos() { ['cosB','cosC','cosAngA'].forEach(id=>document.getElementById(id).value=''); document.getElementById('resultadoLeiCossenos').classList.remove('show'); }

// ==================== FUNÇÕES COM GRÁFICO ====================

function calcularFuncao1() {
    const a=parseFloat(document.getElementById('func1a').value), b=parseFloat(document.getElementById('func1b').value), x=parseFloat(document.getElementById('func1x').value), r=document.getElementById('resultadoFuncao1');
    if (isNaN(a)||isNaN(b)||isNaN(x)) { r.innerHTML='<div class="error">⚠️ Preencha todos os campos!</div>'; r.classList.add('show'); return; }
    const resultado=a*x+b, sinalB=b>=0?'+':'';
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">f(${x}) = ${resultado}</div><div class="function-result"><div class="card-result"><div class="label">Inclinação (a)</div><div class="value blue">${a}</div></div><div class="card-result"><div class="label">Intercepto (b)</div><div class="value green">${b}</div></div></div><div class="step-box"><b>Passo a passo:</b><br><span class="step-number">1</span> f(x) = ${a}x ${sinalB} ${b}<br><span class="step-number">2</span> f(${x}) = ${a}×${x} ${sinalB} ${b}<br><span class="step-number">✅</span> <span class="highlight-step">f(${x}) = ${resultado}</span></div>`;
    r.classList.add('show');
    document.getElementById('canvasWrapper1').style.display='block';
    document.getElementById('iaWrapper1').style.display='block';
    document.getElementById('iaRespF1').classList.remove('show');
    document.getElementById('iaRespF1').textContent='';
    setTimeout(()=>desenharGrafico1(a,b,x,resultado),50);
    adicionarHistorico('Função 1º Grau',`f(x)=${a}x${sinalB}${b}, x=${x}`,`f(${x})=${resultado}`);
}

function desenharGrafico1(a,b,xDest,yDest) {
    const canvas=document.getElementById('grafico1'), container=canvas.parentElement;
    canvas.width=container.clientWidth-30||500; canvas.height=300;
    const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height, pad=50;
    const xMin=xDest-10, xMax=xDest+10, yVals=[a*xMin+b,a*xMax+b,yDest];
    const yMin=Math.min(...yVals)-5, yMax=Math.max(...yVals)+5;
    const toX=x=>pad+(x-xMin)/(xMax-xMin)*(W-2*pad), toY=y=>H-pad-(y-yMin)/(yMax-yMin)*(H-2*pad);
    ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#1e293b'; ctx.lineWidth=1;
    for(let gx=Math.ceil(xMin);gx<=xMax;gx++){const cx=toX(gx);ctx.beginPath();ctx.moveTo(cx,pad);ctx.lineTo(cx,H-pad);ctx.stroke();}
    for(let gy=Math.ceil(yMin);gy<=yMax;gy++){const cy=toY(gy);ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad,cy);ctx.stroke();}
    ctx.strokeStyle='#475569'; ctx.lineWidth=2;
    if(xMin<=0&&xMax>=0){const cx0=toX(0);ctx.beginPath();ctx.moveTo(cx0,pad);ctx.lineTo(cx0,H-pad);ctx.stroke();}
    if(yMin<=0&&yMax>=0){const cy0=toY(0);ctx.beginPath();ctx.moveTo(pad,cy0);ctx.lineTo(W-pad,cy0);ctx.stroke();}
    ctx.fillStyle='#64748b'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    const stX=Math.ceil((xMax-xMin)/8);
    for(let gx=Math.ceil(xMin/stX)*stX;gx<=xMax;gx+=stX) ctx.fillText(gx,toX(gx),H-pad+16);
    ctx.textAlign='right';
    const stY=Math.ceil((yMax-yMin)/6);
    for(let gy=Math.ceil(yMin/stY)*stY;gy<=yMax;gy+=stY) ctx.fillText(gy,pad-6,toY(gy)+4);
    ctx.strokeStyle='#3b82f6'; ctx.lineWidth=3; ctx.shadowColor='rgba(59,130,246,0.4)'; ctx.shadowBlur=8;
    ctx.beginPath(); let first=true;
    for(let px=0;px<=W-2*pad;px++){const xVal=xMin+px/(W-2*pad)*(xMax-xMin),yVal=a*xVal+b,cx=toX(xVal),cy=toY(yVal);if(first){ctx.moveTo(cx,cy);first=false;}else ctx.lineTo(cx,cy);}
    ctx.stroke(); ctx.shadowBlur=0;
    const cx=toX(xDest),cy=toY(yDest);
    ctx.fillStyle='#fbbf24'; ctx.shadowColor='rgba(251,191,36,0.6)'; ctx.shadowBlur=12;
    ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(251,191,36,0.4)'; ctx.lineWidth=1; ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(pad,cy);ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#fbbf24'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
    ctx.fillText(`(${xDest}, ${yDest})`,cx+10,cy-8);
    ctx.fillStyle='#94a3b8'; ctx.font='12px sans-serif'; ctx.textAlign='center';
    ctx.fillText(`f(x) = ${a}x ${b>=0?'+':''} ${b}`,W/2,pad-10);
    document.getElementById('canvasLabel1').textContent=`Gráfico: f(x) = ${a}x ${b>=0?'+':''} ${b} | Ponto: (${xDest}, ${yDest})`;
}

function limparFuncao1() {
    ['func1a','func1b','func1x'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('resultadoFuncao1').classList.remove('show');
    document.getElementById('canvasWrapper1').style.display='none';
    document.getElementById('iaWrapper1').style.display='none';
}

function calcularFuncao2() {
    const a=parseFloat(document.getElementById('func2a').value), b=parseFloat(document.getElementById('func2b').value), c=parseFloat(document.getElementById('func2c').value), x=parseFloat(document.getElementById('func2x').value), r=document.getElementById('resultadoFuncao2');
    if (isNaN(a)||isNaN(b)||isNaN(c)||isNaN(x)) { r.innerHTML='<div class="error">⚠️ Preencha todos os campos!</div>'; r.classList.add('show'); return; }
    const resultado=a*x*x+b*x+c, delta=b*b-4*a*c, xV=-b/(2*a), yV=a*xV*xV+b*xV+c;
    let raizes='', x1=null, x2=null;
    if(delta>0){x1=(-b+Math.sqrt(delta))/(2*a);x2=(-b-Math.sqrt(delta))/(2*a);raizes=`x₁=${x1.toFixed(2)}, x₂=${x2.toFixed(2)}`;}
    else if(delta===0){x1=x2=-b/(2*a);raizes=`x=${x1.toFixed(2)} (raiz dupla)`;}
    else raizes='Sem raízes reais (Δ < 0)';
    const sB=b>=0?'+':'', sC=c>=0?'+':'';
    r.innerHTML=`<div class="success-badge">✅ RESULTADO</div><div class="highlight-result">f(${x}) = ${resultado}</div><div class="function-result"><div class="card-result"><div class="label">Delta (Δ)</div><div class="value blue">${delta.toFixed(4)}</div></div><div class="card-result"><div class="label">Vértice</div><div class="value" style="color:#8b5cf6">(${xV.toFixed(2)}, ${yV.toFixed(2)})</div></div><div class="card-result" style="grid-column:1/-1"><div class="label">Raízes</div><div class="value green">${raizes}</div></div></div><div class="step-box"><b>Passo a passo:</b><br><span class="step-number">1</span> f(x) = ${a}x² ${sB} ${b}x ${sC} ${c}<br><span class="step-number">2</span> Δ = <span class="highlight-step">${delta.toFixed(4)}</span><br><span class="step-number">3</span> Vértice xV = <span class="highlight-step">${xV.toFixed(2)}</span><br><span class="step-number">✅</span> <span class="highlight-step">f(${x}) = ${resultado}</span></div>`;
    r.classList.add('show');
    document.getElementById('canvasWrapper2').style.display='block';
    document.getElementById('iaWrapper2').style.display='block';
    document.getElementById('iaRespF2').classList.remove('show');
    setTimeout(()=>desenharGrafico2(a,b,c,x,resultado,x1,x2,xV,yV),50);
    adicionarHistorico('Função 2º Grau',`f(x)=${a}x²${sB}${b}x${sC}${c}, x=${x}`,`f(${x})=${resultado}`);
}

function desenharGrafico2(a,b,c,xDest,yDest,x1,x2,xV,yV) {
    const canvas=document.getElementById('grafico2'), container=canvas.parentElement;
    canvas.width=container.clientWidth-30||500; canvas.height=300;
    const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height, pad=50;
    const xs=[xDest,xV,x1||xDest,x2||xDest];
    const xMin=Math.min(...xs)-5, xMax=Math.max(...xs)+5;
    const yPts=[a*xMin*xMin+b*xMin+c,a*xMax*xMax+b*xMax+c,yDest,yV];
    const yMin=Math.min(...yPts)-3, yMax=Math.max(...yPts)+3;
    const toX=x=>pad+(x-xMin)/(xMax-xMin)*(W-2*pad), toY=y=>H-pad-(y-yMin)/(yMax-yMin)*(H-2*pad);
    ctx.fillStyle='#0f172a'; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='#1e293b'; ctx.lineWidth=1;
    const sX=Math.max(1,Math.round((xMax-xMin)/10));
    for(let gx=Math.ceil(xMin/sX)*sX;gx<=xMax;gx+=sX){const cx=toX(gx);ctx.beginPath();ctx.moveTo(cx,pad);ctx.lineTo(cx,H-pad);ctx.stroke();}
    const sY=Math.max(1,Math.round((yMax-yMin)/6));
    for(let gy=Math.ceil(yMin/sY)*sY;gy<=yMax;gy+=sY){const cy=toY(gy);ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad,cy);ctx.stroke();}
    ctx.strokeStyle='#475569'; ctx.lineWidth=2;
    if(xMin<=0&&xMax>=0){const cx0=toX(0);ctx.beginPath();ctx.moveTo(cx0,pad);ctx.lineTo(cx0,H-pad);ctx.stroke();}
    if(yMin<=0&&yMax>=0){const cy0=toY(0);ctx.beginPath();ctx.moveTo(pad,cy0);ctx.lineTo(W-pad,cy0);ctx.stroke();}
    ctx.fillStyle='#64748b'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    for(let gx=Math.ceil(xMin/sX)*sX;gx<=xMax;gx+=sX) ctx.fillText(gx,toX(gx),H-pad+16);
    ctx.textAlign='right';
    for(let gy=Math.ceil(yMin/sY)*sY;gy<=yMax;gy+=sY) ctx.fillText(gy,pad-6,toY(gy)+4);
    const grad=ctx.createLinearGradient(0,0,W,0);
    grad.addColorStop(0,'#8b5cf6'); grad.addColorStop(1,'#3b82f6');
    ctx.strokeStyle=grad; ctx.lineWidth=3; ctx.shadowColor='rgba(139,92,246,0.5)'; ctx.shadowBlur=8;
    ctx.beginPath(); let first=true;
    for(let px=0;px<=W-2*pad;px++){const xVal=xMin+px/(W-2*pad)*(xMax-xMin),yVal=a*xVal*xVal+b*xVal+c,cx=toX(xVal),cy=toY(yVal);if(cy<pad-5||cy>H-pad+5){first=true;continue;}if(first){ctx.moveTo(cx,cy);first=false;}else ctx.lineTo(cx,cy);}
    ctx.stroke(); ctx.shadowBlur=0;
    if(x1!==null){[x1,x2].forEach(rx=>{if(rx===null)return;const cx=toX(rx),cy=toY(0);ctx.fillStyle='#22c55e';ctx.shadowColor='rgba(34,197,94,0.6)';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#22c55e';ctx.font='bold 11px sans-serif';ctx.textAlign='center';ctx.fillText(`x=${rx.toFixed(1)}`,cx,cy-12);});}
    const cvx=toX(xV),cvy=toY(yV);
    ctx.fillStyle='#f59e0b'; ctx.shadowColor='rgba(245,158,11,0.6)'; ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(cvx,cvy,6,0,Math.PI*2);ctx.fill(); ctx.shadowBlur=0;
    ctx.fillStyle='#f59e0b'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
    ctx.fillText(`V(${xV.toFixed(1)},${yV.toFixed(1)})`,cvx,cvy+18);
    const cpx=toX(xDest),cpy=toY(yDest);
    ctx.fillStyle='#fbbf24'; ctx.shadowColor='rgba(251,191,36,0.6)'; ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(cpx,cpy,7,0,Math.PI*2);ctx.fill(); ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(251,191,36,0.4)'; ctx.lineWidth=1; ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(cpx,cpy);ctx.lineTo(cpx,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cpx,cpy);ctx.lineTo(pad,cpy);ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#fbbf24'; ctx.font='bold 12px sans-serif'; ctx.textAlign='left';
    ctx.fillText(`(${xDest}, ${yDest})`,cpx+10,cpy-8);
    ctx.fillStyle='#94a3b8'; ctx.font='12px sans-serif'; ctx.textAlign='center';
    ctx.fillText(`f(x) = ${a}x² ${b>=0?'+':''} ${b}x ${c>=0?'+':''} ${c}`,W/2,pad-10);
    document.getElementById('canvasLabel2').textContent=`🟣 Curva  🟢 Raízes  🟡 Vértice  🌕 Ponto escolhido`;
}

function limparFuncao2() {
    ['func2a','func2b','func2c','func2x'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('resultadoFuncao2').classList.remove('show');
    document.getElementById('canvasWrapper2').style.display='none';
    document.getElementById('iaWrapper2').style.display='none';
}

// ==================== IA EXPLICATIVA ====================

async function explicarComIA(tipo) {
    let prompt='', btn, respDiv;
    if (tipo==='funcao1') {
        const a=document.getElementById('func1a').value, b=document.getElementById('func1b').value, x=document.getElementById('func1x').value;
        const resultado=parseFloat(a)*parseFloat(x)+parseFloat(b);
        prompt=`Explique de forma clara e didática para um aluno do ensino médio a função f(x) = ${a}x ${parseFloat(b)>=0?'+':''} ${b}. Calculamos f(${x}) = ${resultado}. Explique o que é inclinação, intercepto e por que f(${x}) = ${resultado}. Use emojis. Máximo 200 palavras.`;
        btn=document.getElementById('iaBtnF1'); respDiv=document.getElementById('iaRespF1');
    } else {
        const a=document.getElementById('func2a').value, b=document.getElementById('func2b').value, c=document.getElementById('func2c').value, x=document.getElementById('func2x').value;
        const resultado=parseFloat(a)*parseFloat(x)**2+parseFloat(b)*parseFloat(x)+parseFloat(c);
        const delta=parseFloat(b)**2-4*parseFloat(a)*parseFloat(c);
        prompt=`Explique de forma clara e didática para um aluno do ensino médio a função f(x) = ${a}x² ${parseFloat(b)>=0?'+':''} ${b}x ${parseFloat(c)>=0?'+':''} ${c}. Delta=${delta.toFixed(2)}, f(${x})=${resultado}. Explique parábola, vértice e raízes. Use emojis. Máximo 200 palavras.`;
        btn=document.getElementById('iaBtnF2'); respDiv=document.getElementById('iaRespF2');
    }
    btn.disabled=true; btn.textContent='⏳ Pensando...';
    respDiv.innerHTML='<div class="ia-loading"><div class="ia-dot"></div><div class="ia-dot"></div><div class="ia-dot"></div><span>IA explicando...</span></div>';
    respDiv.classList.add('show');
    try {
        const res=await fetch(BACKEND_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});
        if(!res.ok) throw new Error('Erro '+res.status);
        const data=await res.json();
        if(data.error) throw new Error(data.error);
        respDiv.innerHTML=`<div class="ia-badge">🤖 IA Explicou</div>\n${data.texto}`;
    } catch(e) {
        respDiv.innerHTML=`<div class="ia-badge" style="background:#ef4444">⚠️ Erro</div>\n${e.message}`;
    }
    btn.disabled=false; btn.textContent='🤖 Explicar com IA';
}

// ==================== OCR ====================

dropArea = document.getElementById('ocrDropArea');
if (dropArea) {
    dropArea.addEventListener('dragover',(e)=>{e.preventDefault();dropArea.classList.add('dragover');});
    dropArea.addEventListener('dragleave',()=>dropArea.classList.remove('dragover'));
    dropArea.addEventListener('drop',(e)=>{e.preventDefault();dropArea.classList.remove('dragover');const f=e.dataTransfer.files[0];if(f)processarArquivo(f);});
}

function setModoOCR(modo) {
    modoOCR=modo;
    const bG=document.getElementById('modoGroqBtn'), bL=document.getElementById('modoLocalBtn');
    if(bG) bG.classList.toggle('active',modo==='groq');
    if(bL) bL.classList.toggle('active',modo==='local');
    const d=document.getElementById('modoDesc');
    if(d) d.innerHTML=modo==='groq'?'🧠 A IA do Groq resolve qualquer questão matemática com passo a passo detalhado.':'⚡ Modo offline — resolve apenas questões simples.';
}

function processarOCR(event) { const f=event.target.files[0]; if(f) processarArquivo(f); }

function processarArquivo(file) {
    const reader=new FileReader();
    reader.onload=(e)=>{const p=document.getElementById('ocrPreview');if(p){p.src=e.target.result;p.style.display='block';}ocrImagem=e.target.result;};
    reader.readAsDataURL(file);
    const progressDiv=document.getElementById('ocrProgress'), statusSpan=document.getElementById('ocrStatus'), progressBar=document.getElementById('ocrProgressBar');
    if(progressDiv){progressDiv.classList.add('show');statusSpan.textContent='Iniciando...';progressBar.style.width='10%';}
    Tesseract.recognize(file,'por',{logger:(m)=>{if(m.status==='recognizing text'){const p=Math.round(m.progress*100);if(statusSpan)statusSpan.textContent=`${p}%`;if(progressBar)progressBar.style.width=`${p}%`;}}})
    .then(({data:{text}})=>{
        if(progressBar)progressBar.style.width='100%';
        if(statusSpan)statusSpan.textContent='Concluído! ✅';
        ocrTextoExtraido=text.trim();
        const ocrResult=document.getElementById('ocrResult'), ocrTexto=document.getElementById('ocrTexto');
        if(ocrResult)ocrResult.classList.add('show');
        if(ocrTexto)ocrTexto.textContent=ocrTextoExtraido;
        if(ocrTextoExtraido.length>0) detectarQuestoes(ocrTextoExtraido);
        else if(ocrTexto) ocrTexto.innerHTML='<div class="error">⚠️ Nenhum texto reconhecido.</div>';
        setTimeout(()=>{if(progressDiv)progressDiv.classList.remove('show');},1200);
    }).catch((err)=>{
        const ocrResult=document.getElementById('ocrResult'), ocrTexto=document.getElementById('ocrTexto');
        if(ocrResult)ocrResult.classList.add('show');
        if(ocrTexto)ocrTexto.innerHTML=`<div class="error">⚠️ Erro: ${err.message}</div>`;
        if(progressDiv)progressDiv.classList.remove('show');
    });
}

function toggleTextoOCR() {
    const t=document.getElementById('ocrTexto'), b=document.getElementById('toggleTextoBtn');
    if(t){if(t.style.display==='none'){t.style.display='block';if(b)b.textContent='▲ Ocultar';}else{t.style.display='none';if(b)b.textContent='▼ Ver';}}
}

// ==================== DETECÇÃO DE QUESTÕES (CORRIGIDA) ====================
// Regras mais rígidas para evitar questões fantasmas vindas do ruído do OCR

function detectarQuestoes(texto) {
    // Remove lixo típico do OCR: linhas com menos de 15 chars ou sem nenhum número/letra significativa
    const linhas = texto.split('\n')
        .map(l => l.trim())
        .filter(l => l.length >= 15 && /[a-zA-ZÀ-ú0-9]{3,}/.test(l));

    // Padrão rígido: linha começa com número seguido de ponto/parêntese e texto real
    const padraoQuestao = /^(\d{1,2}[\.\)]\s{1,3})\S/;

    let questoes = [];
    let atual = '';
    let numAtual = 1;
    let encontrouPadrao = false;

    for (const linha of linhas) {
        if (padraoQuestao.test(linha)) {
            encontrouPadrao = true;
            if (atual.trim().length >= 20) {
                questoes.push({ numero: numAtual++, texto: atual.trim() });
            }
            atual = linha;
        } else {
            atual += ' ' + linha;
        }
    }
    if (atual.trim().length >= 20) questoes.push({ numero: numAtual++, texto: atual.trim() });

    // Só usa separação por blocos se não achou nenhum padrão numérico
    if (!encontrouPadrao || questoes.length === 0) {
        const blocos = texto.split(/\n\s*\n/)
            .map(b => b.trim())
            .filter(b => b.length >= 30 && /\d/.test(b) && /[a-zA-ZÀ-ú]{4,}/.test(b));

        if (blocos.length > 1) {
            questoes = blocos.map((b, i) => ({ numero: i + 1, texto: b }));
        } else {
            // Texto inteiro como uma única questão — só se tiver conteúdo real
            const textoLimpo = texto.trim();
            if (textoLimpo.length >= 30 && /\d/.test(textoLimpo)) {
                questoes = [{ numero: 1, texto: textoLimpo }];
            } else {
                // Texto muito curto ou sem números = provavelmente ruído
                const ocrTexto = document.getElementById('ocrTexto');
                if (ocrTexto) ocrTexto.innerHTML += '<div class="error" style="margin-top:8px;">⚠️ Texto insuficiente para identificar questões. Tente uma imagem mais nítida.</div>';
                return;
            }
        }
    }

    ocrQuestoes = questoes;
    renderizarListaQuestoes(questoes);
}

function renderizarListaQuestoes(questoes) {
    const area=document.getElementById('ocrQuestoesArea'), lista=document.getElementById('ocrQuestoesList'), count=document.getElementById('ocrQuestoesCount');
    if(count) count.textContent=questoes.length;
    if(area) area.style.display='block';
    const r=document.getElementById('resultadoOCR');
    if(r){r.classList.remove('show');r.innerHTML='';}
    if(lista){lista.innerHTML=questoes.map((q,i)=>`
        <div class="questao-card" id="qcard_${i}" style="background:#0f172a;border:2px solid #1e293b;border-radius:14px;padding:16px 18px;margin-bottom:12px;transition:all 0.3s;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
                <div style="flex:1;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <span style="background:#2563eb;color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;">Questão ${q.numero}</span>
                        <span id="qstatus_${i}" style="font-size:12px;color:#64748b;"></span>
                    </div>
                    <p style="color:#cbd5e1;font-size:13px;line-height:1.6;margin:0;max-height:80px;overflow:hidden;" id="qtexto_${i}">${q.texto.substring(0,200)}${q.texto.length>200?'...':''}</p>
                    <button onclick="toggleExpandQuestao(${i})" style="background:none;border:none;color:#64748b;font-size:11px;cursor:pointer;margin-top:4px;padding:0;" id="qexpand_${i}">${q.texto.length>200?'▼ Ver mais':''}</button>
                </div>
                <button class="btn btn-purple" style="white-space:nowrap;font-size:13px;padding:8px 16px;flex-shrink:0;" id="qbtn_${i}" onclick="resolverQuestao(${i})">🤖 Resolver</button>
            </div>
            <div id="qresp_${i}" style="display:none;margin-top:14px;border-top:1px solid #1e293b;padding-top:14px;"></div>
        </div>`).join('');}
}

function toggleExpandQuestao(i) {
    const q=ocrQuestoes[i], t=document.getElementById(`qtexto_${i}`), b=document.getElementById(`qexpand_${i}`);
    if(t){if(t.style.maxHeight==='none'){t.style.maxHeight='80px';t.textContent=q.texto.substring(0,200)+(q.texto.length>200?'..':'');if(b)b.textContent='▼ Ver mais';}else{t.style.maxHeight='none';t.textContent=q.texto;if(b)b.textContent='▲ Ver menos';}}
}

async function resolverQuestao(i) {
    const q=ocrQuestoes[i], btn=document.getElementById(`qbtn_${i}`), respDiv=document.getElementById(`qresp_${i}`), statusEl=document.getElementById(`qstatus_${i}`), card=document.getElementById(`qcard_${i}`);
    document.querySelectorAll('.questao-card').forEach(c=>c.style.borderColor='#1e293b');
    if(card) card.style.borderColor='#7c3aed';
    if(btn){btn.disabled=true;btn.textContent='⏳ Resolvendo...';}
    if(statusEl) statusEl.textContent='🔄 processando...';
    if(respDiv){respDiv.style.display='block';respDiv.innerHTML=`<div class="ia-loading"><div class="ia-dot"></div><div class="ia-dot"></div><div class="ia-dot"></div><span>🧠 IA analisando a questão ${q.numero}...</span></div>`;}
    if(card) card.scrollIntoView({behavior:'smooth',block:'nearest'});

    if (modoOCR === 'groq') {
        try {
            const prompt = `Você é um professor de matemática brasileiro. Resolva passo a passo em português:\n\n${q.texto}\n\nEstrutura: 📌 O que pede | 📐 Resolução com cálculos | ✅ Resposta final. Use emojis.`;
            const res = await fetch(BACKEND_URL, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt})});
            if (!res.ok) throw new Error('Backend retornou erro ' + res.status);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            if(respDiv) respDiv.innerHTML=`<div style="display:inline-block;background:#7c3aed;color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;">🤖 Resolvido pela IA</div><div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#e2e8f0;">${data.texto}</div><button onclick="copiarRespQuestao(${i})" style="margin-top:10px;background:#22c55e;color:white;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">📋 Copiar</button>`;
            if(statusEl) statusEl.innerHTML='<span style="color:#22c55e;">✅ resolvida</span>';
            adicionarHistorico(`OCR Q${q.numero}`,q.texto.substring(0,60)+'...','Resolvido com IA');
        } catch(e) {
            // Fallback offline se o backend falhar
            const fb = resolverLocalmente(q.texto);
            if(respDiv) respDiv.innerHTML=`<div style="display:inline-block;background:#f59e0b;color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;">⚠️ IA indisponível — modo offline</div><div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#e2e8f0;">${fb}</div>`;
            if(statusEl) statusEl.innerHTML='<span style="color:#f59e0b;">⚡ offline</span>';
        }
    } else {
        const fb = resolverLocalmente(q.texto);
        if(respDiv) respDiv.innerHTML=`<div style="display:inline-block;background:#f59e0b;color:white;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;margin-bottom:10px;">⚡ Modo Offline</div><div style="white-space:pre-wrap;font-size:13px;line-height:1.8;color:#e2e8f0;">${fb}</div><button onclick="copiarRespQuestao(${i})" style="margin-top:10px;background:#22c55e;color:white;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;">📋 Copiar</button>`;
        if(statusEl) statusEl.innerHTML='<span style="color:#f59e0b;">⚡ offline</span>';
    }

    if(btn){btn.disabled=false;btn.textContent='🔁 Resolver novamente';}
}

function copiarRespQuestao(i) {
    const d=document.getElementById(`qresp_${i}`);
    if(d) navigator.clipboard.writeText(d.innerText).then(()=>{const b=event.target;b.textContent='✅ Copiado!';setTimeout(()=>b.textContent='📋 Copiar',2000);});
}

function resolverLocalmente(pergunta) {
    const t=pergunta.toLowerCase();
    const eq1=t.match(/([0-9.]+)\s*x\s*([+\-])\s*([0-9.]+)\s*=\s*([0-9.]+)/i);
    if(eq1){const a=parseFloat(eq1[1]),s=eq1[2]==='+'?1:-1,b=parseFloat(eq1[3])*s,c=parseFloat(eq1[4]),x=(c-b)/a;return `📌 Equação do 1º grau\n📐 ${a}x ${eq1[2]} ${Math.abs(b)} = ${c}\n   ${a}x = ${c-b}\n   x = ${(c-b)}÷${a}\n✅ x = ${x}`;}
    const fn=t.match(/([0-9.]+)\s*x\s*([+\-])\s*([0-9.]+)/i);
    if(fn&&(t.includes('f(x)')||t.includes('função'))){const a=parseFloat(fn[1]),s=fn[2]==='+'?1:-1,b=parseFloat(fn[3])*s,xm=t.match(/x\s*=\s*([0-9.]+)/i),x=xm?parseFloat(xm[1]):0,r=a*x+b;return `📌 Função 1º grau: f(x) = ${a}x ${b>=0?'+':''}${b}\n📐 f(${x}) = ${a}×${x} + ${b}\n✅ f(${x}) = ${r}`;}
    return `📌 Não reconhecido automaticamente.\n📝 Texto: ${pergunta.substring(0,200)}\n\n💡 Dica: ative o modo IA (Groq) para questões complexas.`;
}

// ==================== CÂMERA ====================

function abrirCamera() {
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){alert('⚠️ Câmera indisponível.');return;}
    const video=document.getElementById('videoCamera'), preview=document.getElementById('ocrPreview'), icon=document.getElementById('ocrIcon');
    if(preview)preview.style.display='none';
    if(video)video.style.display='block';
    if(icon)icon.textContent='📹';
    if(dropArea)dropArea.querySelector('p').innerHTML='<strong>📸 Aponte e toque para fotografar</strong>';
    navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1280},height:{ideal:720}}})
        .then(stream=>{streamCamera=stream;if(video){video.srcObject=stream;video.play();}if(dropArea)dropArea.onclick=tirarFoto;})
        .catch(()=>{alert('⚠️ Câmera indisponível.');fecharCamera();});
}

function tirarFoto() {
    const video=document.getElementById('videoCamera'), canvas=document.getElementById('canvasCamera'), preview=document.getElementById('ocrPreview');
    if(video&&canvas){canvas.width=video.videoWidth||1280;canvas.height=video.videoHeight||720;canvas.getContext('2d').drawImage(video,0,0);const d=canvas.toDataURL('image/jpeg',0.9);if(preview){preview.src=d;preview.style.display='block';}ocrImagem=d;const icon=document.getElementById('ocrIcon');if(icon)icon.textContent='📸';if(dropArea)dropArea.querySelector('p').innerHTML='<strong>✅ Foto tirada!</strong>';fecharCamera();fetch(d).then(r=>r.blob()).then(b=>processarArquivo(new File([b],'foto.jpg',{type:'image/jpeg'})));if(dropArea)dropArea.onclick=abrirCamera;}
}

function fecharCamera() {
    if(streamCamera){streamCamera.getTracks().forEach(t=>t.stop());streamCamera=null;}
    const video=document.getElementById('videoCamera');
    if(video){video.srcObject=null;video.style.display='none';}
}

function limparOCR() {
    const ids=['ocrInput','ocrPreview','ocrResult','resultadoOCR','ocrProgress','ocrQuestoesArea','ocrQuestoesList','ocrTexto'];
    document.getElementById('ocrInput')&&(document.getElementById('ocrInput').value='');
    const p=document.getElementById('ocrPreview');if(p){p.style.display='none';p.src='';}
    ['ocrResult','resultadoOCR'].forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('show');});
    const op=document.getElementById('ocrProgress');if(op)op.classList.remove('show');
    const qa=document.getElementById('ocrQuestoesArea');if(qa)qa.style.display='none';
    const ql=document.getElementById('ocrQuestoesList');if(ql)ql.innerHTML='';
    const ot=document.getElementById('ocrTexto');if(ot)ot.style.display='none';
    ocrTextoExtraido='';ocrImagem=null;ocrQuestoes=[];
    fecharCamera();
    if(dropArea)dropArea.querySelector('p').innerHTML='<strong>Clique ou arraste</strong> uma imagem aqui';
    const icon=document.getElementById('ocrIcon');if(icon)icon.textContent='📸';
}

// ==================== LOGOUT + INIT ====================

function fazerLogout() { sessionStorage.removeItem('math_user'); window.location.href='login.html'; }

atualizarContadorHistorico();
console.log('✅ Math Solver Pro carregado! Backend:', BACKEND_URL);