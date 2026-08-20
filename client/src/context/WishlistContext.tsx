import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistProductIds: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistProductIds([]);
      return;
    }
    try {
      const res = await fetchApi('/wishlist');
      const ids = (res.wishlist?.items || []).map((i: any) => i.productId);
      setWishlistProductIds(ids);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      alert('Please log in to add items to your wishlist.');
      return;
    }
    const res = await fetchApi('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
    if (res.inWishlist) {
      setWishlistProductIds(prev => [...prev, productId]);
    } else {
      setWishlistProductIds(prev => prev.filter(id => id !== productId));
    }
  };

  const isInWishlist = (productId: string) => wishlistProductIds.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlistProductIds, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
