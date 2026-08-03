import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  hasError?: boolean;
}

export function PasswordInput({ hasError, className = '', ...rest }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        className={`w-full px-3 py-2.5 pr-10 rounded-lg border bg-canvas text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 transition ${
          hasError
            ? 'border-coral focus:ring-coral/30'
            : 'border-black/10 focus:ring-teal/30 focus:border-teal'
        } ${className}`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition"
        tabIndex={-1}
      >
        {visible ? (
           Eye-off icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" strokeLinecap="round" />
            <path
              d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
              strokeLinecap="round"
            />
            <path d="M2 2l20 20" strokeLinecap="round" />
          </svg>
        ) : (
      
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}