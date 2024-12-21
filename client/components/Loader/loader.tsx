interface LoaderProps {
    className?: string;
    size: "sm" | "md" | "lg";
}

export default function Loader({ className, size }: LoaderProps) {
    const sizeClasses = {
        sm: {
            outer: 'w-12 h-12 text-2xl border-4',
            inner: 'w-10 h-10 text-xl border-4'
        },
        md: {
            outer: 'w-16 h-16 text-4xl border-6',
            inner: 'w-14 h-14 text-2xl border-4'
        },
        lg: {
            outer: 'w-20 h-20 text-6xl border-8',
            inner: 'w-18 h-18 text-3xl border-6'
        }
    }
    const { outer, inner } = sizeClasses[size];

    return (
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col gap-4 w-full flex items-center justify-center ${className}`}>
            <div className={`${outer} border-transparent text-blue-400 animate-spin flex items-center justify-center border-t-blue-400 rounded-full`}>
                <div className={`${inner} border-transparent text-red-400 animate-spin flex items-center justify-center border-t-red-400 rounded-full`}></div>
            </div>
        </div>
    )
}
