/* =====================================================================
   API.JS — Talks to Google Apps Script (or uses sample data for testing)
   ===================================================================== */

// Sample products used automatically until you connect your Google Sheet.
// This lets you test the WHOLE website on localhost immediately.
const SAMPLE_PRODUCTS = [
  { id: "1", name: "Classic Leather Wallet", category: "Accessories", price: 2500, salePrice: 1999, stock: 14, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600", featured: true, description: "Genuine leather bi-fold wallet with 6 card slots and a coin pocket. Slim, durable, and built to age beautifully." },
  { id: "2", name: "Wireless Bluetooth Earbuds", category: "Electronics", price: 4500, salePrice: null, stock: 8, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600", featured: true, description: "True wireless earbuds with 24-hour battery life, active noise cancellation, and a compact charging case." },
  { id: "3", name: "Minimalist Analog Watch", category: "Accessories", price: 6000, salePrice: 4799, stock: 5, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600", featured: true, description: "A clean, minimalist analog watch with a stainless steel case and genuine leather strap." },
  { id: "4", name: "Cotton Casual Shirt", category: "Clothing", price: 2200, salePrice: null, stock: 0, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600", featured: false, description: "100% breathable cotton casual shirt, perfect for everyday wear in any season." },
  { id: "5", name: "Stainless Steel Water Bottle", category: "Home & Living", price: 1400, salePrice: 999, stock: 22, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600", featured: true, description: "Double-wall insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours. 1 litre capacity." },
  { id: "6", name: "Ceramic Coffee Mug Set", category: "Home & Living", price: 1800, salePrice: null, stock: 17, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600", featured: false, description: "Set of 2 handcrafted ceramic mugs, microwave and dishwasher safe." },
  { id: "7", name: "Running Sports Shoes", category: "Footwear", price: 5200, salePrice: 3999, stock: 11, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", featured: true, description: "Lightweight, breathable running shoes with cushioned soles for all-day comfort." },
  { id: "8", name: "Sunglasses UV Protection", category: "Accessories", price: 1600, salePrice: null, stock: 3, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600", featured: false, description: "Polarized sunglasses with 100% UV400 protection and a durable frame." }
];

const Api = {
  isConfigured() {
    const url = STORE_CONFIG.googleScriptURL;
    return url && !url.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE");
  },

  async getProducts() {
    if (!this.isConfigured()) {
      // Local testing mode
      return SAMPLE_PRODUCTS;
    }
    try {
      const res = await fetch(`${STORE_CONFIG.googleScriptURL}?action=getProducts`);
      const data = await res.json();
      if (data.success) return data.products;
      console.warn("Falling back to sample products:", data.error);
      return SAMPLE_PRODUCTS;
    } catch (err) {
      console.warn("Could not reach Google Sheet, using sample products.", err);
      return SAMPLE_PRODUCTS;
    }
  },

  async placeOrder(order) {
    if (!this.isConfigured()) {
      // Local testing mode — simulate an order number so you can test the flow
      const fakeOrderNumber = "MS-TEST-" + Math.floor(1000 + Math.random() * 9000);
      console.warn("Google Script not configured — order NOT actually saved anywhere. This is a test order:", order);
      return { success: true, orderNumber: fakeOrderNumber, testMode: true };
    }
    const res = await fetch(STORE_CONFIG.googleScriptURL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // avoids CORS preflight with Apps Script
      body: JSON.stringify({ action: "placeOrder", order })
    });
    const data = await res.json();
    return data;
  }
};
