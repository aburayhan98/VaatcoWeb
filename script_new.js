// VAATCO Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Get navbar elements
    const navbar = document.querySelector('.navbar');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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
        
        // Check if we're on product list page
        const isProductListPage = window.location.pathname.includes('product-list.html');
        
        if (isProductListPage) {
            // Set Products dropdown as active on product list page
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#products' || 
                    link.closest('.dropdown')) {
                    link.classList.add('active');
                }
            });
            return;
        }
        
        // Normal section-based highlighting for main page
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
    
    // Set initial active nav state
    setActiveNavLink();
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Handle external navigation (to other pages)
            if (targetId.includes('.html')) {
                // Let the browser handle navigation to other pages
                return;
            }
            
            // Handle internal navigation (sections on same page)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // If section doesn't exist on current page, navigate to main page
                    window.location.href = 'index.html' + targetId;
                }
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
    
    // Check if we're on product list page for different styling
    const isProductListPage = window.location.pathname.includes('product-list.html');
    const backToTopColor = isProductListPage ? '#3498db' : '#32CD32';
    const backToTopShadow = isProductListPage ? 'rgba(52, 152, 219, 0.3)' : 'rgba(50, 205, 50, 0.3)';
    
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: none;
        background: ${backToTopColor};
        border: none;
        color: white;
        box-shadow: 0 4px 15px ${backToTopShadow};
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

    // Product List Page Navigation
    function initializeProductListNavigation() {
        // Handle "View Complete Product List" button clicks
        const productListButtons = document.querySelectorAll('.btn-product-list, [data-action="product-list"]');
        productListButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add loading state
                const originalText = this.innerHTML;
                const originalClass = this.className;
                
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading Product List...';
                this.disabled = true;
                
                // Navigate to product list page after short delay
                setTimeout(() => {
                    window.location.href = 'product-list.html';
                }, 800);
            });
        });

        // Handle dropdown navigation to product list
        const productDropdownLinks = document.querySelectorAll('a[href="#product-list"], a[href="product-list.html"]');
        productDropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if we're already on product list page
                if (window.location.pathname.includes('product-list.html')) {
                    // Already on product list page, scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // Navigate to product list page
                    window.location.href = 'product-list.html';
                }
            });
        });

        // Handle "Complete Product Range" links in navigation
        const completeRangeLinks = document.querySelectorAll('a[href="#complete-range"]');
        completeRangeLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'product-list.html';
            });
        });

        // Initialize navbar dropdown functionality on product list page
        initializeNavbarDropdowns();
    }

    // Initialize navbar dropdown functionality
    function initializeNavbarDropdowns() {
        // Ensure Bootstrap dropdowns work properly
        const dropdownElements = document.querySelectorAll('.dropdown-toggle');
        dropdownElements.forEach(dropdown => {
            if (typeof bootstrap !== 'undefined') {
                new bootstrap.Dropdown(dropdown);
            }
        });

        // Handle dropdown item clicks
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // If it's a link to another page, let it navigate normally
                if (href && href.includes('.html')) {
                    return;
                }
                
                // If it's a section link and we're not on the main page
                if (href && href.startsWith('#') && !window.location.pathname.endsWith('/') && !window.location.pathname.includes('index.html')) {
                    e.preventDefault();
                    window.location.href = 'index.html' + href;
                }
            });
        });

        // Handle services navigation from product list page
        const servicesLinks = document.querySelectorAll('a[href="#services"], a[href="index.html#services"]');
        servicesLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // If we're on product list page and clicking services
                if (window.location.pathname.includes('product-list.html') && href.includes('#services')) {
                    e.preventDefault();
                    window.location.href = 'index.html#services';
                }
            });
        });
    }

    // Initialize product list functionality if on product list page
    function initializeProductListPage() {
        // Check if we're on the product list page
        const isProductListPage = window.location.pathname.includes('product-list.html') || 
                                 document.body.classList.contains('product-list-page') ||
                                 document.querySelector('.product-list-container');

        if (isProductListPage) {
            // Update page title
            document.title = 'Our Product List - VAATCO Bangladesh Ltd';
            
            // Store original table content for search reset
            storeOriginalTableContent();
            
            // Add breadcrumb navigation
            addProductListBreadcrumb();
            
            // Add search functionality
            addProductSearch();
            
            // Add export/print buttons
            addProductListActions();
            
            // Initialize table sorting
            initializeTableSorting();
        }
    }
    
    // Store original table content for proper search reset
    function storeOriginalTableContent() {
        const tableRows = document.querySelectorAll('.product-table tbody tr');
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                // Store original text content as data attribute
                if (!cell.dataset.originalText) {
                    cell.dataset.originalText = cell.textContent;
                }
            });
        });
    }

    // Add breadcrumb for product list page
    function addProductListBreadcrumb() {
        const mainContent = document.querySelector('main') || document.querySelector('.container').parentElement;
        
        if (mainContent && !document.querySelector('.product-breadcrumb')) {
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'product-breadcrumb bg-light py-3 mb-4';
            breadcrumb.innerHTML = `
                <div class="container">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb mb-0">
                            <li class="breadcrumb-item">
                                <a href="index.html" class="text-decoration-none text-primary">
                                    <i class="fas fa-home me-1"></i>Home
                                </a>
                            </li>
                            <li class="breadcrumb-item">
                                <span class="text-muted">Products</span>
                            </li>
                            <li class="breadcrumb-item active text-primary" aria-current="page">
                                <strong>Our Product List</strong>
                            </li>
                        </ol>
                    </nav>
                </div>
            `;
            
            mainContent.insertBefore(breadcrumb, mainContent.firstChild);
        }
    }

    // Add search functionality to product list
    function addProductSearch() {
        const productSection = document.querySelector('.product-table-container') || 
                              document.querySelector('.section-title')?.parentElement;
        
        if (productSection && !document.querySelector('.product-search-box')) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'product-search-box mb-4';
            searchContainer.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-lg-6 col-md-8">
                        <div class="input-group shadow-sm">
                            <span class="input-group-text bg-primary text-white">
                                <i class="fas fa-search"></i>
                            </span>
                            <input type="text" class="form-control" id="productSearchInput" 
                                   placeholder="Search by product name, type, generic name, pack size, or packing type..." 
                                   aria-label="Search products">
                            <button class="btn btn-outline-secondary" type="button" id="clearSearchBtn" title="Clear search">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="search-results-info mt-2 text-center text-muted small" style="display: none;"></div>
                    </div>
                </div>
            `;
            
            // Insert before the product table
            const tableContainer = document.querySelector('.product-table-container');
            if (tableContainer) {
                tableContainer.parentNode.insertBefore(searchContainer, tableContainer);
            }
            
            // Add search functionality
            const searchInput = document.getElementById('productSearchInput');
            const clearBtn = document.getElementById('clearSearchBtn');
            
            if (searchInput) {
                // Debounce function for smooth searching
                let searchTimeout;
                
                searchInput.addEventListener('input', function() {
                    const searchValue = this.value.trim();
                    
                    // Clear previous timeout
                    clearTimeout(searchTimeout);
                    
                    // Debounce search to avoid too frequent filtering
                    searchTimeout = setTimeout(() => {
                        filterProductTable(searchValue);
                    }, 300);
                });
                
                // Handle backspace and delete for immediate reset when empty
                searchInput.addEventListener('keyup', function(e) {
                    const searchValue = this.value.trim();
                    
                    // If input is empty, immediately reset
                    if (searchValue === '') {
                        clearTimeout(searchTimeout);
                        filterProductTable('');
                    }
                });
                
                // Handle paste events
                searchInput.addEventListener('paste', function() {
                    setTimeout(() => {
                        const searchValue = this.value.trim();
                        filterProductTable(searchValue);
                    }, 10);
                });
            }
            
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    searchInput.value = '';
                    filterProductTable('');
                    searchInput.focus();
                    
                    // Clear any pending search timeouts
                    if (searchTimeout) {
                        clearTimeout(searchTimeout);
                    }
                });
            }
        }
    }

    // Filter product table based on search term
    function filterProductTable(searchTerm) {
        const tableRows = document.querySelectorAll('.product-table tbody tr');
        const resultsInfo = document.querySelector('.search-results-info');
        let visibleCount = 0;
        
        // First, reset all rows to their original state
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                // Restore original text content
                if (cell.dataset.originalText) {
                    cell.textContent = cell.dataset.originalText;
                }
            });
            row.style.display = '';
            row.style.backgroundColor = '';
        });
        
        // If no search term, show all rows and hide results info
        if (!searchTerm || searchTerm.trim() === '') {
            if (resultsInfo) {
                resultsInfo.style.display = 'none';
            }
            return;
        }
        
        // Filter and count visible rows
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let rowText = '';
            
            // Combine all cell text for searching using original content
            cells.forEach(cell => {
                const originalText = cell.dataset.originalText || cell.textContent;
                rowText += originalText.toLowerCase() + ' ';
            });
            
            const isVisible = rowText.includes(searchTerm.toLowerCase());
            
            if (isVisible) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        // Update results info with better messaging
        if (resultsInfo) {
            if (visibleCount === 0) {
                resultsInfo.innerHTML = `<i class="fas fa-search me-1"></i>No products found matching "<strong>${searchTerm}</strong>"`;
                resultsInfo.style.display = 'block';
                resultsInfo.className = 'search-results-info mt-2 text-center text-warning small';
            } else if (visibleCount < tableRows.length) {
                resultsInfo.innerHTML = `<i class="fas fa-filter me-1"></i>Showing <strong>${visibleCount}</strong> of <strong>${tableRows.length}</strong> products`;
                resultsInfo.style.display = 'block';
                resultsInfo.className = 'search-results-info mt-2 text-center text-info small';
            } else {
                resultsInfo.innerHTML = `<i class="fas fa-check me-1"></i>All <strong>${tableRows.length}</strong> products match your search`;
                resultsInfo.style.display = 'block';
                resultsInfo.className = 'search-results-info mt-2 text-center text-success small';
            }
        }
        
        // Highlight search term in visible rows
        if (searchTerm && visibleCount > 0) {
            highlightSearchTerm(searchTerm);
        }
    }

    // Highlight search terms in table
    function highlightSearchTerm(term) {
        const visibleRows = document.querySelectorAll('.product-table tbody tr[style=""], .product-table tbody tr:not([style*="display: none"])');
        
        visibleRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach(cell => {
                // Skip if cell already has highlights to avoid double highlighting
                if (cell.querySelector('mark')) return;
                
                const originalText = cell.textContent;
                const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
                
                if (originalText.toLowerCase().includes(term.toLowerCase())) {
                    const highlightedHTML = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');
                    cell.innerHTML = highlightedHTML;
                }
            });
        });
    }
    
    // Helper function to escape special regex characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Add product count display only
    function addProductListActions() {
        const tableContainer = document.querySelector('.product-table-container');
        
        if (tableContainer && !document.querySelector('.product-list-actions')) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'product-list-actions d-flex justify-content-center align-items-center mb-3';
            actionsDiv.innerHTML = `
                <div class="product-count text-center">
                    <i class="fas fa-list-ul me-2 text-primary"></i>
                    <span class="total-products fw-semibold">Loading...</span>
                </div>
            `;
            
            tableContainer.parentNode.insertBefore(actionsDiv, tableContainer);
            
            // Update product count
            updateProductCount();
        }
    }

    // Update product count display
    function updateProductCount() {
        const totalRows = document.querySelectorAll('.product-table tbody tr').length;
        const countSpan = document.querySelector('.total-products');
        
        if (countSpan) {
            countSpan.textContent = `${totalRows} products available`;
        }
    }

    // Initialize table sorting
    function initializeTableSorting() {
        const headers = document.querySelectorAll('.product-table thead th');
        
        headers.forEach((header, index) => {
            if (index > 0) { // Skip first column (serial number)
                header.style.cursor = 'pointer';
                header.style.userSelect = 'none';
                header.innerHTML += ' <i class="fas fa-sort text-muted ms-1 sort-icon"></i>';
                
                header.addEventListener('click', function() {
                    sortTableByColumn(index);
                });
            }
        });
    }

    // Sort table by column
    function sortTableByColumn(columnIndex) {
        const table = document.querySelector('.product-table tbody');
        const rows = Array.from(table.querySelectorAll('tr'));
        const header = document.querySelectorAll('.product-table thead th')[columnIndex];
        
        const isAscending = !header.dataset.sorted || header.dataset.sorted === 'desc';
        header.dataset.sorted = isAscending ? 'asc' : 'desc';
        
        // Sort rows
        rows.sort((a, b) => {
            const aText = a.cells[columnIndex].textContent.trim();
            const bText = b.cells[columnIndex].textContent.trim();
            
            // Try numeric comparison first
            const aNum = parseFloat(aText);
            const bNum = parseFloat(bText);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return isAscending ? aNum - bNum : bNum - aNum;
            }
            
            // Fallback to string comparison
            return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });
        
        // Re-append sorted rows
        rows.forEach(row => table.appendChild(row));
        
        // Update sort icons
        document.querySelectorAll('.sort-icon').forEach(icon => {
            icon.className = 'fas fa-sort text-muted ms-1 sort-icon';
        });
        
        const currentIcon = header.querySelector('.sort-icon');
        currentIcon.className = `fas fa-sort-${isAscending ? 'up' : 'down'} text-primary ms-1 sort-icon`;
    }

    // Initialize product list functionality
    initializeProductListNavigation();
    initializeProductListPage();
    
    // Initialize common functionality for all pages
    initializeCommonFunctionality();
    
    // Common functionality for all pages
    function initializeCommonFunctionality() {
        // Ensure tooltips work on all pages
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(function (tooltipTriggerEl) {
                new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
        
        // Initialize all dropdowns
        if (typeof bootstrap !== 'undefined') {
            const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
            dropdownElementList.forEach(function (dropdownToggleEl) {
                new bootstrap.Dropdown(dropdownToggleEl);
            });
        }
        
        // Mobile menu improvements
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                    if (navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                }
            });
        }
    }
});
