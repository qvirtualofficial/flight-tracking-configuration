import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { EventDialog } from '@/components/EventDialog';
import { EventsList } from '@/components/EventsList';
import { TrackingEvent, TrackingConfiguration } from '@/types/event';
import JsonView from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

function App() {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TrackingEvent | undefined>();

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setDialogOpen(true);
  };

  const handleEditEvent = (event: TrackingEvent) => {
    setEditingEvent(event);
    setDialogOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<TrackingEvent, 'id'>) => {
    if (editingEvent) {
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...eventData, id: e.id }
          : e
      ));
    } else {
      const newEvent: TrackingEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const config: TrackingConfiguration = JSON.parse(text);
          if (config.events && Array.isArray(config.events)) {
            const importedEvents: TrackingEvent[] = config.events.map((e, index) => ({
              ...e,
              id: Date.now().toString() + index,
            }));
            setEvents(importedEvents);
          }
        } catch (error) {
          console.error('Failed to import configuration:', error);
        }
      }
    };
    input.click();
  };

  const handleExport = () => {
    const config: TrackingConfiguration = {
      events: events.map(({ id, ...event }) => event),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flight-tracking-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const configuration: TrackingConfiguration = {
    events: events.map(({ id, ...event }) => event),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Flight Tracking Configuration</h1>
          <p className="text-muted-foreground">
            Create and manage your SmartCARS 3 flight tracking events
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
          {/* Events List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Events</h2>
              <Button onClick={handleAddEvent}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>

            {events.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No events configured yet</p>
                  <Button onClick={handleAddEvent}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <EventsList
                events={events}
                onEventsChange={setEvents}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}
          </div>

          {/* JSON Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">JSON Preview</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleImport}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                  This JSON can be imported into SmartCARS Central
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 overflow-x-auto max-h-[600px] overflow-y-auto">
                  <JsonView data={configuration} shouldExpandNode={() => true} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
        onSave={handleSaveEvent}
      />
    </div>
  );
}

export default App;