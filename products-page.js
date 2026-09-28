/* =====================================================================
   PRODUCTS-PAGE.JS — search, category filter, sorting for products.html
   ===================================================================== */

let ALL_PRODUCTS = [];

function applyFiltersAndRender() {
  const grid = document.getElementById("products-grid");
  const categoryFilter = document.getElementById("category-filter").value;
  const sortValue = document.getElementById("sort-filter").value;
  const searchTerm = (getURLParam("search") || "").toLowerCase();

  let list = [...ALL_PRODUCTS];

  if (categoryFilter) list = list.filter(p => p.category === categoryFilter);
  if (searchTerm) {
    list = list.filter(
      p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        (p.description || "").toLowerCase().includes(searchTerm)
    );
  }

  if (sortValue === "price-low") {
    list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  } else if (sortValue === "price-high") {
    list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  } else if (sortValue === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  document.getElementById("result-count").textContent = `${list.length} product${list.length !== 1 ? "s" : ""} found`;

  const titleEl = document.getElementById("page-title");
  if (searchTerm) titleEl.textContent = `Search results for "${searchTerm}"`;
  else if (categoryFilter) titleEl.textContent = categoryFilter;
  else titleEl.textContent = "All Products";

  grid.innerHTML = list.length
    ? list.map(productCardHTML).join("")
    : `<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div><h3>No products found</h3><p>Try a different search term or category.</p></div>`;

  wireAddToCartButtons(grid, ALL_PRODUCTS);
}

document.addEventListener("DOMContentLoaded", async () => {
  ALL_PRODUCTS = await Api.getProducts();

  // Populate category dropdown
  const categories = [...new Set(ALL_PRODUCTS.map(p => p.category))];
  const categorySelect = document.getElementById("category-filter");
  categorySelect.innerHTML =
    `<option value="">All Categories</option>` +
    categories.map(c => `<option value="${c}">${c}</option>`).join("");

  // Pre-select category from URL (?category=)
  const urlCategory = getURLParam("category");
  if (urlCategory) categorySelect.value = urlCategory;

  applyFiltersAndRender();

  categorySelect.addEventListener("change", applyFiltersAndRender);
  document.getElementById("sort-filter").addEventListener("change", applyFiltersAndRender);
});
