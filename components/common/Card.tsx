import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl p-6 ${className || ''}`}>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
