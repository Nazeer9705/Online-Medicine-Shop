import React from 'react';
import { Link } from 'react-router-dom';
import { Pill, ShieldCheck, Truck, Clock, Headphones, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 pt-12 pb-20 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust Value Props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-teal-900/50 text-teal-400 p-3 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">100% Genuine Medicines</h4>
            <p className="text-slate-400 text-[11px]">Sourced directly from certified pharmaceutical manufacturers.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-teal-900/50 text-teal-400 p-3 rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Express Delivery</h4>
            <p className="text-slate-400 text-[11px]">Fast home delivery with real-time order status tracking.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-teal-900/50 text-teal-400 p-3 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Pharmacist Verified</h4>
            <p className="text-slate-400 text-[11px]">Prescriptions inspected by licensed healthcare professionals.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-teal-900/50 text-teal-400 p-3 rounded-2xl">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">24/7 Support</h4>
            <p className="text-slate-400 text-[11px]">Customer care team ready to help with orders & inquiries.</p>
          </div>
        </div>

        {/* Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="bg-teal-600 text-white p-1.5 rounded-lg">
                <Pill className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">MEDI<span className="text-teal-400">CARE</span></span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm mb-4">
              MEDICARE V2.0 is India’s premier online pharmacy platform, delivering prescription medicines, over-the-counter drugs, healthcare supplements, and medical devices directly to your doorstep.
            </p>
            <div className="text-[11px] text-slate-500">
              © 2026 MEDICARE Health Systems Inc. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/medicines" className="hover:text-teal-400 transition">All Medicines</Link></li>
              <li><Link to="/medicines?category=pain-relief" className="hover:text-teal-400 transition">Pain Relief</Link></li>
              <li><Link to="/medicines?category=vitamins-supplements" className="hover:text-teal-400 transition">Vitamins</Link></li>
              <li><Link to="/offers" className="hover:text-teal-400 transition">Special Discounts</Link></li>
              <li><Link to="/blog" className="hover:text-teal-400 transition">Health Articles</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Customer Care</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link to="/orders" className="hover:text-teal-400 transition">My Orders</Link></li>
              <li><Link to="/prescriptions" className="hover:text-teal-400 transition">Upload Prescription</Link></li>
              <li><Link to="/faq" className="hover:text-teal-400 transition">FAQ & Helps</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Legal & Safety</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-teal-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Return & Refund Policy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition">Healthcare Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Healthcare Disclaimer */}
        <div className="bg-slate-950/80 p-4 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-800">
          <strong className="text-slate-400 block mb-1">Medical Advice Disclaimer:</strong>
          The content on MEDICARE is for educational and informational purposes only and is not intended to serve as professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified physician or healthcare provider regarding any medical condition or prescription medication.
        </div>
      </div>
    </footer>
  );
};
