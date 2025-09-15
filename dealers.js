/**
 * Enhanced Dealers Page Script with API Integration
 * Includes pagination, search, and dynamic content loading
 */

// API Configuration
const DealersAPI = {
  baseUrl: "https://api.vaatcobd.com/api",

  // Fetch dealers from API with optional search and pagination
  async getDealers(params = {}) {
    try {
      const searchParams = new URLSearchParams();

      // Add pagination parameters
      if (params.page) searchParams.append("page", params.page);
      if (params.limit) searchParams.append("limit", params.limit);

      // Add search parameter
      if (params.keyword && params.keyword.trim()) {
        searchParams.append("keyword", params.keyword.trim());
      }

      const url = `${this.baseUrl}/public/dealers${
        searchParams.toString() ? "?" + searchParams.toString() : ""
      }`;
      console.log("Fetching dealers from:", url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.status && data.data) {
        return {
          dealers: data.data,
          meta: data.meta || {},
          message: data.message,
        };
      }

      return { dealers: [], meta: {}, message: "No data available" };
    } catch (error) {
      console.error("Error fetching dealers:", error);
      throw error;
    }
  },
};

// Global state
let currentDealers = [];
let currentView = "grid";
let organizationMode = "mixed";
let currentPage = 1;
let totalPages = 1;
let currentSearchKeyword = "";
let isLoading = false;

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  loadDealersFromAPI(1); // Load first page
});

// Setup event listeners
function setupEventListeners() {
  // Search functionality with debouncing
  const searchInput = document.getElementById("dealerSearch");
  let searchTimeout;

  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearchKeyword = e.target.value;
        currentPage = 1; // Reset to first page on search
        loadDealersFromAPI(currentPage, currentSearchKeyword);
      }, 500); // 500ms debounce
    });
  }

  // Clear search
  const clearSearchBtn = document.getElementById("clearSearch");
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", clearSearch);
  }

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", handleFilter);
  });

  // View toggle
  const gridViewBtn = document.getElementById("gridView");
  const listViewBtn = document.getElementById("listView");

  if (gridViewBtn)
    gridViewBtn.addEventListener("click", () => toggleView("grid"));
  if (listViewBtn)
    listViewBtn.addEventListener("click", () => toggleView("list"));

  // Organization mode toggle
  document
    .querySelectorAll('input[name="organizationMode"]')
    .forEach((radio) => {
      radio.addEventListener("change", handleOrganizationChange);
    });
}

// Load dealers from API
async function loadDealersFromAPI(page = 1, keyword = "") {
  if (isLoading) return;

  isLoading = true;
  showLoadingState();

  try {
    const params = {
      page: page,
      limit: 20, // Adjust as needed
    };

    if (keyword) {
      params.keyword = keyword;
    }

    const response = await DealersAPI.getDealers(params);

    currentDealers = response.dealers;
    currentPage = page;

    // Update pagination info from API response
    if (response.meta && response.meta.pagination) {
      const pagination = response.meta.pagination;
      totalPages =
        Math.ceil(pagination.totalItems / pagination.itemsPerPage) || 1;
      updatePaginationInfo(pagination);
    }

    displayDealers(currentDealers);
    updateStats();
    updateFilterButtons();
    updatePaginationControls();
    hideLoadingState();
  } catch (error) {
    console.error("Error loading dealers:", error);
    showErrorState();
  } finally {
    isLoading = false;
  }
}

// Show loading state
function showLoadingState() {
  const dealersGrid = document.getElementById("dealersGrid");
  const dealersGrouped = document.getElementById("dealersGrouped");
  const loadingMessage = document.getElementById("loadingMessage");
  const noResults = document.getElementById("noDealersMessage");

  if (dealersGrid) dealersGrid.innerHTML = "";
  if (dealersGrouped) dealersGrouped.innerHTML = "";
  if (noResults) noResults.classList.add("d-none");
  if (loadingMessage) loadingMessage.classList.remove("d-none");
}

// Hide loading state
function hideLoadingState() {
  const loadingMessage = document.getElementById("loadingMessage");
  if (loadingMessage) loadingMessage.classList.add("d-none");
}

// Show error state
function showErrorState() {
  const dealersGrid = document.getElementById("dealersGrid");
  const dealersGrouped = document.getElementById("dealersGrouped");
  const loadingMessage = document.getElementById("loadingMessage");

  hideLoadingState();

  const errorHTML = `
        <div class="col-12 text-center py-5">
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h5>Unable to Load Dealers</h5>
                <p>There was an error connecting to our servers. Please check your internet connection and try again.</p>
                <button onclick="retryLoadDealers()" class="btn btn-primary mt-3">
                    <i class="fas fa-refresh me-2"></i>Try Again
                </button>
            </div>
        </div>
    `;

  if (organizationMode === "grouped") {
    if (dealersGrouped) dealersGrouped.innerHTML = errorHTML;
  } else {
    if (dealersGrid) dealersGrid.innerHTML = errorHTML;
  }
}

