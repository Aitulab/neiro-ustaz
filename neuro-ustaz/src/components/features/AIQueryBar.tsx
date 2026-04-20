import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Card from '../ui/Card';
import styles from './AIQueryBar.module.css';

interface AIQueryBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  isFloating?: boolean;
}

const AIQueryBar: React.FC<AIQueryBarProps> = ({
  onSearch,
  placeholder = 'Сабақ жоспарын жасау (мысалы: 10 сынып биология)...',
  isFloating = false,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <Card className={`${styles.wrapper} ${isFloating ? styles.floating : ''}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.iconWrapper}>
          <span className="material-symbols-outlined">auto_awesome</span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
        />
        <button type="submit" className={styles.submitBtn} disabled={!query.trim()}>
          <Send size={20} />
        </button>
      </form>
    </Card>
  );
};

export default AIQueryBar;
