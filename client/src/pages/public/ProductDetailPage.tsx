import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, AlertTriangle, Heart, ShoppingCart, Award } from 'lucide-react';
import { fetchApi } from '../../services/api';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (id) {
      fetchApi(`/products/${id}`)
        .then(res => setProduct(res.product))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading medicine details...</div>;
  }

  if (!product) {
    return <div className="p-12 text-center text-slate-500">Product not found. <Link to="/medicines" className="text-teal-700 font-bold">Return to catalog</Link></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Gallery */}
        <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-center border border-slate-100 relative">
          <img src={product.image} alt={product.pname} className="max-h-72 object-contain" />
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md text-slate-400 hover:text-red-500 transition"
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Product Information */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {product.category?.name || 'Pharmacy'}
              </span>
              {product.prescriptionRequired && (
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Prescription Required (Rx)
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-bold text-slate-900">{product.pname}</h1>
            <p className="text-xs text-slate-500 mt-1">Composition: {product.composition}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span className="text-slate-400 font-normal">({product.reviewCount} customer reviews)</span>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-baseline gap-3">
            <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(product.sellingPrice)}</span>
            <span className="text-sm text-slate-400 line-through">{formatCurrency(product.mrp)}</span>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {product.discount}% OFF
            </span>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-200 font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product.id, quantity)}
              className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-200 transition"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>100% Genuine Medicine</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-700" />
              <span>Home Delivery Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Dosage Info */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Product Overview & Dosage</h3>
        <div className="text-xs text-slate-600 leading-relaxed space-y-3">
          <p>{product.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl font-medium">
            <div><span className="text-slate-400 block">Dosage Form</span><strong className="text-slate-900">{product.dosageForm}</strong></div>
            <div><span className="text-slate-400 block">Strength</span><strong className="text-slate-900">{product.strength}</strong></div>
            <div><span className="text-slate-400 block">Prescription</span><strong className="text-slate-900">{product.prescriptionRequired ? 'Required' : 'Not Required'}</strong></div>
            <div><span className="text-slate-400 block">Stock Status</span><strong className="text-green-700">In Stock</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
