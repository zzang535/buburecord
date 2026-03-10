'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Album {
  id: number;
  image_url: string;
}

const GRID_COLUMNS_STORAGE_KEY = 'album-grid-columns';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [gridColumns, setGridColumns] = useState(4);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedColumns = window.localStorage.getItem(GRID_COLUMNS_STORAGE_KEY);
    const parsedColumns = Number(storedColumns);

    if (parsedColumns >= 1 && parsedColumns <= 10) {
      setGridColumns(parsedColumns);
      return;
    }

    setGridColumns(window.innerWidth >= 1024 ? 4 : 1);
  }, []);

  useEffect(() => {
    const checkAuthAndFetchAlbums = async () => {
      try {
        const response = await fetch('/api/album/list', {
          credentials: 'include',
        });

        if (response.status === 401) {
          setIsAuthenticated(false);
          setLoading(false);
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }

        const data = await response.json();
        setIsAuthenticated(true);
        setAlbums(data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching albums:', error);
        setIsAuthenticated(false);
        setLoading(false);
        router.push('/login');
      }
    };

    checkAuthAndFetchAlbums();
  }, [router]);

  const handleAlbumClick = (id: number) => {
    router.push(`/album/${id}`);
  };

  const handleGridToggle = () => {
    setGridColumns((currentColumns) => {
      const nextColumns = currentColumns === 10 ? 1 : currentColumns + 1;
      window.localStorage.setItem(GRID_COLUMNS_STORAGE_KEY, String(nextColumns));
      return nextColumns;
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    // This shouldn't be reached as we redirect in useEffect, but just in case
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      <div
        className="grid gap-px bg-white/5"
        style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
      >
        {albums.map((album) => (
          <div
            key={album.id}
            className="aspect-square cursor-pointer bg-black group overflow-hidden"
            onClick={() => handleAlbumClick(album.id)}
          >
            <div className="relative w-full h-full">
              <Image
                src={`https://d38e565eilzns0.cloudfront.net/${album.image_url}?w=500`}
                alt={`Album ${album.id}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={`${Math.round(100 / gridColumns)}vw`}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleGridToggle}
        className="fixed right-5 bottom-5 z-50 flex h-14 min-w-14 items-center justify-center rounded-full border border-white/15 bg-white text-black shadow-[0_12px_40px_rgba(255,255,255,0.18)] transition-transform hover:scale-105"
        aria-label={`Change album grid columns, currently ${gridColumns}`}
      >
        <span className="px-4 text-lg font-semibold tracking-tight">{gridColumns}</span>
      </button>
    </div>
  );
}
