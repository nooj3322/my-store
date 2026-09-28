# My Store — Complete Setup Guide (Beginner Friendly)

Ye guide aapko step-by-step batayegi:
1. Website ko turant **localhost** par test karna (koi setup ke bina)
2. **Google Sheet + Apps Script** setup karna (products database + orders + email)
3. Website ko **apni domain/hosting** par live karna
4. **Admin panel** (Google Sheet) kaise use karna hai

Koi bhi step samajh na aaye to isi guide ko dobara padhein — har step chhota aur clear rakha gaya hai.

---

## 📁 Project Structure

```
my-store/
├── index.html                → Homepage
├── products.html             → All products
├── product-detail.html       → Single product
├── cart.html                 → Shopping cart
├── checkout.html             → Checkout (COD form)
├── order-confirmation.html   → Order success page
├── contact.html, about.html, privacy-policy.html, terms.html, shipping-info.html
├── css/style.css             → All design/colors
├── js/config.js              → ⭐ Store name, colors, WhatsApp, Google Script URL
├── js/api.js                 → Talks to Google Sheet
├── js/cart.js                → Cart logic
├── js/main.js                → Header/footer/search/WhatsApp logic
├── js/products-page.js, product-detail.js, checkout.js
├── images/products/          → Put your product images here (optional)
└── google-apps-script/Code.gs → Paste this into Google Apps Script
```

---

## STEP 1 — Test on Localhost (Right Now, No Setup Needed)

The website already works out of the box with **8 sample products** so you can see everything before connecting your real data.

### Easiest way (no installation):
1. Unzip/open the `my-store` folder.
2. Double-click `index.html` — it opens in your browser.
3. ⚠️ Some browsers block certain features when opening files directly (double-click). If products don't load or search feels odd, use the method below instead — it takes 1 extra minute and avoids all issues.

### Recommended way (Python — usually pre-installed on Mac, easy on Windows):
1. Open the `my-store` folder in a terminal / command prompt.
2. Run:
   ```
   python -m http.server 8000
   ```
   (On Mac/Linux it might be `python3 -m http.server 8000`)
3. Open your browser and go to: `http://localhost:8000`

### Alternative (if you use VS Code):
1. Install the free **"Live Server"** extension in VS Code.
2. Right-click `index.html` → "Open with Live Server".

You should now see the full working store — homepage, products, cart, checkout, and a test order confirmation (orders won't really be saved yet — that's Step 2).

---

## STEP 2 — Connect Your Product Database + Orders (Google Sheets)

This is your **Admin Panel**. No coding, no paid service — 100% free.

### 2.1 Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. Rename it to `My Store Data`.
3. Rename the first tab (bottom left) to **`Products`**.
4. In row 1, type these exact column headers:
   ```
   ID | Name | Category | Price | SalePrice | Stock | Image | Featured | Description
   ```
5. Add a product in row 2, for example:
   ```
   1 | Leather Wallet | Accessories | 2500 | 1999 | 10 | https://example.com/wallet.jpg | Yes | A genuine leather wallet.
   ```
   - **SalePrice**: leave empty if there's no discount.
   - **Featured**: type `Yes` or `No`.
   - **Image**: paste an image URL, or upload your image to `images/products/` on your hosting and use a path like `images/products/wallet.jpg`.
