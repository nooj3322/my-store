/* =====================================================================
   CART.JS — Shopping cart stored in the browser (localStorage)
   ===================================================================== */

const Cart = {
  KEY: "mystore_cart",

  getItems() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch (e) {
      return [];
    }
  },

  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateCartCountBadge();
  },

  addItem(product, qty = 1) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    const price = product.salePrice ?? product.price;

    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: price,
        image: product.image,
        qty: qty,
        stock: product.stock
      });
    }
    this.saveItems(items);
  },

  updateQty(id, qty) {
    let items = this.getItems();
    items = items.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
    this.saveItems(items);
  },

  removeItem(id) {
    const items = this.getItems().filter(i => i.id !== id);
    this.saveItems(items);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateCartCountBadge();
  },

  getTotalQty() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },

  getSubtotal() {
    return this.getItems().reduce((sum, i) => sum + i.qty * i.price, 0);
  },

  getShippingFee() {
    const subtotal = this.getSubtotal();
    if (STORE_CONFIG.freeShippingOver > 0 && subtotal >= STORE_CONFIG.freeShippingOver) return 0;
    return STORE_CONFIG.shippingFee;
  },

  getTotal() {
    return this.getSubtotal() + this.getShippingFee();
  },

  updateCartCountBadge() {
    const els = document.querySelectorAll(".cart-count");
    const count = this.getTotalQty();
    els.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? "inline-flex" : "none";
    });
  }
};

document.addEventListener("DOMContentLoaded", () => Cart.updateCartCountBadge());
