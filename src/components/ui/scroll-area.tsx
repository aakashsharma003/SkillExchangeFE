import * as React from 'react';

type ScrollAreaProps = React.HTMLAttributes<HTMLDivElement> & {
  viewportClassName?: string;
};

export function ScrollArea({ className = '', viewportClassName = '', children, ...props }: ScrollAreaProps) {
  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      <div className={`h-full w-full overflow-auto [scrollbar-width:thin] ${viewportClassName}`}>{children}</div>
    </div>
  );
}

