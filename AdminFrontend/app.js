// Simple Admin Panel with API Integration
// Storage keys (keeping localStorage for backward compatibility and caching)
const STORAGE_KEYS = {
  AUTH: "vaatco_admin_auth",
  GALLERY: "vaatco_gallery_items",
  PRODUCTS: "vaatco_products",
  DEALERS: "vaatco_dealers",
  BLOG: "vaatco_blog_posts",
};

// API Configuration
const API_CONFIG = {
  BASE_URL: "https://api.vaatcobd.com/api",
  ENDPOINTS: {
    LOGIN: "/admin/login",
    GALLERY: "/admin/gallery",
    PRODUCTS: "/admin/products",
    DEALERS: "/admin/dealers",
    BLOG: "/admin/blog",
  },
};

// Default demo data (fallback if API is not available)
const defaultData = {
  gallery: [
    { id: 1, url: "../sticker/sticker1.jpeg", alt: "Sticker 1" },
    { id: 2, url: "../sticker/sticker2.jpeg", alt: "Sticker 2" },
    {
      id: 3,
      url: "ProductImage/micro_off_sample_image.jpg",
      alt: "Micro Off Product Sample",
    },
  ],
  products: [
    {
      id: 1,
      name: "Micro off",
      images: ["ProductImage/micro_off_sample_image.jpg"],
      description: `A newly designed powder formula for harmful microorganism

Key Ingredients (Per 100gm):
1. Dodecyl Dimethyl Benzal Ammonium Chloride- 40%
2. Cetylpyridinium Chloride-2%
3. Glutaraldehyde-15%

Function:
* Immediate germicidal activity against gram positive and gram negative bacteria, algae, fungus and some viruses.
* 100% bio degradable and environment friendly.
* Designed to perform in hard water & reduce ammonia level
* Design to work effectivly in wide pH range
* Reduce the mortality rate of fingerling during early stages.

Dosage & Administration:
* Prevention: 1 gm/ decimal for 3-5 feet water depth
* Treatment: 2-3 gm/ decimal for 3-5 feet water depth

Origin: Germany

Pack Size: 100gm & 50 gm`,
    },
    {
      id: 2,
      name: "Acetaminophen",
      images: [],
      description: `Widely used pain reliever and a fever reducer.

Key Ingredients:
* Paracetamol

Function:
* Reduces fever and relieves mild to moderate pain.

Dosage & Administration:
* As directed by physician.

Origin: Bangladesh

Pack Size: 25 kg`,
    },
    {
      id: 3,
      name: "Ascorbic Acid",
      images: [],
      description: `Vitamin C, essential for growth and repair of tissues.

Key Ingredients:
* L-Ascorbic Acid

Function:
* Boosts immune system, antioxidant.

Dosage & Administration:
* As directed by physician.

Origin: Bangladesh

Pack Size: 25 kg`,
    },
  ],
  dealers: [
    {
      id: 1,
      district: "Dhaka",
      name: "Green Farms Supply",
      shop: "Green Farms Supply Store",
      location: "Dhanmondi, Dhaka",
      contact: "+88017XXXXXXX",
    },
    {
      id: 2,
      district: "Chittagong",
      name: "Aqua Plus Solutions",
      shop: "Aqua Plus Store",
      location: "Agrabad, Chittagong",
      contact: "+88019XXXXXXX",
    },
  ],
  blog: [
    {
      id: 1,
      title: "5 Benefits of Zeolite in Aquaculture",
      summary:
        "How Zeolite improves water quality and pond health for better growth.",
    },
    {
      id: 2,
      title: "How Yucca Improves Pond Water Quality",
      summary: "Natural reduction of ammonia and odors in aquaculture systems.",
    },
  ],
};

// API Helper Functions
async function makeAuthenticatedRequest(endpoint, options = {}) {
  if (!window.authManager) {
    throw new Error("AuthManager not available");
  }

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    return await window.authManager.makeAuthenticatedRequest(url, options);
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Enhanced Storage Functions with API Integration
function initStorage() {
  // Initialize localStorage with default data if empty
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) {
    localStorage.setItem(
      STORAGE_KEYS.GALLERY,
      JSON.stringify(defaultData.gallery)
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(
      STORAGE_KEYS.PRODUCTS,
      JSON.stringify(defaultData.products)
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEALERS)) {
    localStorage.setItem(
      STORAGE_KEYS.DEALERS,
      JSON.stringify(defaultData.dealers)
    );
  }
  if (!localStorage.getItem(STORAGE_KEYS.BLOG)) {
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(defaultData.blog));
  }
}

