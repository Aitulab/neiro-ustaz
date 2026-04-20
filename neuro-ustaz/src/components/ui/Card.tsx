import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevated = false,
  gradient = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.card} ${elevated ? styles.elevated : ''} ${gradient ? styles.gradient : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
