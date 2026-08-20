import { Router } from 'express';
import multer from 'multer';
import path from 'path';

import * as authCtrl from '../controllers/authController';
import * as productCtrl from '../controllers/productController';
import * as categoryCtrl from '../controllers/categoryController';
import * as cartCtrl from '../controllers/cartController';
import * as orderCtrl from '../controllers/orderController';
import * as rxCtrl from '../controllers/prescriptionController';
import * as invCtrl from '../controllers/inventoryController';
import * as sellerCtrl from '../controllers/sellerController';
import * as adminCtrl from '../controllers/adminController';
import * as couponCtrl from '../controllers/couponController';
import * as reviewCtrl from '../controllers/reviewController';
import * as wishlistCtrl from '../controllers/wishlistController';
import * as supportCtrl from '../controllers/supportController';

import { requireAuth } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const upload = multer({ dest: path.join(__dirname, '../../../uploads') });
const router = Router();

// --- Auth Routes ---
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', requireAuth, authCtrl.getMe);

// --- Product & Category Routes ---
router.get('/products', productCtrl.getProducts);
router.get('/products/:id', productCtrl.getProductById);
router.post('/products', requireAuth, requireRole('SELLER', 'ADMIN'), productCtrl.createProduct);
router.get('/categories', categoryCtrl.getCategories);

// --- Cart Routes ---
router.get('/cart', requireAuth, cartCtrl.getCart);
router.post('/cart/items', requireAuth, cartCtrl.addToCart);
router.patch('/cart/items/:id', requireAuth, cartCtrl.updateCartItem);
router.delete('/cart/items/:id', requireAuth, cartCtrl.removeFromCart);
router.delete('/cart', requireAuth, cartCtrl.clearCart);

// --- Order Routes ---
router.post('/orders', requireAuth, orderCtrl.createOrder);
router.get('/orders', requireAuth, orderCtrl.getOrders);
router.get('/orders/:id', requireAuth, orderCtrl.getOrderById);
router.patch('/orders/:id/cancel', requireAuth, orderCtrl.cancelOrder);

// --- Prescription Routes ---
router.post('/prescriptions', requireAuth, upload.single('prescription'), rxCtrl.uploadPrescription);
router.get('/prescriptions', requireAuth, rxCtrl.getPrescriptions);
router.patch('/prescriptions/:id/review', requireAuth, requireRole('PHARMACIST', 'ADMIN'), rxCtrl.reviewPrescription);

// --- Inventory & Seller Routes ---
router.get('/inventory', requireAuth, requireRole('SELLER', 'ADMIN'), invCtrl.getInventory);
router.patch('/inventory/:id/restock', requireAuth, requireRole('SELLER', 'ADMIN'), invCtrl.restockInventory);
router.get('/seller/orders', requireAuth, requireRole('SELLER', 'ADMIN'), sellerCtrl.getSellerOrders);
router.get('/seller/analytics', requireAuth, requireRole('SELLER', 'ADMIN'), sellerCtrl.getSellerAnalytics);

// --- Admin Routes ---
router.get('/admin/stats', requireAuth, requireRole('ADMIN'), adminCtrl.getAdminStats);
router.get('/admin/users', requireAuth, requireRole('ADMIN'), adminCtrl.getUsers);

// --- Coupons, Reviews, Wishlist, Support ---
router.get('/coupons', couponCtrl.getCoupons);
router.post('/coupons/validate', couponCtrl.validateCoupon);
router.post('/reviews', requireAuth, reviewCtrl.createReview);
router.get('/wishlist', requireAuth, wishlistCtrl.getWishlist);
router.post('/wishlist/toggle', requireAuth, wishlistCtrl.toggleWishlist);
router.post('/support/tickets', requireAuth, supportCtrl.createSupportTicket);
router.get('/support/tickets', requireAuth, supportCtrl.getTickets);

export default router;
