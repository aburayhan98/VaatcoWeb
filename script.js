// VAATCO Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Get navbar elements
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect with minimizing
    let lastScrollTop = 0;
    let scrollTimer = null;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.add('navbar-minimized');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.remove('navbar-minimized');
        }
        
        // Hide/show navbar based on scroll direction
        if (scrollTop > 100) { // Only apply effect after scrolling 100px
            if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
                // Scrolling down - hide navbar
                navbar.classList.add('navbar-hidden');
            } else {
                // Scrolling up - show navbar
                navbar.classList.remove('navbar-hidden');
            }
        } else {
            // Always show navbar at the top
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        
        // Clear timer and set a new one to show navbar after scrolling stops
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function() {
            navbar.classList.remove('navbar-hidden');
        }, 1500); // Show navbar after 1.5 seconds of no scrolling
    });
    
    // Show navbar when mouse is near the top of the screen
    document.addEventListener('mousemove', function(e) {
        if (e.clientY < 100) { // Mouse is within 100px of top
            navbar.classList.remove('navbar-hidden');
        }
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
    
    // Active navigation highlighting
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = navbar.offsetHeight;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Update active nav on scroll
    window.addEventListener('scroll', setActiveNavLink);
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.fade-in, .offer-card, .feature-card, .blog-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || document.getElementById('name').value;
            const email = formData.get('email') || document.getElementById('email').value;
            const message = formData.get('message') || document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Back to top functionality
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'btn btn-primary back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: none;
        background: #32CD32;
        border: none;
        color: white;
        box-shadow: 0 4px 15px rgba(50, 205, 50, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Initialize carousel auto-pause on hover
    const carousel = document.querySelector('#heroCarousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', function() {
            const bsCarousel = bootstrap.Carousel.getInstance(this);
            if (bsCarousel) {
                bsCarousel.pause();
            }
        });
        
        carousel.addEventListener('mouseleave', function() {
            const bsCarousel = bootstrap.Carousel.getInstance(this);
            if (bsCarousel) {
                bsCarousel.cycle();
            }
        });
    }
    
    // Custom Image Preview functionality - removed duplicate variables
    
    // Initialize image preview functionality
    function initializeImagePreview() {
        const previewImage = document.getElementById('previewImage');
        const imageContainer = document.querySelector('.preview-image-container');
        
        if (previewImage && imageContainer) {
            // Mouse wheel zoom (desktop)
            imageContainer.addEventListener('wheel', function(e) {
                e.preventDefault();
                const rect = imageContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (e.deltaY > 0) {
                    zoomOut();
                } else {
                    zoomIn();
                }
            });
            
            // Mouse drag to pan (desktop)
            previewImage.addEventListener('mousedown', function(e) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                previewImage.style.cursor = 'grabbing';
                e.preventDefault();
            });
            
            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    translateX = e.clientX - startX;
                    translateY = e.clientY - startY;
                    updateImageTransform();
                }
            });
            
            document.addEventListener('mouseup', function() {
                if (isDragging) {
                    isDragging = false;
                    previewImage.style.cursor = 'grab';
                }
            });
            
            // Enhanced Touch events for mobile
            previewImage.addEventListener('touchstart', function(e) {
                e.preventDefault();
                touches = Array.from(e.touches);
                
                if (touches.length === 1) {
                    // Single touch - start dragging
                    isDragging = true;
                    isZooming = false;
                    const touch = touches[0];
                    startX = touch.clientX - translateX;
                    startY = touch.clientY - translateY;
                } else if (touches.length === 2) {
                    // Two touches - start zooming
                    isDragging = false;
                    isZooming = true;
                    initialDistance = getDistance(touches[0], touches[1]);
                    initialScale = currentZoom;
                }
            });
            
            previewImage.addEventListener('touchmove', function(e) {
                e.preventDefault();
                touches = Array.from(e.touches);
                
                if (touches.length === 1 && isDragging && !isZooming) {
                    // Single touch dragging
                    const touch = touches[0];
                    translateX = touch.clientX - startX;
                    translateY = touch.clientY - startY;
                    updateImageTransform();
                } else if (touches.length === 2 && isZooming) {
                    // Two touch zooming
                    const currentDistance = getDistance(touches[0], touches[1]);
                    const scale = (currentDistance / initialDistance) * initialScale;
                    
                    // Limit zoom levels
                    currentZoom = Math.min(Math.max(scale, 0.5), 4);
                    updateImageTransform();
                }
            });
            
            previewImage.addEventListener('touchend', function(e) {
                e.preventDefault();
                touches = Array.from(e.touches);
                
                if (touches.length === 0) {
                    isDragging = false;
                    isZooming = false;
                } else if (touches.length === 1) {
                    // Switch back to dragging if one finger remains
                    isDragging = true;
                    isZooming = false;
                    const touch = touches[0];
                    startX = touch.clientX - translateX;
                    startY = touch.clientY - translateY;
                }
            });
            
            // Double tap to zoom
            let lastTapTime = 0;
            previewImage.addEventListener('touchend', function(e) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTapTime;
                
                if (tapLength < 500 && tapLength > 0 && e.touches.length === 0) {
                    // Double tap detected
                    if (currentZoom === 1) {
                        currentZoom = 2;
                        translateX = 0;
                        translateY = 0;
                    } else {
                        resetZoom();
                    }
                    updateImageTransform();
                }
                lastTapTime = currentTime;
            });
        }
    }
    
    // Helper function to calculate distance between two touch points
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Helper function to calculate distance between two touch points
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Call initialization after DOM is ready
    setTimeout(function() {
        initializeImagePreview();
    }, 100);
    
    // Smooth scrolling for gallery link
    const galleryLinks = document.querySelectorAll('a[href="#gallery"]');
    galleryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - navbar.offsetHeight - 20;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Image Preview Functions (Global scope for onclick handlers)
