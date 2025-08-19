import * as React from 'react';

type SeparatorProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
};

export function Separator({ orientation = 'horizontal', className = '', ...props }: SeparatorProps) {
  const isVertical = orientation === 'vertical';
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`bg-[--color-border] ${isVertical ? 'h-full w-px' : 'w-full h-px'} ${className}`}
      {...props}
    />
  );
}

