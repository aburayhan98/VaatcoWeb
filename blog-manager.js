/**
 * Blog Manager - Complete blog management system for VAATCO Blog
 */

class BlogManager {
  constructor() {
    this.apiUrl = "https://vaatcobd-1e79cdd06ca7.herokuapp.com/api/public/blogs";
    this.currentPage = 1;
    this.searchQuery = "";
    this.sortBy = "publishDate";
    this.sortOrder = "desc";
    this.featuredFilter = "";
    this.selectedTags = [];
    this.loading = false;
    this.blogs = [];
    this.featuredBlogs = [];
    this.pagination = {};
    this.allTags = [];

    this.initializeElements();
    this.bindEvents();
    this.loadBlogs();
  }

  initializeElements() {
    // Search and filter elements
    this.searchInput = document.getElementById("blogSearchInput");
    this.clearSearchBtn = document.getElementById("clearSearchBtn");
    this.sortSelect = document.getElementById("sortSelect");
    this.featuredSelect = document.getElementById("featuredSelect");
    this.refreshBtn = document.getElementById("refreshBtn");
    this.tagsContainer = document.getElementById("tagsContainer");
    this.tagsRow = document.getElementById("tagsRow");

    // Content elements
    this.loadingContainer = document.getElementById("blogLoadingContainer");
    this.blogGrid = document.getElementById("blogGrid");
    this.blogGridContainer = document.getElementById("blogGridContainer");
    this.emptyState = document.getElementById("blogEmptyState");
    this.paginationContainer = document.getElementById(
      "blogPaginationContainer"
    );
    this.paginationList = document.getElementById("blogPaginationList");
    this.resultsInfo = document.getElementById("blogResultsInfo");
    this.resultsText = document.getElementById("blogResultsText");
    this.sectionTitle = document.getElementById("blogSectionTitle");
  }

  bindEvents() {
    let searchTimeout;

    // Search input
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

    // Clear search button
    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener("click", () => {
        this.clearSearch();
      });
    }

