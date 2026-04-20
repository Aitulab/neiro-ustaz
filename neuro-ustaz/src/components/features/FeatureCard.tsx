import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="w-14 h-14 rounded-full bg-[#f0f5ff] flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-[#1e6ae8] text-[28px]">{icon}</span>
      </div>
      <h3 className="text-[20px] font-bold mb-4 text-[#0f172a] font-headline">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-[15px]">{description}</p>
    </div>
  );
};

export default FeatureCard;
