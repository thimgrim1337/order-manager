import { ReactNode } from 'react';

export default function TypographyLead({ children }: { children: ReactNode }) {
  return <p className='text-muted-foreground'>{children}</p>;
}
