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

    // Theme toggle (shared with admin logic pattern)
    const themeBtn = document.getElementById('themeToggle');
    if(themeBtn){
        const savedTheme = localStorage.getItem('vaatco_public_theme');
        if(savedTheme === 'dark') document.body.classList.add('theme-dark');
        updateThemeIcon();
        themeBtn.addEventListener('click', ()=>{
            document.body.classList.toggle('theme-dark');
            const mode = document.body.classList.contains('theme-dark') ? 'dark':'light';
            localStorage.setItem('vaatco_public_theme', mode);
            updateThemeIcon();
        });
        function updateThemeIcon(){
            const icon = themeBtn.querySelector('i');
            if(!icon) return;
            if(document.body.classList.contains('theme-dark')){
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
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
    
    // ========================================
    // DEALERS SECTION INITIALIZATION
    // ========================================
    
    // Initialize dealers section when DOM is loaded
    setTimeout(function() {
        console.log('Delayed check for dealersGrid element...');
        const dealersGridElement = document.getElementById('dealersGrid');
        console.log('dealersGrid element:', dealersGridElement);
        
        if (dealersGridElement) {
            console.log('dealersGrid found, loading dealers...');
            loadDealers();
            setupDealerSearch();
            
            // Reload dealers when localStorage changes (from admin updates)
            window.addEventListener('storage', function(e) {
                if (e.key === 'vaatco_dealers') {
                    loadDealers();
                }
            });
        } else {
            console.log('dealersGrid element not found!');
        }
    }, 1000); // Wait 1 second to ensure everything is loaded
});

// ========================================
// DEALERS SECTION FUNCTIONALITY
// ========================================

// Load dealers from admin system
function loadDealers() {
    console.log('loadDealers function called');
    const dealersGrid = document.getElementById('dealersGrid');
    console.log('dealersGrid in loadDealers:', dealersGrid);
    
    if (!dealersGrid) {
        console.error('dealersGrid element not found in loadDealers');
        return;
    }
    
    const loadingSpinner = dealersGrid.querySelector('.loading-spinner');
    const noDealersMessage = document.getElementById('noDealersMessage');
    
    try {
        // Get dealers from localStorage (from admin system)
        const dealers = JSON.parse(localStorage.getItem('vaatco_dealers')) || [];
        console.log('Dealers from localStorage:', dealers);
        
        // Clear loading spinner
        dealersGrid.innerHTML = '';
        if (noDealersMessage) {
            noDealersMessage.classList.add('d-none');
        }
        
        if (dealers.length === 0) {
            console.log('No dealers in localStorage, using default dealers');
            // Show default dealers if none in localStorage
            const defaultDealers = [
                {
                    id: 'default-1',
                    district: 'Dhaka',
                    name: 'Green Farms Supply',
                    shop: 'Premium Aqua Solutions',
                    location: 'Dhanmondi, Dhaka',
                    contact: '01700000001'
                },
                {
                    id: 'default-2',
                    district: 'Chittagong',
                    name: 'Aqua Plus Solutions',
                    shop: 'Marine Fish Center',
                    location: 'Agrabad, Chittagong',
                    contact: '01700000002'
                },
                {
                    id: 'default-3',
                    district: 'Khulna',
                    name: 'Delta Agro-Vet',
                    shop: 'Shrimp Farmers Hub',
                    location: 'Sonadanga, Khulna',
                    contact: '01700000003'
                },
                {
                    id: 'default-4',
                    district: 'Sylhet',
                    name: 'Hills Aquaculture',
                    shop: 'Tea Garden Fish Farm',
                    location: 'Zindabazar, Sylhet',
                    contact: '01700000004'
                },
                {
                    id: 'default-5',
                    district: 'Rajshahi',
                    name: 'Padma Fish Supplies',
                    shop: 'Silk City Aqua',
                    location: 'Shaheb Bazar, Rajshahi',
                    contact: '01700000005'
                },
                {
                    id: 'default-6',
                    district: 'Barisal',
                    name: 'River Delta Aqua',
                    shop: 'Coastal Fish Solutions',
                    location: 'Band Road, Barisal',
                    contact: '01700000006'
                },
                {
                    id: 'default-7',
                    district: 'Rangpur',
                    name: 'Northern Fish Enterprise',
                    shop: 'Highland Aqua Center',
                    location: 'Station Road, Rangpur',
                    contact: '01700000007'
                },
                {
                    id: 'default-8',
                    district: 'Mymensingh',
                    name: 'Brahmaputra Aquaculture',
                    shop: 'River View Fish Farm',
                    location: 'Choto Bazar, Mymensingh',
                    contact: '01700000008'
                },
                {
                    id: 'default-9',
                    district: 'Comilla',
                    name: 'Eastern Aqua Solutions',
                    shop: 'Mainamati Fish Center',
                    location: 'Kandirpar, Comilla',
                    contact: '01700000009'
                },
                {
                    id: 'default-10',
                    district: 'Cox\'s Bazar',
                    name: 'Coastal Marine Supply',
                    shop: 'Sea Beach Aquaculture',
                    location: 'Kalatoli Road, Cox\'s Bazar',
                    contact: '01700000010'
                },
                {
                    id: 'default-11',
                    district: 'Bogura',
                    name: 'Central Fish Hub',
                    shop: 'Mahasthangarh Aqua',
                    location: 'Rangpur Road, Bogura',
                    contact: '01700000011'
                },
                {
                    id: 'default-12',
                    district: 'Jessore',
                    name: 'Border Aqua Enterprise',
                    shop: 'Flower City Fish Farm',
                    location: 'MK Road, Jessore',
                    contact: '01700000012'
                },
                {
                    id: 'default-13',
                    district: 'Faridpur',
                    name: 'Padma River Aquaculture',
                    shop: 'Golden Fish Center',
                    location: 'Goal Chand Road, Faridpur',
                    contact: '01700000013'
                },
                {
                    id: 'default-14',
                    district: 'Tangail',
                    name: 'Textile City Aqua',
                    shop: 'Bangabandhu Fish Farm',
                    location: 'Kagmari Road, Tangail',
                    contact: '01700000014'
                },
                {
                    id: 'default-15',
                    district: 'Dinajpur',
                    name: 'Litchi Land Aquaculture',
                    shop: 'North Bengal Fish Hub',
                    location: 'Pulhat Road, Dinajpur',
                    contact: '01700000015'
                },
                {
                    id: 'default-16',
                    district: 'Pabna',
                    name: 'Hardinge Bridge Aqua',
                    shop: 'Padma Side Fish Center',
                    location: 'Station Road, Pabna',
                    contact: '01700000016'
                },
                {
                    id: 'default-17',
                    district: 'Kushtia',
                    name: 'Lalon Fish Enterprise',
                    shop: 'Cultural City Aquaculture',
                    location: 'NS Road, Kushtia',
                    contact: '01700000017'
                },
                {
                    id: 'default-18',
                    district: 'Sirajganj',
                    name: 'Jamuna River Aqua',
                    shop: 'Ferry Ghat Fish Farm',
                    location: 'Shaheed Kamruzzaman Road, Sirajganj',
                    contact: '01700000018'
                },
                {
                    id: 'default-19',
                    district: 'Noakhali',
                    name: 'Coastal Delta Solutions',
                    shop: 'Meghna Estuary Aqua',
                    location: 'Maijdee Court, Noakhali',
                    contact: '01700000019'
                },
                {
                    id: 'default-20',
                    district: 'Patuakhali',
                    name: 'Kuakata Fish Supply',
                    shop: 'Sea View Aquaculture',
                    location: 'Sadar Road, Patuakhali',
                    contact: '01700000020'
                },
                {
                    id: 'default-21',
                    district: 'Narsingdi',
                    name: 'Textile Belt Aqua',
                    shop: 'Meghna Bank Fish Center',
                    location: 'Chinishpur, Narsingdi',
                    contact: '01700000021'
                }
            ];
            displayDealers(defaultDealers);
        } else {
            displayDealers(dealers);
        }
        
    } catch (error) {
        console.error('Error loading dealers:', error);
        dealersGrid.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Unable to load dealer information. Please try again later.
                </div>
            </div>
        `;
    }
}

// Display dealers in grid format
function displayDealers(dealers) {
    console.log('displayDealers called with:', dealers.length, 'dealers');
    const dealersGrid = document.getElementById('dealersGrid');
    
    if (!dealersGrid) {
        console.error('dealersGrid not found in displayDealers');
        return;
    }
    
    if (dealers.length === 0) {
        const noDealersMessage = document.getElementById('noDealersMessage');
        if (noDealersMessage) {
            noDealersMessage.classList.remove('d-none');
        }
        return;
    }
    
    const dealersHTML = dealers.map(dealer => {
        const contactNumber = dealer.contact.replace(/\D/g, ''); // Extract numbers only
        const whatsappLink = contactNumber ? `https://wa.me/88${contactNumber.startsWith('0') ? contactNumber.slice(1) : contactNumber}` : '#';
        const rawMap = dealer.map || '';
        let locationLink;
        if(rawMap){
            if(rawMap.startsWith('http')){
                locationLink = rawMap;
            } else if(/^-?\d{1,3}\.\d+,-?\d{1,3}\.\d+$/.test(rawMap)){ // coordinate pair
                locationLink = `https://www.google.com/maps?q=${encodeURIComponent(rawMap)}`;
            } else {
                locationLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawMap)}`;
            }
        } else {
            locationLink = dealer.location.includes('http') ? dealer.location : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.location + ', Bangladesh')}`;
        }
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="dealer-card">
                    <div class="dealer-card-header">
                        <div class="dealer-district">${dealer.district}</div>
                    </div>
                    <div class="dealer-card-body">
                        <div class="dealer-name">${dealer.name}</div>
                        <div class="dealer-shop">${dealer.shop}</div>
                        
                        <div class="dealer-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${dealer.location}</span>
                        </div>
                        
                        <div class="dealer-info-item">
                            <i class="fas fa-phone"></i>
                            <span>${dealer.contact}</span>
                        </div>
                        
                        <div class="mt-3">
                            <a href="${whatsappLink}" target="_blank" class="dealer-contact-btn">
                                <i class="fab fa-whatsapp"></i>
                                WhatsApp
                            </a>
                            <a href="${locationLink}" target="_blank" class="dealer-location-btn">
                                <i class="fas fa-map"></i>
                                Map
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    dealersGrid.innerHTML = dealersHTML;
}

// Search functionality
function setupDealerSearch() {
    const searchInput = document.getElementById('dealerSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = this.value.toLowerCase().trim();
            filterDealers(query);
        }, 300); // Debounce search
    });
}

