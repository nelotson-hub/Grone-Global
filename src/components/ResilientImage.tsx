import React, { useState, useEffect } from 'react';
import { Building2, PaintBucket } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackCategory?: 'paints' | 'contracting';
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackCategory = 'paints',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-slate-900 text-stone-200 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        {fallbackCategory === 'paints' ? (
          <PaintBucket className="w-10 h-10 text-amber-500 mb-3 opacity-90" />
        ) : (
          <Building2 className="w-10 h-10 text-amber-500 mb-3 opacity-90" />
        )}
        <p className="text-sm font-semibold tracking-tight text-white max-w-xs">{alt}</p>
        <p className="text-xs text-stone-400 mt-1">Grone Global Ltd</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      decoding="async"
      onError={() => setHasError(true)}
      className={`block ${className}`}
    />
  );
};
