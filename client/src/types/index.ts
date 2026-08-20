export type Role = 'CUSTOMER' | 'SELLER' | 'PHARMACIST' | 'ADMIN' | 'SUPPORT';

export interface User {
  id: string;
  email: string;
  fname: string;
  lname: string;
  phone: string;
  role: Role;
  addresses?: Address[];
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  pid: string;
  pname: string;
  slug: string;
  description: string;
  composition: string;
  dosageForm: string;
  strength: string;
  prescriptionRequired: boolean;
  mrp: number;
  sellingPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  category?: Category;
  inventory?: Inventory[];
  reviews?: Review[];
}

export interface Inventory {
  id: string;
  pid: string;
  sid: string;
  quantity: number;
  reorderLevel: number;
  location: string;
  batches?: InventoryBatch[];
}

export interface InventoryBatch {
  id: string;
  batchNo: string;
  mfgDate: string;
  expDate: string;
  quantity: number;
  sellingPrice: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNo: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'OutForDelivery' | 'Delivered' | 'Cancelled' | 'Refunded';
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  total: number;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddressJson: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Prescription {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
  createdAt: string;
  user?: { fname: string; lname: string; email: string };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  user?: { fname: string; lname: string };
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrder: number;
  expiryDate: string;
}