// Authentication check (now integrated with AuthManager)
function isAuthenticated() {
  return window.authManager ? window.authManager.isAuthenticated() : false;
}

function logout() {
  if (window.authManager) {
    window.authManager.logout();
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    window.location.href = "login.html";
  }
}

// Utility
function generateId(items) {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}
function qs(sel) {
  return document.querySelector(sel);
}
function ce(tag, cls) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
}

// Show loading spinner
function showLoading(message = "Loading...") {
  // Implementation for loading spinner
  console.log(message);
}

function hideLoading() {
  // Implementation to hide loading spinner
  console.log("Loading hidden");
}

// Show toast notification
function showToast(message, type = "info") {
  // Create a simple toast notification
  const toast = document.createElement("div");
  toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
  toast.style.zIndex = "9999";
  toast.innerHTML = `
    <i class="fas fa-${
      type === "success"
        ? "check-circle"
        : type === "error"
        ? "exclamation-triangle"
        : "info-circle"
    } me-2"></i>
    ${message}
  `;

  document.body.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 2000);
}

// Render Dashboard Stats
function renderStats() {
  const statsRow = qs("#statsRow");
  if (!statsRow) return;

  const gallery = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.GALLERY) || "[]"
  );
  const products = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"
  );
  const dealers = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.DEALERS) || "[]"
  );
  const blog = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || "[]");

  statsRow.innerHTML = "";
  const tiles = [
    { icon: "fa-image", label: "Gallery Items", value: gallery.length },
    { icon: "fa-box", label: "Products", value: products.length },
    { icon: "fa-store", label: "Dealers", value: dealers.length },
    { icon: "fa-blog", label: "Blog Posts", value: blog.length },
  ];

  tiles.forEach((t) => {
    const col = ce("div", "col-md-4 mb-3");
    col.innerHTML = `<div class="stat-tile card-hover"><div class="icon"><i class="fas ${t.icon}"></i></div><div><h6>${t.label}</h6><p class="value">${t.value}</p></div></div>`;
    statsRow.appendChild(col);
  });
}

// Gallery CRUD with API Integration

async function loadGallery() {
  const grid = qs("#galleryGrid");
  if (!grid) return;

  try {
    showLoading("Loading gallery...");

    // Fetch from API
    const response = await makeAuthenticatedRequest("/gallery");
    const result = await response.json();

    if (result.status && result.data) {
      // Transform API data to match existing structure
      const list = result.data.map((item) => ({
        id: item._id,
        url: item.image.url,
        alt: `Gallery Image - ${item.createdAt}`,
        isActive: item.isActive,
        isFeatured: item.isFeatured,
        sortOrder: item.sortOrder,
        uploadedBy: item.uploadedBy.name,
        usageCount: item.usageCount,
        createdAt: item.createdAt,
      }));

      // Save to localStorage as cache
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(list));

      // Render gallery
      renderGalleryGrid(list);
      showToast("Gallery loaded successfully!", "success");
    } else {
      throw new Error(result.message || "Failed to load gallery");
    }
  } catch (error) {
    console.error("Error loading gallery:", error);
    // Fallback to localStorage
    const cachedList = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.GALLERY) || "[]"
    );
    renderGalleryGrid(cachedList);
    showToast("Using cached gallery data. Check your connection.", "warning");
  } finally {
    hideLoading();
  }
}

