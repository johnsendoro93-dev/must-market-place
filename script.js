// 1. Connection (DOUBLE CHECK YOUR KEYS)
const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseKey = 'YOUR_ANON_KEY';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadMarketplaceItems() {
    console.log("Attempting to fetch items..."); // Debug line
    const { data: products, error } = await _supabase
        .from('products')
        .select('*');

    if (error) {
        console.error("Database Error:", error.message);
        return;
    }

    const container = document.getElementById('item-list');
    if (!container) {
        console.error("Error: Could not find HTML element with id 'item-list'");
        return;
    }

    container.innerHTML = ''; 

    if (products.length === 0) {
        container.innerHTML = '<p>No items found. Be the first to post!</p>';
    }

    products.forEach(item => {
        container.innerHTML += `
            <div class="product-card" style="border:1px solid #ccc; margin:10px; padding:10px;">
                <h3>${item.name}</h3>
                <p><b>${item.price} TZS</b></p>
                <p>${item.description}</p>
            </div>`;
    });
}

async function addNewItem(event) {
    event.preventDefault();
    
    // Check if these IDs exist in your HTML!
    const nameInput = document.getElementById('itemName');
    const priceInput = document.getElementById('itemPrice');
    const descInput = document.getElementById('itemDesc');

    const { data, error } = await _supabase
        .from('products')
        .insert([
            { 
              name: nameInput.value, 
              price: priceInput.value, 
              description: descInput.value 
            }
        ]);

    if (error) {
        console.error("Upload Error:", error.message);
        alert("Error: " + error.message);
    } else {
        alert("Post Successful!");
        loadMarketplaceItems(); // Refresh the list
    }
}

// Load items when the page opens
document.addEventListener('DOMContentLoaded', loadMarketplaceItems);