// Retry loading dealers
function retryLoadDealers() {
  loadDealersFromAPI(currentPage, currentSearchKeyword);
}

// Handle search
function handleSearch(event) {
  const query = event.target.value.toLowerCase().trim();
  currentSearchKeyword = query;
  currentPage = 1;
  loadDealersFromAPI(currentPage, query);
}

// Handle filter by district
function handleFilter(event) {
  const filter = event.target.dataset.filter;

  // Update active filter button
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  // Set search keyword based on filter
  if (filter === "all") {
    currentSearchKeyword = "";
  } else {
    currentSearchKeyword = filter; // Use district name as search keyword
  }

  currentPage = 1;
  loadDealersFromAPI(currentPage, currentSearchKeyword);

  // Update search input to reflect filter
  const searchInput = document.getElementById("dealerSearch");
  if (searchInput) {
    searchInput.value = filter === "all" ? "" : filter;
  }
}

// Display dealers
function displayDealers(dealers) {
  const grid = document.getElementById("dealersGrid");
  const groupedContainer = document.getElementById("dealersGrouped");
  const noResults = document.getElementById("noDealersMessage");

  if (dealers.length === 0) {
    if (grid) grid.innerHTML = "";
    if (groupedContainer) groupedContainer.innerHTML = "";
    if (noResults) noResults.classList.remove("d-none");
    return;
  }

  if (noResults) noResults.classList.add("d-none");

  if (organizationMode === "grouped") {
    displayGroupedDealers(dealers);
  } else {
    displayMixedDealers(dealers);
  }
}

// Display dealers in mixed view
function displayMixedDealers(dealers) {
  const grid = document.getElementById("dealersGrid");
  const groupedContainer = document.getElementById("dealersGrouped");

  if (grid) grid.classList.remove("d-none");
  if (groupedContainer) groupedContainer.classList.add("d-none");

  const dealersHTML = dealers
    .map((dealer) => generateDealerCard(dealer))
    .join("");
  if (grid) grid.innerHTML = dealersHTML;
}

// Display dealers grouped by district
function displayGroupedDealers(dealers) {
  const grid = document.getElementById("dealersGrid");
  const groupedContainer = document.getElementById("dealersGrouped");

  if (grid) grid.classList.add("d-none");
  if (groupedContainer) groupedContainer.classList.remove("d-none");

  // Group dealers by district
  const groupedDealers = dealers.reduce((groups, dealer) => {
    const district = dealer.district;
    if (!groups[district]) {
      groups[district] = [];
    }
    groups[district].push(dealer);
    return groups;
  }, {});

  // Sort districts alphabetically
  const sortedDistricts = Object.keys(groupedDealers).sort();

  const groupedHTML = sortedDistricts
    .map((district) => {
      const districtDealers = groupedDealers[district];
      const dealersHTML = districtDealers
        .map((dealer) => generateDealerCard(dealer, true))
        .join("");

      return `
            <div class="district-group">
                <div class="district-group-header">
                    <h3 class="district-group-title">
                        <i class="fas fa-map-marker-alt"></i>
                        ${district}
                    </h3>
                    <span class="district-group-count">${
                      districtDealers.length
                    } dealer${districtDealers.length > 1 ? "s" : ""}</span>
                </div>
                <div class="district-dealers-grid">
                    ${dealersHTML}
                </div>
            </div>
        `;
    })
    .join("");

  if (groupedContainer) groupedContainer.innerHTML = groupedHTML;
}

