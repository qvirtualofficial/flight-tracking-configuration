import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Edit, Trash2 } from "lucide-react";
import type { TrackingEvent } from "@/types/event";
import React from "react";

interface EventItemProps {
  event: TrackingEvent;
  onEdit: (event: TrackingEvent) => void;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
}

export const EventItem = React.forwardRef<HTMLDivElement, EventItemProps>(
  function EventItem({ event, onEdit, onDelete, isDragOverlay = false }, ref) {
    return (
      <Card ref={ref} className="hover:bg-accent/50 transition-colors relative">
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex-shrink-0">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

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
              disabled={isDragOverlay}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onDelete(event.id)}
              disabled={isDragOverlay}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
);

EventItem.displayName = "EventItem";
