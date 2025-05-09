import { Link } from '@tanstack/react-router';
import { Button } from './ui/primitives/button';

export default function ErrorComponent({
  error,
  onClick,
}: {
  error: Error;
  onClick: () => void;
}) {
  const isDev = process.env.NODE_ENV !== 'production';

  return (
    <div className='mt-8 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div>
          <h2>Oops! Something went wrong</h2>
          <p>We&apos;re sorry, but we encountered an unexpected error.</p>
        </div>

        <div className='mt-4 space-y-4'>
          <Button className='w-full' onClick={onClick}>
            Try again
          </Button>
          <Button asChild className='w-full' variant='outline'>
            <Link to='/'>Return to homepage</Link>
          </Button>
          {isDev ? (
            <div className='rounded-md bg-muted p-4'>
              <h3 className='mb-2 font-semibold'>Error Message:</h3>
              <p className='mb-4 text-sm'>{error.message}</p>
              <h3 className='mb-2 font-semibold'>Stack Trace:</h3>
              <pre className='overflow-x-auto whitespace-pre-wrap text-xs'>
                {error.stack}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
