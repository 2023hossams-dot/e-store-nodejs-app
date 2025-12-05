// API Configuration
const API_URL = '/api';
const TOKEN_KEY = 'token';

// Get token from localStorage
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Set token in localStorage
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove token from localStorage
function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        window.location.href = '/login';
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth Functions
const Auth = {
  async register(userData) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  async login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  async logout() {
    removeToken();
    window.location.href = '/';
  },

  async getCurrentUser() {
    return await apiRequest('/auth/me');
  },

  async updateProfile(userData) {
    return await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  async changePassword(oldPassword, newPassword) {
    return await apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword })
    });
  }
};

// Product Functions
const Product = {
  async getAll(filters = {}) {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/products?${params}`);
  },

  async getById(id) {
    return await apiRequest(`/products/${id}`);
  },

  async getBySlug(slug) {
    return await apiRequest(`/products/slug/${slug}`);
  },

  async getFeatured() {
    return await apiRequest('/products/featured');
  },

  async search(query) {
    return await apiRequest(`/products/search?q=${encodeURIComponent(query)}`);
  },

  async getByCategory(slug) {
    return await apiRequest(`/products/category/${slug}`);
  }
};

// Cart Functions
const Cart = {
  async get() {
    return await apiRequest('/cart');
  },

  async add(productId, quantity = 1, attributes = {}) {
    return await apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, attributes })
    });
  },

  async remove(productId) {
    return await apiRequest(`/cart/remove/${productId}`, {
      method: 'POST'
    });
  },

  async update(productId, quantity) {
    return await apiRequest(`/cart/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  },

  async clear() {
    return await apiRequest('/cart/clear', {
      method: 'POST'
    });
  }
};

// Order Functions
const Order = {
  async create(orderData) {
    return await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  async getUserOrders(page = 1) {
    return await apiRequest(`/orders/my-orders?page=${page}`);
  },

  async getById(id) {
    return await apiRequest(`/orders/${id}`);
  },

  async cancel(id, reason) {
    return await apiRequest(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  }
};

// UI Helpers
const UI = {
  showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.marginBottom = '1rem';

    const container = document.querySelector('main') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  },

  showLoader(text = 'جاري التحميل...') {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      flex-direction: column;
      gap: 1rem;
    `;
    loader.innerHTML = `
      <div class="spinner" style="border-width: 4px; width: 50px; height: 50px;"></div>
      <p style="color: white; font-size: 1.1rem;">${text}</p>
    `;
    document.body.appendChild(loader);
  },

  hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.remove();
    }
  },

  formatPrice(price) {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(price);
  },

  formatDate(date) {
    return new Intl.DateTimeFormat('ar-SA').format(new Date(date));
  }
};

// Format Price Helper
function formatPrice(price) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(price);
}

// Update Cart Count
async function updateCartCount() {
  try {
    if (!getToken()) {
      document.getElementById('cart-count').textContent = '0';
      return;
    }

    const data = await Cart.get();
    if (data.success) {
      document.getElementById('cart-count').textContent = data.cart.items.length;
    }
  } catch (error) {
    console.error('Error updating cart count:', error);
  }
}

// Check Authentication
async function checkAuth() {
  if (!getToken()) {
    return null;
  }

  try {
    const data = await Auth.getCurrentUser();
    return data.user;
  } catch (error) {
    removeToken();
    return null;
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  // Check for logout link
  const logoutLink = document.querySelector('a[href="/logout"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  }
});

// Export for use in other scripts
window.Auth = Auth;
window.Product = Product;
window.Cart = Cart;
window.Order = Order;
window.UI = UI;
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;
window.formatPrice = formatPrice;
window.updateCartCount = updateCartCount;
window.checkAuth = checkAuth;