let currentZoom = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let isZooming = false;
let startX = 0;
let startY = 0;
let touches = [];
let initialDistance = 0;
let initialScale = 1;

function openImagePreview(imgElement) {
    const overlay = document.getElementById('imagePreviewOverlay');
    const previewImage = document.getElementById('previewImage');
    
    if (overlay && previewImage && imgElement) {
        previewImage.src = imgElement.src;
        previewImage.alt = imgElement.alt;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Reset zoom and position
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        isDragging = false;
        isZooming = false;
        updateImageTransform();
        
        // Re-initialize event handlers to ensure they work
        setTimeout(function() {
            initializeImagePreview();
        }, 50);
    }
}

function closeImagePreview() {
    const overlay = document.getElementById('imagePreviewOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset values
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
    }
}

// Close on overlay background click
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('imagePreviewOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            // Close if clicking on overlay background (not on image or controls)
            if (e.target === overlay) {
                closeImagePreview();
            }
        });
    }
});

function zoomIn() {
    if (currentZoom < 4) {
        currentZoom += 0.3;
        updateImageTransform();
    }
}

function zoomOut() {
    if (currentZoom > 0.5) {
        currentZoom -= 0.3;
        updateImageTransform();
        
        // Reset position if zoomed out too much
        if (currentZoom <= 1) {
            translateX = 0;
            translateY = 0;
        }
    }
}

function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
}

function updateImageTransform() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        // Constrain translation based on zoom level
        const maxTranslate = (currentZoom - 1) * 200;
        translateX = Math.max(-maxTranslate, Math.min(maxTranslate, translateX));
        translateY = Math.max(-maxTranslate, Math.min(maxTranslate, translateY));
        
        previewImage.style.transform = `scale(${currentZoom}) translate(${translateX / currentZoom}px, ${translateY / currentZoom}px)`;
        previewImage.style.cursor = currentZoom > 1 ? 'grab' : 'default';
        
        // Add transition for smooth zoom operations from buttons
        if (!isDragging && !isZooming) {
            previewImage.style.transition = 'transform 0.3s ease';
        } else {
            previewImage.style.transition = 'none';
        }
    }
}

