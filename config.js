/* =====================================================================
   CONFIG.JS — SABSE ZAROORI FILE
   =====================================================================
   Yahan aap website ki basic settings change kar sakte hain:
   - Store ka naam aur logo
   - Colors (theme)
   - WhatsApp number
   - Currency
   - Shipping fee
   - Google Apps Script URL (order/product backend)

   Kisi bhi cheez ko change karne ke baad, file ko SAVE karein aur
   browser mein page ko refresh (Ctrl+R / Cmd+R) karein.
   ===================================================================== */

const STORE_CONFIG = {
  // ---------- STORE IDENTITY ----------
  storeName: "My Store",
  storeTagline: "Quality products, delivered to your door.",
  logoText: "My Store",          // Agar image logo use karna hai to logo.png ko images folder mein daalein
  useImageLogo: false,           // true karein agar images/logo.png use karna hai
  logoImagePath: "images/logo.png",

  // ---------- CONTACT ----------
  whatsappNumber: "923001234567", // Country code ke saath, bina + ya spaces ke (e.g. Pakistan: 923001234567)
  contactEmail: "info@mystore.com",
  contactPhone: "+92 300 1234567",
  contactAddress: "Shop #12, Main Boulevard, Karachi, Pakistan",

  // ---------- CURRENCY ----------
  currencySymbol: "Rs.",
  currencyCode: "PKR",

  // ---------- SHIPPING ----------
  shippingFee: 200,               // Flat delivery charge, 0 rakhein agar free delivery deni ho
  freeShippingOver: 5000,         // Is amount se zyada order par shipping free (0 rakhein agar disable karna ho)

  // ---------- BACKEND (Google Sheet + Apps Script) ----------
  // Isko step-by-step guide follow karke apne Google Apps Script deployment
  // ke "Web App URL" se replace karein. Jab tak replace nahi karte,
  // website demo/sample products par chalegi aur order sirf localStorage
  // mein test ke liye save hoga (real order kahin nahi jayega).
  googleScriptURL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE",

  // ---------- THEME COLORS ----------
  // Yahan colors change karein — poori website automatically update ho jayegi.
  colors: {
    primary: "#1B4B43",        // Main brand color (buttons, links, navbar)
    primaryDark: "#123832",    // Hover state
    primaryLight: "#EAF2F0",   // Light tint backgrounds
    accent: "#C08A28",         // Sale badges, discount highlights
    background: "#F7F5F0",     // Page background
    surface: "#FFFFFF",        // Card backgrounds
    text: "#1F2421",           // Main text
    textMuted: "#6B7280",      // Secondary text
    border: "#E5E1D8",         // Borders/dividers
    success: "#2F7D52",        // In stock / delivered
    danger: "#B23A3A",         // Out of stock / cancelled / errors
    warning: "#B8862E"         // Pending/new order status
  }
};

// Apply theme colors as CSS variables so style.css can use them everywhere
(function applyTheme() {
  const root = document.documentElement;
  Object.entries(STORE_CONFIG.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
})();
