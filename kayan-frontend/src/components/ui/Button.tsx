import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const VARIANTS = {
  primary: 'bg-teal text-white hover:bg-teal/90',
  secondary: 'bg-canvas text-ink border border-black/10 hover:bg-black/5',
  danger: 'bg-coral text-white hover:bg-coral/90',
};

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      className={`px-4 py-2 rounded-lg text-xs font-medium transition disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}