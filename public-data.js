// Public side dynamic loaders pulling from localStorage filled by Admin panel
(function(){
  const STORAGE_KEYS = {
    GALLERY: 'vaatco_gallery_items',
    PRODUCTS: 'vaatco_products',
    DEALERS: 'vaatco_dealers'
  };
  function get(key){ try{return JSON.parse(localStorage.getItem(key)||'[]');}catch(e){return [];} }

  // Product List page dynamic table
  function populateProductsPage(){
    const tbody = document.getElementById('dynamicProductTableBody');
    if(!tbody) return;
    const products = get(STORAGE_KEYS.PRODUCTS);
    tbody.innerHTML='';
    products.forEach((p,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="text-center">${i+1}</td><td class="product-name">${p.name}</td><td class="product-type">${p.type}</td><td>${p.genericName||''}</td><td>${p.packSize||''}</td><td>${p.packingType||''}</td>`;
      tbody.appendChild(tr);
    });
  }

  // Home page gallery (4 items max currently)
  function populateGallery(){
    const gallerySection = document.querySelector('#gallery .row');
    if(!gallerySection) return;
    const images = get(STORAGE_KEYS.GALLERY);
    if(!images.length) return;
    // Clear existing image columns (only those with gallery-item)
    gallerySection.querySelectorAll('.gallery-item').forEach(c=>c.parentElement.remove());
    images.slice(0,12).forEach(img=>{
      const col = document.createElement('div');
      col.className='col-lg-3 col-md-4 col-sm-6 mb-4';
      col.innerHTML = `<div class="gallery-item"><div class="gallery-image-wrapper"><img src="${img.url}" alt="${img.alt}" class="img-fluid gallery-image" onclick="openImagePreview(this)"><div class="gallery-overlay"><i class="fas fa-search-plus fa-2x text-white"></i></div></div></div>`;
      gallerySection.appendChild(col);
    });
  }

  // Dealers table on index (if present)
  function populateDealers(){
    const dealerTableBody = document.querySelector('#dealers table tbody');
    if(!dealerTableBody) return;
    const dealers = get(STORAGE_KEYS.DEALERS);
    if(!dealers.length) return;
    dealerTableBody.innerHTML='';
    dealers.forEach(d=>{
      const tr=document.createElement('tr');
      tr.innerHTML = `<td>${d.district}</td><td>${d.name}</td><td>${d.contact}</td>`;
      dealerTableBody.appendChild(tr);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    populateProductsPage();
    populateGallery();
    populateDealers();
  });
})();