// Generate individual dealer card
function generateDealerCard(dealer, isGrouped = false) {
  // Handle different field names from API
  const dealerName = dealer.name || dealer.ownerName || "N/A";
  const shopName = dealer.shop || dealer.shopName || "N/A";
  const contactNumber = dealer.contact || dealer.phone || "";
  const dealerLocation = dealer.location || "N/A";
  const dealerDistrict = dealer.district || "N/A";

  // Clean phone number for WhatsApp
  const cleanContact = contactNumber.replace(/\D/g, "");
  const whatsappLink = cleanContact
    ? `https://wa.me/88${
        cleanContact.startsWith("0") ? cleanContact.slice(1) : cleanContact
      }`
    : "#";

  // Generate map link
  const locationLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dealerLocation + ", " + dealerDistrict + ", Bangladesh"
  )}`;

  if (currentView === "list" && !isGrouped) {
    return `
            <div class="col-12 mb-3">
                <div class="dealer-card" style="border-radius: 10px;">
                    <div class="row no-gutters">
                        <div class="col-md-3">
                            <div class="dealer-card-header" style="height: 100%; border-radius: 10px 0 0 10px;">
                                <div class="dealer-district">${dealerDistrict}</div>
                                ${
                                  dealer.isFeatured
                                    ? '<div class="dealer-badge">Featured</div>'
                                    : ""
                                }
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="dealer-card-body" style="text-align: left;">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="dealer-name">${dealerName}</div>
                                        <div class="dealer-shop">${shopName}</div>
                                        ${
                                          dealer.rating
                                            ? `<div class="dealer-rating">${"★".repeat(
                                                dealer.rating
                                              )} (${dealer.rating}/5)</div>`
                                            : ""
                                        }
                                    </div>
                                    <div class="col-md-6">
                                        <div class="dealer-info-item">
                                            <i class="fas fa-map-marker-alt"></i>
                                            <span>${dealerLocation}</span>
                                        </div>
                                        <div class="dealer-info-item">
                                            <i class="fas fa-phone"></i>
                                            <a href="tel:${contactNumber}" class="dealer-phone-link">${contactNumber}</a>
                                        </div>
                                        <div class="mt-2">
                                            <a href="#" class="dealer-location-btn" data-map-url="${locationLink}">
                                                <i class="fas fa-map"></i> <span data-i18n="dealer.mapBtn">View on Map</span>
                                            </a>
                                            ${
                                              cleanContact
                                                ? `<a href="${whatsappLink}" target="_blank" class="dealer-contact-btn ms-2">
                                                <i class="fab fa-whatsapp"></i> WhatsApp
                                            </a>`
                                                : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  } else {
    // Grid view (including grouped view)
    const containerClass = isGrouped ? "" : "col-lg-4 col-md-6 mb-4";
    const cardContent = `
            <div class="dealer-card">
                ${
                  !isGrouped
                    ? `<div class="dealer-card-header">
                    <div class="dealer-district">${dealerDistrict}</div>
                    ${
                      dealer.isFeatured
                        ? '<div class="dealer-badge">Featured</div>'
                        : ""
                    }
                </div>`
                    : ""
                }
                <div class="dealer-card-body">
                    <div class="dealer-name">${dealerName}</div>
                    <div class="dealer-shop">${shopName}</div>
                    
                    ${
                      dealer.rating
                        ? `<div class="dealer-rating">${"★".repeat(
                            dealer.rating
                          )} (${dealer.rating}/5)</div>`
                        : ""
                    }
                    
                    <div class="dealer-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${dealerLocation}</span>
                    </div>
                    
                    <div class="dealer-info-item">
                        <i class="fas fa-phone"></i>
                        <a href="tel:${contactNumber}" class="dealer-phone-link">${contactNumber}</a>
                    </div>
                    
                    <div class="mt-3">
                        <a href="#" class="dealer-location-btn" data-map-url="${locationLink}">
                            <i class="fas fa-map"></i>
                            <span data-i18n="dealer.mapBtn">View on Map</span>
                        </a>
                        ${
                          cleanContact
                            ? `<a href="${whatsappLink}" target="_blank" class="dealer-contact-btn ms-2">
                            <i class="fab fa-whatsapp"></i> WhatsApp
                        </a>`
                            : ""
                        }
                    </div>
                </div>
            </div>
        `;

    return isGrouped
      ? cardContent
      : `<div class="${containerClass}">${cardContent}</div>`;
  }
}

// Handle organization mode change
function handleOrganizationChange(event) {
  organizationMode = event.target.value;

  // Disable list view in grouped mode
  const listViewBtn = document.getElementById("listView");
  const gridViewBtn = document.getElementById("gridView");

  if (organizationMode === "grouped") {
    if (listViewBtn) {
      listViewBtn.disabled = true;
      listViewBtn.classList.add("disabled");
    }
    if (currentView === "list") {
      currentView = "grid";
      if (gridViewBtn) gridViewBtn.classList.add("active");
      if (listViewBtn) listViewBtn.classList.remove("active");
    }
  } else {
    if (listViewBtn) {
      listViewBtn.disabled = false;
      listViewBtn.classList.remove("disabled");
    }
  }

  displayDealers(currentDealers);
}

// Toggle view
function toggleView(view) {
  currentView = view;

  // Update buttons
  const gridViewBtn = document.getElementById("gridView");
  const listViewBtn = document.getElementById("listView");

  if (gridViewBtn) gridViewBtn.classList.toggle("active", view === "grid");
  if (listViewBtn) listViewBtn.classList.toggle("active", view === "list");

  // Redisplay dealers
  displayDealers(currentDealers);
}

