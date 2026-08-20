import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../services/api';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchApi('/wishlist')
      .then(res => setItems(res.wishlist?.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (productId: string) => {
    await fetchApi('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading wishlist...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Saved Wishlist ({items.length})</h1>

      {items.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No saved products yet</h3>
          <p className="text-xs text-slate-500">Save items here to quickly purchase them later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(item => {
            const prod: Product = item.product;
            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-full h-32 flex items-center justify-center bg-slate-50 rounded-xl mb-3">
                    <img src={prod?.image || 'images/pills.png'} alt={prod?.pname} className="h-24 object-contain" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{prod?.pname}</h4>
                  <p className="text-[10px] text-slate-500 mb-2">{prod?.dosageForm} • {prod?.strength}</p>
                  <div className="text-sm font-extrabold text-slate-900">{formatCurrency(prod?.sellingPrice || 0)}</div>
                </div>

                <div className="flex gap-2 border-t border-slate-100 pt-3 mt-3">
                  <button
                    onClick={() => addToCart(prod.id)}
                    className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(prod.id)}
                    className="p-2 text-slate-400 hover:text-red-500 border border-slate-200 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
