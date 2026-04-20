import React from 'react';

interface StatCounterProps {
  number: string;
  label: string;
}

const StatCounter: React.FC<StatCounterProps> = ({ number, label }) => {
  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-black text-primary mb-2">{number}</div>
      <div className="text-on-surface-variant font-medium">{label}</div>
    </div>
  );
};

export default StatCounter;
