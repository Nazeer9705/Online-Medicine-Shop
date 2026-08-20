import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getInventory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const where = role === 'SELLER' ? { sid: userId } : {};

    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        product: true,
        batches: true
      }
    });

    return res.json({ success: true, inventory });
  } catch (err) {
    next(err);
  }
};

export const restockInventory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { restockQuantity, batchNo, mfgDate, expDate } = req.body;
    const qt = parseInt(restockQuantity);

    const inventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: { increment: qt }
      }
    });

    if (batchNo && expDate) {
      await prisma.inventoryBatch.create({
        data: {
          inventoryId: inventory.id,
          batchNo,
          mfgDate: mfgDate || new Date().toISOString().substring(0, 10),
          expDate,
          quantity: qt,
          purchasePrice: 0,
          sellingPrice: 0
        }
      });
    }

    return res.json({ success: true, message: 'Stock updated successfully', inventory });
  } catch (err) {
    next(err);
  }
};
