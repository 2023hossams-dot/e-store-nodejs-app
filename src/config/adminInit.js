const Admin = require('../models/Admin');

// Initialize default admin user
const initializeAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('✓ المشرف الافتراضي موجود بالفعل');
      return;
    }

    // Create default admin
    const defaultAdmin = await Admin.create({
      username: 'admin',
      email: 'admin@estore.com',
      password: 'Admin@123456',
      fullName: 'المشرف الرئيسي',
      phone: '+966500000000',
      role: 'super_admin',
      permissions: [
        'manage_users',
        'manage_products',
        'manage_orders',
        'manage_categories',
        'manage_coupons',
        'view_reports',
        'manage_admins',
        'manage_notifications'
      ]
    });

    console.log('\n' + '='.repeat(50));
    console.log('✓ تم إنشاء حساب المشرف الافتراضي');
    console.log('='.repeat(50));
    console.log('اسم المستخدم: admin');
    console.log('كلمة المرور: Admin@123456');
    console.log('رابط تسجيل الدخول: http://localhost:3000/admin/login');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('خطأ في إنشاء المشرف الافتراضي:', error.message);
  }
};

module.exports = initializeAdmin;