function renderGalleryGrid(list) {
  const grid = qs("#galleryGrid");
  if (!grid) return;

  grid.innerHTML = "";
  list.forEach((item) => {
    const col = ce("div", "col-sm-6 col-md-4 col-lg-3 mb-3");
    const featuredBadge = item.isFeatured
      ? '<span class="badge bg-warning position-absolute top-0 start-0 m-1">Featured</span>'
      : "";
    const activeBadge = item.isActive
      ? ""
      : '<span class="badge bg-secondary position-absolute top-0 end-0 m-1">Inactive</span>';

    col.innerHTML = `
      <div class="gallery-card card-hover position-relative">
        ${featuredBadge}
        ${activeBadge}
        <img src="${item.url}" alt="${item.alt}" class="thumb"/>
        <div class="actions">
          <button class="edit" data-id="${item.id}" title="Edit">
            <i class="fas fa-pen"></i>
          </button>
          <button class="del" data-id="${item.id}" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <small class="d-block mt-1 text-muted text-truncate" title="${
          item.alt
        }">
          ${item.alt}
        </small>
        <div class="small text-muted mt-1">
          <i class="fas fa-user me-1"></i>${item.uploadedBy || "Unknown"}
          <span class="ms-2"><i class="fas fa-eye me-1"></i>${
            item.usageCount || 0
          }</span>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}
// Add this function to reset the gallery form properly
function resetGalleryForm() {
  qs("#galleryForm").reset();
  qs("#galleryId").value = "";
  qs("#gallerySortOrder").value = "0"; // NEW: Reset sort order to default

  // Reset checkboxes to default state
  if (qs("#galleryIsFeatured")) qs("#galleryIsFeatured").checked = false;
  if (qs("#galleryIsActive")) qs("#galleryIsActive").checked = true;

  // Make file upload required again
  const fileInput = qs("#galleryFileUpload");
  if (fileInput) {
    fileInput.setAttribute("required", "");
  }

  // Reset modal title
  const modalTitle = qs("#galleryModal .modal-title");
  if (modalTitle) {
    modalTitle.textContent = "Add / Edit Gallery Image";
  }

  // Hide preview
  const previewContainer = qs("#imagePreviewContainer");
  if (previewContainer) {
    previewContainer.style.display = "none";
  }

  // Remove any upload notes
  const note = document.querySelector(".upload-simulation-note");
  if (note) note.remove();
}
// Updated saveGalleryItem function to handle both create and update
async function saveGalleryItem(e) {
  e.preventDefault();
  const id = qs("#galleryId").value;
  const fileInput = qs("#galleryFileUpload");
  const alt = qs("#galleryAlt").value.trim();
  const sortOrder = parseInt(qs("#gallerySortOrder").value) || 0; // NEW: Get sort order
  const isFeatured = qs("#galleryIsFeatured")?.checked || false;
  const isActive = qs("#galleryIsActive")?.checked !== false;

  if (!alt) {
    showToast("Please provide alt text / description for the image.", "error");
    return;
  }

  try {
    if (id) {
      // Update existing item
      const updateData = {
        alt,
        isFeatured,
        isActive,
      };

      // If a new file is selected, we need to handle file upload differently
      if (fileInput.files && fileInput.files.length > 0) {
        // For updates with new image, you might want to handle this differently
        // depending on your backend API design
        showToast(
          "To change the image, please delete this item and create a new one.",
          "info"
        );
        return;
      }

      await updateGalleryItem(id, updateData);
    } else {
      // Create new item (existing logic)
      showLoading("Saving gallery item...");

      if (!fileInput.files || fileInput.files.length === 0) {
        showToast("Please select a file to upload.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("image", fileInput.files[0]);
      formData.append("alt", alt);
      formData.append("sortOrder", sortOrder); // NEW: Include sort order
      formData.append("isFeatured", isFeatured);
      formData.append("isActive", isActive);

      const response = await fetch(`${API_CONFIG.BASE_URL}/gallery/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${window.authManager.getToken()}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status) {
        showToast("Image uploaded successfully!", "success");

        await loadGallery();
        bootstrap.Modal.getInstance(
          document.getElementById("galleryModal")
        ).hide();
        resetGalleryForm();
        renderStats();
      } else {
        throw new Error(result.message || "Upload failed");
      }
    }
  } catch (error) {
    console.error("Error saving gallery item:", error);
    showToast("Failed to save gallery item: " + error.message, "error");
  } finally {
    hideLoading();
  }
}
async function editGalleryItem(id) {
  try {
    showLoading("Loading image details...");

    // Get item from localStorage first (cached data)
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || "[]");
    const item = list.find((i) => i.id == id);

    if (item) {
      // Populate the form with existing data
      qs("#galleryId").value = item.id;
      qs("#galleryAlt").value = item.alt || "";
      qs("#gallerySortOrder").value = item.sortOrder || 0; // NEW: Set sort order

      // Set checkboxes
      if (qs("#galleryIsFeatured")) {
        qs("#galleryIsFeatured").checked = item.isFeatured || false;
      }
      if (qs("#galleryIsActive")) {
        qs("#galleryIsActive").checked = item.isActive !== false; // default to true
      }

      // Show preview of existing image
      showImagePreview(item.url);

      // Update modal title
      const modalTitle = qs("#galleryModal .modal-title");
      if (modalTitle) {
        modalTitle.textContent = "Edit Gallery Image";
      }

      // Make file upload optional for editing
      const fileInput = qs("#galleryFileUpload");
      if (fileInput) {
        fileInput.removeAttribute("required");
      }

      // Show the modal
      new bootstrap.Modal(document.getElementById("galleryModal")).show();

      showToast("Image details loaded for editing", "success");
    } else {
      showToast("Image not found", "error");
    }
  } catch (error) {
    console.error("Error loading image for edit:", error);
    showToast("Failed to load image details: " + error.message, "error");
  } finally {
    hideLoading();
  }
}
async function updateGalleryItem(id, data) {
  try {
    showLoading("Updating image...");

    const response = await fetch(`${API_CONFIG.BASE_URL}/gallery/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${window.authManager.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && result.status) {
      showToast("Image updated successfully!", "success");

      // Reload gallery and close modal
      await loadGallery();
      bootstrap.Modal.getInstance(
        document.getElementById("galleryModal")
      ).hide();
      resetGalleryForm();
      renderStats();

      return true;
    } else {
      throw new Error(result.message || "Update failed");
    }
  } catch (error) {
    console.error("Error updating gallery item:", error);
    showToast("Failed to update image: " + error.message, "error");
    return false;
  } finally {
    hideLoading();
  }
}
async function deleteGalleryItem(id) {
  try {
    showLoading("Deleting image...");

    const response = await fetch(`${API_CONFIG.BASE_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${window.authManager.getToken()}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok && result.status) {
      showToast("Image deleted successfully!", "success");

      // Reload gallery and update stats
      await loadGallery();
      renderStats();
    } else {
      throw new Error(result.message || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    showToast("Failed to delete image: " + error.message, "error");
  } finally {
    hideLoading();
  }
}

// Products CRUD with API Integration
// Products CRUD with API Integration
async function loadProducts() {
  try {
    showLoading("Loading products...");

    // Fetch from API
    const response = await makeAuthenticatedRequest("/products");
    const result = await response.json();

    if (result.status && result.data) {
      // Transform API data to match existing structure
      const list = result.data.map((item) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        images: item.images || [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      // Save to localStorage as cache
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));

      // Render products table
      renderProductsTable(list);
      showToast("Products loaded successfully!", "success");
    } else {
      throw new Error(result.message || "Failed to load products");
    }
  } catch (error) {
    console.error("Error loading products:", error);
    // Fallback to localStorage
    const cachedList = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"
    );
    renderProductsTable(cachedList);
    showToast("Using cached product data. Check your connection.", "warning");
  } finally {
    hideLoading();
  }
}
function renderProductsTable(list) {
  const tbody = document.querySelector("#productsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  list.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="fw-semibold">${item.name || ""}</td>
      <td>
        <button class="btn btn-sm btn-outline-info me-1 view-details" data-id="${
          item.id
        }">
          <i class="fas fa-eye"></i> View Details
        </button>
        <button class="btn btn-sm btn-outline-primary me-1 edit" data-id="${
          item.id
        }">
          <i class="fas fa-pen"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger del" data-id="${item.id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
async function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const name = document.getElementById("productName").value.trim();
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const imagesText = document.getElementById("productImages").value.trim();

  if (!name || !description) {
    showToast(
      "Please fill in both Product Name and Description fields.",
      "error"
    );
    return;
  }

  // Convert images text to array (split by lines and filter empty ones)
  const images = imagesText
    ? imagesText
        .split("\n")
        .map((img) => img.trim())
        .filter((img) => img)
    : [];

  try {
    showLoading("Saving product...");

    const productData = { name, description, images };

    if (id && id.trim() !== "") {
      // Edit existing product - API call
      const response = await makeAuthenticatedRequest(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        showToast("Product updated successfully!", "success");
      } else {
        throw new Error(result.message || "Failed to update product");
      }
    } else {
      // Add new product - API call
      const response = await makeAuthenticatedRequest("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok && result.status) {
        showToast("Product created successfully!", "success");
      } else {
        throw new Error(result.message || "Failed to create product");
      }
    }

    // Reload products and close modal
    await loadProducts();
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();

    // Reset form properly
    if (typeof window.resetProductForm === "function") {
      window.resetProductForm();
    } else {
      // Fallback reset
      document.getElementById("productForm").reset();
      document.getElementById("productId").value = "";
    }
    renderStats();
  } catch (error) {
    console.error("Error saving product:", error);
    showToast("Failed to save product: " + error.message, "error");
  } finally {
    hideLoading();
  }
}

// Reset product form function
function resetProductForm() {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("productImages").value = "";

  // Reset image selection if functions exist
  if (typeof window.selectedProductImages !== "undefined") {
    window.selectedProductImages = [];
  }
  if (typeof window.updateSelectedImagesDisplay === "function") {
    window.updateSelectedImagesDisplay();
  }

  // Reset modal title
  const modalTitle = document.getElementById("productModalTitle");
  if (modalTitle) {
    modalTitle.textContent = "Add Product";
  }
}
async function editProduct(id) {
  try {
    showLoading("Loading product details...");

    // Get item from localStorage first (cached data)
    const list = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"
    );
    const item = list.find((i) => i.id == id);

    if (item) {
      // Set modal title for editing
      const modalTitle = document.getElementById("productModalTitle");
      if (modalTitle) {
        modalTitle.textContent = "Edit Product";
      }

      // Populate form fields
      document.getElementById("productId").value = item.id;
      document.getElementById("productName").value = item.name;
      document.getElementById("productDescription").value =
        item.description || "";
      document.getElementById("productImages").value = item.images
        ? item.images.join("\n")
        : "";
      console.log("Selected product images:", item.images);

      // FIXED: Properly sync selectedProductImages with existing product images
      if (typeof window.selectedProductImages !== "undefined") {
        window.selectedProductImages = item.images || [];
        console.log(
          "Selected product images updated:",
          window.selectedProductImages
        );

        // Update the visual display
        if (typeof window.updateSelectedImagesDisplay === "function") {
          window.updateSelectedImagesDisplay();
        }
      }

      new bootstrap.Modal(document.getElementById("productModal")).show();
      showToast("Product details loaded for editing", "success");
    } else {
      showToast("Product not found", "error");
    }
  } catch (error) {
    console.error("Error loading product for edit:", error);
    showToast("Failed to load product details: " + error.message, "error");
  } finally {
    hideLoading();
  }
}

async function deleteProduct(id) {
  try {
    showLoading("Deleting product...");

    const response = await makeAuthenticatedRequest(`/products/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok && result.status) {
      showToast("Product deleted successfully!", "success");

      // Reload products and update stats
      await loadProducts();
      renderStats();
    } else {
      throw new Error(result.message || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    showToast("Failed to delete product: " + error.message, "error");
  } finally {
    hideLoading();
  }
}

// Dealers CRUD with API Integration
async function loadDealers() {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || "[]");
  const tbody = qs("#dealersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  list.forEach((item) => {
    const tr = ce("tr");
    const shortMap = item.map
      ? item.map.length > 28
        ? item.map.slice(0, 25) + "..."
        : item.map
      : "";
    tr.innerHTML = `<td>${item.district || ""}</td><td>${
      item.name || ""
    }</td><td>${item.shop || ""}</td><td>${
      item.location || ""
    }</td><td>${shortMap}</td><td>${
      item.contact || ""
    }</td><td><button class="btn btn-sm btn-outline-primary me-1 edit" data-id="${
      item.id
    }"><i class="fas fa-pen"></i></button><button class="btn btn-sm btn-outline-danger del" data-id="${
      item.id
    }"><i class="fas fa-trash"></i></button></td>`;
    tbody.appendChild(tr);
  });
}

