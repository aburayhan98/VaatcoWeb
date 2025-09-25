/**
 * Blog Detail Manager - Handles individual blog post display
 */

class BlogDetailManager {
  constructor() {
    this.apiUrl = "https://api.vaatcobd.com/api/public/blogs";
    this.blogSlug = this.getSlugFromUrl();
    this.currentBlog = null;
    this.relatedBlogs = [];

    this.initializeElements();
    this.loadBlogDetail();
  }

  initializeElements() {
    // Loading and error states
    this.loadingContainer = document.getElementById("loadingContainer");
    this.errorContainer = document.getElementById("errorContainer");
    this.blogContent = document.getElementById("blogContent");

    // Blog content elements
    this.blogHeader = document.getElementById("blogHeader");
    this.blogMeta = document.getElementById("blogMeta");
    this.blogTitle = document.getElementById("blogTitle");
    this.blogExcerpt = document.getElementById("blogExcerpt");
    this.blogTags = document.getElementById("blogTags");
    this.blogBody = document.getElementById("blogBody");

    // Author elements
    this.authorAvatar = document.getElementById("authorAvatar");
    this.authorName = document.getElementById("authorName");

    // Share buttons
    this.shareFacebook = document.getElementById("shareFacebook");
    this.shareTwitter = document.getElementById("shareTwitter");
    this.shareLinkedIn = document.getElementById("shareLinkedIn");
    this.shareWhatsApp = document.getElementById("shareWhatsApp");

    // Related posts
    this.relatedPosts = document.getElementById("relatedPosts");
    this.relatedPostsGrid = document.getElementById("relatedPostsGrid");
  }

  getSlugFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("slug");
  }

  async loadBlogDetail() {
    if (!this.blogSlug) {
      this.showError("No blog specified");
      return;
    }

    try {
      this.showLoading();

      // Get blog detail by slug
      const response = await fetch(`${this.apiUrl}/${this.blogSlug}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Blog not found");
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status && data.data) {
        this.currentBlog = data.data;
        this.renderBlogDetail();
        this.setupShareButtons();
        this.updatePageMeta();
        await this.loadRelatedBlogs();
      } else {
        throw new Error(data.message || "Failed to load blog");
      }
    } catch (error) {
      console.error("Error loading blog:", error);
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  renderBlogDetail() {
    const blog = this.currentBlog;

    // Render header with featured image
    this.renderHeader(blog);

    // Render meta information
    this.renderMeta(blog);

    // Render title
    this.blogTitle.textContent = blog.title;

    // Render excerpt
    if (blog.excerpt) {
      this.blogExcerpt.textContent = blog.excerpt;
    } else {
      this.blogExcerpt.style.display = "none";
    }

    // Render tags
    this.renderTags(blog.tags);

    // Render main content
    this.renderContent(blog.content);

    // Render author
    this.renderAuthor(blog.author);

    this.showContent();
  }

  renderHeader(blog) {
    const featuredBadge = blog.isFeatured
      ? '<div class="blog-featured-badge"><i class="fas fa-star me-1"></i>Featured</div>'
      : "";

    this.blogHeader.innerHTML = `
      <img src="${blog.featuredImage}" alt="${this.escapeHtml(
      blog.title
    )}" class="blog-detail-image"
           onerror="this.src='https://via.placeholder.com/800x400/f8f9fa/6c757d?text=VAATCO+Blog'">
      ${featuredBadge}
      <div class="blog-detail-overlay">
        <div class="d-flex align-items-center text-white">
          <i class="fas fa-calendar me-2"></i>
          <span>${new Date(blog.publishDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</span>
        </div>
      </div>
    `;
  }

  renderMeta(blog) {
    const publishDate = new Date(blog.publishDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    this.blogMeta.innerHTML = `
      <div class="blog-meta-item">
        <i class="fas fa-calendar"></i>
        <span>${publishDate}</span>
      </div>
      <div class="blog-meta-item">
        <i class="fas fa-user"></i>
        <span>${this.escapeHtml(blog.author?.name || "VAATCO Team")}</span>
      </div>
      <div class="blog-meta-item">
        <i class="fas fa-clock"></i>
        <span>${blog.readTime} min read</span>
      </div>
      <div class="blog-meta-item">
        <i class="fas fa-eye"></i>
        <span>${blog.views} views</span>
      </div>
    `;
  }

  renderTags(tags) {
    if (!tags || tags.length === 0) {
      this.blogTags.style.display = "none";
      return;
    }

    const tagsHtml = tags
      .map((tag) => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`)
      .join("");

    this.blogTags.innerHTML = tagsHtml;
  }

  renderContent(content) {
    // If content is provided, use it; otherwise show a placeholder
    if (content) {
      this.blogBody.innerHTML = this.formatContent(content);
    } else {
      // Fallback content if no detailed content is available
      this.blogBody.innerHTML = `
        <p>This is the main content of the blog post. The full article content would be displayed here when available from the API.</p>
        <p>Currently showing excerpt and metadata from the blog listing. To display full content, ensure your API endpoint returns the complete blog content.</p>
      `;
    }
  }

  formatContent(content) {
    // Basic content formatting - you can enhance this based on your content structure
    if (typeof content === "string") {
      return content
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>")
        .replace(/^/, "<p>")
        .replace(/$/, "</p>");
    }
    return content;
  }

  renderAuthor(author) {
    const authorName = author?.name || "VAATCO Team";
    const authorInitial = authorName.charAt(0).toUpperCase();

    this.authorAvatar.textContent = authorInitial;
    this.authorName.textContent = authorName;
  }

  setupShareButtons() {
    const blog = this.currentBlog;
    const currentUrl = window.location.href;
    const title = encodeURIComponent(blog.title);
    const description = encodeURIComponent(
      blog.excerpt || "Read this article from VAATCO Bangladesh Ltd"
    );

    if (this.shareFacebook) {
      this.shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`;
    }

    if (this.shareTwitter) {
      this.shareTwitter.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=${title}`;
    }

    if (this.shareLinkedIn) {
      this.shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`;
    }

    if (this.shareWhatsApp) {
      this.shareWhatsApp.href = `https://wa.me/?text=${title}%20${encodeURIComponent(
        currentUrl
      )}`;
    }

    // Add click handlers to open in new windows
    [
      this.shareFacebook,
      this.shareTwitter,
      this.shareLinkedIn,
      this.shareWhatsApp,
    ].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          window.open(
            btn.href,
            "_blank",
            "width=600,height=400,scrollbars=yes,resizable=yes"
          );
        });
      }
    });
  }

  updatePageMeta() {
    const blog = this.currentBlog;

    // Update page title
    document.title = `${blog.title} - VAATCO Bangladesh Ltd Blog`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        blog.excerpt ||
          `Read ${blog.title} - Latest insights from VAATCO Bangladesh Ltd`
      );
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && blog.tags && blog.tags.length > 0) {
      metaKeywords.setAttribute(
        "content",
        `VAATCO, blog, ${blog.tags.join(", ")}, aquaculture, agriculture`
      );
    }
  }

  async loadRelatedBlogs() {
    try {
      // Get related blogs (same tags or recent blogs)
      const params = new URLSearchParams({
        limit: 3,
        sortBy: "publishDate",
        sortOrder: "desc",
      });

      // If current blog has tags, try to find related by tags
      if (this.currentBlog.tags && this.currentBlog.tags.length > 0) {
        params.append("tags", this.currentBlog.tags.join(","));
      }

      const response = await fetch(`${this.apiUrl}?${params}`);

      if (response.ok) {
        const data = await response.json();
        if (data.status && data.data) {
          // Filter out the current blog from related blogs
          this.relatedBlogs = data.data
            .filter((blog) => blog._id !== this.currentBlog._id)
            .slice(0, 3);
          this.renderRelatedBlogs();
        }
      }
    } catch (error) {
      console.error("Error loading related blogs:", error);
      // Don't show error for related blogs, just hide the section
    }
  }

  renderRelatedBlogs() {
    if (this.relatedBlogs.length === 0) {
      this.relatedPosts.style.display = "none";
      return;
    }

    const html = this.relatedBlogs
      .map((blog) => {
        const publishDate = new Date(blog.publishDate).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );

        return `
        <div class="col-lg-4 col-md-6 mb-3">
          <div class="related-post-card">
            <div class="mb-2">
              <small class="text-muted">
                <i class="fas fa-calendar me-1"></i>${publishDate}
              </small>
              ${
                blog.isFeatured
                  ? '<span class="badge bg-warning text-dark ms-2">Featured</span>'
                  : ""
              }
            </div>
            <h5 class="related-post-title">
              <a href="blog-detail.html?slug=${
                blog.slug
              }" class="text-decoration-none">
                ${this.escapeHtml(blog.title)}
              </a>
            </h5>
            <p class="related-post-excerpt">${this.escapeHtml(blog.excerpt)}</p>
            <div class="mt-auto">
              <a href="blog-detail.html?slug=${
                blog.slug
              }" class="btn btn-sm btn-outline-primary">
                <i class="fas fa-arrow-right me-1"></i>Read More
              </a>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    this.relatedPostsGrid.innerHTML = html;
    this.relatedPosts.style.display = "block";
  }

  showLoading() {
    this.loadingContainer.style.display = "flex";
    this.errorContainer.style.display = "none";
    this.blogContent.style.display = "none";
    this.relatedPosts.style.display = "none";
  }

  hideLoading() {
    this.loadingContainer.style.display = "none";
  }

  showContent() {
    this.blogContent.style.display = "block";
  }

  showError(message) {
    this.errorContainer.style.display = "block";
    this.loadingContainer.style.display = "none";
    this.blogContent.style.display = "none";
    this.relatedPosts.style.display = "none";

    // Update error message if needed
    const errorText = this.errorContainer.querySelector("p");
    if (errorText && message !== "Blog not found") {
      errorText.textContent = message;
    }
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize BlogDetailManager when DOM is loaded
let blogDetailManager;
document.addEventListener("DOMContentLoaded", function () {
  blogDetailManager = new BlogDetailManager();
});

// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BlogDetailManager };
}
