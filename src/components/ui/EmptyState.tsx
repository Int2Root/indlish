import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="w-16 h-16 bg-surface-lighter rounded-full flex items-center justify-center mb-4">
        <Icon className="text-text-muted" size={24} />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-text-muted text-sm max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}