async function saveDealer(e) {
  e.preventDefault();
  const id = qs("#dealerId").value;
  const district = qs("#dealerDistrict").value.trim();
  const name = qs("#dealerName").value.trim();
  const shop = qs("#dealerShop").value.trim();
  const location = qs("#dealerLocation").value.trim();
  const map = (qs("#dealerMap")?.value || "").trim();
  const contact = qs("#dealerContact").value.trim();

  if (!district || !name || !shop || !location || !contact) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  try {
    showLoading("Saving dealer...");

    const dealerData = { district, name, shop, location, map, contact };

    // For now, save to localStorage (later integrate with API)
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || "[]");
    if (id) {
      const idx = list.findIndex((i) => i.id == id);
      if (idx > -1)
        list[idx] = {
          ...list[idx],
          district,
          name,
          shop,
          location,
          map,
          contact,
        };
    } else {
      list.push({
        id: generateId(list),
        district,
        name,
        shop,
        location,
        map,
        contact,
      });
    }
    localStorage.setItem(STORAGE_KEYS.DEALERS, JSON.stringify(list));
    loadDealers();
    bootstrap.Modal.getInstance(document.getElementById("dealerModal")).hide();
    qs("#dealerForm").reset();
    qs("#dealerId").value = "";
    renderStats();

    showToast("Dealer saved successfully!", "success");
  } catch (error) {
    console.error("Error saving dealer:", error);
    showToast("Failed to save dealer. Please try again.", "error");
  } finally {
    hideLoading();
  }
}

