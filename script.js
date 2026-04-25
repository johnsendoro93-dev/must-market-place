// 1. CONNECTION (Replace with your actual keys from Supabase)
const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 2. UI LOGIC (Keep your old "Open/Close Form" functions here)
function openPostForm() {
    document.getElementById('postModal').style.display = 'block';
}

function closePostForm() {
    document.getElementById('postModal').style.display = 'none';
}

// 3. CLOUD SAVING (The new part)
async function addNewItem(event) {
    event.preventDefault(); 

    // Get values from your HTML inputs
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const desc = document.getElementById('itemDesc').value;

    // Send to Supabase
    const { data, error } = await _supabase
        .from('products')
        .insert([{ name, price, description: desc }]);

    if (error) {
        alert("Aisee, upload failed: " + error.message);
    } else {
        alert("Post Successful! It is now live for all MUST students.");
        document.getElementById('postForm').reset(); 
        closePostForm();
        loadMarketplaceItems(); // Refresh the list
    }
}

// 4. CLOUD LOADING (The part that lets others see your posts)
async function loadMarketplaceItems() {
    const { data: products, error } = await _supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Fetch Error:", error);
        return;
    }

    const container = document.getElementById('item-list');
    container.innerHTML = ''; 

    products.forEach(item => {
        container.innerHTML += `
            <div class="product-card">
                <h3>${item.name}</h3>
                <p class="price">${item.price} TZS</p>
                <p>${item.description}</p>
                <small>Posted: ${new Date(item.created_at).toLocaleDateString()}</small>
            </div>
        `;
    });
}
// RESTORING TO ORIGINAL LOCAL VERSION
let items = [];

function openPostForm() {
    document.getElementById('postModal').style.display = 'block';
}

function closePostForm() {
    document.getElementById('postModal').style.display = 'none';
}

function addNewItem(event) {
    event.preventDefault();
    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const desc = document.getElementById('itemDesc').value;

    const newItem = { name, price, desc };
    items.push(newItem);
    
    renderItems();
    document.getElementById('postForm').reset();
    closePostForm();
}

function renderItems() {
    const list = document.getElementById('item-list');
    list.innerHTML = '';
    items.forEach(item => {
        list.innerHTML += `
            <div class="product-card">
                <h3>${item.name}</h3>
                <p>Price: ${item.price} TZS</p>
                <p>${item.desc}</p>
            </div>`;
    });
}
// 5. INITIALIZE
window.onload = loadMarketplaceItems;
