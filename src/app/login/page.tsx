'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div
        className="w-full max-w-md"
        onKeyDown={handleKeyDown}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-widest text-white">BUBU-RECORD</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 text-white placeholder-white/40 px-4 py-3 focus:outline-none focus:border-white/60 transition-colors"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 text-white placeholder-white/40 px-4 py-3 focus:outline-none focus:border-white/60 transition-colors"
            />
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full h-12 bg-white text-black font-light tracking-wider hover:bg-white/90 transition-colors"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
