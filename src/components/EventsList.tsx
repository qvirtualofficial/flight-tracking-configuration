import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { TrackingEvent } from '@/types/event';
import { SortableEventItem } from './SortableEventItem';

interface EventsListProps {
  events: TrackingEvent[];
  onEventsChange: (events: TrackingEvent[]) => void;
  onEditEvent: (event: TrackingEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export function EventsList({ events, onEventsChange, onEditEvent, onDeleteEvent }: EventsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = events.findIndex((e) => e.id === active.id);
      const newIndex = events.findIndex((e) => e.id === over.id);
      onEventsChange(arrayMove(events, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={events.map(e => e.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {events.map((event) => (
            <SortableEventItem
              key={event.id}
              event={event}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}