// Blog CRUD with API Integration
async function loadBlog() {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || "[]");
  const tbody = document.querySelector("#blogTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  list.forEach((post) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${post.title}</td><td>${post.summary}</td><td style="width:120px;"><button class='btn btn-sm btn-outline-primary me-1 edit' data-id='${post.id}'><i class='fas fa-pen'></i></button><button class='btn btn-sm btn-outline-danger del' data-id='${post.id}'><i class='fas fa-trash'></i></button></td>`;
    tbody.appendChild(tr);
  });
}

async function saveBlog(e) {
  e.preventDefault();
  const id = document.getElementById("blogId").value;
  const title = document.getElementById("blogTitle").value.trim();
  const summary = document.getElementById("blogSummary").value.trim();

  if (!title || !summary) {
    showToast("Please fill in both title and summary fields.", "error");
    return;
  }

  try {
    showLoading("Saving blog post...");

    const blogData = { title, summary };

    // For now, save to localStorage (later integrate with API)
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || "[]");
    if (id) {
      const idx = list.findIndex((p) => p.id == id);
      if (idx > -1) list[idx] = { ...list[idx], title, summary };
    } else {
      list.push({ id: generateId(list), title, summary });
    }
    localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(list));
    loadBlog();
    bootstrap.Modal.getInstance(document.getElementById("blogModal")).hide();
    document.getElementById("blogForm").reset();
    document.getElementById("blogId").value = "";
    renderStats();

    showToast("Blog post saved successfully!", "success");
  } catch (error) {
    console.error("Error saving blog post:", error);
    showToast("Failed to save blog post. Please try again.", "error");
  } finally {
    hideLoading();
  }
}

