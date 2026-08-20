import { Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createSupportTicket = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { category, subject, message } = req.body;

    const ticketNo = `TKT-${Date.now().toString().slice(-6)}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNo,
        userId,
        category: category || 'General Inquiry',
        subject,
        message,
        status: 'Open'
      }
    });

    return res.status(201).json({ success: true, message: 'Support ticket submitted', ticket });
  } catch (err) {
    next(err);
  }
};

export const getTickets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const where = ['ADMIN', 'SUPPORT'].includes(role) ? {} : { userId };

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: { select: { fname: true, lname: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, tickets });
  } catch (err) {
    next(err);
  }
};
