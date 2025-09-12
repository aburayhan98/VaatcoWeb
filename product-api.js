/**
 * Product API Manager and Full-Screen Image Viewer
 * Complete standalone JavaScript file for product management
 */

// Product API and Management
class ProductManager {
  constructor() {
    this.apiUrl = "https://api.vaatcobd.com/api/public/products";
    this.currentPage = 1;
    this.searchQuery = "";
    this.loading = false;
    this.products = [];
    this.pagination = {};

    this.initializeElements();
    this.bindEvents();
    this.loadProducts();
  }

  initializeElements() {
    this.searchInput = document.getElementById("productSearchInput");
    this.clearBtn = document.getElementById("clearSearchBtn");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.loadingContainer = document.getElementById("loadingContainer");
    this.productsGrid = document.getElementById("productsGrid");
    this.emptyState = document.getElementById("emptyState");
    this.paginationContainer = document.getElementById("paginationContainer");
    this.resultsInfo = document.getElementById("resultsInfo");
    this.resultsText = document.getElementById("resultsText");
  }

  bindEvents() {
    let searchTimeout;

    if (this.searchInput) {
      this.searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          this.handleSearch();
        }, 500);
      });

      this.searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          clearTimeout(searchTimeout);
          this.handleSearch();
        }
      });
    }

    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => {
        this.clearSearch();
      });
    }

    if (this.refreshBtn) {
      this.refreshBtn.addEventListener("click", () => {
        this.refreshProducts();
      });
    }
  }

  async loadProducts() {
    if (this.loading) return;

    this.loading = true;
    this.showLoading();

    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        limit: 12,
      });

      if (this.searchQuery) {
        params.append("search", this.searchQuery);
      }

      const response = await fetch(`${this.apiUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status && data.data) {
        this.products = data.data;
        this.pagination = data.meta?.pagination || {};
        this.renderProducts();
        this.updatePagination();
        this.updateResultsInfo();
      } else {
        throw new Error(data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
      this.showError("Failed to load products. Please try again later.");
    } finally {
      this.loading = false;
      this.hideLoading();
    }
  }

  handleSearch() {
    const newQuery = this.searchInput?.value.trim() || "";
    if (newQuery !== this.searchQuery) {
      this.searchQuery = newQuery;
      this.currentPage = 1;
      this.loadProducts();
    }
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = "";
    }
    this.searchQuery = "";
    this.currentPage = 1;
    this.loadProducts();
  }

  refreshProducts() {
    this.currentPage = 1;
    this.loadProducts();
  }

  renderProducts() {
    if (!this.products || this.products.length === 0) {
      this.showEmptyState();
      return;
    }

    const html = this.products
      .map((product) => this.createProductCard(product))
      .join("");

    if (this.productsGrid) {
      this.productsGrid.innerHTML = html;
      this.productsGrid.style.display = "grid";
    }

    if (this.emptyState) {
      this.emptyState.style.display = "none";
    }
  }

  createProductCard(product) {
    const firstImage =
      product.images && product.images.length > 0 ? product.images[0] : null;
    const productName = this.escapeHtml(product.name || "Unnamed Product");
    const shortDescription = this.escapeHtml(product.shortDescription || "");

    return `
            <div class="product-card" data-product-id="${product._id}">
                <div class="product-image-container">
                    ${
                      firstImage
                        ? `<img src="${firstImage}" alt="${productName}" class="product-image" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" 
                             loading="lazy">
                         <div class="product-image-placeholder" style="display: none;">
                             <i class="fas fa-image"></i>
                         </div>`
                        : `<div class="product-image-placeholder">
                             <i class="fas fa-image"></i>
                         </div>`
                    }
                </div>
                <div class="product-content">
                    <h3 class="product-name" title="${productName}">${productName}</h3>
                    ${
                      shortDescription
                        ? `<p class="product-description" title="${shortDescription}">${shortDescription}</p>`
                        : ""
                    }
                    <div class="product-actions">
                        <button class="btn btn-view-details" onclick="productManager.showProductDetails('${
                          product._id
                        }')">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  showProductDetails(productId) {
    const product = this.products.find((p) => p._id === productId);
    if (!product) return;

    const productName = this.escapeHtml(product.name || "Unnamed Product");
    let html = `
            <div class="product-details-content">
                <h4 class="mb-3 text-primary">
                    <i class="fas fa-box me-2"></i>${productName}
                </h4>
        `;

    // Product images
    if (product.images && product.images.length > 0) {
      html += `<div class="product-images-container mb-4">`;
      product.images.forEach((image, index) => {
        html += `
                    <div class="product-image-wrapper d-inline-block me-3 mb-3">
                        <img src="${image}" alt="${productName} - Image ${
          index + 1
        }" 
                             class="product-detail-image img-thumbnail" 
                             style="max-width: 200px; max-height: 200px; object-fit: cover; cursor: pointer;"
                             onclick="openFullScreenImage('${image}', '${productName}')"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="text-center text-muted p-2 border rounded" style="display: none; max-width: 200px;">
                            <i class="fas fa-image fa-2x mb-2"></i>
                            <p class="mb-0 small">Image not available</p>
                        </div>
                    </div>
                `;
      });
      html += `</div>`;
    }

    // Product details - Show shortDescription first, then full description
    if (product.shortDescription) {
      html += `<div class="mb-3"><strong>Summary:</strong><br>${this.escapeHtml(
        product.shortDescription
      )}</div>`;
    }

    if (
      product.description &&
      product.description !== product.shortDescription
    ) {
      html += `<div class="mb-3"><strong>Full Description:</strong><br>${this.escapeHtml(
        product.description
      ).replace(/\n/g, "<br>")}</div>`;
    }

    // Additional info
    html += `
            <div class="row mt-4">
                <div class="col-md-6">
                    <p><strong>Product ID:</strong> ${this.escapeHtml(
                      product._id
                    )}</p>
                    ${
                      product.slug
                        ? `<p><strong>Slug:</strong> ${this.escapeHtml(
                            product.slug
                          )}</p>`
                        : ""
                    }
                </div>
                <div class="col-md-6">
                    <p><strong>Status:</strong> <span class="badge ${
                      product.isActive ? "bg-success" : "bg-secondary"
                    }">${product.isActive ? "Active" : "Inactive"}</span></p>
                    <p><strong>Featured:</strong> <span class="badge ${
                      product.isFeatured ? "bg-primary" : "bg-secondary"
                    }">${product.isFeatured ? "Yes" : "No"}</span></p>
                </div>
            </div>
        `;

    if (product.createdAt) {
      const createdDate = new Date(product.createdAt).toLocaleDateString();
      html += `<p class="text-muted small mt-3">Created: ${createdDate}</p>`;
    }

    html += `</div>`;

    const modalBody = document.getElementById("productDetailsBody");
    if (modalBody) {
      modalBody.innerHTML = html;
      const modal = new bootstrap.Modal(
        document.getElementById("productDetailsModal")
      );
      modal.show();
    }
  }

  updatePagination() {
    const { currentPage, hasNext, hasPrev } = this.pagination;

    if (!currentPage || (currentPage === 1 && !hasNext)) {
      if (this.paginationContainer) {
        this.paginationContainer.style.display = "none";
      }
      return;
    }

    const paginationList = document.getElementById("paginationList");
    if (!paginationList) return;

    let html = "";

    // Previous button
    html += `
            <li class="page-item ${!hasPrev ? "disabled" : ""}">
                <a class="page-link" href="#" ${
                  hasPrev
                    ? `onclick="productManager.goToPage(${
                        currentPage - 1
                      }); return false;"`
                    : 'onclick="return false;"'
                }>
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;

    // Current page and next/prev pages
    const startPage = Math.max(1, currentPage - 1);
    const endPage = hasNext ? currentPage + 1 : currentPage;

    for (let i = startPage; i <= endPage; i++) {
      html += `
                <li class="page-item ${i === currentPage ? "active" : ""}">
                    <a class="page-link" href="#" onclick="productManager.goToPage(${i}); return false;">${i}</a>
                </li>
            `;
    }

    if (hasNext) {
      html += `
                <li class="page-item">
                    <a class="page-link" href="#" onclick="productManager.goToPage(${
                      currentPage + 1
                    }); return false;">
                        <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            `;
    }

    paginationList.innerHTML = html;
    if (this.paginationContainer) {
      this.paginationContainer.style.display = "flex";
    }
  }

  goToPage(page) {
    if (page < 1 || page === this.currentPage || this.loading) return;

    this.currentPage = page;
    this.loadProducts();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  updateResultsInfo() {
    if (!this.resultsText || !this.resultsInfo) return;

    if (this.products.length === 0) {
      this.resultsInfo.style.display = "none";
      return;
    }

    let text = "";
    const { currentPage } = this.pagination;

    if (this.searchQuery) {
      text = `Found ${this.products.length} product${
        this.products.length !== 1 ? "s" : ""
      } for "${this.searchQuery}"`;
    } else {
      text = `Showing ${this.products.length} product${
        this.products.length !== 1 ? "s" : ""
      }`;
    }

    if (currentPage && currentPage > 1) {
      text += ` (Page ${currentPage})`;
    }

    this.resultsText.textContent = text;
    this.resultsInfo.style.display = "block";
  }

  showLoading() {
    if (this.loadingContainer) {
      this.loadingContainer.style.display = "flex";
    }
    this.hideContent();
  }

  hideLoading() {
    if (this.loadingContainer) {
      this.loadingContainer.style.display = "none";
    }
  }

  showEmptyState() {
    if (this.emptyState) {
      this.emptyState.style.display = "block";
    }
    this.hideContent(false);
  }

  hideContent(hidePagination = true) {
    if (this.productsGrid) {
      this.productsGrid.style.display = "none";
    }
    if (this.emptyState) {
      this.emptyState.style.display = "none";
    }
    if (hidePagination && this.paginationContainer) {
      this.paginationContainer.style.display = "none";
    }
    if (this.resultsInfo) {
      this.resultsInfo.style.display = "none";
    }
  }

  showError(message) {
    const errorHtml = `
            <i class="fas fa-exclamation-triangle text-warning"></i>
            <h4>Error Loading Products</h4>
            <p>${this.escapeHtml(message)}</p>
            <button class="btn btn-primary" onclick="productManager.refreshProducts()">
                <i class="fas fa-refresh me-2"></i>Try Again
            </button>
        `;

    if (this.emptyState) {
      this.emptyState.innerHTML = errorHtml;
      this.showEmptyState();
    }
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Full Screen Image Functionality
function openFullScreenImage(imageSrc, productName) {
  // Remove existing overlay if present
  const existingOverlay = document.getElementById("fullScreenImageOverlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Create new overlay
  const overlay = document.createElement("div");
  overlay.id = "fullScreenImageOverlay";
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;

  overlay.innerHTML = `
        <div style="position: relative; width: 90%; height: 90%; display: flex; justify-content: center; align-items: center;">
            <button onclick="closeFullScreenImage()" style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                color: white;
                font-size: 20px;
                cursor: pointer;
                z-index: 10001;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                <i class="fas fa-times"></i>
            </button>
            
            <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;">
                <img src="${imageSrc}" alt="${productName}" style="
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    user-select: none;
                    transition: transform 0.3s ease;
                    cursor: grab;
                " id="fullScreenImage" onmousedown="startImageDrag(event)" draggable="false">
            </div>
            
            <div style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                z-index: 10001;
            ">
                <button onclick="zoomFullScreenImage('in')" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                    <i class="fas fa-search-plus"></i>
                </button>
                <button onclick="resetFullScreenImageZoom()" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                    <i class="fas fa-expand-arrows-alt"></i>
                </button>
                <button onclick="zoomFullScreenImage('out')" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
                    <i class="fas fa-search-minus"></i>
                </button>
            </div>
        </div>
    `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  // Click outside to close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeFullScreenImage();
    }
  });

  // Keyboard support
  const keyHandler = (e) => {
    if (e.key === "Escape") {
      closeFullScreenImage();
    } else if (e.key === "+" || e.key === "=") {
      zoomFullScreenImage("in");
    } else if (e.key === "-") {
      zoomFullScreenImage("out");
    } else if (e.key === "0") {
      resetFullScreenImageZoom();
    }
  };

  document.addEventListener("keydown", keyHandler);

  // Initialize zoom variables
  window.currentImageZoom = 1;
  window.currentImageTranslateX = 0;
  window.currentImageTranslateY = 0;
  window.imageKeyHandler = keyHandler;
}