// Search / Filter
function setupSearchFiltering() {
  // Create search bars dynamically above each table/section
  const productsSection = document.querySelector("#products .table-responsive");
  if (productsSection && !document.getElementById("productSearchBox")) {
    const div = document.createElement("div");
    div.className = "mb-2";
    div.innerHTML = `<input id="productSearchBox" type="text" class="form-control form-control-sm" placeholder="Search products..." />`;
    productsSection.parentElement.insertBefore(div, productsSection);
    document
      .getElementById("productSearchBox")
      .addEventListener("input", function () {
        filterTable("#productsTable tbody", this.value);
      });
  }

  const dealersSection = document.querySelector("#dealers .table-responsive");
  if (dealersSection && !document.getElementById("dealerSearchBox")) {
    const div = document.createElement("div");
    div.className = "mb-2";
    div.innerHTML = `<input id="dealerSearchBox" type="text" class="form-control form-control-sm" placeholder="Search dealers..." />`;
    dealersSection.parentElement.insertBefore(div, dealersSection);
    document
      .getElementById("dealerSearchBox")
      .addEventListener("input", function () {
        filterTable("#dealersTable tbody", this.value);
      });
  }

  const gallerySection = document.querySelector("#gallery .row");
  if (gallerySection && !document.getElementById("gallerySearchBox")) {
    const input = document.createElement("input");
    input.id = "gallerySearchBox";
    input.type = "text";
    input.className = "form-control form-control-sm mb-3";
    input.placeholder = "Search gallery images...";
    gallerySection.parentElement.insertBefore(input, gallerySection);
    input.addEventListener("input", function () {
      const term = this.value.toLowerCase();
      document
        .querySelectorAll("#galleryGrid .gallery-card")
        .forEach((card) => {
          const alt = card.querySelector("img").alt.toLowerCase();
          card.style.display = alt.includes(term) ? "block" : "none";
        });
    });
  }
}

function filterTable(selector, term) {
  term = term.toLowerCase();
  document.querySelectorAll(selector + " tr").forEach((tr) => {
    tr.style.display = tr.innerText.toLowerCase().includes(term) ? "" : "none";
  });
}

