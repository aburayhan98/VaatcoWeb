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
