import type { ReactNode, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = '', ...rest }: Props) {
  return (
    <div className={`bg-surface rounded-2xl border border-black/5 shadow-sm ${className}`} {...rest}>
      {children}
    </div>
  );
}