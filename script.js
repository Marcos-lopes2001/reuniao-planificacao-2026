// ============================================
// ANIMAÇÕES DE SCROLL - LETRAS APARECENDO
// ============================================

// Função principal para animações
function initScrollAnimations() {
    // Seleciona todos os elementos que serão animados
    const animatedElements = document.querySelectorAll(`
        .hero-texto h2,
        .hero-texto h3,
        .hero-texto .lema,
        .hero-texto .hero-info,
        .hero-texto .hero-botoes,
        .card-destaque,
        .contexto-texto h2,
        .contexto-texto p,
        .contexto-texto blockquote,
        .contexto-imagem,
        .resultado-card,
        .dia-card,
        .destaque-card,
        .acesso-card,
        .participante-card,
        .documento-card,
        .sobre-info h2,
        .sobre-info p,
        .sobre-info ul,
        .org-card,
        .evento-completo
    `);
    
    // Adiciona classes de animação aos elementos
    animatedElements.forEach((el, index) => {
        // Define o tipo de animação baseado na classe do elemento
        if (el.classList.contains('resultado-card') || 
            el.classList.contains('destaque-card') ||
            el.classList.contains('documento-card')) {
            el.classList.add('scale-up');
        } 
        else if (el.classList.contains('contexto-imagem') ||
                 el.classList.contains('card-destaque')) {
            el.classList.add('fade-right');
        }
        else if (el.classList.contains('contexto-texto') ||
                 el.classList.contains('sobre-info')) {
            el.classList.add('fade-left');
        }
        else {
            el.classList.add('fade-up');
        }
        
        // Adiciona delay baseado no índice para criar efeito cascata
        const delay = Math.min(index % 6 + 1, 5);
        el.classList.add(`delay-${delay}`);
    });
    
    // Configura o Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observa todos os elementos com classes de animação
    document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-up').forEach(el => {
        observer.observe(el);
    });
}

// Animações específicas para títulos
function animateTitlesOnScroll() {
    const titles = document.querySelectorAll('h1, h2, h3, .section-tag');
    
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    titles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'all 0.6s ease-out';
        titleObserver.observe(title);
    });
}

// ============================================
// FUNÇÃO DE CONTAGEM CORRIGIDA - NÃO APAGA OS NÚMEROS!
// ============================================
function animateNumbers() {
    const numbers = document.querySelectorAll('.resultado-numero');
    
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                // Pega o número original (ex: "01" ou "1")
                let finalNumber = element.innerText;
                // Converte para número inteiro
                finalNumber = parseInt(finalNumber, 10);
                
                // Só executa se ainda não foi animado
                if (!element.hasAttribute('data-animated')) {
                    element.setAttribute('data-animated', 'true');
                    
                    // Guarda o texto original com zero à esquerda
                    const originalText = element.innerText;
                    let current = 0;
                    const increment = finalNumber / 30;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= finalNumber) {
                            // Restaura o texto original (com zero à esquerda se tiver)
                            element.innerText = originalText;
                            clearInterval(timer);
                        } else {
                            // Mostra o número atual sem zero à esquerda durante a contagem
                            element.innerText = Math.floor(current);
                        }
                    }, 30);
                }
            }
        });
    }, { threshold: 0.5 });
    
    numbers.forEach(number => {
        // Guarda o texto original
        const originalText = number.innerText;
        // NÃO ALTERA O TEXTO! Mantém o número original
        number.setAttribute('data-final', originalText);
        numberObserver.observe(number);
    });
}

// Animação de texto letra por letra (efeito de digitação)
function typeWriterEffect() {
    const elements = document.querySelectorAll('.hero-texto .lema, .contexto-texto blockquote');
    
    elements.forEach(el => {
        const text = el.innerText;
        el.innerText = '';
        el.style.opacity = '1';
        
        const typeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let i = 0;
                    const interval = setInterval(() => {
                        if (i < text.length) {
                            el.innerText += text.charAt(i);
                            i++;
                        } else {
                            clearInterval(interval);
                        }
                    }, 30);
                    typeObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        typeObserver.observe(el);
    });
}

// ============================================
// MENU MOBILE
// ============================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navList = document.getElementById('navList');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
    });
}

// Fecha menu ao clicar em um link
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
    });
});

// ============================================
// TABS DA AGENDA
// ============================================
const tabBtns = document.querySelectorAll('.tab-btn');
const agendaDias = document.querySelectorAll('.agenda-dia');

if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dia = btn.getAttribute('data-dia');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            agendaDias.forEach(d => d.classList.remove('active'));
            document.getElementById(dia).classList.add('active');
            
            // Reaplica animações nos novos elementos visíveis
            const newEvents = document.querySelectorAll(`#${dia} .evento-completo`);
            newEvents.forEach((event, index) => {
                event.classList.add('fade-up', `delay-${Math.min(index % 5 + 1, 5)}`);
                setTimeout(() => {
                    event.classList.add('visible');
                }, 100);
            });
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============================================
// PARALLAX EFFECT (opcional)
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(() => {
        initScrollAnimations();
        animateTitlesOnScroll();
        // COMENTEI A FUNÇÃO QUE ESTAVA APAGANDO OS NÚMEROS
        // animateNumbers(); 
        typeWriterEffect();
    }, 100);
});

// Reobserva elementos quando o conteúdo muda (para páginas internas)
if (window.location.pathname.includes('agenda.html')) {
    setTimeout(() => {
        const firstTabEvents = document.querySelectorAll('#dia1 .evento-completo');
        firstTabEvents.forEach((event, index) => {
            event.classList.add('fade-up', `delay-${Math.min(index % 5 + 1, 5)}`);
            setTimeout(() => {
                event.classList.add('visible');
            }, 200);
        });
    }, 500);
}