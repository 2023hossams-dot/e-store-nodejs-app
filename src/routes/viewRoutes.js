// ==================== PAGE ROUTES ====================

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Authentication pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register.html'));
});

// Shop pages
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/products.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/product-details.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/checkout.html'));
});

app.get('/order-confirmation', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/order-confirmation.html'));
});

app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/account.html'));
});

// Discovery pages
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/search-results.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/categories.html'));
});

app.get('/wishlist', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/wishlist.html'));
});

// Service pages
app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/services.html'));
});

app.get('/partnership', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/partnership.html'));
});

app.get('/loyalty', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/loyalty.html'));
});

app.get('/learning', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/learning.html'));
});

app.get('/digital', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/digital.html'));
});

app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/support.html'));
});

// Information pages
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/contact.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/faq.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/terms.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/privacy.html'));
});

// Admin pages
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-dashboard.html'));
});

// 404 Page
app.get('/404', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/404.html'));
});

// Catch all - 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../views/404.html'));
});

module.exports = { viewRoutes: true };
