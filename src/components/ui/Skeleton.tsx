interface SkeletonProps {
    className?: string;
}

const Skeleton = ({ className = '' }: SkeletonProps) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-md ${className}`}
            aria-hidden="true"
        />
    );
};

export default Skeleton;
