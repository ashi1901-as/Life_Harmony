document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const loginModal = document.getElementById('loginModal');
  const signupModal = document.getElementById('signupModal');
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const cartIcon = document.getElementById('cartIcon');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItemsDiv = document.getElementById('cartItems');
  const productCards = document.querySelectorAll('.product-card');
  const totalAmountDisplay = document.getElementById('totalAmountDisplay');

  let userId = null;

  loginButton.addEventListener('click', () => {
    loginModal.style.display = 'block';
  });

  switchToSignup.addEventListener('click', () => {
    loginModal.style.display = 'none';
    signupModal.style.display = 'block';
  });

  switchToLogin.addEventListener('click', () => {
    signupModal.style.display = 'none';
    loginModal.style.display = 'block';
  });

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);
    try {
      const response = await fetch('http://localhost:8000/register.php', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        signupModal.style.display = 'none';
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    try {
      const response = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        userId = data.user_id;
        loginModal.style.display = 'none';
        loginButton.style.display = 'none';
        alert(data.message);

        // Initialize total price display to Rs 0 on successful login
        totalAmountDisplay.textContent = 'Total Price: Rs 0';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  });

  productCards.forEach(card => {
    card.querySelector('.add-to-cart').addEventListener('click', async () => {
      if (!userId) {
        alert('Please login to add items to cart.');
        return;
      }
      const productId = card.dataset.productId;
      try {
        const response = await fetch('http://localhost:8000/add_to_cart.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `productId=${productId}&quantity=1`,
        });
        const data = await response.json();
        console.log('Add to cart response:', data); // Add this line
        alert(data.message);

        // Fetch updated cart data and update total
        await updateCartAndTotal();

      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('An error occurred while adding to cart.');
      }
    });
  });


  async function updateCartAndTotal() {
    try {
      const response = await fetch(`http://localhost:8000/get_cart.php?userId=${userId}`);
      const data = await response.json();
      console.log('Get Cart Response:', data);

      if (data.success) {
        totalAmountDisplay.textContent = `Total Price: Rs ${data.totalAmount.toFixed(2)}`;
      } else {
        totalAmountDisplay.textContent = 'Total Price: Rs 0';
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      totalAmountDisplay.textContent = 'Total Price: Rs 0';
    }
  }

  cartIcon.addEventListener('click', async () => {
    console.log("Cart icon clicked!");
    if (!userId) {
      alert('Please login to view your cart.');
      return;
    }
    cartModal.style.display = 'block';
    try {
      const response = await fetch('http://localhost:8000/get_cart.php');
      const data = await response.json();
      console.log('Get Cart Data:', data); // add this line

      if (data.success) {
        console.log('Cart Items:', data.cartItems);
        console.log("Total Amount:", data.totalAmount);
        cartItemsDiv.innerHTML = '';
        let total = 0;
        data.cartItems.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.innerHTML = `
                    <h3>${item.product_name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: Rs ${item.price}</p>
                `;
          cartItemsDiv.appendChild(itemDiv);
          total += (item.price * item.quantity);
        });
        totalAmountDisplay.textContent = `Total Price: Rs ${data.totalAmount.toFixed(2)}`;
      } else {
        cartItemsDiv.innerHTML = '<p>Cart is empty or failed to load.</p>';
        totalAmountDisplay.textContent = 'Total Price: Rs 0';
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      cartItemsDiv.innerHTML = '<p>Failed to load cart.</p>';
      totalAmountDisplay.textContent = 'Total Price: Rs 0';
    }
  });

  closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});