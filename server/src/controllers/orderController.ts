import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { shippingAddress, paymentMethod = 'COD', couponCode } = req.body;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { inventory: true }
            }
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check Prescription Requirements
    const rxRequired = cart.items.some(item => item.product.prescriptionRequired);
    if (rxRequired) {
      const approvedRx = await prisma.prescription.findFirst({
        where: { userId, status: 'Approved' }
      });
      if (!approvedRx) {
        return res.status(400).json({
          message: 'Order contains Prescription Required medicines. Please upload a valid prescription for pharmacist review first.'
        });
      }
    }

    // Calculate Prices & Verify Stock
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of cart.items) {
      const prod = item.product;
      const inv = prod.inventory[0];

      if (!inv || inv.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${prod.pname}. Available: ${inv ? inv.quantity : 0}`
        });
      }

      const itemTotal = prod.sellingPrice * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: prod.id,
        sellerId: inv ? inv.sid : 'seller123',
        quantity: item.quantity,
        unitPrice: prod.sellingPrice,
        totalPrice: itemTotal
      });
    }

    // Handle Coupon Discount
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (coupon && coupon.active && coupon.expiryDate > new Date() && subtotal >= coupon.minOrder) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    const shippingFee = subtotal > 499 ? 0 : 40;
    const total = subtotal - discount + shippingFee;
    const orderNo = `MED-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Deduct Stock (FEFO)
      for (const item of cart.items) {
        await tx.inventory.updateMany({
          where: { pid: item.product.pid },
          data: { quantity: { decrement: item.quantity } }
        });
      }

      // 2. Create Order
      const order = await tx.order.create({
        data: {
          orderNo,
          userId,
          status: 'Confirmed',
          subtotal,
          discount,
          tax: 0,
          shippingFee,
          total,
          paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
          paymentMethod,
          shippingAddressJson: JSON.stringify(shippingAddress || {}),
          items: {
            create: orderItemsData
          }
        },
        include: { items: { include: { product: true } } }
      });

      // 3. Create Payment Record
      await tx.payment.create({
        data: {
          orderId: order.id,
          transactionId: `TXN-${Date.now()}`,
          provider: paymentMethod === 'COD' ? 'CashOnDelivery' : 'Razorpay',
          amount: total,
          status: paymentMethod === 'COD' ? 'Pending' : 'Paid'
        }
      });

      // 4. Empty User Cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: result
    });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        payments: true,
        prescriptions: true
      }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    return res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

export const cancelOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot cancel order in state: ${order.status}` });
    }

    // Restore Stock
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const prod = await tx.product.findUnique({ where: { id: item.productId } });
        if (prod) {
          await tx.inventory.updateMany({
            where: { pid: prod.pid },
            data: { quantity: { increment: item.quantity } }
          });
        }
      }

      await tx.order.update({
        where: { id },
        data: { status: 'Cancelled', paymentStatus: 'Refunded' }
      });
    });

    return res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (err) {
    next(err);
  }
};