function closeFullScreenImage() {
  const overlay = document.getElementById("fullScreenImageOverlay");
  if (overlay) {
    overlay.remove();
    document.body.style.overflow = "";
    if (window.imageKeyHandler) {
      document.removeEventListener("keydown", window.imageKeyHandler);
    }
  }
}

function zoomFullScreenImage(direction) {
  const img = document.getElementById("fullScreenImage");
  if (!img) return;

  if (direction === "in") {
    window.currentImageZoom = Math.min(window.currentImageZoom * 1.2, 5);
  } else if (direction === "out") {
    window.currentImageZoom = Math.max(window.currentImageZoom / 1.2, 0.1);
  }

  img.style.transform = `scale(${window.currentImageZoom}) translate(${window.currentImageTranslateX}px, ${window.currentImageTranslateY}px)`;
}

function resetFullScreenImageZoom() {
  const img = document.getElementById("fullScreenImage");
  if (img) {
    window.currentImageZoom = 1;
    window.currentImageTranslateX = 0;
    window.currentImageTranslateY = 0;
    img.style.transform = "scale(1) translate(0px, 0px)";
  }
}

// Image dragging functionality
let isDragging = false;
let dragStartX, dragStartY;
let initialTranslateX, initialTranslateY;

function startImageDrag(e) {
  const img = document.getElementById("fullScreenImage");
  if (!img) return;

  isDragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  initialTranslateX = window.currentImageTranslateX;
  initialTranslateY = window.currentImageTranslateY;

  img.style.cursor = "grabbing";
  e.preventDefault();
}

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const deltaX = (e.clientX - dragStartX) / window.currentImageZoom;
  const deltaY = (e.clientY - dragStartY) / window.currentImageZoom;

  window.currentImageTranslateX = initialTranslateX + deltaX;
  window.currentImageTranslateY = initialTranslateY + deltaY;

  const img = document.getElementById("fullScreenImage");
  if (img) {
    img.style.transform = `scale(${window.currentImageZoom}) translate(${window.currentImageTranslateX}px, ${window.currentImageTranslateY}px)`;
  }
});

