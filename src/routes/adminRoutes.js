const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin, isAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Public routes
router.get('/login-page', adminController.getAdminLoginPage);
router.post('/login', authLimiter, adminController.adminLogin);

// Protected routes (requires admin authentication)
router.get('/me', protectAdmin, adminController.getAdminProfile);
router.put('/profile', protectAdmin, adminController.updateAdminProfile);
router.put('/change-password', protectAdmin, adminController.changeAdminPassword);
router.post('/logout', protectAdmin, adminController.adminLogout);

// Dashboard (requires admin authentication)
router.get('/dashboard', protectAdmin, adminController.getDashboard);

// User management routes
router.get('/users', protectAdmin, adminController.getAllUsers);
router.get('/users/:id', protectAdmin, adminController.getUserById);
router.put('/users/:id', protectAdmin, adminController.updateUser);
router.delete('/users/:id', protectAdmin, adminController.deleteUser);

// Product management routes
router.get('/products', protectAdmin, adminController.getAllProducts);
router.post('/products', protectAdmin, adminController.createProduct);
router.put('/products/:id', protectAdmin, adminController.updateProduct);
router.delete('/products/:id', protectAdmin, adminController.deleteProduct);

// Admin management routes (only for super_admin)
router.get('/admins', protectAdmin, isAdmin('manage_admins'), adminController.getAllAdmins);
router.post('/admins', protectAdmin, isAdmin('manage_admins'), adminController.createAdmin);
router.put('/admins/:id', protectAdmin, isAdmin('manage_admins'), adminController.updateAdmin);
router.delete('/admins/:id', protectAdmin, isAdmin('manage_admins'), adminController.deleteAdmin);

module.exports = router;
