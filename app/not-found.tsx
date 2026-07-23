import Link from 'next/link';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-black text-brand-500 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mb-6 text-sm">
        The service page or resource you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
}
