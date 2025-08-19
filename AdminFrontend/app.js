// Simple Admin Panel (Front-end only demo)
// Storage keys
const STORAGE_KEYS = {
  AUTH: 'vaatco_admin_auth',
  GALLERY: 'vaatco_gallery_items',
  PRODUCTS: 'vaatco_products',
  DEALERS: 'vaatco_dealers',
  BLOG: 'vaatco_blog_posts'
};

// Default demo data (can be removed later)
const defaultData = {
  gallery: [
    { id: 1, url: '../sticker/sticker1.jpeg', alt: 'Sticker 1' },
    { id: 2, url: '../sticker/sticker2.jpeg', alt: 'Sticker 2' }
  ],
  products: [
    { 
      id: 1, 
      name: 'Micro off', 
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

Pack Size: 100gm & 50 gm`
    },
    { 
      id: 2, 
      name: 'Acetaminophen', 
      description: `Widely used pain reliever and a fever reducer.

Key Ingredients:
* Paracetamol

Function:
* Reduces fever and relieves mild to moderate pain.

Dosage & Administration:
* As directed by physician.

Origin: Bangladesh

Pack Size: 25 kg`
    },
    { 
      id: 3, 
      name: 'Ascorbic Acid', 
      description: `Vitamin C, essential for growth and repair of tissues.

Key Ingredients:
* L-Ascorbic Acid

Function:
* Boosts immune system, antioxidant.

Dosage & Administration:
* As directed by physician.

Origin: Bangladesh

Pack Size: 25 kg`
    }
  ],
  dealers: [
    { id: 1, district: 'Dhaka', name: 'Green Farms Supply', shop: 'Green Farms Supply Store', location: 'Dhanmondi, Dhaka', contact: '+88017XXXXXXX' },
    { id: 2, district: 'Chittagong', name: 'Aqua Plus Solutions', shop: 'Aqua Plus Store', location: 'Agrabad, Chittagong', contact: '+88019XXXXXXX' }
  ],
  blog: [
    { id:1, title:'5 Benefits of Zeolite in Aquaculture', summary:'How Zeolite improves water quality and pond health for better growth.' },
    { id:2, title:'How Yucca Improves Pond Water Quality', summary:'Natural reduction of ammonia and odors in aquaculture systems.' }
  ]
};

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.GALLERY)) localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(defaultData.gallery));
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultData.products));
  if (!localStorage.getItem(STORAGE_KEYS.DEALERS)) localStorage.setItem(STORAGE_KEYS.DEALERS, JSON.stringify(defaultData.dealers));
  if (!localStorage.getItem(STORAGE_KEYS.BLOG)) localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(defaultData.blog));
}

// Auth (simple demo - replace with real backend later)
const DEMO_USER = { username: 'admin', password: 'admin123' };

function login(username, password) {
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    return true;
  }
  return false;
}

function isAuthenticated() { return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true'; }
function logout() { 
  localStorage.removeItem(STORAGE_KEYS.AUTH); 
  // Also clear any cached data if needed
  console.log('User logged out');
}

// Utility
function generateId(items) { return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1; }
function qs(sel) { return document.querySelector(sel); }
function ce(tag, cls) { const el = document.createElement(tag); if (cls) el.className = cls; return el; }

// Render Dashboard Stats
function renderStats() {
  const statsRow = qs('#statsRow');
  if (!statsRow) return;
  const gallery = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
  const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  const dealers = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || '[]');
  const blog = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || '[]');
  statsRow.innerHTML = '';
  const tiles = [
    { icon: 'fa-image', label: 'Gallery Items', value: gallery.length },
    { icon: 'fa-box', label: 'Products', value: products.length },
    { icon: 'fa-store', label: 'Dealers', value: dealers.length },
    { icon: 'fa-blog', label: 'Blog Posts', value: blog.length }
  ];
  tiles.forEach(t => {
    const col = ce('div', 'col-md-4 mb-3');
    col.innerHTML = `<div class="stat-tile card-hover"><div class="icon"><i class="fas ${t.icon}"></i></div><div><h6>${t.label}</h6><p class="value">${t.value}</p></div></div>`;
    statsRow.appendChild(col);
  });
}

// Gallery CRUD
function loadGallery() {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
  const grid = qs('#galleryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  list.forEach(item => {
    const col = ce('div', 'col-sm-6 col-md-4 col-lg-3 mb-3');
    col.innerHTML = `<div class="gallery-card card-hover"><img src="${item.url}" alt="${item.alt}" class="thumb"/><div class="actions"><button class="edit" data-id="${item.id}" title="Edit"><i class="fas fa-pen"></i></button><button class="del" data-id="${item.id}" title="Delete"><i class="fas fa-trash"></i></button></div><small class="d-block mt-1 text-muted text-truncate" title="${item.alt}">${item.alt}</small></div>`;
    grid.appendChild(col);
  });
}

function saveGalleryItem(e) {
  e.preventDefault();
  const id = qs('#galleryId').value;
  const url = qs('#galleryUrl').value.trim();
  const alt = qs('#galleryAlt').value.trim();
  if (!url || !alt) return;
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
  if (id) {
    const idx = list.findIndex(i => i.id == id);
    if (idx > -1) list[idx] = { ...list[idx], url, alt };
  } else {
    list.push({ id: generateId(list), url, alt });
  }
  localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(list));
  loadGallery();
  bootstrap.Modal.getInstance(document.getElementById('galleryModal')).hide();
  qs('#galleryForm').reset();
  qs('#galleryId').value='';
  renderStats();
}

// Products CRUD (updated to match sample product list schema)
function loadProducts() {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  const tbody = document.querySelector('#productsTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  list.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="fw-semibold">${item.name||''}</td>
      <td>
        <button class="btn btn-sm btn-outline-info me-1 view-details" data-id="${item.id}"><i class="fas fa-eye"></i> View Details</button>
        <button class="btn btn-sm btn-outline-primary me-1 edit" data-id="${item.id}"><i class="fas fa-pen"></i></button>
        <button class="btn btn-sm btn-outline-danger del" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const name = document.getElementById('productName').value.trim();
  const description = document.getElementById('productDescription').value.trim();

  if(!name || !description) {
    alert('Please fill in both Product Name and Description fields.');
    return;
  }

  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  if (id) {
    const idx = list.findIndex(i => i.id == id);
    if (idx > -1) list[idx] = { 
      ...list[idx], 
      name, 
      description
    };
  } else {
    list.push({ 
      id: generateId(list), 
      name, 
      description
    });
  }
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
  loadProducts();
  bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
  document.getElementById('productForm').reset();
  document.getElementById('productId').value='';
  renderStats();
}

// Dealers CRUD
function loadDealers() {
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || '[]');
  const tbody = qs('#dealersTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  list.forEach(item => {
    const tr = ce('tr');
    const shortMap = item.map ? (item.map.length > 28 ? item.map.slice(0,25)+'...' : item.map) : '';
    tr.innerHTML = `<td>${item.district || ''}</td><td>${item.name || ''}</td><td>${item.shop || ''}</td><td>${item.location || ''}</td><td>${shortMap}</td><td>${item.contact || ''}</td><td><button class="btn btn-sm btn-outline-primary me-1 edit" data-id="${item.id}"><i class="fas fa-pen"></i></button><button class="btn btn-sm btn-outline-danger del" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>`;
    tbody.appendChild(tr);
  });
}

// Blog CRUD
function loadBlog(){
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || '[]');
  const tbody = document.querySelector('#blogTable tbody');
  if(!tbody) return;
  tbody.innerHTML='';
  list.forEach(post=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${post.title}</td><td>${post.summary}</td><td style="width:120px;"><button class='btn btn-sm btn-outline-primary me-1 edit' data-id='${post.id}'><i class='fas fa-pen'></i></button><button class='btn btn-sm btn-outline-danger del' data-id='${post.id}'><i class='fas fa-trash'></i></button></td>`;
    tbody.appendChild(tr);
  });
}
function saveBlog(e){
  e.preventDefault();
  const id = document.getElementById('blogId').value;
  const title = document.getElementById('blogTitle').value.trim();
  const summary = document.getElementById('blogSummary').value.trim();
  if(!title || !summary) return;
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || '[]');
  if(id){
    const idx = list.findIndex(p=>p.id==id);
    if(idx>-1) list[idx] = { ...list[idx], title, summary };
  } else {
    list.push({ id: generateId(list), title, summary });
  }
  localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(list));
  loadBlog();
  bootstrap.Modal.getInstance(document.getElementById('blogModal')).hide();
  document.getElementById('blogForm').reset();
  document.getElementById('blogId').value='';
  renderStats();
}

