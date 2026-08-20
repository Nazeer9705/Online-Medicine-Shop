import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MEDICARE V2.0 Database Seeding...');

  // Password Hash
  const defaultPassword = await bcrypt.hash('pass123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  // 1. Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medicare.com' },
    update: {},
    create: {
      email: 'admin@medicare.com',
      password: adminPassword,
      fname: 'System',
      lname: 'Administrator',
      phone: '9999999999',
      role: 'ADMIN',
      isVerified: true
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: 'john.doe@medicare.com' },
    update: {},
    create: {
      email: 'john.doe@medicare.com',
      password: defaultPassword,
      fname: 'John',
      lname: 'Doe',
      phone: '9876543210',
      role: 'CUSTOMER',
      isVerified: true,
      addresses: {
        create: {
          label: 'Home',
          name: 'John Doe',
          phone: '9876543210',
          addressLine: '123 Health Avenue, Flat 4B',
          city: 'Hyderabad',
          state: 'Telangana',
          postalCode: '500081',
          country: 'India',
          isDefault: true
        }
      }
    }
  });

  const seller = await prisma.user.upsert({
    where: { email: 'apex.pharma@medicare.com' },
    update: {},
    create: {
      email: 'apex.pharma@medicare.com',
      password: defaultPassword,
      fname: 'Apex',
      lname: 'Pharmacy Supplies',
      phone: '9123456789',
      role: 'SELLER',
      isVerified: true
    }
  });

  const pharmacist = await prisma.user.upsert({
    where: { email: 'pharmacist@medicare.com' },
    update: {},
    create: {
      email: 'pharmacist@medicare.com',
      password: defaultPassword,
      fname: 'Dr. Sarah',
      lname: 'Jenkins',
      phone: '9888877777',
      role: 'PHARMACIST',
      isVerified: true
    }
  });

  console.log('✅ Users seeded: Admin, Customer, Seller, Pharmacist');

  // 2. Categories
  const categoriesData = [
    { name: 'Pain Relief', slug: 'pain-relief', description: 'Effective relief from headaches, body ache & fever' },
    { name: 'Vitamins & Supplements', slug: 'vitamins-supplements', description: 'Boost immunity, bone health & energy levels' },
    { name: 'Diabetes Care', slug: 'diabetes-care', description: 'Insulin, blood glucose monitors & dietary care' },
    { name: 'Heart Care', slug: 'heart-care', description: 'BP monitors, cholesterol management & supplements' },
    { name: 'Cold & Flu', slug: 'cold-flu', description: 'Decongestants, syrups, cough drops & immunity shots' },
    { name: 'Skin Care', slug: 'skin-care', description: 'Dermatological creams, lotions & sunscreens' },
    { name: 'Medical Devices', slug: 'medical-devices', description: 'Thermometers, pulse oximeters, BP apparatus' }
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  const painReliefCat = await prisma.category.findUnique({ where: { slug: 'pain-relief' } });
  const vitaminsCat = await prisma.category.findUnique({ where: { slug: 'vitamins-supplements' } });
  const coldFluCat = await prisma.category.findUnique({ where: { slug: 'cold-flu' } });
  const diabetesCat = await prisma.category.findUnique({ where: { slug: 'diabetes-care' } });
  const devicesCat = await prisma.category.findUnique({ where: { slug: 'medical-devices' } });

  // 3. Brands & Manufacturers
  const gsk = await prisma.brand.upsert({
    where: { name: 'GlaxoSmithKline' },
    update: {},
    create: { name: 'GlaxoSmithKline' }
  });

  const pfizer = await prisma.brand.upsert({
    where: { name: 'Pfizer' },
    update: {},
    create: { name: 'Pfizer' }
  });

  const bayer = await prisma.brand.upsert({
    where: { name: 'Bayer' },
    update: {},
    create: { name: 'Bayer' }
  });

  // 4. Products
  const products = [
    {
      pid: 'P101',
      pname: 'Paracetamol 500mg Tablets',
      slug: 'paracetamol-500mg-tablets',
      description: 'Used for fast relief from fever, headaches, muscle pain, and mild arthritis.',
      composition: 'Paracetamol IP 500mg',
      dosageForm: 'Tablet',
      strength: '500mg',
      prescriptionRequired: false,
      mrp: 65.0,
      sellingPrice: 49.0,
      discount: 25.0,
      rating: 4.8,
      reviewCount: 142,
      image: 'images/pills.png',
      categoryId: painReliefCat!.id,
      brandId: gsk.id
    },
    {
      pid: 'P102',
      pname: 'Amoxicillin 250mg Capsules',
      slug: 'amoxicillin-250mg-capsules',
      description: 'Broad-spectrum antibiotic used to treat bacterial infections of chest, lungs, and throat.',
      composition: 'Amoxicillin Trihydrate 250mg',
      dosageForm: 'Capsule',
      strength: '250mg',
      prescriptionRequired: true,
      mrp: 120.0,
      sellingPrice: 95.0,
      discount: 21.0,
      rating: 4.6,
      reviewCount: 88,
      image: 'images/pills.png',
      categoryId: coldFluCat!.id,
      brandId: pfizer.id
    },
    {
      pid: 'P103',
      pname: 'Ibuprofen 400mg Pain Relief',
      slug: 'ibuprofen-400mg-tablets',
      description: 'Non-steroidal anti-inflammatory drug (NSAID) for dental pain, back pain, and joint stiffness.',
      composition: 'Ibuprofen IP 400mg',
      dosageForm: 'Tablet',
      strength: '400mg',
      prescriptionRequired: false,
      mrp: 50.0,
      sellingPrice: 38.0,
      discount: 24.0,
      rating: 4.7,
      reviewCount: 95,
      image: 'images/pills.png',
      categoryId: painReliefCat!.id,
      brandId: bayer.id
    },
    {
      pid: 'P104',
      pname: 'Vitamin C 1000mg Chewable',
      slug: 'vitamin-c-1000mg-chewable',
      description: 'Immunity booster tablet enriched with Zinc and Rosehips extract for daily vitality.',
      composition: 'Ascorbic Acid 1000mg + Elemental Zinc 10mg',
      dosageForm: 'Chewable Tablet',
      strength: '1000mg',
      prescriptionRequired: false,
      mrp: 350.0,
      sellingPrice: 249.0,
      discount: 28.0,
      rating: 4.9,
      reviewCount: 210,
      image: 'images/pills.png',
      categoryId: vitaminsCat!.id,
      brandId: gsk.id
    },
    {
      pid: 'P105',
      pname: 'Accu-Chek Blood Glucose Test Strips 50s',
      slug: 'accu-chek-test-strips-50s',
      description: 'High accuracy self-testing blood glucose test strips for diabetic monitoring.',
      composition: 'Glucose Oxidase Biosensor Strips',
      dosageForm: 'Strips',
      strength: '50 Strips Pack',
      prescriptionRequired: false,
      mrp: 999.0,
      sellingPrice: 799.0,
      discount: 20.0,
      rating: 4.9,
      reviewCount: 310,
      image: 'images/pills.png',
      categoryId: diabetesCat!.id,
      brandId: bayer.id
    },
    {
      pid: 'P106',
      pname: 'Digital Upper Arm Blood Pressure Monitor',
      slug: 'digital-bp-monitor-upper-arm',
      description: 'Fully automatic digital BP apparatus with large LCD display and arrhythmia detection.',
      composition: 'Digital Oscillometric Sensor',
      dosageForm: 'Medical Device',
      strength: '1 Unit',
      prescriptionRequired: false,
      mrp: 2499.0,
      sellingPrice: 1799.0,
      discount: 28.0,
      rating: 4.8,
      reviewCount: 165,
      image: 'images/pills.png',
      categoryId: devicesCat!.id,
      brandId: gsk.id
    }
  ];

  for (const prod of products) {
    const createdProd = await prisma.product.upsert({
      where: { pid: prod.pid },
      update: {},
      create: prod
    });

    // 5. Inventory & FEFO Batches
    const inventory = await prisma.inventory.upsert({
      where: { pid_sid: { pid: createdProd.pid, sid: seller.id } },
      update: {},
      create: {
        pid: createdProd.pid,
        sid: seller.id,
        quantity: 100,
        reservedQty: 0,
        reorderLevel: 15,
        location: 'Warehouse A-12'
      }
    });

    await prisma.inventoryBatch.create({
      data: {
        inventoryId: inventory.id,
        batchNo: `BATCH-${createdProd.pid}-2024`,
        mfgDate: '2024-01-10',
        expDate: '2026-12-31',
        quantity: 100,
        purchasePrice: prod.sellingPrice * 0.6,
        sellingPrice: prod.sellingPrice
      }
    });
  }

  console.log('✅ Products & FEFO Batches seeded');

  // 6. Promotional Coupons
  await prisma.coupon.upsert({
    where: { code: 'MEDICARE10' },
    update: {},
    create: {
      code: 'MEDICARE10',
      description: 'Get 10% flat discount on all health products',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      maxDiscount: 150,
      minOrder: 300,
      expiryDate: new Date('2027-12-31'),
      usageLimit: 500,
      active: true
    }
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME50' },
    update: {},
    create: {
      code: 'WELCOME50',
      description: 'Flat ₹50 OFF for new Medicare customers',
      discountType: 'FIXED',
      discountValue: 50,
      minOrder: 249,
      expiryDate: new Date('2027-12-31'),
      usageLimit: 1000,
      active: true
    }
  });

  console.log('✅ Promotional coupons seeded');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
