import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { productId, rating, comment } = req.body;

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: parseInt(rating),
        comment,
        verifiedPurchase: true
      }
    });

    // Update Average Rating
    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length
      }
    });

    return res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
};
