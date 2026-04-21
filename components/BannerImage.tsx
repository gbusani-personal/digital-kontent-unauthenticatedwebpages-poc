'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BannerImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  itemId?: string;
  elementCodename?: string;
}

export default function BannerImage({ src, alt, className, style, itemId, elementCodename = 'banner' }: BannerImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 rounded-lg animate-pulse ${className}`}
        style={style}
      />
    );
  }

  const editAttributes = itemId
    ? { 'data-kontent-item-id': itemId, 'data-kontent-element-codename': elementCodename }
    : {};

  return (
    <div className="relative overflow-hidden w-full rounded-lg sm:rounded-xl" style={{ height: '12rem' }} {...editAttributes}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg sm:rounded-xl animate-pulse"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        priority
        className={`transition-all duration-700 ease-out rounded-lg sm:rounded-xl ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} object-cover`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}