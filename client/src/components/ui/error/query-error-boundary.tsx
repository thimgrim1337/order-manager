import { ErrorBoundary } from 'react-error-boundary';
import ErrorComponent from '@/components/ui/error/error';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactNode } from '@tanstack/react-router';
import { Suspense } from 'react';
import { LoaderCircleIcon } from 'lucide-react';

export default function QueryErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorComponent error={error} onClick={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<LoaderCircleIcon className='animate-spin' />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
