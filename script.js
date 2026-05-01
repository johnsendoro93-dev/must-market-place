const sellForm = document.getElementById('sell-form');
const requestForm = document.getElementById('request-form');
const productsGrid = document.getElementById('products-grid');
const requestsGrid = document.getElementById('requests-grid');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');

// --- Initialization ---
function loadMarketplace() {
    const savedItems = localStorage.getItem('mustMarketHTML_Decorated_v1');
    if (savedItems && savedItems.trim() !== "") {
        productsGrid.innerHTML = savedItems;
    }
    
    const savedRequests = localStorage.getItem('mustMarketRequests_Decorated_v1');
    if (savedRequests && savedRequests.trim() !== "") {
        requestsGrid.innerHTML = savedRequests;
    }
    
    checkEmptyState();
}

// --- Create New Listing (FOR SALE) ---
sellForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const price = document.getElementById('item-price').value;
    const cat = document.getElementById('item-category').value;
    const phone = document.getElementById('item-phone').value;
    const imageFile = document.getElementById('item-image').files[0];

    // Placeholder image if file is somehow missing, though form requires it
    let imageSrc = "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600"; // Generic MUST Tech Placeholder

    const reader = new FileReader();
    reader.onload = function(event) {
        imageSrc = event.target.result;
        createProductCard(name, price, cat, phone, imageSrc);
    };
    reader.readAsDataURL(imageFile);
});

function createProductCard(name, price, cat, phone, img) {
    const card = document.createElement('div');
    card.className = 'product-card animate-pop';
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Pro WhatsApp Link
    const waText = encodeURIComponent(`Habari! I am a MUST student interested in your *${name}* listed for ${Number(price).toLocaleString()} TZS. Is it still available?`);
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    card.innerHTML = `
        <img src="${img}" class="product-img" alt="${name}">
        <div class="product-info">
            <span class="category-badge">${cat}</span>
            <p class="product-name">${name}</p>
            <p class="product-price">${Number(price).toLocaleString()} TZS</p>
        </div>
        <div class="card-actions">
            <a href="${waLink}" target="_blank" class="whatsapp-btn">💬 Chat on WhatsApp</a>
            <button class="delete-btn product-delete">Remove Listing</button>
        </div>
    `;

    productsGrid.prepend(card);
    saveData();
    sellForm.reset();
}

// --- Create New Request (WANTED) ---
requestForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('req-name').value;
    const budget = document.getElementById('req-budget').value;
    const phone = document.getElementById('req-phone').value;

    createRequestCard(name, budget, phone);
});

function createRequestCard(name, budget, phone) {
    const card = document.createElement('div');
    card.className = 'product-card request-card animate-pop'; 
    const cleanPhone = phone.replace(/\D/g, '');
    
    const waText = encodeURIComponent(`Habari! I saw your request on the MUST Marketplace Board. You are looking for *${name}*. I have it for sale!`);
    const waLink = `https://wa.me/${cleanPhone}?text=${waText}`;

    card.innerHTML = `
        <div class="product-info">
            <span class="request-badge">Wanted Item</span>
            <p class="product-name">Looking for: ${name}</p>
            <p class="request-price">Budget: ${Number(budget).toLocaleString()} TZS</p>
        </div>
        <div class="card-actions">
            <a href="${waLink}" target="_blank" class="whatsapp-btn">👋 I Have This Item</a>
            <button class="delete-btn request-delete">Remove Request</button>
        </div>
    `;

    requestsGrid.prepend(card);
    saveRequests();
    requestForm.reset();
}

// --- Delete Handling ---
document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('product-delete')) {
        if(confirm("Mark this item as sold and remove from the market?")) {
            e.target.closest('.product-card').remove();
            saveData();
        }
    }
    if (e.target.classList.contains('request-delete')) {
        if(confirm("Remove this item request?")) {
            e.target.closest('.product-card').remove();
            saveRequests();
        }
    }
});

// --- Memory Management ---
function saveData() {
    localStorage.setItem('mustMarketHTML_Decorated_v1', productsGrid.innerHTML);
    checkEmptyState();
}

function saveRequests() {
    localStorage.setItem('mustMarketRequests_Decorated_v1', requestsGrid.innerHTML);
}

function checkEmptyState() {
    const cards = productsGrid.querySelectorAll('.product-card');
    if (cards.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// --- Search Filter ---
searchBtn.addEventListener('click', function() {
    const term = searchInput.value.toLowerCase();
    
    // Search products
    const pCards = productsGrid.querySelectorAll('.product-card');
    let visibleCount = 0;
    pCards.forEach(c => {
        if(c.textContent.toLowerCase().includes(term)) {
            c.style.display = 'flex';
            visibleCount++;
        } else {
            c.style.display = 'none';
        }
    });

    if (visibleCount === 0 && pCards.length > 0) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = '<h3>No matches found</h3><p>Try searching for a different keyword or post a Request below!</p>';
    } else {
        checkEmptyState();
    }
});

// Start app
loadMarketplace();