// Update stats
function updateStats() {
  const resultsCount = document.getElementById("resultsCount");
  const totalCount = document.getElementById("totalCount");
  const totalDealers = document.getElementById("totalDealers");

  if (resultsCount) resultsCount.textContent = currentDealers.length;
  if (totalCount) totalCount.textContent = currentDealers.length; // This could be total from API
  if (totalDealers) totalDealers.textContent = currentDealers.length;

  // Update unique districts count
  const uniqueDistricts = [...new Set(currentDealers.map((d) => d.district))]
    .length;
  const totalDistricts = document.getElementById("totalDistricts");
  if (totalDistricts) totalDistricts.textContent = uniqueDistricts;
}

// Update filter buttons (simplified for API integration)
function updateFilterButtons() {
  // For API integration, we'll keep the filter buttons but they'll work as search filters
  // The districts will be dynamically determined by the search results
}

// Update pagination controls
function updatePaginationControls() {
  // Create or update pagination controls
  createPaginationControls();
}

// Create pagination controls
function createPaginationControls() {
  const paginationContainer =
    document.querySelector(".pagination-container") ||
    createPaginationContainer();

  if (totalPages <= 1) {
    paginationContainer.style.display = "none";
    return;
  }

  paginationContainer.style.display = "block";

  let paginationHTML =
    '<nav aria-label="Dealers pagination"><ul class="pagination justify-content-center">';

  // Previous button
  if (currentPage > 1) {
    paginationHTML += `
            <li class="page-item">
                <button class="page-link" onclick="changePage(${
                  currentPage - 1
                })">
                    <i class="fas fa-chevron-left"></i> Previous
                </button>
            </li>
        `;
  }

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `<li class="page-item"><button class="page-link" onclick="changePage(1)">1</button></li>`;
    if (startPage > 2) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <button class="page-link" onclick="changePage(${i})">${i}</button>
            </li>
        `;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    paginationHTML += `<li class="page-item"><button class="page-link" onclick="changePage(${totalPages})">${totalPages}</button></li>`;
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `
            <li class="page-item">
                <button class="page-link" onclick="changePage(${
                  currentPage + 1
                })">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </li>
        `;
  }

  paginationHTML += "</ul></nav>";
  paginationContainer.innerHTML = paginationHTML;
}

// Create pagination container if it doesn't exist
function createPaginationContainer() {
  const container = document.createElement("div");
  container.className = "pagination-container mt-4";

  const dealersSection = document.querySelector(".dealers-section .container");
  if (dealersSection) {
    dealersSection.appendChild(container);
  }

  return container;
}

// Change page
function changePage(page) {
  if (page < 1 || page > totalPages || page === currentPage || isLoading)
    return;

  currentPage = page;
  loadDealersFromAPI(currentPage, currentSearchKeyword);

  // Scroll to top of dealers section
  const dealersSection = document.querySelector(".dealers-section");
  if (dealersSection) {
    dealersSection.scrollIntoView({ behavior: "smooth" });
  }
}

// Update pagination info
function updatePaginationInfo(pagination) {
  // Update any pagination info displays
  console.log("Pagination info:", pagination);
}

// Clear search
function clearSearch() {
  const searchInput = document.getElementById("dealerSearch");
  if (searchInput) searchInput.value = "";

  // Clear active filter
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const allButton = document.querySelector('[data-filter="all"]');
  if (allButton) allButton.classList.add("active");

  currentSearchKeyword = "";
  currentPage = 1;
  loadDealersFromAPI(currentPage, "");
}

// Clear all filters
function clearAllFilters() {
  clearSearch();
}

// CSS for additional styling (add to your existing CSS)
const additionalCSS = `
.dealer-badge {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    position: absolute;
    top: 10px;
    right: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.dealer-rating {
    color: #ffc107;
    font-size: 0.9rem;
    margin: 5px 0;
}

.pagination-container {
    margin-top: 2rem;
}

.pagination .page-link {
    color: var(--primary-color);
    border-color: #dee2e6;
    padding: 0.75rem 1rem;
}

.pagination .page-item.active .page-link {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.pagination .page-link:hover {
    background-color: #f8f9fa;
    border-color: var(--primary-color);
    color: var(--primary-color);
}
`;

// Add CSS to document
if (!document.getElementById("dealers-api-styles")) {
  const style = document.createElement("style");
  style.id = "dealers-api-styles";
  style.textContent = additionalCSS;
  document.head.appendChild(style);
}
