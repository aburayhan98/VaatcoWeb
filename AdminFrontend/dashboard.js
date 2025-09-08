// dashboard.js - Dashboard-specific functionality

// Check authentication on page load and load user info
function loadUserInfo() {
  const userData = window.authManager?.getCurrentUser();
  if (userData) {
    document.getElementById("userName").textContent =
      userData.name || "Admin User";
    document.getElementById("userEmail").textContent = userData.email || "";
  } else {
    document.getElementById("userName").textContent = "Unknown User";
    document.getElementById("userEmail").textContent = "";
  }
}

// Enhanced logout functionality
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        if (window.authManager) {
          window.authManager.logout();
        } else {
          window.location.href = "login.html";
        }
      }
    });
  }
}

// Update last updated time
function updateLastUpdated() {
  const lastUpdatedElement = document.getElementById("lastUpdated");
  if (lastUpdatedElement) {
    lastUpdatedElement.textContent = new Date().toLocaleString();
  }
}

// Image modal function
function openImageModal(imageSrc, altText) {
  const modal = document.getElementById("imageModal");
  const img = document.getElementById("imageModalImg");
  const title = document.getElementById("imageModalTitle");

  img.src = imageSrc;
  img.alt = altText;
  title.textContent = altText || "Product Image";

  new bootstrap.Modal(modal).show();
}

// Gallery selector functions
let selectedProductImages = [];

function openGallerySelector() {
  // Load current product images selection
  const currentImages = document.getElementById("productImages").value;
  selectedProductImages = currentImages
    ? currentImages.split("\n").filter((img) => img.trim())
    : [];

  loadGallerySelector();
  new bootstrap.Modal(document.getElementById("gallerySelectorModal")).show();
}

