// StreamingClaw Project Page JavaScript

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeImageModal();
    initializeCopyButtons();
    initializeLanguageToggle();
    initializeCarousel();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'var(--card-background)';
            navbar.style.boxShadow = 'var(--shadow)';
        }
    });
}

/**
 * Initialize animation effects
 */
function initializeAnimations() {
    // Use Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that need animation
    document.querySelectorAll('.section, .stat-card, .task-card').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });

    // Add CSS animation class
    const style = document.createElement('style');
    style.textContent = `
        .animate-ready {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize image modal
 */
function initializeImageModal() {
    // Get all clickable images
    const images = document.querySelectorAll('.framework-diagram img, .section-image img, .proactive-image-item img, .proactive-training img, .carousel-slide img');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.close');

    if (!modal) return;

    // Click image to open modal
    images.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;

            // Get image caption
            const caption = this.parentElement.querySelector('.figure-caption');
            if (caption) {
                modalCaption.innerHTML = caption.textContent;
            } else {
                modalCaption.innerHTML = this.alt || 'Image preview';
            }
        });
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Click modal background to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Keyboard close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

/**
 * Initialize copy buttons
 */
function initializeCopyButtons() {
    const copyButton = document.getElementById('copyBibtex');

    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const bibtexCode = document.querySelector('.citation-box pre code').textContent;

            navigator.clipboard.writeText(bibtexCode).then(() => {
                // Show copy success
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyButton.style.backgroundColor = '#2ecc71';

                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                    copyButton.style.backgroundColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }
}

/**
 * Initialize language toggle for skill carousel
 */
function initializeLanguageToggle() {
    const langButtons = document.querySelectorAll('.lang-btn');
    const skillCarouselContainer = document.getElementById('skillCarouselContainer');

    if (!skillCarouselContainer || !langButtons.length) return;

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');

            // Update button states
            langButtons.forEach(btn => {
                btn.classList.remove('lang-btn-active');
            });
            this.classList.add('lang-btn-active');

            // Show/hide slides based on language
            const slides = skillCarouselContainer.querySelectorAll('.carousel-slide');
            slides.forEach(slide => {
                slide.style.display = 'none';
            });

            // Show only slides with selected language
            const visibleSlides = skillCarouselContainer.querySelectorAll(`.carousel-slide[data-lang="${selectedLang}"]`);
            visibleSlides.forEach(slide => {
                slide.style.display = 'block';
            });

            // Reset carousel to first slide
            const track = skillCarouselContainer.querySelector('.carousel-track');
            track.style.transform = 'translateX(0)';

            // Reset indicators
            const indicators = skillCarouselContainer.querySelectorAll('.indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === 0);
            });
        });
    });
}

/**
 * Initialize carousel
 */
function initializeCarousel() {
    const carouselContainers = document.querySelectorAll('.tools-carousel-container');
    if (!carouselContainers.length) return;

    carouselContainers.forEach((container) => {
        const carousel = container.querySelector('.carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const indicators = container.querySelectorAll('.carousel-indicators .indicator');

        let currentIndex = 0;

        // Get visible slides (for skill carousel with language filter)
        function getVisibleSlides() {
            const allSlides = carousel.querySelectorAll('.carousel-slide');
            return Array.from(allSlides).filter(slide => slide.style.display !== 'none');
        }

        // Update carousel position
        function updateCarousel() {
            const visibleSlides = getVisibleSlides();
            const slideCount = visibleSlides.length;

            if (slideCount === 0) return;

            // Clamp currentIndex to valid range
            if (currentIndex >= slideCount) {
                currentIndex = slideCount - 1;
            }

            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update indicator state
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        // Next slide
        function nextSlide() {
            const visibleSlides = getVisibleSlides();
            const slideCount = visibleSlides.length;
            if (slideCount === 0) return;

            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        }

        // Previous slide
        function prevSlide() {
            const visibleSlides = getVisibleSlides();
            const slideCount = visibleSlides.length;
            if (slideCount === 0) return;

            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
        }

        // Go to specific slide
        function goToSlide(index) {
            const visibleSlides = getVisibleSlides();
            if (index < visibleSlides.length) {
                currentIndex = index;
                updateCarousel();
            }
        }

        // Bind button events
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Bind indicator events
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    });

    // Keyboard support (global, for the first visible carousel)
    document.addEventListener('keydown', (e) => {
        const carouselContainers = document.querySelectorAll('.tools-carousel-container');
        for (const container of carouselContainers) {
            const carousel = container.querySelector('.carousel');
            const rect = carousel.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

            if (isInViewport) {
                const track = carousel.querySelector('.carousel-track');
                const slides = carousel.querySelectorAll('.carousel-slide');
                const visibleSlides = Array.from(slides).filter(slide => slide.style.display !== 'none');
                const slideCount = visibleSlides.length;
                let currentTransform = track.style.transform;
                let currentIndex = 0;

                if (currentTransform) {
                    const match = currentTransform.match(/-?(\d+\.?\d*)%/);
                    if (match) {
                        currentIndex = Math.round(parseFloat(match[1]) / 100);
                    }
                }

                if (e.key === 'ArrowLeft') {
                    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    const indicators = container.querySelectorAll('.carousel-indicators .indicator');
                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === currentIndex);
                    });
                } else if (e.key === 'ArrowRight') {
                    currentIndex = (currentIndex + 1) % slideCount;
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    const indicators = container.querySelectorAll('.carousel-indicators .indicator');
                    indicators.forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === currentIndex);
                    });
                }
                break;
            }
        }
    });
}

/**
 * Utility functions
 */
// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Create back to top button
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'back-to-top-btn';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        display: none;
        font-size: 1.2rem;
        z-index: 999;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(button);

    // Show/hide logic
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', scrollToTop);
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);
