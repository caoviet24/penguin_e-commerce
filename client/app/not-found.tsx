import { Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
            <div className="space-y-2 text-center">
                <h1 className="text-6xl font-bold">404</h1>
                <h2 className="text-2xl font-medium">Page Not Found</h2>
                <p className="text-muted-foreground">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
            </div>
            <Button>
                <Link href="/">Go Back Home</Link>
            </Button>
        </div>
    );
}