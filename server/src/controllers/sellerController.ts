import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getSellerOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.userId;
    const orderItems = await prisma.orderItem.findMany({
      where: { sellerId },
      include: {
        order: { include: { user: { select: { fname: true, lname: true, email: true, phone: true } } } },
        product: true
      },
      orderBy: { id: 'desc' }
    });

    return res.json({ success: true, orderItems });
  } catch (err) {
    next(err);
  }
};

export const getSellerAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user!.userId;

    const [items, inventory] = await Promise.all([
      prisma.orderItem.findMany({ where: { sellerId } }),
      prisma.inventory.findMany({ where: { sid: sellerId }, include: { product: true } })
    ]);

    const totalRevenue = items.reduce((acc, i) => acc + i.totalPrice, 0);
    const totalOrders = items.length;
    const lowStockCount = inventory.filter(i => i.quantity <= i.reorderLevel).length;

    return res.json({
      success: true,
      analytics: {
        totalRevenue,
        totalOrders,
        totalProducts: inventory.length,
        lowStockCount
      }
    });
  } catch (err) {
    next(err);
  }
};
