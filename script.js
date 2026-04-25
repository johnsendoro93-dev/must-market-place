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