document.addEventListener("mouseup", () => {
  const img = document.getElementById("fullScreenImage");
  if (img) {
    img.style.cursor = "grab";
  }
  isDragging = false;
});

// Touch support for mobile devices
document.addEventListener("touchstart", (e) => {
  if (!document.getElementById("fullScreenImage")) return;

  if (e.touches.length === 1) {
    const img = document.getElementById("fullScreenImage");
    if (e.target === img) {
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      initialTranslateX = window.currentImageTranslateX;
      initialTranslateY = window.currentImageTranslateY;
    }
  }
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging || e.touches.length !== 1) return;
  e.preventDefault();

  const deltaX = (e.touches[0].clientX - dragStartX) / window.currentImageZoom;
  const deltaY = (e.touches[0].clientY - dragStartY) / window.currentImageZoom;

  window.currentImageTranslateX = initialTranslateX + deltaX;
  window.currentImageTranslateY = initialTranslateY + deltaY;

  const img = document.getElementById("fullScreenImage");
  if (img) {
    img.style.transform = `scale(${window.currentImageZoom}) translate(${window.currentImageTranslateX}px, ${window.currentImageTranslateY}px)`;
  }
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

// Initialize ProductManager when DOM is loaded
let productManager;
document.addEventListener("DOMContentLoaded", function () {
  productManager = new ProductManager();
});

// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ProductManager };
}
