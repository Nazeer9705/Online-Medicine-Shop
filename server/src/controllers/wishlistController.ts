import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: { include: { product: true } }
      }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: { items: { include: { product: true } } }
      });
    }

    return res.json({ success: true, wishlist });
  } catch (err) {
    next(err);
  }
};

export const toggleWishlist = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.body;

    let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId } });
    }

    const existing = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId }
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return res.json({ success: true, message: 'Removed from wishlist', inWishlist: false });
    } else {
      await prisma.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId }
      });
      return res.json({ success: true, message: 'Added to wishlist', inWishlist: true });
    }
  } catch (err) {
    next(err);
  }
};
