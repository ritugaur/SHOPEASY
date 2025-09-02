document.addEventListener('DOMContentLoaded', () => {   
  const main = document.getElementById("store");
  const cartDisplay = document.getElementById('cart');
  const storeSection = document.getElementById('store');
  const checkoutSection = document.getElementById('checkout');
  const searchInput = document.getElementById('search'); 
  const searchBtn = document.getElementById('searchBtn');
  const topBtn = document.getElementById("topBtn");
  let cart = [];

  // Products
  const products = [];

  // FashionHub - 20 items
  const fashionNames = ["T-Shirt","Shirt","Jeans","Jacket","Sneakers","Hat","Socks","Dress","Coat","Scarf","Gloves","Shoes","Skirt","Hoodie","Shorts","Sweater","Belt","Watch","Tie","Bag"];
  const fashionEmojis = ["👕","👔","👖","🧥","👟","🎩","🧦","👗","🧥","🧣","🧤","👞","👚","🧥","🩳","🧥","👖","⌚","👔","👜"];
  for(let i = 0; i < 20; i++){
    products.push({ 
      name: fashionNames[i], 
      price: Math.floor(Math.random() * 50) + 10, 
      emoji: fashionEmojis[i], 
      category: "FashionHub" 
    });
  }

  // Electronics - 20 items
  const electronicsNames = ["Laptop","Phone","Tablet","Camera","Headphones","Speaker","Monitor","Mouse","Keyboard","Charger","Router","Smartwatch","Drone","Microphone","Projector","Printer","Webcam","VR Headset","Power Bank","Flash Drive"];
  const electronicsEmojis = ["💻","📱","📱","📷","🎧","🔊","🖥️","🖱️","⌨️","🔌","📡","⌚","🛸","🎤","📽️","🖨️","📷","🕶️","🔋","💾"];
  for(let i = 0; i < 20; i++){
    products.push({ 
      name: electronicsNames[i], 
      price: Math.floor(Math.random() * 500) + 50, 
      emoji: electronicsEmojis[i], 
      category: "Electronics" 
    });
  }

  // Grocery - 20 items
  const groceryNames = ["Milk","Bread","Eggs","Cheese","Butter","Rice","Pasta","Tomato","Potato","Onion","Apple","Banana","Orange","Juice","Coffee","Tea","Sugar","Salt","Oil","Yogurt"];
  const groceryEmojis = ["🥛","🍞","🥚","🧀","🧈","🍚","🍝","🍅","🥔","🧅","🍎","🍌","🍊","🧃","☕","🍵","🍬","🧂","🛢️","🥛"];
  for(let i = 0; i < 20; i++){
    products.push({ 
      name: groceryNames[i], 
      price: Math.floor(Math.random() * 20) + 1, 
      emoji: groceryEmojis[i], 
      category: "Grocery" 
    });
  }

  // Display products
  function displayProducts(list){
    main.innerHTML = "";
    main.style.display = "grid";
    list.forEach((product, index) => {
      const productDiv = document.createElement("div");
      productDiv.className = "product";
      productDiv.innerHTML = `
        <div class="emoji">${product.emoji}</div>
        <h2>${product.name}</h2>
        <p>Price: $${product.price}</p>
        <button data-index="${products.indexOf(product)}">Add to Cart</button>
      `;
      main.appendChild(productDiv);
    });
  }

  displayProducts(products);

  // Filter by category
  window.filterCategory = function(category){
    if(category === "All"){
      displayProducts(products);
    } else {
      const filtered = products.filter(p => p.category === category);
      displayProducts(filtered);
    }
  }

  // Search functionality
  function applySearch() {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    displayProducts(q ? filtered : products);
  }

  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', applySearch);
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applySearch();
    });
  }

  // Add to cart
  main.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON'){
      const index = e.target.dataset.index;
      const product = products[index];
      const existing = cart.find(item => item.name === product.name);
      if(existing){
        existing.qty += 1;
      } else {
        cart.push({...product, qty:1});
      }
      updateCartDisplay();
    }
  });

  function updateCartDisplay(){
    if(cart.length === 0){
      cartDisplay.innerHTML = 'Cart: 0 items';
      return;
    }
    let html = `<h3>Cart (${cart.length} items)</h3><ul>`;
    cart.forEach((item,i) => {
      html += `
        <li>
          ${item.name} - $${item.price} × ${item.qty}
          <button onclick="decreaseQty(${i})">-</button>
          <button onclick="increaseQty(${i})">+</button>
          <button onclick="removeFromCart(${i})">Delete</button>
        </li>`;
    });
    html += `</ul><button class="checkout-btn" onclick="checkout()">Checkout</button>`;
    cartDisplay.innerHTML = html;
  }

  window.increaseQty = function(index){
    cart[index].qty++;
    updateCartDisplay();
    renderCheckoutIfVisible();
  }

  window.decreaseQty = function(index){
    if(cart[index].qty > 1){
      cart[index].qty--;
    } else {
      cart.splice(index, 1);
    }
    updateCartDisplay();
    renderCheckoutIfVisible();
  }

  window.removeFromCart = function(index){
    cart.splice(index, 1);
    updateCartDisplay();
    renderCheckoutIfVisible();
  }

  function renderCheckoutIfVisible(){
    if(checkoutSection.style.display === 'block'){
      renderCheckout();
    }
  }

  // --- Checkout ---
  function renderCheckout() {
    // hide top button while on checkout page
    topBtn.style.display = 'none';

    if(cart.length === 0){
      checkoutSection.innerHTML = `
        <div class="checkout-container">
          <h1>🛒 Checkout</h1>
          <p>Your cart is empty.</p>
          <button id="backToStore" class="checkout-btn">← Back to Store</button>
        </div>`;
      document.getElementById('backToStore').addEventListener('click', ()=>{
        checkoutSection.style.display = 'none';
        storeSection.style.display = 'grid';
        const searchRow = document.querySelector('.search-row');
        if(searchRow) searchRow.style.display = 'block';
        displayProducts(products);
        topBtn.style.display = 'block';
      });
      return;
    }

    const totalAmount = cart.reduce((sum,item)=>sum + (item.price*item.qty),0);

    let html = `
      <div class="checkout-container">
        <h1>🛒 Checkout</h1>
        <p>Total Amount: <strong>$${totalAmount}</strong></p>
        <form id="checkoutForm">
          <label>Name: <input type="text" required></label><br>
          <label>Email: <input type="email" required></label><br>
          <label>Address: <textarea required></textarea></label><br>
          <button type="submit" class="checkout-btn">Confirm Purchase</button>
        </form>
        <button id="backToStore" class="checkout-btn">← Back to Store</button>
      </div>`;

    checkoutSection.innerHTML = html;

    const checkoutForm = document.getElementById('checkoutForm');
    if(checkoutForm){
      checkoutForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        checkoutSection.innerHTML = `
          <div class="thankyou">
            <h1>🎉 Thank You for Shopping with ShopEasy! 🎉</h1>
            <p>Your order has been placed successfully.</p>
            <button id="backToStore" class="checkout-btn">← Back to Store</button>
          </div>`;
        cart = [];
        updateCartDisplay();
        document.getElementById('backToStore').addEventListener('click', ()=>{
          checkoutSection.style.display = 'none';
          storeSection.style.display = 'grid';
          const searchRow = document.querySelector('.search-row');
          if(searchRow) searchRow.style.display = 'block';
          displayProducts(products);
          topBtn.style.display = 'block';
        });
      });
    }

    // Back to store button listener
    const backBtn = document.getElementById('backToStore');
    if(backBtn){
      backBtn.addEventListener('click', ()=>{
        checkoutSection.style.display = 'none';
        storeSection.style.display = 'grid';
        const searchRow = document.querySelector('.search-row');
        if(searchRow) searchRow.style.display = 'block';
        displayProducts(products);
        topBtn.style.display = 'block';
      });
    }
  }

  window.checkout = function() {
    storeSection.style.display = 'none';
    const searchRow = document.querySelector('.search-row');
    if(searchRow) searchRow.style.display = 'none';
    checkoutSection.style.display = 'block';
    renderCheckout();
  }
});
