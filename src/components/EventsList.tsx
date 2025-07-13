import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { TrackingEvent } from "@/types/event";
import { EventItem } from "./EventItem";
import { SortableEventWrapper } from "./SortableEventWrapper";
import { useState, useCallback, useMemo } from "react";

interface EventsListProps {
  events: TrackingEvent[];
  onEventsChange: (events: TrackingEvent[]) => void;
  onEditEvent: (event: TrackingEvent) => void;
  onDeleteEvent: (id: string) => void;
}

function EventsList({
  events,
  onEventsChange,
  onEditEvent,
  onDeleteEvent,
}: EventsListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = events.findIndex((e) => e.id === active.id);
        const newIndex = events.findIndex((e) => e.id === over.id);
        onEventsChange(arrayMove(events, oldIndex, newIndex));
      }

      setActiveId(null);
    },
    [events, onEventsChange],
  );

  const activeEvent = useMemo(
    () => (activeId ? events.find((e) => e.id === activeId) : null),
    [activeId, events],
  );

  const sortableItems = useMemo(() => events.map((e) => e.id), [events]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={sortableItems}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {events.map((event) => (
            <SortableEventWrapper
              key={event.id}
              event={event}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeEvent ? (
          <EventItem
            event={activeEvent}
            onEdit={() => {}}
            onDelete={() => {}}
            isDragOverlay={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export { EventsList };