// Helper function to calculate distance between two touch points
function getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Global initialization function for image preview
function initializeImagePreview() {
    const previewImage = document.getElementById('previewImage');
    const imageContainer = document.querySelector('.preview-image-container');
    
    if (previewImage && imageContainer) {
        // Remove existing event listeners to avoid duplicates
        previewImage.removeEventListener('touchstart', handleTouchStart);
        previewImage.removeEventListener('touchmove', handleTouchMove);
        previewImage.removeEventListener('touchend', handleTouchEnd);
        previewImage.removeEventListener('mousedown', handleMouseDown);
        
        // Mouse wheel zoom (desktop)
        imageContainer.addEventListener('wheel', function(e) {
            e.preventDefault();
            if (e.deltaY > 0) {
                zoomOut();
            } else {
                zoomIn();
            }
        });
        
        // Mouse drag to pan (desktop)
        previewImage.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Touch events for mobile
        previewImage.addEventListener('touchstart', handleTouchStart);
        previewImage.addEventListener('touchmove', handleTouchMove);
        previewImage.addEventListener('touchend', handleTouchEnd);
    }
}

// Touch event handlers
function handleTouchStart(e) {
    e.preventDefault();
    touches = Array.from(e.touches);
    
    if (touches.length === 1) {
        // Single touch - start dragging
        isDragging = true;
        isZooming = false;
        const touch = touches[0];
        startX = touch.clientX - translateX;
        startY = touch.clientY - translateY;
    } else if (touches.length === 2) {
        // Two touches - start zooming
        isDragging = false;
        isZooming = true;
        initialDistance = getDistance(touches[0], touches[1]);
        initialScale = currentZoom;
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    touches = Array.from(e.touches);
    
    if (touches.length === 1 && isDragging && !isZooming) {
        // Single touch dragging
        const touch = touches[0];
        translateX = touch.clientX - startX;
        translateY = touch.clientY - startY;
        updateImageTransform();
    } else if (touches.length === 2 && isZooming) {
        // Two touch zooming
        const currentDistance = getDistance(touches[0], touches[1]);
        const scale = (currentDistance / initialDistance) * initialScale;
        
        // Limit zoom levels
        currentZoom = Math.min(Math.max(scale, 0.5), 4);
        updateImageTransform();
    }
}

let lastTapTime = 0;
function handleTouchEnd(e) {
    e.preventDefault();
    touches = Array.from(e.touches);
    
    // Double tap to zoom detection
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 500 && tapLength > 0 && e.touches.length === 0) {
        // Double tap detected
        if (currentZoom === 1) {
            currentZoom = 2;
            translateX = 0;
            translateY = 0;
        } else {
            resetZoom();
        }
        updateImageTransform();
    }
    lastTapTime = currentTime;
    
    if (touches.length === 0) {
        isDragging = false;
        isZooming = false;
    } else if (touches.length === 1) {
        // Switch back to dragging if one finger remains
        isDragging = true;
        isZooming = false;
        const touch = touches[0];
        startX = touch.clientX - translateX;
        startY = touch.clientY - translateY;
    }
}

// Mouse event handlers
function handleMouseDown(e) {
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    document.getElementById('previewImage').style.cursor = 'grabbing';
    e.preventDefault();
}

function handleMouseMove(e) {
    if (isDragging) {
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImageTransform();
    }
}

function handleMouseUp() {
    if (isDragging) {
        isDragging = false;
        document.getElementById('previewImage').style.cursor = 'grab';
    }
}

// Keyboard controls for image preview
document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('imagePreviewOverlay');
    if (overlay && overlay.style.display === 'flex') {
        switch(e.key) {
            case 'Escape':
                closeImagePreview();
                break;
            case '+':
            case '=':
                e.preventDefault();
                zoomIn();
                break;
            case '-':
                e.preventDefault();
                zoomOut();
                break;
            case '0':
                e.preventDefault();
                resetZoom();
                break;
        }
    }
});
