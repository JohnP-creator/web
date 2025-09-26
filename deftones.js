// ===== HAMBURGER MENU FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const nav = document.getElementById('nav');
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', closeMobileMenu);
    
    // Close menu when clicking on navigation links
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            closeMobileMenu();
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on window resize if it's open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Add touch support for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;
    
    navLinks.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    navLinks.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        
        // Close menu if swiping right
        if (touchEndY - touchStartY > 50) {
            closeMobileMenu();
        }
    });
    
    // Accessibility improvements
    hamburger.addEventListener('focus', function() {
        this.style.outline = '2px solid #ffffff';
        this.style.outlineOffset = '4px';
    });
    
    hamburger.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

// ===== NAVIGATION FUNCTIONS =====
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// ===== SCROLL EFFECTS =====
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    const scrolled = window.pageYOffset;
    
    // Navigation background effect
    if (scrolled > 50) {
        nav.style.background = 'rgba(0, 0, 0, 0.98)';
        nav.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.boxShadow = 'none';
    }
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const speed = scrolled * 0.3;
        hero.style.transform = `translateY(${speed}px)`;
    }
    
    // Close mobile menu on scroll
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('active')) {
        const hamburger = document.getElementById('hamburger');
        const navOverlay = document.getElementById('navOverlay');
        
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== SPOTIFY INTEGRATION =====
function openSpotify(url) {
    // Add some visual feedback before opening
    const clickedElement = event.target.closest('.album-card');
    if (clickedElement) {
        clickedElement.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clickedElement.style.transform = '';
        }, 150);
    }
    
    // Open Spotify link in new tab
    window.open(url, '_blank');
}

// ===== TIMELINE ANIMATIONS (NUEVA FUNCIONALIDAD) =====
document.addEventListener('DOMContentLoaded', function() {
    // Crear indicadores de progreso para la cronología
    createTimelineProgressDots();
    
    // Observer para animaciones basadas en scroll de la cronología
    setupTimelineScrollAnimations();
    
    // Actualizar indicadores de progreso al hacer scroll
    updateTimelineProgressOnScroll();
    
    // Efecto typewriter para texto de cronología
    setupTypewriterEffect();
});

function createTimelineProgressDots() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const timelineItems = timeline.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;
    
    // Crear contenedor de indicadores
    const progressContainer = document.createElement('div');
    progressContainer.className = 'timeline-progress';
    
    // Crear un dot para cada item
    timelineItems.forEach((item, index) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.setAttribute('data-index', index);
        dot.setAttribute('title', `Ir al evento ${index + 1}`);
        
        // Click en dot para scroll suave al elemento
        dot.addEventListener('click', () => {
            item.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        });
        
        progressContainer.appendChild(dot);
    });
    
    document.body.appendChild(progressContainer);
}

function setupTimelineScrollAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Activar dot correspondiente
                const index = Array.from(timelineItems).indexOf(entry.target);
                const dots = document.querySelectorAll('.progress-dot');
                
                // Activar dots hasta el actual
                dots.forEach((dot, dotIndex) => {
                    if (dotIndex <= index) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-50px'
    });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

function updateTimelineProgressOnScroll() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    const progressDots = document.querySelectorAll('.progress-dot');
    
    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const timelineTop = timeline.offsetTop;
        const timelineHeight = timeline.offsetHeight;
        
        // Calcular progreso basado en scroll
        const progress = Math.max(0, Math.min(1, 
            (scrollTop + windowHeight/2 - timelineTop) / timelineHeight
        ));
        
        // Actualizar dots basado en progreso
        const activeIndex = Math.floor(progress * timelineItems.length);
        
        progressDots.forEach((dot, index) => {
            if (index <= activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Throttle scroll event
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function setupTypewriterEffect() {
    // Efecto de máquina de escribir para el texto de cronología
    function typewriterEffect(element, text, speed = 30) {
        element.innerHTML = '';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Observer para aplicar typewriter a elementos que aparecen
    const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const textElement = entry.target.querySelector('p');
                if (textElement && !textElement.hasAttribute('data-typed')) {
                    const originalText = textElement.textContent;
                    textElement.setAttribute('data-typed', 'true');
                    setTimeout(() => {
                        typewriterEffect(textElement, originalText, 40);
                    }, 800);
                }
            }
        });
    }, { threshold: 0.6 });

    // Observar elementos de cronología para typewriter
    document.querySelectorAll('.timeline-content').forEach(item => {
        typewriterObserver.observe(item);
    });
}

