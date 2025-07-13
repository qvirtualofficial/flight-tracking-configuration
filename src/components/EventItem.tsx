import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import type { TrackingEvent } from '@/types/event';

interface EventItemProps {
  event: TrackingEvent;
  onEdit: (event: TrackingEvent) => void;
  onDelete: (id: string) => void;
}

export function EventItem({ event, onEdit, onDelete }: EventItemProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded border bg-card hover:bg-accent/50 transition-colors group">
      <GripVertical className="h-3 w-3 text-muted-foreground cursor-grab flex-shrink-0" />
      
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <span className="font-mono text-xs truncate flex-1" title={event.condition}>
          {event.condition}
        </span>
        <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={event.message}>
          → {event.message}
        </span>
        {(event.initialValue !== undefined || event.timeout !== undefined) && (
          <span className="text-xs text-muted-foreground/70 flex-shrink-0">
            {event.initialValue !== undefined && `[${event.initialValue ? 'T' : 'F'}]`}
            {event.timeout !== undefined && ` ${event.timeout}ms`}
          </span>
        )}
      </div>
      
      <div className="flex gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onEdit(event)}
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => onDelete(event.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}