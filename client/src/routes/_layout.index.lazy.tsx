import App from '@/App';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_layout/')({
  component: Index,
});

function Index() {
  return (
    <div className='container mx-auto py-10'>
      <h3>Welcome Home!</h3>
      <App />
    </div>
  );
}