// ===== ALBUM CARD INTERACTIONS =====
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced hover effects for album cards
    document.querySelectorAll('.album-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05) translateY(-10px)';
            card.style.transition = 'all 0.3s ease';
            
            // Add glow effect
            card.style.boxShadow = '0 20px 40px rgba(255, 255, 255, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) translateY(0)';
            card.style.boxShadow = '';
        });
        
        // Click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Special effects for latest album
    const latestAlbum = document.querySelector('.latest-album');
    if (latestAlbum) {
        latestAlbum.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 25px 50px rgba(255, 255, 255, 0.15)';
            this.style.transform = 'scale(1.08) translateY(-15px)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        });
        
        latestAlbum.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            this.style.transform = 'scale(1) translateY(0)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });
    }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation for grid items
            if (entry.target.classList.contains('achievement-card') || 
                entry.target.classList.contains('album-card') ||
                entry.target.classList.contains('member-card') ||
                entry.target.classList.contains('info-card')) {
                
                const delay = Math.random() * 0.3;
                entry.target.style.transitionDelay = `${delay}s`;
            }
        }
    });
}, observerOptions);

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup elements for animation
    document.querySelectorAll('.achievement-card, .album-card, .member-card, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// ===== NAVIGATION SMOOTH SCROLLING =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            const element = document.querySelector(target);
            
            if (element) {
                const offsetTop = element.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Add active state visual feedback
                link.style.color = '#ffffff';
                setTimeout(() => {
                    link.style.color = '';
                }, 300);
            }
        });
    });
});

// ===== DYNAMIC CONTENT UPDATES =====
document.addEventListener('DOMContentLoaded', function() {
    // Update years of career dynamically
    const startYear = 1988;
    const currentYear = new Date().getFullYear();
    const yearsActive = currentYear - startYear;
    
    // Update any reference to years of career
    document.querySelectorAll('.years-active').forEach(el => {
        el.textContent = `${yearsActive} años`;
    });
    
    // Update subtitle if needed
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) {
        subtitle.textContent = `Pioneros del Metal Alternativo desde 1988 (${yearsActive} años)`;
    }
});

// ===== TIMELINE PROGRESS VISIBILITY CONTROL =====
document.addEventListener('DOMContentLoaded', function() {
    const timelineProgressContainer = document.querySelector('.timeline-progress');
    const timeline = document.querySelector('.timeline');
    
    if (timelineProgressContainer && timeline) {
        // Mostrar/ocultar indicadores basado en si estamos en la sección de timeline
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineProgressContainer.style.opacity = '1';
                    timelineProgressContainer.style.pointerEvents = 'all';
                } else {
                    timelineProgressContainer.style.opacity = '0.3';
                    timelineProgressContainer.style.pointerEvents = 'none';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -20% 0px'
        });
        
        timelineObserver.observe(timeline);
    }
});

