import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const uploadPrescription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const file = req.file;
    const { orderId, notes } = req.body;

    const fileUrl = file ? `/uploads/${file.filename}` : 'images/pills.png';
    const fileName = file ? file.originalname : 'Prescription_Document.pdf';

    const rx = await prisma.prescription.create({
      data: {
        userId,
        orderId: orderId || null,
        fileUrl,
        fileName,
        notes: notes || 'Prescription uploaded for pharmacist verification.',
        status: 'Pending'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Prescription uploaded successfully. Awaiting pharmacist review.',
      prescription: rx
    });
  } catch (err) {
    next(err);
  }
};

export const getPrescriptions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const where = role === 'CUSTOMER' ? { userId } : {};

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: {
        user: { select: { fname: true, lname: true, email: true, phone: true } },
        reviewer: { select: { fname: true, lname: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, prescriptions });
  } catch (err) {
    next(err);
  }
};

export const reviewPrescription = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // Approved or Rejected
    const reviewerId = req.user!.userId;

    const rx = await prisma.prescription.update({
      where: { id },
      data: {
        status,
        notes: notes || `Reviewed by Pharmacist on ${new Date().toLocaleDateString()}`,
        reviewerId,
        reviewedAt: new Date()
      }
    });

    return res.json({
      success: true,
      message: `Prescription status updated to ${status}`,
      prescription: rx
    });
  } catch (err) {
    next(err);
  }
};