function saveDealer(e) {
  e.preventDefault();
  const id = qs('#dealerId').value;
  const district = qs('#dealerDistrict').value.trim();
  const name = qs('#dealerName').value.trim();
  const shop = qs('#dealerShop').value.trim();
  const location = qs('#dealerLocation').value.trim();
  const map = (qs('#dealerMap')?.value || '').trim();
  const contact = qs('#dealerContact').value.trim();
  if (!district || !name || !shop || !location || !contact) return;
  const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || '[]');
  if (id) {
    const idx = list.findIndex(i => i.id == id);
    if (idx > -1) list[idx] = { ...list[idx], district, name, shop, location, map, contact };
  } else {
    list.push({ id: generateId(list), district, name, shop, location, map, contact });
  }
  localStorage.setItem(STORAGE_KEYS.DEALERS, JSON.stringify(list));
  loadDealers();
  bootstrap.Modal.getInstance(document.getElementById('dealerModal')).hide();
  qs('#dealerForm').reset();
  qs('#dealerId').value='';
  renderStats();
}

// Search / Filter
function setupSearchFiltering(){
  // Create search bars dynamically above each table/section
  const productsSection = document.querySelector('#products .table-responsive');
  if(productsSection && !document.getElementById('productSearchBox')){
    const div = document.createElement('div');
    div.className='mb-2';
    div.innerHTML = `<input id="productSearchBox" type="text" class="form-control form-control-sm" placeholder="Search products..." />`;
    productsSection.parentElement.insertBefore(div, productsSection);
    document.getElementById('productSearchBox').addEventListener('input', function(){
      filterTable('#productsTable tbody', this.value);
    });
  }
  const dealersSection = document.querySelector('#dealers .table-responsive');
  if(dealersSection && !document.getElementById('dealerSearchBox')){
    const div = document.createElement('div');
    div.className='mb-2';
    div.innerHTML = `<input id="dealerSearchBox" type="text" class="form-control form-control-sm" placeholder="Search dealers..." />`;
    dealersSection.parentElement.insertBefore(div, dealersSection);
    document.getElementById('dealerSearchBox').addEventListener('input', function(){
      filterTable('#dealersTable tbody', this.value);
    });
  }
  const gallerySection = document.querySelector('#gallery .row');
  if(gallerySection && !document.getElementById('gallerySearchBox')){
    const input = document.createElement('input');
    input.id='gallerySearchBox';
    input.type='text';
    input.className='form-control form-control-sm mb-3';
    input.placeholder='Search gallery images...';
    gallerySection.parentElement.insertBefore(input, gallerySection);
    input.addEventListener('input', function(){
      const term = this.value.toLowerCase();
      document.querySelectorAll('#galleryGrid .gallery-card').forEach(card=>{
        const alt = card.querySelector('img').alt.toLowerCase();
        card.style.display = alt.includes(term)?'block':'none';
      });
    });
  }
}
function filterTable(selector, term){
  term = term.toLowerCase();
  document.querySelectorAll(selector+' tr').forEach(tr=>{
    tr.style.display = tr.innerText.toLowerCase().includes(term)?'':'none';
  });
}

