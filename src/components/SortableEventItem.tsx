import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import type { TrackingEvent } from '@/types/event';

interface SortableEventItemProps {
  event: TrackingEvent;
  onEdit: (event: TrackingEvent) => void;
  onDelete: (id: string) => void;
}

export function SortableEventItem({ event, onEdit, onDelete }: SortableEventItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: event.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={isDragging ? 'shadow-lg' : ''}>
        <CardContent className="flex items-center gap-4 p-4">
          <div
            className="cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-1">
            <div className="font-mono text-sm mb-1">{event.condition}</div>
            <div className="text-sm text-muted-foreground">{event.message}</div>
            <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
              {event.initialValue !== undefined && (
                <span>Initial: {event.initialValue ? 'true' : 'false'}</span>
              )}
              {event.timeout !== undefined && (
                <span>Timeout: {event.timeout}ms</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(event)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}