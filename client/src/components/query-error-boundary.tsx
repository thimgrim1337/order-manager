import { ErrorBoundary } from 'react-error-boundary';
import ErrorComponent from '@/components/error';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactNode } from '@tanstack/react-router';

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
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
