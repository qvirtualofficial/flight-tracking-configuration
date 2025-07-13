import type { TrackingEvent } from "@/types/event";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit, Trash2 } from "lucide-react";

interface SortableEventWrapperProps {
  event: TrackingEvent;
  onEdit: (event: TrackingEvent) => void;
  onDelete: (id: string) => void;
}

function SortableEventWrapper({
  event,
  onEdit,
  onDelete,
}: SortableEventWrapperProps) {
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
    <div ref={setNodeRef} style={style} className="relative">
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="flex items-center gap-3 px-3">
          <button
            className="flex-shrink-0 focus:outline-none cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="font-mono text-sm truncate" title={event.condition}>
              {event.condition}
            </div>
            <div
              className="text-sm text-muted-foreground truncate"
              title={event.message}
            >
              {event.message}
            </div>
            {(event.initialValue !== undefined ||
              event.timeout !== undefined) && (
              <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                {event.initialValue !== undefined && (
                  <span>Initial: {event.initialValue ? "true" : "false"}</span>
                )}
                {event.timeout !== undefined && (
                  <span>Timeout: {event.timeout}ms</span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-1 flex-shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onEdit(event)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
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

export { SortableEventWrapper };
