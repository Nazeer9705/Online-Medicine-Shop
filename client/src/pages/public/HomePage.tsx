import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Truck, Clock, Pill, Heart, Zap, Award, Star, ArrowRight, Activity, Flame, ChevronRight } from 'lucide-react';
import { fetchApi } from '../../services/api';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi('/products?limit=6')
      .then(res => setFeaturedProducts(res.products || []))
      .catch(err => console.error(err));
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/medicines?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-teal-700/60 border border-teal-500/40 text-teal-200 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-yellow-400" /> India's Trusted Healthcare Platform
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Healthcare made <span className="text-teal-300">simple.</span>
          </h1>

          <p className="text-sm md:text-base text-teal-100 leading-relaxed">
            Order genuine prescription medicines, vitamins & health devices online from verified pharmacies with fast home delivery.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="flex items-center bg-white p-1.5 rounded-2xl shadow-lg max-w-xl">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              placeholder="Search medicines (e.g. Paracetamol, Amoxicillin)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm text-slate-900 focus:outline-none"
            />
            <button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-xl transition whitespace-nowrap">
              Search
            </button>
          </form>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-teal-700/50 text-xs text-teal-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              <span>100% Genuine</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-300" />
              <span>Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-300" />
              <span>Verified Pharmacists</span>
            </div>
          </div>
        </div>

        {/* Decorative Badge Overlay */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20 hover:opacity-30 transition">
          <Pill className="w-80 h-80 text-teal-300" />
        </div>
      </section>

      {/* 2. Top Medicine Categories */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Explore Medicine Categories</h2>
            <p className="text-xs text-slate-500">Find healthcare products by department</p>
          </div>
          <Link to="/medicines" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'Pain Relief', slug: 'pain-relief', icon: Zap, color: 'bg-red-50 text-red-600' },
            { name: 'Vitamins', slug: 'vitamins-supplements', icon: Star, color: 'bg-amber-50 text-amber-600' },
            { name: 'Diabetes Care', slug: 'diabetes-care', icon: Activity, color: 'bg-blue-50 text-blue-600' },
            { name: 'Cold & Cough', slug: 'cold-flu', icon: Flame, color: 'bg-teal-50 text-teal-600' },
            { name: 'Medical Devices', slug: 'medical-devices', icon: Award, color: 'bg-purple-50 text-purple-600' },
            { name: 'Heart Care', slug: 'heart-care', icon: Heart, color: 'bg-rose-50 text-rose-600' },
          ].map(cat => (
            <Link key={cat.slug} to={`/medicines?category=${cat.slug}`} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition text-center flex flex-col items-center gap-2 group">
              <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Shop by Health Concern */}
      <section className="bg-teal-50/50 p-6 md:p-8 rounded-3xl border border-teal-100 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Shop by Health Concern</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: 'Heart Health', desc: 'BP & Cholesterol care', slug: 'heart-care' },
            { title: 'Diabetes Management', desc: 'Strips, monitors & care', slug: 'diabetes-care' },
            { title: 'Bone & Joints', desc: 'Calcium & Vitamin D3', slug: 'vitamins-supplements' },
            { title: 'Immunity Boosters', desc: 'Vitamin C & Supplements', slug: 'vitamins-supplements' },
          ].map((item, idx) => (
            <Link key={idx} to={`/medicines?category=${item.slug}`} className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-teal-400 transition flex items-center justify-between group">
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700">{item.title}</h4>
                <p className="text-[10px] text-slate-500">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-700 opacity-0 group-hover:opacity-100 transition" />
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured & Best Seller Medicines */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Popular Essential Medicines</h2>
            <p className="text-xs text-slate-500">Verified pharmaceuticals with instant stock</p>
          </div>
          <Link to="/medicines" className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1">
            Browse Catalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredProducts.map((prod) => (
            <div key={prod.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition relative group">
              {/* Wishlist Icon */}
              <button
                onClick={() => toggleWishlist(prod.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition z-10"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(prod.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              <div>
                {/* Image */}
                <div className="w-full h-32 flex items-center justify-center bg-slate-50 rounded-xl mb-3 overflow-hidden">
                  <img src={prod.image} alt={prod.pname} className="h-24 object-contain group-hover:scale-105 transition" />
                </div>

                {/* Badges */}
                {prod.prescriptionRequired && (
                  <span className="inline-block bg-red-100 text-red-800 text-[9px] font-bold px-1.5 py-0.5 rounded mb-1">
                    Rx Required
                  </span>
                )}

                <h3 className="font-bold text-xs text-slate-900 line-clamp-2 mb-1">{prod.pname}</h3>
                <p className="text-[10px] text-slate-500 mb-2">{prod.dosageForm} • {prod.strength}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 mb-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{prod.rating}</span>
                  <span className="text-slate-400">({prod.reviewCount})</span>
                </div>
              </div>

              {/* Price & Cart */}
              <div className="border-t border-slate-100 pt-2 mt-2">
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-sm font-extrabold text-slate-900">{formatCurrency(prod.sellingPrice)}</span>
                  <span className="text-[10px] text-slate-400 line-through">{formatCurrency(prod.mrp)}</span>
                  <span className="text-[10px] font-bold text-green-600">{prod.discount}% OFF</span>
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
      </section>

      {/* 5. Health Blog & Educational Articles */}
      <section className="bg-slate-100 p-8 rounded-3xl space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Health & Wellness Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'How to Store Medicines Safely at Home', category: 'Medicine Safety', date: '20 Aug 2026' },
            { title: 'Understanding Prescription Drug Expiry Dates', category: 'Pharmacy Care', date: '18 Aug 2026' },
            { title: 'Daily Immunity Boosters & Vitamin C Guide', category: 'Wellness', date: '15 Aug 2026' }
          ].map((blog, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full uppercase">{blog.category}</span>
                <h4 className="font-bold text-sm text-slate-900 mt-2 mb-1">{blog.title}</h4>
                <p className="text-xs text-slate-500">Learn important guidelines from certified pharmacists on safe pharmaceutical handling.</p>
              </div>
              <div className="text-[10px] text-slate-400 mt-4 font-medium">{blog.date}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