// Delegated actions
function attachDelegates() {
  document.body.addEventListener('click', function(e) {
    // Product View Details
    if (e.target.closest('#productsTable .view-details')) {
      const id = e.target.closest('button').dataset.id;
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const item = list.find(i => i.id == id);
      if (item) {
        let html = `<h4 class="mb-3">${item.name||''}</h4>`;
        if (item.description) {
          // Display description with proper formatting
          const formattedDescription = item.description.replace(/\n/g, '<br>');
          html += `<div class="product-description">${formattedDescription}</div>`;
        }
        document.getElementById('adminProductDetailsBody').innerHTML = html;
        var modal = new bootstrap.Modal(document.getElementById('adminProductDetailsModal'));
        modal.show();
      }
    }
    if (e.target.closest('#galleryGrid .edit')) {
      const id = e.target.closest('button').dataset.id;
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
      const item = list.find(i => i.id == id);
      if (item) {
        qs('#galleryId').value = item.id;
        qs('#galleryUrl').value = item.url;
        qs('#galleryAlt').value = item.alt;
        new bootstrap.Modal(document.getElementById('galleryModal')).show();
      }
    }
    if (e.target.closest('#galleryGrid .del')) {
      const id = e.target.closest('button').dataset.id;
      if (!confirm('Delete this image?')) return;
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
      list = list.filter(i => i.id != id);
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(list));
      loadGallery();
      renderStats();
    }

  if (e.target.closest('#productsTable .edit')) {
      const id = e.target.closest('button').dataset.id;
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const item = list.find(i => i.id == id);
      if (item) {
        qs('#productId').value = item.id;
        qs('#productName').value = item.name;
        qs('#productDescription').value = item.description || '';
        new bootstrap.Modal(document.getElementById('productModal')).show();
      }
    }
    if (e.target.closest('#productsTable .del')) {
      const id = e.target.closest('button').dataset.id;
      if (!confirm('Delete this product?')) return;
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      list = list.filter(i => i.id != id);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(list));
      loadProducts();
      renderStats();
    }

  if (e.target.closest('#dealersTable .edit')) {
      const id = e.target.closest('button').dataset.id;
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || '[]');
      const item = list.find(i => i.id == id);
      if (item) {
        qs('#dealerId').value = item.id;
        qs('#dealerDistrict').value = item.district || '';
        qs('#dealerName').value = item.name || '';
        qs('#dealerShop').value = item.shop || '';
        qs('#dealerLocation').value = item.location || '';
    const mapInput = qs('#dealerMap'); if(mapInput) mapInput.value = item.map || '';
    qs('#dealerContact').value = item.contact || '';
        new bootstrap.Modal(document.getElementById('dealerModal')).show();
      }
    }
    if (e.target.closest('#dealersTable .del')) {
      const id = e.target.closest('button').dataset.id;
      if (!confirm('Delete this dealer?')) return;
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || '[]');
      list = list.filter(i => i.id != id);
      localStorage.setItem(STORAGE_KEYS.DEALERS, JSON.stringify(list));
      loadDealers();
      renderStats();
    }
    if (e.target.closest('#blogTable .edit')) {
      const id = e.target.closest('button').dataset.id;
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || '[]');
      const item = list.find(i=> i.id==id);
      if(item){
        document.getElementById('blogId').value = item.id;
        document.getElementById('blogTitle').value = item.title;
        document.getElementById('blogSummary').value = item.summary;
        new bootstrap.Modal(document.getElementById('blogModal')).show();
      }
    }
    if (e.target.closest('#blogTable .del')) {
      const id = e.target.closest('button').dataset.id;
      if(!confirm('Delete this blog post?')) return;
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || '[]');
      list = list.filter(i=> i.id != id);
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(list));
      loadBlog();
      renderStats();
    }
  });
}

