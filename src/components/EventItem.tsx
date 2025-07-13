import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit, Trash2 } from 'lucide-react';
import { TrackingEvent } from '@/types/event';

interface EventItemProps {
  event: TrackingEvent;
  onEdit: (event: TrackingEvent) => void;
  onDelete: (id: string) => void;
}

export function EventItem({ event, onEdit, onDelete }: EventItemProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
        
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
  );
}