import { cn } from '@/lib/utils';
import TypographyH2 from './h2';
import TypographyLead from './lead';

type PageHeaderProps = {
  h2Text: string;
  subText?: string;
  className?: string;
};

export default function PageHeader({
  h2Text,
  subText,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('mb-4', className)}>
      <TypographyH2>{h2Text}</TypographyH2>
      <TypographyLead>{subText}</TypographyLead>
    </header>
  );
}
