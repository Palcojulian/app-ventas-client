import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
}

const EmptyState = ({
    title = 'Sin datos',
    description,
    icon: Icon = Inbox,
    action,
}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Icon className="text-gray-400" width={24} height={24} />
            </div>
            <h4 className="text-base font-semibold text-gray-700">{title}</h4>
            {description && (
                <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
};

export default EmptyState;