// Filter dealers based on search query
function filterDealers(query) {
    try {
        const dealers = JSON.parse(localStorage.getItem('vaatco_dealers')) || [];
        let filteredDealers = dealers;
        
        // Use default dealers if no admin dealers
        if (dealers.length === 0) {
            filteredDealers = [
                {
                    id: 'default-1',
                    district: 'Dhaka',
                    name: 'Green Farms Supply',
                    shop: 'Premium Aqua Solutions',
                    location: 'Dhanmondi, Dhaka',
                    contact: '+880171234567'
                },
                {
                    id: 'default-2',
                    district: 'Chittagong',
                    name: 'Aqua Plus Solutions',
                    shop: 'Marine Fish Center',
                    location: 'Agrabad, Chittagong',
                    contact: '+880191234567'
                },
                {
                    id: 'default-3',
                    district: 'Khulna',
                    name: 'Delta Agro-Vet',
                    shop: 'Shrimp Farmers Hub',
                    location: 'Sonadanga, Khulna',
                    contact: '+880181234567'
                },
                {
                    id: 'default-4',
                    district: 'Sylhet',
                    name: 'Hills Aquaculture',
                    shop: 'Tea Garden Fish Farm',
                    location: 'Zindabazar, Sylhet',
                    contact: '+880171234568'
                },
                {
                    id: 'default-5',
                    district: 'Rajshahi',
                    name: 'Padma Fish Supplies',
                    shop: 'Silk City Aqua',
                    location: 'Shaheb Bazar, Rajshahi',
                    contact: '+880181234568'
                },
                {
                    id: 'default-6',
                    district: 'Barisal',
                    name: 'River Delta Aqua',
                    shop: 'Coastal Fish Solutions',
                    location: 'Band Road, Barisal',
                    contact: '+880191234568'
                },
                {
                    id: 'default-7',
                    district: 'Rangpur',
                    name: 'Northern Fish Enterprise',
                    shop: 'Highland Aqua Center',
                    location: 'Station Road, Rangpur',
                    contact: '+880171234569'
                },
                {
                    id: 'default-8',
                    district: 'Mymensingh',
                    name: 'Brahmaputra Aquaculture',
                    shop: 'River View Fish Farm',
                    location: 'Choto Bazar, Mymensingh',
                    contact: '+880181234569'
                },
                {
                    id: 'default-9',
                    district: 'Comilla',
                    name: 'Eastern Aqua Solutions',
                    shop: 'Mainamati Fish Center',
                    location: 'Kandirpar, Comilla',
                    contact: '+880191234569'
                },
                {
                    id: 'default-10',
                    district: 'Cox\'s Bazar',
                    name: 'Coastal Marine Supply',
                    shop: 'Sea Beach Aquaculture',
                    location: 'Kalatoli Road, Cox\'s Bazar',
                    contact: '+880171234570'
                },
                {
                    id: 'default-11',
                    district: 'Bogura',
                    name: 'Central Fish Hub',
                    shop: 'Mahasthangarh Aqua',
                    location: 'Rangpur Road, Bogura',
                    contact: '+880181234570'
                },
                {
                    id: 'default-12',
                    district: 'Jessore',
                    name: 'Border Aqua Enterprise',
                    shop: 'Flower City Fish Farm',
                    location: 'MK Road, Jessore',
                    contact: '+880191234570'
                },
                {
                    id: 'default-13',
                    district: 'Faridpur',
                    name: 'Padma River Aquaculture',
                    shop: 'Golden Fish Center',
                    location: 'Goal Chand Road, Faridpur',
                    contact: '+880171234571'
                },
                {
                    id: 'default-14',
                    district: 'Tangail',
                    name: 'Textile City Aqua',
                    shop: 'Bangabandhu Fish Farm',
                    location: 'Kagmari Road, Tangail',
                    contact: '+880181234571'
                },
                {
                    id: 'default-15',
                    district: 'Dinajpur',
                    name: 'Litchi Land Aquaculture',
                    shop: 'North Bengal Fish Hub',
                    location: 'Pulhat Road, Dinajpur',
                    contact: '+880191234571'
                },
                {
                    id: 'default-16',
                    district: 'Pabna',
                    name: 'Hardinge Bridge Aqua',
                    shop: 'Padma Side Fish Center',
                    location: 'Station Road, Pabna',
                    contact: '+880171234572'
                },
                {
                    id: 'default-17',
                    district: 'Kushtia',
                    name: 'Lalon Fish Enterprise',
                    shop: 'Cultural City Aquaculture',
                    location: 'NS Road, Kushtia',
                    contact: '+880181234572'
                },
                {
                    id: 'default-18',
                    district: 'Sirajganj',
                    name: 'Jamuna River Aqua',
                    shop: 'Ferry Ghat Fish Farm',
                    location: 'Shaheed Kamruzzaman Road, Sirajganj',
                    contact: '+880191234572'
                },
                {
                    id: 'default-19',
                    district: 'Noakhali',
                    name: 'Coastal Delta Solutions',
                    shop: 'Meghna Estuary Aqua',
                    location: 'Maijdee Court, Noakhali',
                    contact: '+880171234573'
                },
                {
                    id: 'default-20',
                    district: 'Patuakhali',
                    name: 'Kuakata Fish Supply',
                    shop: 'Sea View Aquaculture',
                    location: 'Sadar Road, Patuakhali',
                    contact: '+880181234573'
                },
                {
                    id: 'default-21',
                    district: 'Narsingdi',
                    name: 'Textile Belt Aqua',
                    shop: 'Meghna Bank Fish Center',
                    location: 'Chinishpur, Narsingdi',
                    contact: '+880191234573'
                }
            ];
        }
        
        if (query) {
            filteredDealers = filteredDealers.filter(dealer => 
                dealer.district.toLowerCase().includes(query) ||
                dealer.name.toLowerCase().includes(query) ||
                dealer.shop.toLowerCase().includes(query) ||
                dealer.location.toLowerCase().includes(query) ||
                dealer.contact.toLowerCase().includes(query)
            );
        }
        
        displayDealers(filteredDealers);
        
    } catch (error) {
        console.error('Error filtering dealers:', error);
    }
}

// ========================================
// FORCE DEALERS LOADING - FINAL ATTEMPT
// ========================================

// Multiple attempts to ensure dealers load
window.addEventListener('load', function() {
    console.log('Window loaded, trying to load dealers...');
    setTimeout(function() {
        const dealersGrid = document.getElementById('dealersGrid');
        if (dealersGrid) {
            console.log('Found dealersGrid on window load, loading dealers now...');
            loadDealers();
            setupDealerSearch();
        }
    }, 500);
});

// Also try on DOM content loaded as a backup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, trying to load dealers...');
    setTimeout(function() {
        const dealersGrid = document.getElementById('dealersGrid');
        if (dealersGrid) {
            console.log('Found dealersGrid on DOM loaded, loading dealers now...');
            loadDealers();
            setupDealerSearch();
        }
    }, 1000);
});

// Final fallback with longer delay
setTimeout(function() {
    console.log('Final fallback attempt to load dealers...');
    const dealersGrid = document.getElementById('dealersGrid');
    if (dealersGrid && dealersGrid.innerHTML.includes('Loading dealers')) {
        console.log('Found dealersGrid in fallback, still showing loading - loading dealers now...');
        loadDealers();
        setupDealerSearch();
    }
}, 3000);
