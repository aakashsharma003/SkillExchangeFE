import * as React from 'react';

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  src?: string | null;
  alt?: string;
  fallback?: string;
};

export function Avatar({ src, alt, fallback, className = '', ...props }: AvatarProps) {
  return (
    <div
      className={`relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[--color-border] bg-[--color-muted] ${className}`}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ''} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-medium text-[--muted-foreground]">
          {fallback?.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}