    // Sort select
    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", () => {
        this.handleSortChange();
      });
    }

    // Featured filter
    if (this.featuredSelect) {
      this.featuredSelect.addEventListener("change", () => {
        this.handleFeaturedFilter();
      });
    }

    // Refresh button
    if (this.refreshBtn) {
      this.refreshBtn.addEventListener("click", () => {
        this.refreshBlogs();
      });
    }
  }

  async loadBlogs() {
    if (this.loading) return;

    this.loading = true;
    this.showLoading();

    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        limit: 12,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      });

      if (this.searchQuery) {
        params.append("search", this.searchQuery);
      }

      if (this.featuredFilter !== "") {
        params.append("featured", this.featuredFilter);
      }

      if (this.selectedTags.length > 0) {
        params.append("tags", this.selectedTags.join(","));
      }

      const response = await fetch(`${this.apiUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status && data.data) {
        this.blogs = data.data;
        this.pagination = data.meta?.pagination || {};

        // Extract all unique tags
        this.extractTags();

        this.renderBlogs();
        this.renderTags();
        this.updatePagination();
        this.updateResultsInfo();
        this.updateSectionTitle();
      } else {
        throw new Error(data.message || "Failed to load blogs");
      }
    } catch (error) {
      console.error("Error loading blogs:", error);
      this.showError("Failed to load blogs. Please try again later.");
    } finally {
      this.loading = false;
      this.hideLoading();
    }
  }

  extractTags() {
    const tagSet = new Set();
    this.blogs.forEach((blog) => {
      if (blog.tags && Array.isArray(blog.tags)) {
        blog.tags.forEach((tag) => tagSet.add(tag));
      }
    });
    this.allTags = Array.from(tagSet).sort();
  }

  renderTags() {
    if (!this.tagsContainer || this.allTags.length === 0) {
      if (this.tagsRow) this.tagsRow.style.display = "none";
      return;
    }

    if (this.tagsRow) this.tagsRow.style.display = "block";

    const html = this.allTags
      .map((tag) => {
        const isActive = this.selectedTags.includes(tag);
        return `
        <span class="filter-tag ${isActive ? "active" : ""}" 
              onclick="blogManager.toggleTag('${this.escapeHtml(tag)}')"
              title="Filter by ${this.escapeHtml(tag)}">
          ${this.escapeHtml(tag)}
        </span>
      `;
      })
      .join("");

    this.tagsContainer.innerHTML = html;
  }

  toggleTag(tag) {
    const index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(tag);
    }

    this.currentPage = 1;
    this.loadBlogs();
  }

  renderFeaturedBlogs() {
    if (
      !this.featuredBlogs ||
      this.featuredBlogs.length === 0 ||
      this.searchQuery ||
      this.featuredFilter === "false"
    ) {
      if (this.featuredSection) this.featuredSection.style.display = "none";
      return;
    }

    if (this.featuredSection) this.featuredSection.style.display = "block";

    const html = this.featuredBlogs
      .slice(0, 2)
      .map((blog) => {
        return this.createFeaturedBlogCard(blog);
      })
      .join("");

    if (this.featuredBlogs) {
      this.featuredBlogs.innerHTML = html;
    }
  }

  createFeaturedBlogCard(blog) {
    const publishDate = new Date(blog.publishDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const tags =
      blog.tags && blog.tags.length > 0
        ? blog.tags
            .map(
              (tag) => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`
            )
            .join("")
        : "";

    return `
      <div class="col-lg-6 mb-4">
        <div class="featured-blog-card">
          <div class="featured-blog-image">
            <img src="${blog.featuredImage}" alt="${this.escapeHtml(
      blog.title
    )}" 
                 class="img-fluid" style="width: 100%; height: 300px; object-fit: cover;"
                 onerror="this.src='https://via.placeholder.com/600x300/f8f9fa/6c757d?text=VAATCO+Blog'">
            <div class="blog-featured-badge">
              <i class="fas fa-star me-1"></i>Featured
            </div>
          </div>
          <div class="featured-blog-content">
            <div class="blog-meta mb-3">
              <div class="blog-meta-item">
                <i class="fas fa-calendar"></i>
                <span>${publishDate}</span>
              </div>
              
              <div class="blog-meta-item">
                <i class="fas fa-clock"></i>
                <span>${blog.readTime} min read</span>
              </div>
              <div class="blog-meta-item">
                <i class="fas fa-eye"></i>
                <span>${blog.views} views</span>
              </div>
            </div>
            <h3 class="featured-blog-title">${this.escapeHtml(blog.title)}</h3>
            <p class="featured-blog-excerpt">${this.escapeHtml(
              blog.excerpt
            )}</p>
            ${tags ? `<div class="blog-tags mb-3">${tags}</div>` : ""}
            <a href="blog-detail.html?slug=${blog.slug}" class="blog-read-btn">
              <i class="fas fa-arrow-right me-2"></i>Read Full Article
            </a>
          </div>
        </div>
      </div>
    `;
  }

  renderBlogs() {
    // Show all blogs without filtering out featured ones
    const allBlogs = this.blogs;

    if (allBlogs.length === 0) {
      this.showEmptyState();
      return;
    }

    const html = allBlogs.map((blog) => this.createBlogCard(blog)).join("");

    if (this.blogGrid) {
      this.blogGrid.innerHTML = html;
      this.blogGridContainer.style.display = "block";
    }

    if (this.emptyState) {
      this.emptyState.style.display = "none";
    }
  }

  createBlogCard(blog) {
    const publishDate = new Date(blog.publishDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const tags =
      blog.tags && blog.tags.length > 0
        ? blog.tags
            .map(
              (tag) => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`
            )
            .join("")
        : "";

    const featuredBadge = blog.isFeatured
      ? '<div class="blog-featured-badge"><i class="fas fa-star me-1"></i>Featured</div>'
      : "";

    return `
      <div class="blog-card">
        <div class="blog-card-image">
          <img src="${blog.featuredImage}" alt="${this.escapeHtml(blog.title)}"
               onerror="this.src='https://via.placeholder.com/400x200/f8f9fa/6c757d?text=VAATCO+Blog'">
          ${featuredBadge}
        </div>
        <div class="blog-card-content">
          <div class="blog-meta">
            <div class="blog-meta-item">
              <i class="fas fa-calendar"></i>
              <span>${publishDate}</span>
            </div>
            
            <div class="blog-meta-item">
              <i class="fas fa-clock"></i>
              <span>${blog.readTime} min</span>
            </div>
          </div>
          <h3 class="blog-title">${this.escapeHtml(blog.title)}</h3>
          <p class="blog-excerpt">${this.escapeHtml(blog.excerpt)}</p>
          ${tags ? `<div class="blog-tags">${tags}</div>` : ""}
          <div class="blog-card-footer">
            <a href="blog-detail.html?slug=${blog.slug}" class="blog-read-btn">
              <i class="fas fa-book-open me-1"></i>Read More
            </a>
            <div class="blog-views">
              <i class="fas fa-eye"></i>
              <span>${blog.views}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateSectionTitle() {
    if (!this.sectionTitle) return;

    let title = "All Articles";

    if (this.searchQuery) {
      title = `Search Results`;
    } else if (this.featuredFilter === "true") {
      title = "Featured Articles";
    } else if (this.featuredFilter === "false") {
      title = "Regular Articles";
    } else if (this.selectedTags.length > 0) {
      title = `Articles tagged: ${this.selectedTags.join(", ")}`;
    }

    this.sectionTitle.textContent = title;
  }

  updatePagination() {
    const { currentPage, hasNext, hasPrev, totalPages } = this.pagination;

    if (!currentPage || (currentPage === 1 && !hasNext)) {
      if (this.paginationContainer) {
        this.paginationContainer.style.display = "none";
      }
      return;
    }

    if (!this.paginationList) return;

    let html = "";

    // Previous button
    html += `
      <li class="page-item ${!hasPrev ? "disabled" : ""}">
        <a class="page-link" href="#" ${
          hasPrev
            ? `onclick="blogManager.goToPage(${
                currentPage - 1
              }); return false;"`
            : 'onclick="return false;"'
        }>
          <i class="fas fa-chevron-left"></i> Previous
        </a>
      </li>
    `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(
      totalPages || currentPage,
      startPage + maxVisiblePages - 1
    );

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis if needed
    if (startPage > 1) {
      html += `
        <li class="page-item">
          <a class="page-link" href="#" onclick="blogManager.goToPage(1); return false;">1</a>
        </li>
      `;
      if (startPage > 2) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      html += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" onclick="blogManager.goToPage(${i}); return false;">${i}</a>
        </li>
      `;
    }

    // Last page and ellipsis if needed
    if (endPage < (totalPages || currentPage)) {
      if (endPage < (totalPages || currentPage) - 1) {
        html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
      html += `
        <li class="page-item">
          <a class="page-link" href="#" onclick="blogManager.goToPage(${
            totalPages || currentPage
          }); return false;">${totalPages || currentPage}</a>
        </li>
      `;
    }

    // Next button
    if (hasNext) {
      html += `
        <li class="page-item">
          <a class="page-link" href="#" onclick="blogManager.goToPage(${
            currentPage + 1
          }); return false;">
            Next <i class="fas fa-chevron-right"></i>
          </a>
        </li>
      `;
    }

    this.paginationList.innerHTML = html;
    if (this.paginationContainer) {
      this.paginationContainer.style.display = "flex";
    }
  }

  goToPage(page) {
    if (page < 1 || page === this.currentPage || this.loading) return;

    this.currentPage = page;
    this.loadBlogs();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  updateResultsInfo() {
    if (!this.resultsText || !this.resultsInfo) return;

    const totalBlogs = this.blogs.length;

    if (totalBlogs === 0) {
      this.resultsInfo.style.display = "none";
      return;
    }

    let text = "";
    const { currentPage } = this.pagination;

    if (this.searchQuery) {
      text = `Found ${totalBlogs} blog${totalBlogs !== 1 ? "s" : ""} for "${
        this.searchQuery
      }"`;
    } else if (this.featuredFilter === "true") {
      text = `Showing ${totalBlogs} featured blog${
        totalBlogs !== 1 ? "s" : ""
      }`;
    } else if (this.selectedTags.length > 0) {
      text = `Found ${totalBlogs} blog${
        totalBlogs !== 1 ? "s" : ""
      } with selected tags`;
    } else {
      text = `Showing ${totalBlogs} blog${totalBlogs !== 1 ? "s" : ""}`;
    }

    if (currentPage && currentPage > 1) {
      text += ` - Page ${currentPage}`;
    }

    this.resultsText.textContent = text;
    this.resultsInfo.style.display = "block";
  }

  handleSearch() {
    const newQuery = this.searchInput?.value.trim() || "";
    if (newQuery !== this.searchQuery) {
      this.searchQuery = newQuery;
      this.currentPage = 1;
      this.loadBlogs();
    }
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = "";
    }
    this.searchQuery = "";
    this.currentPage = 1;
    this.loadBlogs();
  }

  handleSortChange() {
    const value = this.sortSelect?.value || "publishDate";
    this.sortBy = value;

    // Adjust sort order based on selection
    if (value === "title") {
      this.sortOrder = "asc";
    } else {
      this.sortOrder = "desc";
    }

    this.currentPage = 1;
    this.loadBlogs();
  }

  handleFeaturedFilter() {
    this.featuredFilter = this.featuredSelect?.value || "";
    this.currentPage = 1;
    this.loadBlogs();
  }

  refreshBlogs() {
    this.currentPage = 1;
    this.loadBlogs();
  }

  clearAllFilters() {
    if (this.searchInput) this.searchInput.value = "";
    if (this.sortSelect) this.sortSelect.value = "publishDate";
    if (this.featuredSelect) this.featuredSelect.value = "";

    this.searchQuery = "";
    this.sortBy = "publishDate";
    this.sortOrder = "desc";
    this.featuredFilter = "";
    this.selectedTags = [];
    this.currentPage = 1;

    this.loadBlogs();
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
    if (this.blogGridContainer) {
      this.blogGridContainer.style.display = "none";
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
      <i class="fas fa-exclamation-triangle text-warning fa-4x mb-3"></i>
      <h4>Error Loading Blogs</h4>
      <p>${this.escapeHtml(message)}</p>
      <button class="btn btn-primary" onclick="blogManager.refreshBlogs()">
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

// Initialize BlogManager when DOM is loaded
let blogManager;
document.addEventListener("DOMContentLoaded", function () {
  blogManager = new BlogManager();
});

// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BlogManager };
}
