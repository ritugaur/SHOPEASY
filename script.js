document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById("store");
  const cartDisplay = document.getElementById('cart');
  const storeSection = document.getElementById('store');
  const checkoutSection = document.getElementById('checkout');
  let cart = [];

  const products = [];

  // FashionHub - 20 items
  const fashionNames = ["T-Shirt","Shirt","Jeans","Jacket","Sneakers","Hat","Socks","Dress","Coat","Scarf","Gloves","Shoes","Skirt","Hoodie","Shorts","Sweater","Belt","Watch","Tie","Bag"];
  const fashionEmojis = ["👕","👔","👖","🧥","👟","🎩","🧦","👗","🧥","🧣","🧤","👞","👚","🧥","🩳","🧥","👖","⌚","👔","👜"];
  for(let i=0;i<20;i++){
    products.push({ name: fashionNames[i], price: Math.floor(Math.random()*50)+10, emoji: fashionEmojis[i], category: "FashionHub" });
  }

  // Electronics - 20 items
  const electronicsNames = ["Laptop","Phone","Tablet","Camera","Headphones","Speaker","Monitor","Mouse","Keyboard","Charger","Router","Smartwatch","Drone","Microphone","Projector","Printer","Webcam","VR Headset","Power Bank","Flash Drive"];
  const electronicsEmojis = ["💻","📱","📱","📷","🎧","🔊","🖥️","🖱️","⌨️","🔌","📡","⌚","🛸","🎤","📽️","🖨️","📷","🕶️","🔋","💾"];
  for(let i=0;i<20;i++){
    products.push({ name: electronicsNames[i], price: Math.floor(Math.random()*500)+50, emoji: electronicsEmojis[i], category: "Electronics" });
  }

  // Grocery - 20 items
  const groceryNames = ["Milk","Bread","Eggs","Cheese","Butter","Rice","Pasta","Tomato","Potato","Onion","Apple","Banana","Orange","Juice","Coffee","Tea","Sugar","Salt","Oil","Yogurt"];
  const groceryEmojis = ["🥛","🍞","🥚","🧀","🧈","🍚","🍝","🍅","🥔","🧅","🍎","🍌","🍊","🧃","☕","🍵","🍬","🧂","🛢️","🥛"];
  for(let i=0;i<20;i++){
    products.push({ name: groceryNames[i], price: Math.floor(Math.random()*20)+1, emoji: groceryEmojis[i], category: "Grocery" });
  }

  // Display products
  function displayProducts(list){
    main.style.display = 'flex';
    main.style.flexWrap = 'wrap';
    main.innerHTML = "";
    list.forEach((product,index)=>{
      const productDiv = document.createElement("div");
      productDiv.className="product";
      productDiv.innerHTML=`
        <div class="emoji">${product.emoji}</div>
        <h2>${product.name}</h2>
        <p>Price: $${product.price}</p>
        <button data-index="${products.indexOf(product)}">Add to Cart</button>
      `;
      main.appendChild(productDiv);
    });
  }

  displayProducts(products);

  // Filter
  window.filterCategory = function(category){
    if(category==="All") displayProducts(products);
    else displayProducts(products.filter(p=>p.category===category));
  }

  // Cart
  main.addEventListener('click', (e)=>{
    if(e.target.tagName==='BUTTON'){
      const index = e.target.dataset.index;
      cart.push(products[index]);
      updateCartDisplay();
    }
  });

  function updateCartDisplay(){
    if(cart.length===0){
      cartDisplay.innerHTML='Cart: 0 items';
      return;
    }
    let html=`<h3>Cart (${cart.length} items)</h3><ul class="cart-list">`;
    cart.forEach((item,i)=>{
      html+=`<li>${item.name} - $${item.price} <button onclick="removeFromCart(${i})">Delete</button></li>`;
    });
    html+=`</ul><button onclick="checkout()" class="checkout-btn">Checkout</button>`;
    cartDisplay.innerHTML=html;
  }

  window.removeFromCart=function(index){
    cart.splice(index,1);
    updateCartDisplay();
  }

  window.checkout=function(){
    storeSection.style.display='none';
    checkoutSection.style.display='flex';
    checkoutSection.style.justifyContent = 'center';
    checkoutSection.style.alignItems = 'center';

    const totalAmount = cart.reduce((sum,item)=>sum+item.price,0);
    checkoutSection.innerHTML = `
      <div class="checkout-container">
        <h1>🎉 Thank You for Shopping with Us! 🎉</h1>
        <h2>You shopped at <strong>SHOPEASY</strong></h2>
        <p class="total-amount">Total Amount: <strong>$${totalAmount}</strong></p>
        <button id="backToStore" class="checkout-btn">← Back to Store</button>
      </div>
    `;
    cart = [];

    document.getElementById('backToStore').addEventListener('click', ()=>{
      checkoutSection.style.display='none';
      storeSection.style.display='flex';
      displayProducts(products);
      updateCartDisplay();
    });
  }
});
