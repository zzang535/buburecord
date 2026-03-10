'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Album {
  id: number;
  image_url: string;
  date: string;
  comment: string;
}

export default function AlbumDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/album/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch album');
        }

        const data = await response.json();
        setAlbum(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAlbum();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white/60">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white/60">Album not found</div>
      </div>
    );
  }

  const cloudFrontUrl = `https://d38e565eilzns0.cloudfront.net/${album.image_url}`;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black -mt-16">
      {/* Full screen image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={cloudFrontUrl}
          alt="Album"
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Minimal overlay panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10 transition-transform duration-300 ease-in-out ${
          isPanelVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-3">
            <div>
              <p className="text-xs font-light text-white/40 uppercase tracking-wider mb-1">Date</p>
              <p className="text-lg text-white font-light">{new Date(album.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>

            {album.comment && (
              <div>
                <p className="text-xs font-light text-white/40 uppercase tracking-wider mb-1">Comment</p>
                <p className="text-base text-white/90 font-light leading-relaxed whitespace-pre-wrap">{album.comment}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsPanelVisible(!isPanelVisible)}
        className="absolute top-20 right-6 z-50 bg-white/10 backdrop-blur-sm border border-white/20 p-2.5 hover:bg-white/20 transition-colors"
        aria-label={isPanelVisible ? 'Hide panel' : 'Show panel'}
      >
        <svg
          className={`w-5 h-5 text-white transition-transform duration-300 ${
            isPanelVisible ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
