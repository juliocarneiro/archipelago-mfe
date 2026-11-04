import { Link } from 'react-router';
import { ErrorState } from '@mfe/ui';

export function NotFound() {
  return (
    <ErrorState
      title="No island lives at this address"
      description={
        <Link to="/" className="font-semibold text-sea underline-offset-4 hover:underline">
          Go to the home page
        </Link>
      }
    />
  );
}