// Navigation between sections
function setupNav() {
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      const section = this.dataset.section;
      document.querySelectorAll('.panel-section').forEach(sec => sec.classList.add('d-none'));
      document.getElementById(section).classList.remove('d-none');
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      if (section === 'gallery') loadGallery();
      if (section === 'products') loadProducts();
      if (section === 'dealers') loadDealers();
  if (section === 'blog') loadBlog();
      if (section === 'dashboard') renderStats();
    });
  });
}

// Forms submission
function setupForms() {
  const galleryForm = document.getElementById('galleryForm');
  if (galleryForm) galleryForm.addEventListener('submit', saveGalleryItem);
  const productForm = document.getElementById('productForm');
  if (productForm) productForm.addEventListener('submit', saveProduct);
  const dealerForm = document.getElementById('dealerForm');
  if (dealerForm) dealerForm.addEventListener('submit', saveDealer);
  const blogForm = document.getElementById('blogForm');
  if (blogForm) blogForm.addEventListener('submit', saveBlog);
}

// Auth handling
function setupAuth() {
  const authView = document.getElementById('authView');
  const panelView = document.getElementById('panelView');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  
  console.log('Setting up auth...', { authView, panelView, loginForm, logoutBtn });
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const u = document.getElementById('username').value.trim();
      const p = document.getElementById('password').value.trim();
      if (login(u,p)) {
        console.log('Login successful');
        authView.classList.add('d-none');
        panelView.classList.remove('d-none');
        renderStats();
      } else {
        alert('Invalid credentials. Use username: admin, password: admin123');
      }
    });
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(){
      console.log('Logout clicked');
      logout();
      location.reload();
    });
  }
  
  // Show appropriate view based on authentication status
  const isAuth = isAuthenticated();
  console.log('Auth status:', isAuth);
  
  if (isAuth) {
    if (authView) authView.classList.add('d-none');
    if (panelView) panelView.classList.remove('d-none');
    renderStats();
  } else {
    if (authView) authView.classList.remove('d-none');
    if (panelView) panelView.classList.add('d-none');
  }
}

