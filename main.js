/* =====================================================================
   MAIN.JS — Runs on EVERY page (header, footer, search, WhatsApp, toast)
   ===================================================================== */

function formatPrice(amount) {
  return `${STORE_CONFIG.currencySymbol} ${Number(amount).toLocaleString()}`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function getURLParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderStockLine(product) {
  if (product.stock <= 0) return `<span class="stock-line stock-out">Out of stock</span>`;
  if (product.stock <= 5) return `<span class="stock-line stock-low">Only ${product.stock} left</span>`;
  return `<span class="stock-line stock-in">In stock</span>`;
}

function productCardHTML(product) {
  const hasSale = product.salePrice && product.salePrice < product.price;
  const outOfStock = product.stock <= 0;
  return `
    <div class="product-card">
      <a href="product-detail.html?id=${product.id}" class="product-thumb">
        ${hasSale ? `<span class="badge badge-sale">SALE</span>` : ""}
        ${outOfStock ? `<span class="badge badge-out">Out of Stock</span>` : ""}
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-info">
        <span class="product-cat">${product.category}</span>
        <a href="product-detail.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="price-row">
          <span class="price">${formatPrice(hasSale ? product.salePrice : product.price)}</span>
          ${hasSale ? `<span class="price-old">${formatPrice(product.price)}</span>` : ""}
        </div>
        ${renderStockLine(product)}
        <button class="add-btn" data-id="${product.id}" ${outOfStock ? "disabled" : ""}>
          ${outOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>`;
}

function wireAddToCartButtons(container, products) {
  container.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const product = products.find(p => p.id === btn.dataset.id);
      if (!product || product.stock <= 0) return;
      Cart.addItem(product, 1);
      showToast(`${product.name} added to cart`);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  // ---- Logo ----
  const logoEl = document.getElementById("logo-link");
  if (logoEl) {
    logoEl.innerHTML = STORE_CONFIG.useImageLogo
      ? `<img src="${STORE_CONFIG.logoImagePath}" alt="${STORE_CONFIG.storeName}">`
      : STORE_CONFIG.logoText;
  }

  // ---- Footer store name + year ----
  document.querySelectorAll("[data-cfg='storeName']").forEach(el => (el.textContent = STORE_CONFIG.storeName));
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- WhatsApp floating button ----
  const waBtn = document.getElementById("whatsapp-float");
  if (waBtn) {
    const msg = encodeURIComponent(`Hi ${STORE_CONFIG.storeName}, I have a question about a product.`);
    waBtn.href = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${msg}`;
  }

  // ---- Mobile menu toggle ----
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  // ---- Search form (redirects to products.html?search=...) ----
  const searchForm = document.getElementById("nav-search-form");
  if (searchForm) {
    const searchInput = document.getElementById("nav-search-input");
    const existing = getURLParam("search");
    if (existing) searchInput.value = existing;
    searchForm.addEventListener("submit", e => {
      e.preventDefault();
      const q = searchInput.value.trim();
      window.location.href = `products.html${q ? "?search=" + encodeURIComponent(q) : ""}`;
    });
  }

  // ---- Category strip (built from live product data) ----
  const catStrip = document.getElementById("category-strip-list");
  if (catStrip) {
    try {
      const products = await Api.getProducts();
      const categories = [...new Set(products.map(p => p.category))];
      const activeCat = getURLParam("category");
      catStrip.innerHTML =
        `<a href="products.html" class="${!activeCat ? "active" : ""}">All Products</a>` +
        categories
          .map(
            c =>
              `<a href="products.html?category=${encodeURIComponent(c)}" class="${activeCat === c ? "active" : ""}">${c}</a>`
          )
          .join("");
    } catch (e) {
      /* fail silently, category strip is not critical */
    }
  }
});
