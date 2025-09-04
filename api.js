/**
 * VAATCO API Integration Script
 * Simple approach to update gallery images dynamically
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
  // Get all gallery images
  const galleryImages = document.querySelectorAll("#gallery .gallery-image");

  if (galleryImages.length === 0) return;

  // Fetch images from API
  const apiImages = await VaatcoAPI.getGalleryImages();

  // Update images if API returned data
  if (apiImages.length > 0) {
    galleryImages.forEach((img, index) => {
      if (index < apiImages.length) {
        // Update src to API image
        img.src = apiImages[index];
        // Update alt text
        img.alt = `Gallery Image ${index + 1}`;
        // Add error fallback to original image
        img.onerror = function () {
          this.onerror = null; // Prevent infinite loop
          this.src = `sticker/sticker${index + 1}.jpeg`;
        };
      }
    });
  }
  // If API returns no images, keep the original static images
});

// Function to refresh gallery (can be called manually)
async function refreshGallery() {
  const galleryImages = document.querySelectorAll("#gallery .gallery-image");
  const apiImages = await VaatcoAPI.getGalleryImages();

  if (apiImages.length > 0) {
    galleryImages.forEach((img, index) => {
      if (index < apiImages.length) {
        img.src = apiImages[index];
        img.onerror = function () {
          this.onerror = null;
          this.src = `sticker/sticker${index + 1}.jpeg`;
        };
      }
    });
  }
}
