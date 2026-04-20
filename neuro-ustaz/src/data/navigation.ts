import type { NavItem } from '../types';

export const navItems: NavItem[] = [
  { id: 'home', path: '/' },
  { id: 'assistant', path: '/assistant' },
  { id: 'tasks', path: '/tasks' },
  { id: 'community', path: '/community' },
  { id: 'tools', path: '/tools' },
  { id: 'npa', path: '/npa' },
  { id: 'support', path: '/support' },
];

export const footerLinks: NavItem[] = [
  { id: 'about', label: 'Біз туралы', path: '#' },
  { id: 'privacy', label: 'Құпиялылық', path: '#' },
  { id: 'help', label: 'Көмек', path: '#' },
  { id: 'contact', label: 'Байланыс', path: '#' },
];
