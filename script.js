// 1. INITIALIZE SUPABASE
const supabaseUrl = 'YOUR_SUPABASE_URL_HERE'; 
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Ensure the library loaded from HTML
if (!window.supabase) {
    alert("System Error: Cloud database library failed to load.");
}
const _supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. UI CONTROLS
function openPostModal() { document.getElementById('postModal').style.display = 'block'; }
function closePostModal() { document.getElementById('postModal').style.display = 'none'; }

// 3. FETCH LIVE ITEMS (The "Read" Operation)
async function fetchItems() {
    const feed = document.getElementById('marketplace-feed');
    feed.innerHTML = '<div class="loader">Loading campus items...</div>';

    try {
        const { data: products, error } = await _supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (products.length === 0) {
            feed.innerHTML = '<p style="text-align:center; width:100%;">No items currently. Be the first to post!</p>';
            return;
        }

        // Clear feed and render items
        feed.innerHTML = '';
        products.forEach(item => {
            // Format phone number for WhatsApp (remove leading 0, add 255)
            let phone = item.phone || ''; // Fallback if no phone
            if (phone.startsWith('0')) phone = '255' + phone.substring(1);
            
            const whatsappLink = `https://wa.me/${phone}?text=Hello! I saw your ${item.name} on MUST Marketplace.`;

            feed.innerHTML += `
                <div class="glass-card">
                    <h3>${item.name}</h3>
                    <p class="price-tag">${parseInt(item.price).toLocaleString()} TZS</p>
                    <p>${item.description}</p>
                    <small>Posted: ${new Date(item.created_at).toLocaleDateString()}</small><br>
                    <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">💬 Chat on WhatsApp</a>
                </div>
            `;
        });
    } catch (err) {
        console.error("Fetch Error:", err);
        feed.innerHTML = `<p style="color:red;">Failed to load items. Error: ${err.message}</p>`;
    }
}

// 4. POST NEW ITEM (The "Write" Operation)
async function handlePost(event) {
    event.preventDefault(); // Stop page reload
    
    const btn = document.getElementById('submitBtn');
    btn.innerText = 'Posting...';
    btn.disabled = true;

    const name = document.getElementById('itemName').value;
    const price = document.getElementById('itemPrice').value;
    const desc = document.getElementById('itemDesc').value;
    const phone = document.getElementById('sellerPhone').value; // New column needed in DB!

    try {
        const { error } = await _supabase
            .from('products')
            .insert([{ name: name, price: price, description: desc, phone: phone }]);

        if (error) throw error;

        alert("Successfully posted to MUST Marketplace!");
        document.getElementById('postForm').reset();
        closePostModal();
        fetchItems(); // Instantly reload feed

    } catch (err) {
        console.error("Post Error:", err);
        alert("Failed to post: " + err.message);
    } finally {
        btn.innerText = 'Post to Marketplace';
        btn.disabled = false;
    }
}

// 5. START UP
document.addEventListener('DOMContentLoaded', fetchItems);
