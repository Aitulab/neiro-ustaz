import React from 'react';
import styles from './Input.module.css';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
  label?: string;
  id?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  label,
  id,
  className = '',
}) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${styles.input} ${icon ? styles.withIcon : ''}`}
        />
      </div>
    </div>
  );
};

export default Input;
