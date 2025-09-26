/**
 * Enhanced VAATCO API Integration Script
 * Dynamic gallery updates with proper fallback handling
 * Preserves gallery title and subtitle
 */

const VaatcoAPI = {
  baseUrl: "https://api.vaatcobd.com/api",

  // Fetch gallery images from API
  async getGalleryImages() {
    try {
      const response = await fetch(`${this.baseUrl}/public/images`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status && data.data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      return [];
    }
  },
};

// Update gallery images when page loads
document.addEventListener("DOMContentLoaded", async function () {
  await updateGalleryFromAPI();
});

// Main function to update gallery
async function updateGalleryFromAPI() {
  // Find or create the gallery images container (separate from title row)
  let galleryContainer = document.querySelector("#gallery .gallery-images-row");

  if (!galleryContainer) {
    // If specific container doesn't exist, find the gallery section and create proper structure
    const gallerySection = document.getElementById("gallery");
    if (!gallerySection) {
      console.log("Gallery section not found");
      return;
    }

    // Find the container div
    const containerDiv = gallerySection.querySelector(".container");
    if (!containerDiv) {
      console.log("Gallery container not found");
      return;
    }

    // Create or find the images row (after the title row)
    galleryContainer = containerDiv.querySelector(".gallery-images-row");
    if (!galleryContainer) {
      // Create the images row if it doesn't exist
      galleryContainer = document.createElement("div");
      galleryContainer.className = "row gallery-images-row";
      containerDiv.appendChild(galleryContainer);
    }
  }

  // Show loading state
  showGalleryLoading(galleryContainer);

  try {
    // Fetch images from API
    const apiImages = await VaatcoAPI.getGalleryImages();

    if (apiImages.length > 0) {
      // Display API images
      displayGalleryImages(galleryContainer, apiImages);
    } else {
      // Show no images message
      showNoImagesMessage(galleryContainer);
    }
  } catch (error) {
    console.error("Error updating gallery:", error);
    // Fall back to default images on error
    showDefaultImages(galleryContainer);
  }
}

// Show loading state
function showGalleryLoading(container) {
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-primary mb-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="text-muted">Loading gallery images...</p>
    </div>
  `;
}

// Display gallery images dynamically
function displayGalleryImages(container, images) {
  let galleryHTML = "";

  images.forEach((imageUrl, index) => {
    // Validate image URL
    if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim() === "") {
      return; // Skip invalid URLs
    }

    const cleanUrl = imageUrl.trim();

    galleryHTML += `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="gallery-item">
          <div class="gallery-image-wrapper">
            <img
              src="${cleanUrl}"
              alt="Gallery Image ${index + 1}"
              class="img-fluid gallery-image"
              onclick="openImagePreview(this)"
              onerror="handleImageError(this)"
            />
            <div class="gallery-overlay">
              <i class="fas fa-search-plus fa-2x text-white"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = galleryHTML;
}

// Handle individual image loading errors
function handleImageError(imgElement) {
  const wrapper = imgElement.closest(".gallery-image-wrapper");
  if (wrapper) {
    wrapper.innerHTML = `
      <div class="gallery-error" style="
        background: #f8f9fa; 
        border: 2px dashed #dee2e6; 
        border-radius: 8px; 
        padding: 40px; 
        text-align: center; 
        min-height: 200px; 
        display: flex; 
        flex-direction: column; 
        justify-content: center;
      ">
        <i class="fas fa-image fa-3x text-muted mb-2"></i>
        <p class="text-muted mb-0">Image not available</p>
      </div>
    `;
  }
}

// Show no images available message
function showNoImagesMessage(container) {
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="no-images-message" style="
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border: 2px dashed #dee2e6;
        border-radius: 15px;
        padding: 60px 40px;
        margin: 20px 0;
      ">
        <i class="fas fa-images fa-4x text-muted mb-4" style="opacity: 0.6;"></i>
        <h4 class="text-muted mb-3">No Images Available</h4>
        <p class="text-muted mb-4">
          Gallery images are currently not available. Please check back later or contact us for more information.
        </p>
        <div class="mt-4">
          <button 
            onclick="refreshGallery()" 
            class="btn btn-outline-primary me-3"
            style="border-radius: 25px; padding: 10px 25px;"
          >
            <i class="fas fa-refresh me-2"></i>Try Again
          </button>
          <a 
            href="#contact" 
            class="btn btn-primary"
            style="border-radius: 25px; padding: 10px 25px;"
          >
            <i class="fas fa-envelope me-2"></i>Contact Us
          </a>
        </div>
      </div>
    </div>
  `;
}

// Fallback to default images
function showDefaultImages(container) {
  const defaultImages = [
    "sticker/sticker1.jpeg",
    "sticker/sticker2.jpeg",
    "sticker/sticker3.jpeg",
    "sticker/sticker4.jpeg",
  ];

  let galleryHTML = "";

  defaultImages.forEach((imageSrc, index) => {
    galleryHTML += `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="gallery-item">
          <div class="gallery-image-wrapper">
            <img
              src="${imageSrc}"
              alt="Gallery Image ${index + 1}"
              class="img-fluid gallery-image"
              onclick="openImagePreview(this)"
              onerror="handleImageError(this)"
            />
            <div class="gallery-overlay">
              <i class="fas fa-search-plus fa-2x text-white"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = galleryHTML;
}

// Function to refresh gallery (can be called manually)
async function refreshGallery() {
  console.log("Refreshing gallery...");
  await updateGalleryFromAPI();
}

// Enhanced error handling for network issues
window.addEventListener("online", function () {
  console.log("Network connection restored, refreshing gallery...");
  setTimeout(refreshGallery, 1000);
});

// Auto-refresh gallery every 5 minutes (optional)
// setInterval(refreshGallery, 5 * 60 * 1000);

const FeaturedBlogsAPI = {
  baseUrl: "https://api.vaatcobd.com/api/public/blogs",

  async getFeaturedBlogs() {
    try {
      const params = new URLSearchParams({
        featured: "true",
        limit: 9,
        sortBy: "publishDate",
        sortOrder: "desc",
      });

      const response = await fetch(`${this.baseUrl}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status && data.data && Array.isArray(data.data)) {
        return data.data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching featured blogs:", error);
      throw error;
    }
  },
};

// Load featured blogs on page load
document.addEventListener("DOMContentLoaded", function () {
  loadFeaturedBlogs();
});

async function loadFeaturedBlogs() {
  const loadingEl = document.getElementById("featuredBlogsLoading");
  const gridEl = document.getElementById("featuredBlogsGrid");
  const emptyEl = document.getElementById("featuredBlogsEmpty");

  // Show loading state
  if (loadingEl) loadingEl.style.display = "block";
  if (gridEl) gridEl.style.display = "none";
  if (emptyEl) emptyEl.style.display = "none";

  try {
    const blogs = await FeaturedBlogsAPI.getFeaturedBlogs();

    if (blogs.length > 0) {
      renderFeaturedBlogs(blogs, gridEl);
      if (gridEl) gridEl.style.display = "flex";
    } else {
      if (emptyEl) emptyEl.style.display = "block";
    }
  } catch (error) {
    console.error("Failed to load featured blogs:", error);
    if (emptyEl) emptyEl.style.display = "block";
  } finally {
    if (loadingEl) loadingEl.style.display = "none";
  }
}

function renderFeaturedBlogs(blogs, container) {
  if (!container) return;

  const html = blogs
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
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="featured-blog-card">
          <div class="featured-blog-image">
            <img src="${blog.featuredImage}" alt="${escapeHtml(blog.title)}"
                 onerror="this.src='https://via.placeholder.com/400x200/f8f9fa/6c757d?text=VAATCO+Blog'">
            ${
              blog.isFeatured
                ? '<div class="featured-blog-badge"><i class="fas fa-star me-1"></i>Featured</div>'
                : ""
            }
          </div>
          <div class="featured-blog-content">
            <div class="featured-blog-meta">
              <div class="d-flex align-items-center">
                <i class="fas fa-calendar"></i>
                <span>${publishDate}</span>
              </div>
              
              <div class="d-flex align-items-center">
                <i class="fas fa-clock"></i>
                <span>${blog.readTime} min</span>
              </div>
            </div>
            <h5 class="featured-blog-title">${escapeHtml(blog.title)}</h5>
            <p class="featured-blog-excerpt">${escapeHtml(blog.excerpt)}</p>
            <div class="featured-blog-footer">
              <a href="blog-detail.html?slug=${
                blog.slug
              }" class="featured-blog-read-btn">
                <i class="fas fa-arrow-right"></i>
                Read More
              </a>
              <div class="featured-blog-views">
                <i class="fas fa-eye"></i>
                <span>${blog.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  container.innerHTML = html;
}

function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