function loadGallerySelector() {
  // Use the same storage key as in app.js
  const gallery = JSON.parse(
    localStorage.getItem("vaatco_gallery_items") || "[]"
  );
  console.log("Gallery data loaded:", gallery); // Debug log
  const grid = document.getElementById("gallerySelectorGrid");
  const selectedCount = document.getElementById("selectedCount");

  if (gallery.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center text-muted py-4">
        <i class="fas fa-images fa-3x mb-3"></i>
        <p>No images in gallery. Upload some images first.</p>
      </div>
    `;
    selectedCount.textContent = "0 selected";
    return;
  }

  let html = "";
  gallery.forEach((item) => {
    const isSelected = selectedProductImages.includes(item.url);
    html += `
      <div class="col-md-3 col-sm-4 col-6 mb-3">
        <div class="gallery-selector-item ${isSelected ? "selected" : ""}" 
             data-url="${item.url}" 
             onclick="toggleImageSelection('${item.url}', this)">
          <div class="position-relative">
            <img src="${item.url}" alt="${item.alt}" 
                 class="img-fluid rounded shadow-sm" 
                 style="width: 100%; height: 120px; object-fit: cover; cursor: pointer;"
                 onerror="this.parentElement.innerHTML='<div class=\\'d-flex align-items-center justify-content-center bg-light rounded\\' style=\\'height:120px\\'><i class=\\'fas fa-image-broken text-muted\\'></i></div>'">
            <div class="selection-overlay">
              <i class="fas fa-check-circle"></i>
            </div>
          </div>
          <small class="text-muted mt-1 d-block text-truncate">${
            item.alt
          }</small>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
  updateSelectedCount();
}

function toggleImageSelection(imageUrl, element) {
  const index = selectedProductImages.indexOf(imageUrl);

  if (index === -1) {
    selectedProductImages.push(imageUrl);
    element.classList.add("selected");
  } else {
    selectedProductImages.splice(index, 1);
    element.classList.remove("selected");
  }

  updateSelectedCount();
}

function updateSelectedCount() {
  const selectedCount = document.getElementById("selectedCount");
  if (selectedCount) {
    selectedCount.textContent = `${selectedProductImages.length} selected`;
  }
}

function confirmImageSelection() {
  console.log("Confirming image selection:", selectedProductImages); // Debug log
  // Update the hidden field and display
  document.getElementById("productImages").value =
    selectedProductImages.join("\n");
  console.log(
    "Updated productImages field:",
    document.getElementById("productImages").value
  ); // Debug log
  updateSelectedImagesDisplay();

  // Close the modal
  bootstrap.Modal.getInstance(
    document.getElementById("gallerySelectorModal")
  ).hide();
}

function updateSelectedImagesDisplay() {
  const container = document.getElementById("selectedImagesContainer");
  const images = selectedProductImages;

  if (images.length === 0) {
    container.innerHTML =
      '<small class="text-muted w-100">No images selected. Click "Browse Gallery" to select images.</small>';
    return;
  }

  let html = "";
  images.forEach((imageUrl, index) => {
    html += `
      <div class="selected-image-item position-relative me-2 mb-2">
        <img src="${imageUrl}" alt="Selected image ${index + 1}" 
             class="rounded shadow-sm" 
             style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;"
             onclick="openImageModal('${imageUrl}', 'Product Image ${
      index + 1
    }')"
             onerror="this.style.display='none'">
        <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-1" 
                style="width: 20px; height: 20px; font-size: 10px; transform: translate(25%, -25%);"
                onclick="removeSelectedImage(${index})"
                title="Remove image">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  });

  container.innerHTML = html;
}

function removeSelectedImage(index) {
  const currentImages = document
    .getElementById("productImages")
    .value.split("\n")
    .filter((img) => img.trim());
  currentImages.splice(index, 1);
  document.getElementById("productImages").value = currentImages.join("\n");
  selectedProductImages = currentImages;
  updateSelectedImagesDisplay();
}

function closeGallerySelector() {
  bootstrap.Modal.getInstance(
    document.getElementById("gallerySelectorModal")
  ).hide();
}

// Reset product form function (accessible from app.js)
function resetProductForm() {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("productImages").value = "";

  // Reset image selection
  selectedProductImages = [];
  updateSelectedImagesDisplay();

  // Reset modal title
  const modalTitle = document.getElementById("productModalTitle");
  if (modalTitle) {
    modalTitle.textContent = "Add Product";
  }
}

// Prepare form for adding new product
function prepareAddProduct() {
  resetProductForm();
}

// Handle image upload for gallery
function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;

  // Validate file type
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validTypes.includes(file.type)) {
    alert("Please select a valid image file (JPG, PNG, GIF, or WebP)");
    input.value = "";
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    alert("Image file size should be less than 5MB");
    input.value = "";
    return;
  }

  // Create a simulated upload (in real app, you'd upload to server)
  const reader = new FileReader();
  reader.onload = function (e) {
    // For demo purposes, we'll create a local path
    // In real implementation, you'd get this from your upload endpoint
    const fileName = file.name;
    const imagePath = `ProductImage/${fileName}`;

    // Set the URL field
    document.getElementById("galleryUrl").value = imagePath;

    // Set alt text if empty
    const altField = document.getElementById("galleryAlt");
    if (!altField.value) {
      altField.value = fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    }

    // Show preview
    showImagePreview(e.target.result);

    // Show a note about the simulated upload
    showUploadNote(fileName);
  };
  reader.readAsDataURL(file);
}

// Show image preview function (needed for gallery edit)
function showImagePreview(src) {
  const container = document.getElementById("imagePreviewContainer");
  const preview = document.getElementById("imagePreview");

  if (container && preview) {
    preview.src = src;
    container.style.display = "block";
  }
}

function showUploadNote(fileName) {
  // Create a temporary note about the upload simulation
  const existingNote = document.querySelector(".upload-simulation-note");
  if (existingNote) existingNote.remove();

  const note = document.createElement("div");
  note.className = "alert alert-info upload-simulation-note mt-2";
  note.innerHTML = `
    <i class="fas fa-info-circle me-2"></i>
    <strong>Simulation:</strong> File "${fileName}" would be uploaded to ProductImage/ folder. 
    In a real application, this would be handled by your backend server.
  `;

  document.getElementById("imagePreviewContainer").appendChild(note);
}

// Reset gallery form when modal is closed
function setupGalleryFormReset() {
  const galleryModal = document.getElementById("galleryModal");
  if (galleryModal) {
    galleryModal.addEventListener("hidden.bs.modal", function () {
      document.getElementById("galleryForm").reset();
      document.getElementById("galleryFileUpload").value = "";
      document.getElementById("galleryId").value = "";
      document.getElementById("imagePreviewContainer").style.display = "none";

      // Reset checkboxes to default state
      document.getElementById("galleryIsFeatured").checked = false;
      document.getElementById("galleryIsActive").checked = true;

      const note = document.querySelector(".upload-simulation-note");
      if (note) note.remove();
    });
  }
}

function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;

  // Validate file type
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validTypes.includes(file.type)) {
    alert("Please select a valid image file (JPG, PNG, GIF, or WebP)");
    input.value = "";
    return;
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    alert("Image file size should be less than 5MB");
    input.value = "";
    return;
  }

  // Set alt text if empty
  const altField = document.getElementById("galleryAlt");
  if (!altField.value) {
    altField.value = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  }

  // Show preview
  const reader = new FileReader();
  reader.onload = function (e) {
    showImagePreview(e.target.result);
  };
  reader.readAsDataURL(file);
}
// Make functions globally accessible
window.openGallerySelector = openGallerySelector;
window.updateSelectedImagesDisplay = updateSelectedImagesDisplay;
window.selectedProductImages = selectedProductImages;
window.resetProductForm = resetProductForm;
window.prepareAddProduct = prepareAddProduct;
window.openImageModal = openImageModal;
window.handleImageUpload = handleImageUpload;
window.toggleImageSelection = toggleImageSelection;
window.confirmImageSelection = confirmImageSelection;
window.removeSelectedImage = removeSelectedImage;
window.closeGallerySelector = closeGallerySelector;

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Load user info first
  loadUserInfo();

  // Setup logout functionality
  setupLogout();

  // Update last updated time
  updateLastUpdated();

  // Setup gallery form reset
  setupGalleryFormReset();

  console.log("Dashboard JavaScript loaded and initialized");
});
