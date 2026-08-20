import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Star, Heart, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { fetchApi } from '../../services/api';
import { Product, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MedicinesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';

  useEffect(() => {
    fetchApi('/categories')
      .then(res => setCategories(res.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (currentCategory) query.set('category', currentCategory);
    if (currentSearch) query.set('search', currentSearch);
    if (currentSort) query.set('sort', currentSort);

    fetchApi(`/products?${query.toString()}`)
      .then(res => setProducts(res.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentCategory, currentSearch, currentSort]);

  const handleCategorySelect = (catSlug: string) => {
    const params = new URLSearchParams(searchParams);
    if (catSlug) params.set('category', catSlug);
    else params.delete('category');
    setSearchParams(params);
  };

  const handleSortSelect = (sortVal: string) => {
    const params = new URLSearchParams(searchParams);
    if (sortVal) params.set('sort', sortVal);
    else params.delete('sort');
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumbs */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pharmacy Medicine Catalog</h1>
        <p className="text-xs text-slate-500">Showing genuine pharmaceutical products & health devices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 h-fit space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-teal-700" />
            <h3 className="font-bold text-sm text-slate-900">Filters</h3>
          </div>

          {/* Department Categories Filter */}
          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-2">Categories</h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                  !currentCategory ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Products
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategorySelect(c.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg transition ${
                    currentCategory === c.slug ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="md:col-span-3 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="font-medium text-slate-600">
              Found <strong className="text-slate-900">{products.length}</strong> products
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={currentSort}
                onChange={(e) => handleSortSelect(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="">Sort by Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white h-64 rounded-2xl animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Filter className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No medicines found</h3>
              <p className="text-xs text-slate-500">Try adjusting your category filter or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition relative group">
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition z-10"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(prod.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <div>
                    <Link to={`/medicines/${prod.id}`}>
                      <div className="w-full h-36 flex items-center justify-center bg-slate-50 rounded-xl mb-3 overflow-hidden">
                        <img src={prod.image} alt={prod.pname} className="h-28 object-contain group-hover:scale-105 transition" />
                      </div>
                    </Link>

                    {prod.prescriptionRequired && (
                      <span className="inline-block bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded mb-1">
                        Rx Required
                      </span>
                    )}

                    <Link to={`/medicines/${prod.id}`}>
                      <h3 className="font-bold text-xs text-slate-900 line-clamp-2 hover:text-teal-700 transition mb-1">{prod.pname}</h3>
                    </Link>
                    <p className="text-[10px] text-slate-500 mb-2">{prod.dosageForm} • {prod.strength}</p>

                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{prod.rating}</span>
                      <span className="text-slate-400">({prod.reviewCount})</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-base font-extrabold text-slate-900">{formatCurrency(prod.sellingPrice)}</span>
                      <span className="text-xs text-slate-400 line-through">{formatCurrency(prod.mrp)}</span>
                      <span className="text-xs font-bold text-green-600">{prod.discount}% OFF</span>
                    </div>

                    <button
                      onClick={() => addToCart(prod.id)}
                      className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-2 rounded-xl transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