6. Click the **+** at the bottom to add a second tab. Rename it **`Orders`**.
7. In row 1 of the Orders tab, type these exact headers:
   ```
   OrderNumber | Date | Name | Phone | Email | Address | City | Province | PostalCode | Notes | Items | Total | Status
   ```
   (You don't need to fill this in — it fills automatically when customers order.)

### 2.2 Add the Apps Script (this is your "backend")

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any code you see there.
3. Open the file `google-apps-script/Code.gs` from this project, copy **everything**, and paste it into the Apps Script editor.
4. Near the top, find this line:
   ```js
   const NOTIFY_EMAIL = "your-email@gmail.com";
   ```
   Replace it with the email address where you want to receive new order notifications.
5. Click the **Save** icon (💾).

### 2.3 Deploy it as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon ⚙️ next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description**: `My Store API` (anything you like)
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Google will ask you to **authorize** — click through with your Google account (you may see a "Google hasn't verified this app" warning — this is normal for your own scripts; click **Advanced → Go to My Store API (unsafe)** → **Allow**).
6. Copy the **Web app URL** shown (it ends with `/exec`).

### 2.4 Connect it to your website

1. Open `js/config.js` in a text editor (Notepad, VS Code, etc.).
2. Find this line:
   ```js
   googleScriptURL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE",
   ```
3. Replace the text inside the quotes with the URL you copied. Example:
   ```js
   googleScriptURL: "https://script.google.com/macros/s/AKfycb.../exec",
   ```
4. Save the file, refresh your website (or re-test on localhost) — your real products from the Google Sheet should now appear, and orders will save to the **Orders** tab and email you automatically.

> ⚠️ Whenever you edit `Code.gs` in the future, you must click **Deploy → Manage deployments → ✏️ Edit → New version → Deploy** again for the changes to go live. Editing the code alone is not enough.

---

## STEP 3 — Using Your Admin Panel (Google Sheets)

You manage your entire store from the Google Sheet — no separate admin login needed.

| Task | How |
|---|---|
| Add a product | Add a new row in the `Products` tab with a new ID |
| Edit price / change sale price | Just edit the `Price` or `SalePrice` cell |
| Update stock | Edit the `Stock` cell (0 = shows "Out of Stock" on the site) |
| Change/replace product image | Replace the URL in the `Image` cell |
| Add/manage categories | Just type any category name in the `Category` column — it appears automatically on the website |
| Feature a product on homepage | Set `Featured` to `Yes` |
| View customer orders | Open the `Orders` tab — every order appears as a new row |
| Change order status | Edit the `Status` cell to: `New`, `Confirmed`, `Shipped`, `Delivered`, or `Cancelled` |

Changes appear on your live website within a few seconds (just refresh the page).

---

## STEP 4 — Deploy to Your Domain / Hosting

Since this is a plain HTML/CSS/JS website, it works on **any** hosting — shared hosting (Hostinger, GoDaddy, Namecheap), or free options like Netlify.

### Option A — Free hosting with Netlify (fastest, recommended for beginners)
1. Go to [netlify.com](https://netlify.com) → Sign up (free).
2. On your dashboard, find **"Add new site" → "Deploy manually"**.
3. Drag and drop your entire `my-store` folder into the upload box.
4. Netlify gives you a live link instantly (e.g. `random-name.netlify.app`).
5. To use your own domain: go to **Site settings → Domain management → Add custom domain**, then update your domain's DNS records as Netlify instructs (usually adding a CNAME or A record at your domain registrar).

### Option B — Your existing cPanel / shared hosting
1. Log into your hosting's **cPanel** (or the control panel your host provides).
2. Open **File Manager** → go to the `public_html` folder (this is your website's root).
3. Upload all files/folders from `my-store` directly into `public_html` (not inside a subfolder, so that `index.html` sits directly in `public_html`).
4. If your hosting requires a `.zip` upload, zip the **contents** of the `my-store` folder (not the folder itself), upload the zip via File Manager, then extract it.
5. Visit your domain (e.g. `www.yourdomain.com`) — your store should now be live.

### Option C — Vercel (also free, similar to Netlify)
1. Go to [vercel.com](https://vercel.com) → sign up.
2. Create a new project → drag and drop the `my-store` folder or connect a GitHub repo containing it.
3. Deploy — you'll get a live link, and you can attach your own domain in project settings.

---

## 💰 Costs Summary (Keeping It Minimum)

| Item | Cost |
|---|---|
| Website hosting (Netlify/Vercel) | **Free** |
| Website hosting (your own cPanel) | Whatever you already pay for hosting |
| Google Sheets + Apps Script (database, admin, orders, email) | **Free** (uses your Google account) |
| Domain name | Only if you don't already own one (~$8–15/year from any registrar) |
| Payment gateway | **Not needed** — Cash on Delivery only |

**No monthly recurring cost is required** beyond an optional domain name.

---

## 🛠️ Customizing Your Store

Almost everything is controlled from **`js/config.js`**:
- Store name → `storeName`
- WhatsApp number → `whatsappNumber` (format: country code + number, no `+` or spaces, e.g. `923001234567`)
- Colors/theme → the `colors` object
- Shipping fee / free shipping threshold → `shippingFee`, `freeShippingOver`
- Currency symbol → `currencySymbol`

To use an image logo instead of text: put your logo file in `images/logo.png`, then in `config.js` set:
```js
useImageLogo: true,
```

---

## ❓ Troubleshooting

- **Products not showing / stuck on "Loading…"**: Check that `googleScriptURL` in `config.js` is correct and that you deployed with "Who has access: Anyone".
- **Orders not emailing you**: Make sure `NOTIFY_EMAIL` in `Code.gs` is correct, and that you redeployed after any code changes (Deploy → Manage deployments → Edit → New version).
- **Changed a product in Google Sheets but it's not updating on the site**: Just refresh the website page — data is fetched live each time, there's no separate "publish" step.
- **Testing locally but orders don't save anywhere**: This is expected until you complete Step 2 — until then, the site runs in a safe "test mode" so you can try the full checkout flow without affecting real data.

---

You're all set! If you get stuck on any step, re-read that section carefully — every step above is required only once during setup.
