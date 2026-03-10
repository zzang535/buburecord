'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Album {
  id: number;
  image_url: string;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    <div className="min-h-screen bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
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
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
