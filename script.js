let cart = [];

function updateCartDisplay() {
  const cartDiv = document.getElementById('cart-items');
  cartDiv.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    cartDiv.innerHTML += `
      <li>
        ${item.name} ($${item.price.toFixed(2)} x ${item.quantity})
        <button onclick="removeFromCart(${index})">Remove</button>
      </li>
    `;
  });

  document.getElementById('cart-total').innerText = total.toFixed(2);
  document.getElementById('cart-count').innerText = cart.length;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', e => {
    const productDiv = e.target.closest('.product');
    const id = productDiv.getAttribute('data-id');
    const name = productDiv.getAttribute('data-name');
    const price = parseFloat(productDiv.getAttribute('data-price'));

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1 });
    }

    updateCartDisplay();
  });
});

document.getElementById('checkout-btn').addEventListener('click', () => {
  fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart })
  })
  .then(res => res.json())
  .then(data => {
    if (data.id) {
      const stripe = Stripe('pk_test_REPLACE_WITH_YOUR_KEY');
      stripe.redirectToCheckout({ sessionId: data.id });
    } else {
      alert("Payment error: " + data.error);
    }
  });
});

updateCartDisplay();