// ===== ANIMACIONES ESPECIALES PARA LA SECCIÓN DE HONOR =====
document.addEventListener('DOMContentLoaded', function() {
    // Animación especial para la foto memorial de Chi
    const chiPhoto = document.querySelector('.chi-photo');
    const memorialFrame = document.querySelector('.memorial-frame');
    
    if (chiPhoto && memorialFrame) {
        // Efecto de aparición gradual para la foto
        const memorialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                    
                    // Efecto de brillo sutil en el marco
                    memorialFrame.style.boxShadow = `
                        0 0 30px rgba(255, 255, 255, 0.2),
                        inset 0 0 20px rgba(0, 0, 0, 0.5)
                    `;
                    
                    setTimeout(() => {
                        memorialFrame.style.boxShadow = `
                            0 0 30px rgba(255, 255, 255, 0.1),
                            inset 0 0 20px rgba(0, 0, 0, 0.5)
                        `;
                    }, 2000);
                }
            });
        }, { threshold: 0.5 });
        
        // Configurar estado inicial
        chiPhoto.style.opacity = '0';
        chiPhoto.style.transform = 'scale(0.9)';
        chiPhoto.style.transition = 'all 1s ease';
        
        memorialObserver.observe(chiPhoto);
    }
    
    // Animaciones escalonadas para las tarjetas de contribución
    const contributionCards = document.querySelectorAll('.contribution-card');
    contributionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${index * 0.2}s`;
        
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.3 });
        
        cardObserver.observe(card);
    });
    
    // Efecto especial para la cita memorial
    const memorialQuote = document.querySelector('.memorial-quote');
    if (memorialQuote) {
        memorialQuote.style.opacity = '0';
        memorialQuote.style.transform = 'translateY(20px)';
        memorialQuote.style.transition = 'all 1s ease';
        
        const quoteObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.5 });
        
        quoteObserver.observe(memorialQuote);
    }
});

// ===== ANIMACIONES PARA LA SECCIÓN DE MÚSICA FAVORITA =====
document.addEventListener('DOMContentLoaded', function() {
    // Animaciones escalonadas para las tarjetas de canciones
    const songCards = document.querySelectorAll('.song-card');
    
    songCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateX(-50px)';
        card.style.transition = 'all 0.8s ease';
        card.style.transitionDelay = `${index * 0.15}s`;
        
        const songObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.2 });
        
        songObserver.observe(card);
    });
    
    // Efecto especial para la canción destacada
    const featuredSong = document.querySelector('.featured-song');
    if (featuredSong) {
        featuredSong.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.1)';
        });
        
        featuredSong.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(10px) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
    }
    
    // Efectos hover mejorados para botones de reproducción
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(45deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))';
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
            this.style.transform = 'translateY(-2px) scale(1)';
        });
        
        // Efecto de click con feedback visual
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Efecto ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Animación para el botón de playlist
    const playlistButton = document.querySelector('.playlist-button');
    if (playlistButton) {
        playlistButton.style.opacity = '0';
        playlistButton.style.transform = 'translateY(20px)';
        playlistButton.style.transition = 'all 0.8s ease';
        
        const playlistObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.5 });
        
        playlistObserver.observe(playlistButton);
        
        // Efecto hover mejorado para el botón de playlist
        playlistButton.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(45deg, #1ed760, #1ab954)';
            this.style.transform = 'translateY(-4px) scale(1.05)';
            this.style.boxShadow = '0 12px 30px rgba(29, 185, 84, 0.5)';
        });
        
        playlistButton.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(45deg, #1db954, #1ed760)';
            this.style.transform = 'translateY(-3px) scale(1)';
            this.style.boxShadow = '0 8px 25px rgba(29, 185, 84, 0.4)';
        });
    }
});

// ===== EFECTOS ESPECIALES PARA SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    // Efecto parallax sutil para las nuevas secciones
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Efecto parallax para la sección de honor
        const honorSection = document.getElementById('honor');
        if (honorSection) {
            const rect = honorSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const speed = (scrolled - honorSection.offsetTop) * 0.1;
                const memorialImage = honorSection.querySelector('.memorial-image');
                if (memorialImage) {
                    memorialImage.style.transform = `translateY(${speed}px)`;
                }
            }
        }
        
        // Efecto de cambio de opacidad para elementos específicos
        const songCards = document.querySelectorAll('.song-card');
        songCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const visibilityPercentage = 
                    (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const opacity = Math.max(0.3, Math.min(1, visibilityPercentage * 1.5));
                card.style.opacity = opacity;
            }
        });
    });
});

// ===== CONTADOR DINÁMICO PARA LA SECCIÓN DE HONOR =====
document.addEventListener('DOMContentLoaded', function() {
    // Calcular años desde el accidente de Chi (2008)
    const accidentYear = 2008;
    const currentYear = new Date().getFullYear();
    const yearsSinceAccident = currentYear - accidentYear;
    
    // Actualizar referencias dinámicas si existen
    const chiDatesElement = document.querySelector('.chi-dates');
    if (chiDatesElement) {
        // Agregar información adicional si es necesario
        const additionalInfo = document.createElement('p');
        additionalInfo.className = 'chi-legacy';
        additionalInfo.style.cssText = `
            font-size: 0.9rem;
            color: #888;
            margin-top: 0.5rem;
            font-style: italic;
        `;
        additionalInfo.textContent = `Su legado perdura ${yearsSinceAccident} años después`;
        chiDatesElement.parentNode.insertBefore(additionalInfo, chiDatesElement.nextSibling);
    }
});

// ===== GESTIÓN DE ERRORES Y FALLBACKS =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que las imágenes de las nuevas secciones carguen correctamente
    const chiPhoto = document.querySelector('.chi-photo');
    if (chiPhoto) {
        chiPhoto.addEventListener('error', function() {
            // Fallback si la imagen no carga
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #333, #666);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                font-size: 3rem;
                font-weight: bold;
            `;
            placeholder.textContent = 'CHI';
            this.parentNode.appendChild(placeholder);
        });
    }
    
    // Manejar errores de Spotify
    window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('spotify')) {
            console.log('Error al acceder a Spotify. Verifique la conexión.');
        }
    });
});