// Delegated actions with enhanced error handling
function attachDelegates() {
  document.body.addEventListener("click", function (e) {
    // Product View Details
    if (e.target.closest("#productsTable .view-details")) {
      const id = e.target.closest("button").dataset.id;
      const list = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"
      );
      const item = list.find((i) => i.id == id);
      if (item) {
        let html = `<h4 class="mb-3">${item.name || ""}</h4>`;

        // Display product images if available
        if (item.images && item.images.length > 0) {
          html += `<div class="product-images mb-3">`;
          item.images.forEach((imagePath, index) => {
            html += `
              <div class="product-image-container mb-2">
                <img src="${imagePath}" alt="${item.name} - Image ${index + 1}" 
                     class="product-image img-fluid" 
                     style="max-width: 200px; height: auto; border-radius: 8px; cursor: pointer;"
                     onclick="openImageModal('${imagePath}', '${item.name}')"
                     onerror="this.style.display='none'">
              </div>
            `;
          });
          html += `</div>`;
        }

        if (item.description) {
          // Display description with proper formatting
          const formattedDescription = item.description.replace(/\n/g, "<br>");
          html += `<div class="product-description">${formattedDescription}</div>`;
        }
        document.getElementById("adminProductDetailsBody").innerHTML = html;
        var modal = new bootstrap.Modal(
          document.getElementById("adminProductDetailsModal")
        );
        modal.show();
      }
    }

    // Gallery edit
    if (e.target.closest("#galleryGrid .edit")) {
      const id = e.target.closest("button").dataset.id;
      editGalleryItem(id);
    }
    // if (e.target.closest("#galleryGrid .edit")) {
    //   const id = e.target.closest("button").dataset.id;
    //   const list = JSON.parse(
    //     localStorage.getItem(STORAGE_KEYS.GALLERY) || "[]"
    //   );
    //   const item = list.find((i) => i.id == id);
    //   if (item) {
    //     qs("#galleryId").value = item.id;
    //     qs("#galleryUrl").value = item.url;
    //     qs("#galleryAlt").value = item.alt;
    //     new bootstrap.Modal(document.getElementById("galleryModal")).show();
    //   }
    // }

    // Gallery delete
    // Gallery delete - find this section and replace
    if (e.target.closest("#galleryGrid .del")) {
      const id = e.target.closest("button").dataset.id;
      if (!confirm("Delete this image permanently?")) return;

      deleteGalleryItem(id);
    }

    // Product edit
    if (e.target.closest("#productsTable .edit")) {
      const id = e.target.closest("button").dataset.id;
      editProduct(id);
    }

    // Product delete
    if (e.target.closest("#productsTable .del")) {
      const id = e.target.closest("button").dataset.id;
      if (!confirm("Delete this product permanently?")) return;
      deleteProduct(id);
    }

    // Dealer edit
    if (e.target.closest("#dealersTable .edit")) {
      const id = e.target.closest("button").dataset.id;
      const list = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.DEALERS) || "[]"
      );
      const item = list.find((i) => i.id == id);
      if (item) {
        qs("#dealerId").value = item.id;
        qs("#dealerDistrict").value = item.district || "";
        qs("#dealerName").value = item.name || "";
        qs("#dealerShop").value = item.shop || "";
        qs("#dealerLocation").value = item.location || "";
        const mapInput = qs("#dealerMap");
        if (mapInput) mapInput.value = item.map || "";
        qs("#dealerContact").value = item.contact || "";
        new bootstrap.Modal(document.getElementById("dealerModal")).show();
      }
    }

    // Dealer delete
    if (e.target.closest("#dealersTable .del")) {
      const id = e.target.closest("button").dataset.id;
      if (!confirm("Delete this dealer?")) return;
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || "[]");
      list = list.filter((i) => i.id != id);
      localStorage.setItem(STORAGE_KEYS.DEALERS, JSON.stringify(list));
      loadDealers();
      renderStats();
      showToast("Dealer deleted successfully!", "success");
    }

    // Blog edit
    if (e.target.closest("#blogTable .edit")) {
      const id = e.target.closest("button").dataset.id;
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || "[]");
      const item = list.find((i) => i.id == id);
      if (item) {
        document.getElementById("blogId").value = item.id;
        document.getElementById("blogTitle").value = item.title;
        document.getElementById("blogSummary").value = item.summary;
        new bootstrap.Modal(document.getElementById("blogModal")).show();
      }
    }

    // Blog delete
    if (e.target.closest("#blogTable .del")) {
      const id = e.target.closest("button").dataset.id;
      if (!confirm("Delete this blog post?")) return;
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || "[]");
      list = list.filter((i) => i.id != id);
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(list));
      loadBlog();
      renderStats();
      showToast("Blog post deleted successfully!", "success");
    }
  });
}

// Navigation between sections
function setupNav() {
  const navLinks = document.querySelectorAll("#navMenu .nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.dataset.section;
      document
        .querySelectorAll(".panel-section")
        .forEach((sec) => sec.classList.add("d-none"));
      document.getElementById(section).classList.remove("d-none");
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      if (section === "gallery") loadGallery();
      if (section === "products") loadProducts();
      if (section === "dealers") loadDealers();
      if (section === "blog") loadBlog();
      if (section === "dashboard") renderStats();
    });
  });
}

