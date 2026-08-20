import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getAdminStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalSellers, totalProducts, totalOrders, totalPrescriptions, orders] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'SELLER' } }),
      prisma.product.count(),
      prisma.order.count(),
      prisma.prescription.count({ where: { status: 'Pending' } }),
      prisma.order.findMany({ select: { total: true } })
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        pendingPrescriptions: totalPrescriptions,
        totalRevenue
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fname: true,
        lname: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};
