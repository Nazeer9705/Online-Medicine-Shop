import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } }
      }
    });

    return res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};
