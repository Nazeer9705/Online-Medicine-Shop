import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = '1', limit = '12' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { status: 'Active' };

    if (search) {
      where.OR = [
        { pname: { contains: search as string } },
        { composition: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }

    if (category) {
      where.category = { slug: category as string };
    }

    if (minPrice || maxPrice) {
      where.sellingPrice = {};
      if (minPrice) where.sellingPrice.gte = parseFloat(minPrice as string);
      if (maxPrice) where.sellingPrice.lte = parseFloat(maxPrice as string);
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { sellingPrice: 'asc' };
    if (sort === 'price_desc') orderBy = { sellingPrice: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          manufacturer: true,
          inventory: true
        },
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ]);

    return res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { pid: id }]
      },
      include: {
        category: true,
        brand: true,
        manufacturer: true,
        inventory: {
          include: { batches: true }
        },
        reviews: {
          include: { user: { select: { fname: true, lname: true } } }
        }
      }
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    return res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pid, pname, description, composition, categoryId, dosageForm, strength, prescriptionRequired, mrp, sellingPrice, image, initialStock } = req.body;

    const slug = pname.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = await prisma.product.create({
      data: {
        pid,
        pname,
        slug,
        description,
        composition: composition || '',
        categoryId,
        dosageForm: dosageForm || 'Tablet',
        strength: strength || '500mg',
        prescriptionRequired: Boolean(prescriptionRequired),
        mrp: parseFloat(mrp),
        sellingPrice: parseFloat(sellingPrice),
        discount: Math.round(((mrp - sellingPrice) / mrp) * 100),
        image: image || 'images/pills.png'
      }
    });

    // Create Initial Inventory
    if (initialStock && (req as any).user) {
      const inventory = await prisma.inventory.create({
        data: {
          pid: product.pid,
          sid: (req as any).user.userId,
          quantity: parseInt(initialStock)
        }
      });

      await prisma.inventoryBatch.create({
        data: {
          inventoryId: inventory.id,
          batchNo: `BATCH-${product.pid}-NEW`,
          mfgDate: new Date().toISOString().substring(0, 10),
          expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
          quantity: parseInt(initialStock),
          purchasePrice: parseFloat(sellingPrice) * 0.6,
          sellingPrice: parseFloat(sellingPrice)
        }
      });
    }

    return res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};
