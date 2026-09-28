/* =====================================================================
   CHECKOUT.JS
   ===================================================================== */

const PROVINCES = [
  "Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan",
  "Gilgit-Baltistan", "Azad Kashmir", "Islamabad Capital Territory", "Other"
];

function renderCheckout() {
  const items = Cart.getItems();
  const wrapper = document.getElementById("checkout-wrapper");

  if (!items.length) {
    wrapper.innerHTML = `
      <div class="empty-state">
        <div class="icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products before checking out.</p>
        <a href="products.html" class="btn btn-primary" style="margin-top:14px">Start Shopping</a>
      </div>`;
    return;
  }

  const subtotal = Cart.getSubtotal();
  const shipping = Cart.getShippingFee();
  const total = Cart.getTotal();

  const itemsListHTML = items.map(i => `
    <div class="summary-row"><span>${i.name} × ${i.qty}</span><span>${formatPrice(i.price * i.qty)}</span></div>
  `).join("");

  wrapper.innerHTML = `
    <div class="checkout-layout">
      <div class="form-card">
        <h3 style="margin-bottom:18px">Delivery Details</h3>
        <form id="checkout-form" novalidate>

          <div class="form-group" id="group-fullName">
            <label for="fullName">Full Name <span class="req">*</span></label>
            <input type="text" id="fullName" name="fullName" placeholder="e.g. Ahmed Khan" required>
            <div class="error-text">Please enter your full name.</div>
          </div>

          <div class="form-row-2">
            <div class="form-group" id="group-mobile">
              <label for="mobile">Mobile Number <span class="req">*</span></label>
              <input type="tel" id="mobile" name="mobile" placeholder="03XXXXXXXXX" required>
              <div class="error-text">Please enter a valid mobile number (11 digits).</div>
            </div>
            <div class="form-group" id="group-email">
              <label for="email">Email <span style="color:var(--color-textMuted)">(optional)</span></label>
              <input type="email" id="email" name="email" placeholder="you@example.com">
              <div class="error-text">Please enter a valid email address.</div>
            </div>
          </div>

          <div class="form-group" id="group-address">
            <label for="address">Complete Address <span class="req">*</span></label>
            <textarea id="address" name="address" rows="3" placeholder="House #, Street, Area / Landmark" required></textarea>
            <div class="error-text">Please enter your complete delivery address.</div>
          </div>

          <div class="form-row-2">
            <div class="form-group" id="group-city">
              <label for="city">City <span class="req">*</span></label>
              <input type="text" id="city" name="city" placeholder="e.g. Karachi" required>
              <div class="error-text">Please enter your city.</div>
            </div>
            <div class="form-group" id="group-province">
              <label for="province">Province <span class="req">*</span></label>
              <select id="province" name="province" required>
                <option value="">Select province</option>
                ${PROVINCES.map(p => `<option value="${p}">${p}</option>`).join("")}
              </select>
              <div class="error-text">Please select your province.</div>
            </div>
          </div>

          <div class="form-group" id="group-postalCode">
            <label for="postalCode">Postal Code <span style="color:var(--color-textMuted)">(optional)</span></label>
            <input type="text" id="postalCode" name="postalCode" placeholder="e.g. 74400">
          </div>

          <div class="form-group">
            <label for="notes">Order Notes <span style="color:var(--color-textMuted)">(optional)</span></label>
            <textarea id="notes" name="notes" rows="2" placeholder="Delivery instructions, gift note, etc."></textarea>
          </div>

          <div class="form-group">
            <label>Payment Method</label>
            <div class="payment-option">
              <span class="icon">💵</span>
              <div>
                <strong>Cash on Delivery</strong>
                <span>Pay in cash to the rider when your order is delivered</span>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg btn-block" id="place-order-btn">Place Order</button>
        </form>
      </div>

      <div class="summary-box">
        <h3 style="margin-bottom:16px">Order Summary</h3>
        ${itemsListHTML}
        <div class="summary-row" style="border-top:1px solid var(--color-border); padding-top:12px; margin-top:6px">
          <span>Subtotal</span><span>${formatPrice(subtotal)}</span>
        </div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
      </div>
    </div>
  `;

  wireForm(items, { subtotal, shipping, total });
}

function setFieldError(groupId, hasError) {
  const group = document.getElementById(groupId);
  group.classList.toggle("invalid", hasError);
}

function wireForm(items, totals) {
  const form = document.getElementById("checkout-form");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const fullName = form.fullName.value.trim();
    const mobile = form.mobile.value.trim();
    const email = form.email.value.trim();
    const address = form.address.value.trim();
    const city = form.city.value.trim();
    const province = form.province.value;
    const postalCode = form.postalCode.value.trim();
    const notes = form.notes.value.trim();

    let valid = true;

    setFieldError("group-fullName", fullName.length < 2);
    if (fullName.length < 2) valid = false;

    const mobileClean = mobile.replace(/[^0-9]/g, "");
    const mobileValid = mobileClean.length >= 10 && mobileClean.length <= 12;
    setFieldError("group-mobile", !mobileValid);
    if (!mobileValid) valid = false;

    const emailValid = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setFieldError("group-email", !emailValid);
    if (!emailValid) valid = false;

    setFieldError("group-address", address.length < 8);
    if (address.length < 8) valid = false;

    setFieldError("group-city", city.length < 2);
    if (city.length < 2) valid = false;

    setFieldError("group-province", province === "");
    if (province === "") valid = false;

    if (!valid) {
      showToast("Please fix the highlighted fields");
      return;
    }

    const submitBtn = document.getElementById("place-order-btn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Placing order…";

    const order = {
      fullName, mobile, email, address, city, province, postalCode, notes,
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total
    };

    try {
      const result = await Api.placeOrder(order);
      if (result.success) {
        sessionStorage.setItem("lastOrder", JSON.stringify({ ...order, orderNumber: result.orderNumber }));
        Cart.clear();
        window.location.href = "order-confirmation.html";
      } else {
        showToast(result.error || "Something went wrong. Please try again.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Place Order";
      }
    } catch (err) {
      showToast("Could not place order. Please check your internet connection.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Place Order";
    }
  });
}

document.addEventListener("DOMContentLoaded", renderCheckout);
