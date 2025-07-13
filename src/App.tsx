import { useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash2 } from "lucide-react";
import { EventDialog } from "@/components/EventDialog";
import { EventsList } from "@/components/EventsList";
import { Footer } from "@/components/Footer";
import { JsonEditor } from "@/components/JsonEditor";
import type { TrackingEvent, TrackingConfiguration } from "@/types/event";
import { defaultConfiguration } from "@/data/defaultConfig";
import planeIcon from "@/assets/plane.png";
import { useAppStore } from "@/store/appStore";

function App() {
  // Zustand store
  const {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    reorderEvents,
    importConfiguration,
    getConfiguration,
    clearEvents,
  } = useAppStore();

  // Local UI state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TrackingEvent | undefined>();
  const [jsonFormat, setJsonFormat] = useState<"beautify" | "minify">(
    "beautify",
  );
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [hasDefaultConfig, setHasDefaultConfig] = useState(false);

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
      if (editingEvent) {
        updateEvent(editingEvent.id, eventData);
      } else {
        addEvent(eventData);
      }
      setHasDefaultConfig(false);
    },
    [editingEvent, addEvent, updateEvent],
  );

  const handleDeleteEvent = useCallback(
    (id: string) => {
      deleteEvent(id);
      setHasDefaultConfig(false);
    },
    [deleteEvent],
  );

  const handleCopyJson = useCallback(async () => {
    const config = getConfiguration();
    const jsonString = JSON.stringify(config); // Always copy minified

    try {
      await navigator.clipboard.writeText(jsonString);
      // Could add a toast notification here in the future
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  }, [getConfiguration]);

  const handleJsonChange = useCallback(
    (config: TrackingConfiguration) => {
      importConfiguration(config);
      setHasDefaultConfig(false);
    },
    [importConfiguration],
  );

  const handleLoadDefaultConfiguration = useCallback(() => {
    importConfiguration(defaultConfiguration);
    setHasDefaultConfig(true);
  }, [importConfiguration]);

  const handleClearEvents = useCallback(() => {
    // If we have default config and no modifications, skip dialog
    if (
      hasDefaultConfig &&
      events.length === defaultConfiguration.events.length
    ) {
      // Check if current events match default config
      const currentConfig = getConfiguration();
      const isDefaultConfig =
        JSON.stringify(currentConfig) === JSON.stringify(defaultConfiguration);

      if (isDefaultConfig) {
        clearEvents();
        setHasDefaultConfig(false);
        return;
      }
    }

    // Show confirmation dialog
    setClearDialogOpen(true);
  }, [hasDefaultConfig, events.length, getConfiguration, clearEvents]);

  const handleConfirmClear = useCallback(() => {
    clearEvents();
    setHasDefaultConfig(false);
    setClearDialogOpen(false);
  }, [clearEvents]);

  const configuration: TrackingConfiguration = useMemo(
    () => ({
      events: events.map(({ id: _, ...event }) => event),
    }),
    [events],
  );

  const formattedJsonString = useMemo(() => {
    return jsonFormat === "beautify"
      ? JSON.stringify(configuration, null, 2)
      : JSON.stringify(configuration);
  }, [configuration, jsonFormat]);

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="border-b flex-shrink-0">
        <div className="mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Flight Tracking Configuration
              </h1>
              <img src={planeIcon} alt="Flight Tracking" className="h-6 w-6" />
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
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Events</h2>
                {events.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {events.length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {events.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearEvents}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear Events
                  </Button>
                )}
                <Button size="sm" onClick={handleAddEvent}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
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
                onEventsChange={reorderEvents}
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
              <div className="flex items-center gap-3">
                {/* Format Toggle */}
                <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
                  <button
                    onClick={() => setJsonFormat("beautify")}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      jsonFormat === "beautify"
                        ? "bg-background text-foreground shadow-sm"
                        : "hover:bg-background/10"
                    }`}
                  >
                    Beautify
                  </button>
                  <button
                    onClick={() => setJsonFormat("minify")}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      jsonFormat === "minify"
                        ? "bg-background text-foreground shadow-sm"
                        : "hover:bg-background/10"
                    }`}
                  >
                    Minify
                  </button>
                </div>
                <Button size="sm" variant="outline" onClick={handleCopyJson}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy JSON
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Edit JSON directly or use the visual editor on the left
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <JsonEditor
              value={formattedJsonString}
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

      {/* Clear Events Confirmation Dialog */}
      <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Events</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all events? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmClear}>
              Clear All Events
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default App;
