/* =====================================================================
   Code.gs — My Store Backend (Google Apps Script)
   =====================================================================
   YE FILE KAHAN PASTE KARNI HAI:
   1. Google Sheets kholein → naya spreadsheet banayein
   2. Sheet ka naam "Products" rakhein (pehli tab), header row yeh dein:
      ID | Name | Category | Price | SalePrice | Stock | Image | Featured | Description
   3. Ek naya tab banayein naam "Orders", header row yeh dein:
      OrderNumber | Date | Name | Phone | Email | Address | City | Province |
      PostalCode | Notes | Items | Total | Status
   4. Menu se: Extensions → Apps Script
   5. Jo default code hai usko delete kar ke, is poori file ka code paste kar dein
   6. Upar "Deploy" button → "New deployment" → Type: "Web app"
      - Execute as: Me
      - Who has access: Anyone
      → Deploy → Authorize karein apni Google account se
   7. Jo URL milega (…/exec) usko copy karke js/config.js mein
      googleScriptURL wali line mein paste kar dein.

   Poori step-by-step guide neeche README.md file mein bhi hai.
   ===================================================================== */

// ============ SETTINGS ============
const NOTIFY_EMAIL = "your-email@gmail.com"; // <-- YAHAN APNA EMAIL DAALEIN jahan order notification chahiye
const SHEET_PRODUCTS = "Products";
const SHEET_ORDERS = "Orders";

// ============ MAIN ENTRY POINTS ============

function doGet(e) {
  try {
    const action = e.parameter.action || "getProducts";
    if (action === "getProducts") {
      return jsonResponse(getProducts());
    }
    return jsonResponse({ error: "Unknown action" });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === "placeOrder") {
      const result = placeOrder(data.order);
      return jsonResponse(result);
    }
    return jsonResponse({ error: "Unknown action" });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ============ PRODUCTS ============

function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PRODUCTS);
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift(); // remove header row

  const products = rows
    .filter(row => row[0] !== "" && row[0] !== null) // skip empty rows
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return {
        id: String(obj.ID),
        name: obj.Name,
        category: obj.Category,
        price: Number(obj.Price) || 0,
        salePrice: obj.SalePrice ? Number(obj.SalePrice) : null,
        stock: Number(obj.Stock) || 0,
        image: obj.Image,
        featured: String(obj.Featured).toLowerCase() === "yes" || obj.Featured === true,
        description: obj.Description || ""
      };
    });

  return { success: true, products: products };
}

// ============ ORDERS ============

function placeOrder(order) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ORDERS);
  const orderNumber = generateOrderNumber(sheet);
  const date = new Date();

  const itemsText = order.items
    .map(it => `${it.name} x${it.qty} (${it.price} each)`)
    .join("; ");

  sheet.appendRow([
    orderNumber,
    date,
    order.fullName,
    order.mobile,
    order.email || "",
    order.address,
    order.city,
    order.province,
    order.postalCode || "",
    order.notes || "",
    itemsText,
    order.total,
    "New"
  ]);

  sendNotificationEmail(orderNumber, order, itemsText, date);

  return { success: true, orderNumber: orderNumber };
}

function generateOrderNumber(sheet) {
  const lastRow = sheet.getLastRow(); // header = row 1
  const seq = lastRow; // e.g. if lastRow is 1 (only header), first order = 1
  const y = new Date().getFullYear();
  const padded = String(seq).padStart(4, "0");
  return `MS-${y}-${padded}`;
}

function sendNotificationEmail(orderNumber, order, itemsText, date) {
  const subject = `🛒 New Order ${orderNumber} — ${order.fullName}`;
  const body = `
New Cash on Delivery order received!

Order Number: ${orderNumber}
Date: ${date}

CUSTOMER DETAILS
----------------
Name: ${order.fullName}
Mobile: ${order.mobile}
Email: ${order.email || "-"}
Address: ${order.address}
City: ${order.city}
Province: ${order.province}
Postal Code: ${order.postalCode || "-"}
Notes: ${order.notes || "-"}

ITEMS
-----
${itemsText}

TOTAL: ${order.total}

Go to your Google Sheet "Orders" tab to update the order status.
  `;
  try {
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
  } catch (err) {
    // Email failure should not break order placement
    Logger.log("Email failed: " + err.message);
  }
}

// ============ HELPERS ============

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
