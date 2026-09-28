/* =====================================================================
   PRODUCT-DETAIL.JS
   ===================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const id = getURLParam("id");
  const main = document.getElementById("pd-main");
  const products = await Api.getProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="icon">📦</div>
        <h3>Product not found</h3>
        <p>This product may have been removed or the link is incorrect.</p>
        <a href="products.html" class="btn btn-primary" style="margin-top:14px">Browse Products</a>
      </div>`;
    return;
  }

  document.getElementById("doc-title").textContent = `${product.name} — My Store`;

  const hasSale = product.salePrice && product.salePrice < product.price;
  const outOfStock = product.stock <= 0;
  const discountPct = hasSale ? Math.round(100 - (product.salePrice / product.price) * 100) : 0;

  main.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">Home</a> / <a href="products.html">Shop</a> / <a href="products.html?category=${encodeURIComponent(product.category)}">${product.category}</a> / <span>${product.name}</span>
    </div>
    <div class="pd-wrap">
      <div>
        <div class="pd-gallery-main">
          <img src="${product.image}" alt="${product.name}" id="pd-main-image">
        </div>
      </div>
      <div>
        <span class="pd-cat">${product.category}</span>
        <h1 class="pd-title">${product.name}</h1>
        <div class="pd-price-row">
          <span class="pd-price">${formatPrice(hasSale ? product.salePrice : product.price)}</span>
          ${hasSale ? `<span class="pd-price-old">${formatPrice(product.price)}</span><span class="pd-save">Save ${discountPct}%</span>` : ""}
        </div>
        ${renderStockLine(product)}
        <p class="pd-desc" style="margin-top:14px">${product.description || "No description available for this product."}</p>

        <div class="qty-row">
          <div class="qty-control">
            <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
            <input type="text" id="qty-input" value="1" inputmode="numeric" aria-label="Quantity">
            <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="pd-actions">
          <button class="btn btn-primary btn-lg" id="add-to-cart-btn" ${outOfStock ? "disabled" : ""}>
            ${outOfStock ? "Out of Stock" : "🛒 Add to Cart"}
          </button>
          <a href="cart.html" class="btn btn-outline btn-lg" id="buy-now-btn">Buy Now</a>
        </div>

        <div class="pd-meta">
          <span>💵 Cash on Delivery available — pay when you receive your order</span>
          <span>🚚 Delivered across Pakistan, usually within 2–5 working days</span>
          <span>↩️ Easy returns within 3 days of delivery on eligible items</span>
        </div>
      </div>
    </div>
  `;

  // Quantity controls
  const qtyInput = document.getElementById("qty-input");
  document.getElementById("qty-minus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) - 1);
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    qtyInput.value = Math.min(product.stock, parseInt(qtyInput.value || 1) + 1);
  });
  qtyInput.addEventListener("change", () => {
    let v = parseInt(qtyInput.value) || 1;
    v = Math.max(1, Math.min(product.stock, v));
    qtyInput.value = v;
  });

  function addToCartHandler() {
    const qty = parseInt(qtyInput.value) || 1;
    Cart.addItem(product, qty);
    showToast(`${product.name} added to cart`);
  }

  document.getElementById("add-to-cart-btn").addEventListener("click", addToCartHandler);
  const buyNowBtn = document.getElementById("buy-now-btn");
  if (!outOfStock) {
    buyNowBtn.addEventListener("click", e => {
      e.preventDefault();
      addToCartHandler();
      window.location.href = "cart.html";
    });
  }

  // Related products (same category, excluding this product)
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  if (related.length) {
    document.getElementById("related-section").style.display = "block";
    const relGrid = document.getElementById("related-grid");
    relGrid.innerHTML = related.map(productCardHTML).join("");
    wireAddToCartButtons(relGrid, products);
  }
});
