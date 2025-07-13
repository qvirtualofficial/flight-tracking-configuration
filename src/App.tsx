import { useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";
import { EventDialog } from "@/components/EventDialog";
import { EventsList } from "@/components/EventsList";
import { ImportDialog } from "@/components/ImportDialog";
import { Footer } from "@/components/Footer";
import { JsonEditor } from "@/components/JsonEditor";
import type { TrackingEvent, TrackingConfiguration } from "@/types/event";

function App() {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TrackingEvent | undefined>();

  const handleAddEvent = useCallback(() => {
    setEditingEvent(undefined);
    setDialogOpen(true);
  }, []);

  const handleEditEvent = useCallback((event: TrackingEvent) => {
    setEditingEvent(event);
    setDialogOpen(true);
  }, []);

  const handleSaveEvent = useCallback(
    (eventData: Omit<TrackingEvent, "id">) => {
      setEvents((prevEvents) => {
        if (editingEvent) {
          return prevEvents.map((e) =>
            e.id === editingEvent.id ? { ...eventData, id: e.id } : e,
          );
        } else {
          const newEvent: TrackingEvent = {
            ...eventData,
            id: Date.now().toString(),
          };
          return [...prevEvents, newEvent];
        }
      });
    },
    [editingEvent],
  );

  const handleDeleteEvent = useCallback((id: string) => {
    setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
  }, []);

  const handleImport = useCallback((config: TrackingConfiguration) => {
    const importedEvents: TrackingEvent[] = config.events.map((e, index) => ({
      ...e,
      id: Date.now().toString() + index,
    }));
    setEvents(importedEvents);
  }, []);

  const handleExport = useCallback(() => {
    const config: TrackingConfiguration = {
      events: events.map(({ id: _, ...event }) => event),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flight-tracking-config.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [events]);

  const handleJsonChange = useCallback((config: TrackingConfiguration) => {
    const importedEvents: TrackingEvent[] = config.events.map((e, index) => ({
      ...e,
      id: Date.now().toString() + index,
    }));
    setEvents(importedEvents);
  }, []);

  const handleLoadDefaultConfiguration = useCallback(async () => {
    try {
      const response = await fetch("/default.json");
      const defaultConfig: TrackingConfiguration = await response.json();

      const importedEvents: TrackingEvent[] = defaultConfig.events.map(
        (e, index) => ({
          ...e,
          id: Date.now().toString() + index,
        }),
      );
      setEvents(importedEvents);
    } catch (error) {
      console.error("Failed to load default configuration:", error);
    }
  }, []);

  const configuration: TrackingConfiguration = useMemo(
    () => ({
      events: events.map(({ id: _, ...event }) => event),
    }),
    [events],
  );

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="border-b flex-shrink-0">
        <div className="mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Flight Tracking Configuration
              </h1>
              <img src="/plane.png" alt="Flight Tracking" className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              Create and manage your SmartCARS 3 flight tracking events
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <a
                href={
                  "https://docs.tfdidesign.com/en/smartcars3/flight-tracking-customization"
                }
                target={"_blank"}
              >
                Documentation
              </a>
            </Button>
            <Button size="sm" onClick={handleLoadDefaultConfiguration}>
              Load Default Configuration
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Events */}
        <div className="w-3/5 border-r flex flex-col">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Events</h2>
              <Button size="sm" onClick={handleAddEvent}>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {events.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    No events configured yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste your JSON in the right panel or click below to start
                  </p>
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
        </div>

        {/* Right Panel - JSON Editor */}
        <div className="w-2/5 bg-muted/30 flex flex-col">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">JSON Configuration</h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setImportDialogOpen(true)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Paste your JSON here or use the visual editor on the left
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <JsonEditor
              value={configuration}
              onChange={handleJsonChange}
              className="h-full"
            />
          </div>
        </div>
      </div>

      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={editingEvent}
        onSave={handleSaveEvent}
      />

      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
      />

      <Footer />
    </div>
  );
}

export default App;
