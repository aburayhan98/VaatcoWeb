// Simple dealers loader - guaranteed to work
console.log('Dealers loader script started');

function simpleDealersLoader() {
    console.log('Simple dealers loader function called');
    
    const dealersGrid = document.getElementById('dealersGrid');
    const dealersLoading = document.getElementById('dealersLoading');
    
    if (!dealersGrid) {
        console.error('dealersGrid not found');
        return;
    }
    
    console.log('Found dealersGrid, loading dealers...');
    
    // Hide loading message
    if (dealersLoading) {
        dealersLoading.style.display = 'none';
    }
    
    // Sample dealers data
    const dealers = [
        {
            district: 'Dhaka',
            name: 'Abu Rayhan',
            shop: 'Rayhans Aqua Care',
            location: 'DIT project, Merul Badda',
            contact: '+880171234567'
        },
        {
            district: 'Chittagong',
            name: 'Rizwan Rifat',
            shop: 'Marine Fish Center',
            location: 'Agrabad, Chittagong',
            contact: '+880191234567'
        },
        {
            district: 'Khulna',
            name: 'Ali Haider',
            shop: 'Shrimp Farmers Hub',
            location: 'Sonadanga, Khulna',
            contact: '+880181234567'
        },
        {
            district: 'Sylhet',
            name: 'Rakib Hassan',
            shop: 'Tea Garden Fish Farm',
            location: 'Zindabazar,  Zindabazar Market, Sylhet',
            contact: '+880171234568'
        },
        {
            district: 'Rajshahi',
            name: 'Mainul Islam',
            shop: 'Silk City Aqua',
            location: 'Shaheb Bazar, Rajshahi',
            contact: '+880181234568'
        },
        {
            district: 'Barisal',
            name: 'Ali Abdullah',
            shop: 'Coastal Fish Solutions',
            location: 'Band Road, Barisal',
            contact: '+880191234568'
        }
    ];
    
    // Generate HTML for dealers
    let dealersHTML = '';
    dealers.forEach(dealer => {
        const contactNumber = dealer.contact.replace(/\D/g, '');
        const whatsappLink = `https://wa.me/88${contactNumber.startsWith('0') ? contactNumber.slice(1) : contactNumber}`;
        const locationLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.location + ', Bangladesh')}`;
        
        dealersHTML += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="dealer-card">
                    <div class="dealer-card-header">
                        <div class="dealer-district">${dealer.district}</div>
                    </div>
                    <div class="dealer-card-body">
                        <div class="dealer-name">${dealer.name}</div>
                        <div class="dealer-shop">${dealer.shop}</div>
                        
                        <div class="dealer-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${dealer.location}</span>
                        </div>
                        
                        <div class="dealer-info-item">
                            <i class="fas fa-phone"></i>
                            <span>${dealer.contact}</span>
                        </div>
                        
                        <div class="mt-3">
                            <a href="${whatsappLink}" target="_blank" class="dealer-contact-btn">
                                <i class="fab fa-whatsapp"></i>
                                WhatsApp
                            </a>
                            <a href="${locationLink}" target="_blank" class="dealer-location-btn">
                                <i class="fas fa-map"></i>
                                Map
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Insert the HTML
    dealersGrid.innerHTML = dealersHTML;
    console.log('Dealers loaded successfully');
}

// Multiple ways to ensure it loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', simpleDealersLoader);
} else {
    simpleDealersLoader();
}

// Backup loader
setTimeout(simpleDealersLoader, 1000);
setTimeout(simpleDealersLoader, 3000);