// Theme toggle
function setupThemeToggle(){
  const btn = document.getElementById('themeToggle');
  const mobileBtn = document.getElementById('mobileThemeToggle');
  const buttons = [btn, mobileBtn].filter(Boolean);
  if(!buttons.length) return;
  const saved = localStorage.getItem('vaatco_theme');
  if(saved === 'light') document.body.classList.add('theme-light');
  updateThemeIcons();
  buttons.forEach(b=>{
    b.addEventListener('click', ()=>{
      document.body.classList.toggle('theme-light');
      const mode = document.body.classList.contains('theme-light') ? 'light':'dark';
      localStorage.setItem('vaatco_theme', mode);
      updateThemeIcons();
    });
  });
  function updateThemeIcons(){
    buttons.forEach(b=>{
      const i = b.querySelector('i');
      if(!i) return;
      if(document.body.classList.contains('theme-light')){
        i.classList.remove('fa-moon');
        i.classList.add('fa-sun');
      } else {
        i.classList.remove('fa-sun');
        i.classList.add('fa-moon');
      }
    });
  }
}

// Viewport height fix
function applyViewportHeightFix(){
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', applyViewportHeightFix);
window.addEventListener('orientationchange', ()=>{
  applyViewportHeightFix();
  // Close sidebar on rotation for safety
  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  if(sidebar && sidebar.classList.contains('open')){
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
    if(toggleBtn) toggleBtn.setAttribute('aria-expanded','false');
  }
});

// Public export helpers (to be used on public pages)
function getGalleryItems() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]'); }
function getProducts() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]'); }
function getDealers() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.DEALERS) || '[]'); }
function getBlogPosts() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOG) || '[]'); }

// Admin helper functions
function forceLogout() {
  logout();
  location.reload();
}

function checkAuthStatus() {
  console.log('Authenticated:', isAuthenticated());
  console.log('Auth token:', localStorage.getItem(STORAGE_KEYS.AUTH));
}

window.VAATCO_DATA = { getGalleryItems, getProducts, getDealers, getBlogPosts };
window.VAATCO_ADMIN = { forceLogout, checkAuthStatus, login, logout, isAuthenticated };

// Init
window.addEventListener('DOMContentLoaded', function(){
  applyViewportHeightFix();
  initStorage();
  setupAuth();
  setupNav();
  setupForms();
  attachDelegates();
  renderStats();
  setupSearchFiltering();
  setupThemeToggle();
  // Mobile sidebar toggle
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  if(toggleBtn && sidebar){
    toggleBtn.addEventListener('click', ()=>{
      const open = sidebar.classList.toggle('open');
      document.body.classList.toggle('sidebar-open', open);
      toggleBtn.setAttribute('aria-expanded', open ? 'true':'false');
    });
    document.body.addEventListener('click', (e)=>{
      if(document.body.classList.contains('sidebar-open')){
        if(!sidebar.contains(e.target) && e.target!==toggleBtn && !toggleBtn.contains(e.target)){
          sidebar.classList.remove('open');
          document.body.classList.remove('sidebar-open');
          toggleBtn.setAttribute('aria-expanded','false');
        }
      }
    }, true);
  }
});
