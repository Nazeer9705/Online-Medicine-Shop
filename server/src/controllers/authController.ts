import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fname, lname, phone, role } = req.body;

    if (!email || !password || !fname || !lname) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await hashPassword(password);
    const userRole = role && ['CUSTOMER', 'SELLER'].includes(role) ? role : 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fname,
        lname,
        phone: phone || '',
        role: userRole
      }
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        fname: true,
        lname: true,
        phone: true,
        role: true,
        addresses: true
      }
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
