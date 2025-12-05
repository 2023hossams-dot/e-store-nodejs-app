



const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'يرجى إدخال اسم المستخدم'],
      unique: true,
      trim: true,
      minlength: [4, 'اسم المستخدم يجب أن يكون 4 أحرف على الأقل']
    },
    password: {
      type: String,
      required: [true, 'يرجى إدخال كلمة المرور'],
      minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
      select: false
    },
    email: {
      type: String,
      required: [true, 'يرجى إدخال البريد الإلكتروني'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'يرجى إدخال بريد إلكتروني صحيح'
      ]
    },
    fullName: {
      type: String,
      required: [true, 'يرجى إدخال الاسم الكامل'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'يرجى إدخال رقم الهاتف']
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin'],
      default: 'admin'
    },
    permissions: [
      {
        type: String,
        enum: [
          'manage_users',
          'manage_products',
          'manage_orders',
          'manage_categories',
          'manage_coupons',
          'view_reports',
          'manage_admins',
          'manage_notifications'
        ]
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    activityLog: [
      {
        action: String,
        description: String,
        timestamp: {
          type: Date,
          default: Date.now
        },
        ipAddress: String,
        userAgent: String
      }
    ]
  },
  {
    timestamps: true
  }
);

// Hash password before saving
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to handle login attempts
adminSchema.methods.incLoginAttempts = function () {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  const maxAttempts = 5;
  const lockTimeMinutes = 30;

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = {
      lockUntil: new Date(Date.now() + lockTimeMinutes * 60 * 1000)
    };
  }

  return this.updateOne(updates);
};

// Method to check if account is locked
adminSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Method to reset login attempts
adminSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 }
  });
};

// Method to log activity
adminSchema.methods.logActivity = function (action, description, ipAddress, userAgent) {
  this.activityLog.push({
    action,
    description,
    ipAddress,
    userAgent,
    timestamp: new Date()
  });

  // Keep only last 100 activities
  if (this.activityLog.length > 100) {
    this.activityLog = this.activityLog.slice(-100);
  }

  return this.save();
};

module.exports = mongoose.model('Admin', adminSchema);