// ===== FUNCIONES DE UTILIDAD ADICIONALES =====
function highlightFavoriteSection() {
    // Función para destacar la sección de música favorita
    const favoriteMusicSection = document.getElementById('mi-musica');
    if (favoriteMusicSection) {
        favoriteMusicSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Efecto de destacado temporal
        favoriteMusicSection.style.background = 'rgba(255, 255, 255, 0.05)';
        setTimeout(() => {
            favoriteMusicSection.style.background = '';
        }, 2000);
    }
}

function showChiTribute() {
    // Función para mostrar un tributo especial a Chi
    const honorSection = document.getElementById('honor');
    if (honorSection) {
        honorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Efecto especial en la foto memorial
        const memorialPhoto = honorSection.querySelector('.memorial-frame');
        if (memorialPhoto) {
            memorialPhoto.style.boxShadow = '0 0 50px rgba(255, 255, 255, 0.3)';
            setTimeout(() => {
                memorialPhoto.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.1)';
            }, 3000);
        }
    }
}

// ===== VIDEO AUTO-PLAY CUANDO ENTRA EN VIEWPORT =====
document.addEventListener("DOMContentLoaded", function () {
    const chiVideo = document.getElementById("chiVideo");
    const honorSection = document.getElementById("honor");

    if (chiVideo && honorSection) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chiVideo.play()
                        .then(() => {
                            // La reproducción se inició correctamente
                        })
                        .catch(error => {
                            // La reproducción falló, probablemente por políticas del navegador
                            console.error("Error al intentar reproducir el video:", error);
                        });
                    
                    // Detener la observación una vez que el video se intenta reproducir
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); 

        observer.observe(honorSection);
    }
});

// ===== CSS ANIMATIONS (programmatic) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes waveEffect {
        to {
            transform: scale(3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation support
    document.querySelectorAll('.album-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Escuchar ${card.querySelector('.album-title')?.textContent || 'album'} en Spotify`);
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    
    // Keyboard support for timeline progress dots
    document.querySelectorAll('.progress-dot').forEach(dot => {
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('role', 'button');
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dot.click();
            }
        });
    });
});

console.log('🍔🎸 Deftones website con hamburger menu funcional cargado exitosamente! 🎸🍔');