// Forms submission
function setupForms() {
  const galleryForm = document.getElementById("galleryForm");
  if (galleryForm) galleryForm.addEventListener("submit", saveGalleryItem);

  const productForm = document.getElementById("productForm");
  if (productForm) productForm.addEventListener("submit", saveProduct);

  const dealerForm = document.getElementById("dealerForm");
  if (dealerForm) dealerForm.addEventListener("submit", saveDealer);

  const blogForm = document.getElementById("blogForm");
  if (blogForm) blogForm.addEventListener("submit", saveBlog);
}

// Enhanced Auth handling with AuthManager integration
function setupAuth() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        logout();
      }
    });
  }

  // Check authentication status
  if (!isAuthenticated()) {
    console.log("User not authenticated, redirecting to login");
    window.location.href = "login.html";
    return;
  }

  console.log("User authenticated, loading dashboard");
}

// Theme toggle
function setupThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const mobileBtn = document.getElementById("mobileThemeToggle");
  const buttons = [btn, mobileBtn].filter(Boolean);
  if (!buttons.length) return;

  const saved = localStorage.getItem("vaatco_theme");
  if (saved === "light") document.body.classList.add("theme-light");
  updateThemeIcons();

  buttons.forEach((b) => {
    b.addEventListener("click", () => {
      document.body.classList.toggle("theme-light");
      const mode = document.body.classList.contains("theme-light")
        ? "light"
        : "dark";
      localStorage.setItem("vaatco_theme", mode);
      updateThemeIcons();
    });
  });

  function updateThemeIcons() {
    buttons.forEach((b) => {
      const i = b.querySelector("i");
      if (!i) return;
      if (document.body.classList.contains("theme-light")) {
        i.classList.remove("fa-moon");
        i.classList.add("fa-sun");
      } else {
        i.classList.remove("fa-sun");
        i.classList.add("fa-moon");
      }
    });
  }
}

// Viewport height fix
function applyViewportHeightFix() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener("resize", applyViewportHeightFix);
window.addEventListener("orientationchange", () => {
  applyViewportHeightFix();
  // Close sidebar on rotation for safety
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");
  if (sidebar && sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
  }
});

// Public export helpers (to be used on public pages)
function getGalleryItems() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || "[]");
}
function getProducts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]");
}
function getDealers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || "[]");
}
function getBlogPosts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || "[]");
}

// Admin helper functions
function forceLogout() {
  logout();
}

function checkAuthStatus() {
  console.log("Authenticated:", isAuthenticated());
  if (window.authManager) {
    console.log("Current user:", window.authManager.getCurrentUser());
  }
}
async function makeAuthenticatedRequest(endpoint, options = {}) {
  if (!window.authManager) {
    throw new Error("AuthManager not available");
  }

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  try {
    // Don't set Content-Type for FormData - browser handles it
    const headers = {
      Authorization: `Bearer ${window.authManager.getToken()}`,
      ...options.headers,
    };

    // Only set Content-Type if not FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const mergedOptions = {
      ...options,
      headers,
    };

    return await window.authManager.makeAuthenticatedRequest(
      url,
      mergedOptions
    );
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Global exports
window.VAATCO_DATA = { getGalleryItems, getProducts, getDealers, getBlogPosts };
window.VAATCO_ADMIN = { forceLogout, checkAuthStatus, logout, isAuthenticated };

// Enhanced initialization
window.addEventListener("DOMContentLoaded", function () {
  applyViewportHeightFix();
  initStorage();

  // Wait for AuthManager to be available
  if (window.authManager) {
    setupAuth();
  } else {
    // Fallback check
    setTimeout(() => {
      setupAuth();
    }, 100);
  }

  setupNav();
  setupForms();
  attachDelegates();
  renderStats();
  setupSearchFiltering();
  setupThemeToggle();

  // Mobile sidebar toggle
  const toggleBtn = document.getElementById("sidebarToggle");
  const sidebar = document.querySelector(".sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      document.body.classList.toggle("sidebar-open", open);
      toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.body.addEventListener(
      "click",
      (e) => {
        if (document.body.classList.contains("sidebar-open")) {
          if (
            !sidebar.contains(e.target) &&
            e.target !== toggleBtn &&
            !toggleBtn.contains(e.target)
          ) {
            sidebar.classList.remove("open");
            document.body.classList.remove("sidebar-open");
            toggleBtn.setAttribute("aria-expanded", "false");
          }
        }
      },
      true
    );
  }

  console.log("Admin panel initialized with API integration");
});
window.resetGalleryForm = resetGalleryForm;
