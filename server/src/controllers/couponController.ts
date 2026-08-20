import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coupons = await prisma.coupon.findMany({ where: { active: true } });
    return res.json({ success: true, coupons });
  } catch (err) {
    next(err);
  }
};

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, amount } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon || !coupon.active || coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired coupon code' });
    }

    if (parseFloat(amount) < coupon.minOrder) {
      return res.status(400).json({ message: `Minimum order amount for this coupon is ₹${coupon.minOrder}` });
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = (parseFloat(amount) * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = coupon.discountValue;
    }

    return res.json({ success: true, coupon, discount });
  } catch (err) {
    next(err);
  }
};
