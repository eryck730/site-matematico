// ==================== OCR SIMPLIFICADO E FUNCIONAL ====================

let ocrTextoExtraido = '';
let ocrImagem = null;

function processarOCR(event) {
    const file = event.target.files[0];
    if (!file) {
        alert('⚠️ Nenhum arquivo selecionado!');
        return;
    }
    processarArquivo(file);
}

function processarArquivo(file) {
    // ===== VERIFICA SE TESSERACT FOI CARREGADO =====
    if (typeof Tesseract === 'undefined') {
        alert('⚠️ Tesseract.js não carregou. Verifique sua conexão com a internet.');
        console.error('Tesseract não está definido!');
        return;
    }

    // ===== MOSTRA PREVIEW DA IMAGEM =====
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('ocrPreview');
        if (preview) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        ocrImagem = e.target.result;
    };
    reader.readAsDataURL(file);

    // ===== MOSTRA PROGRESSO =====
    const progressDiv = document.getElementById('ocrProgress');
    const statusSpan = document.getElementById('ocrStatus');
    const progressBar = document.getElementById('ocrProgressBar');
    
    if (progressDiv) {
        progressDiv.classList.add('show');
        statusSpan.textContent = 'Iniciando OCR...';
        progressBar.style.width = '10%';
    }

    // ===== EXECUTA O OCR =====
    Tesseract.recognize(file, 'por', {
        logger: (m) => {
            if (m.status === 'recognizing text') {
                const progress = Math.round(m.progress * 100);
                if (statusSpan) statusSpan.textContent = `${progress}%`;
                if (progressBar) progressBar.style.width = `${progress}%`;
            }
        }
    })
    .then(({ data: { text } }) => {
        // ===== SUCESSO =====
        if (progressBar) progressBar.style.width = '100%';
        if (statusSpan) statusSpan.textContent = 'Concluído! ✅';
        
        ocrTextoExtraido = text.trim();
        
        const ocrResult = document.getElementById('ocrResult');
        const ocrTexto = document.getElementById('ocrTexto');
        
        if (ocrResult) ocrResult.classList.add('show');
        if (ocrTexto) {
            ocrTexto.textContent = ocrTextoExtraido;
            ocrTexto.style.display = 'block';
        }
        
        // Mostra a primeira linha detectada
        console.log('📝 Texto extraído:', ocrTextoExtraido);
        
        // Se tiver texto, tenta detectar questões
        if (ocrTextoExtraido.length > 0) {
            if (typeof detectarQuestoes === 'function') {
                detectarQuestoes(ocrTextoExtraido);
            } else {
                console.log('ℹ️ Função detectarQuestoes não encontrada');
            }
        } else {
            if (ocrTexto) ocrTexto.innerHTML = '<div class="error">⚠️ Nenhum texto reconhecido. Tente uma imagem mais clara.</div>';
        }
        
        setTimeout(() => {
            if (progressDiv) progressDiv.classList.remove('show');
        }, 1200);
    })
    .catch((err) => {
        // ===== ERRO =====
        console.error('Erro no OCR:', err);
        
        const ocrResult = document.getElementById('ocrResult');
        const ocrTexto = document.getElementById('ocrTexto');
        
        if (ocrResult) ocrResult.classList.add('show');
        if (ocrTexto) {
            ocrTexto.innerHTML = `<div class="error">⚠️ Erro: ${err.message || 'Erro desconhecido'}</div>`;
            ocrTexto.style.display = 'block';
        }
        
        if (progressDiv) progressDiv.classList.remove('show');
    });
}

// ===== FUNÇÃO PARA TESTAR O OCR =====
function testarOCR() {
    alert('✅ Tesseract.js carregado com sucesso!');
    console.log('Tesseract:', Tesseract);
}