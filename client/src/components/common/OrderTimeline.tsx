import React from 'react';
import { CheckCircle2, Clock, PackageCheck, Truck, Home } from 'lucide-react';

interface OrderTimelineProps {
  status: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const steps = [
    { key: 'Confirmed', label: 'Order Placed', icon: CheckCircle2 },
    { key: 'Packed', label: 'Packed & Ready', icon: PackageCheck },
    { key: 'OutForDelivery', label: 'Out For Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: Home }
  ];

  const getStepIndex = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Confirmed':
      case 'Pending': return 0;
      case 'Processing':
      case 'Packed': return 1;
      case 'Shipped':
      case 'OutForDelivery': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative max-w-md mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-1 bg-teal-700 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= currentIndex;
          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isCompleted ? 'bg-teal-700 text-white shadow-md shadow-teal-200' : 'bg-slate-100 border-2 border-slate-300 text-slate-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[11px] font-medium ${isCompleted ? 'text-teal-900 font-bold' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
