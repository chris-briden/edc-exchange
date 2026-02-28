// src/components/WaitlistForm.tsx
'use client';

import { useState, FormEvent } from 'react';

interface WaitlistFormProps {
  signupType?: 'general' | 'founding_seller';
  source?: string;
  className?: string;
  buttonText?: string;
  variant?: 'hero' | 'founding-seller';
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function WaitlistForm({
  signupType = 'general',
  source = 'organic',
  className = '',
  buttonText = 'Join the Carry',
  variant = 'hero',
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [count, setCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, signup_type: signupType, source }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setState('success');
      setCount(data.count);
    } catch (error) {
      console.error('Waitlist signup error:', error);
      setState('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  // Success state
  if (state === 'success') {
    return (
      <div className={`${className} text-center`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
            <svg
              className="h-5 w-5 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">You&apos;re in!</h3>
        <p className="text-sm text-gray-300">
          We&apos;ll be in touch soon.
          {count && ` You're #${count} on the list.`}
        </p>
      </div>
    );
  }

  // Compact hero variant — inline email + button
  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className={className}>
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 sm:bg-white/10 sm:backdrop-blur-md sm:border sm:border-white/15 sm:rounded-full sm:p-1.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={state === 'loading'}
            required
            className="
              flex-1 px-5 py-3 sm:py-2.5
              bg-white/10 sm:bg-transparent
              border border-white/15 sm:border-0
              rounded-full sm:rounded-full
              text-white text-sm placeholder:text-gray-400
              focus:outline-none focus:ring-0
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
            "
          />
          <button
            type="submit"
            disabled={state === 'loading' || !email}
            className="
              px-7 py-3 sm:py-2.5 rounded-full
              bg-orange-500 hover:bg-orange-400
              text-white text-sm font-bold tracking-wide
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all transform hover:scale-[1.02]
              active:scale-[0.98]
              shadow-lg shadow-orange-600/25
              whitespace-nowrap
            "
          >
            {state === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Joining...
              </span>
            ) : (
              buttonText
            )}
          </button>
        </div>

        {state === 'error' && (
          <p className="mt-3 text-red-400 text-sm text-center">{errorMessage}</p>
        )}
      </form>
    );
  }

  // Default / founding-seller variant
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={state === 'loading'}
          required
          className="
            w-full px-5 py-3 rounded-lg
            bg-black/40 border border-gray-700
            text-white text-sm placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
          "
        />
        <button
          type="submit"
          disabled={state === 'loading' || !email}
          className="
            w-full px-6 py-3 rounded-full
            bg-orange-500 hover:bg-orange-400
            text-white text-sm font-bold tracking-wide
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all transform hover:scale-[1.02]
            active:scale-[0.98]
            shadow-lg shadow-orange-600/25
          "
        >
          {state === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Joining...
            </span>
          ) : (
            buttonText
          )}
        </button>
      </div>

      {state === 'error' && (
        <p className="mt-3 text-red-400 text-sm">{errorMessage}</p>
      )}
    </form>
  );
}
