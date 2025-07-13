import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackingEvent, TrackingConfiguration } from "@/types/event";

interface AppState {
  // Events
  events: TrackingEvent[];
  
  // User preferences (for future use)
  preferences: {
    theme?: "light" | "dark" | "system";
    showLineNumbers?: boolean;
  };
  
  // Actions
  setEvents: (events: TrackingEvent[]) => void;
  addEvent: (event: Omit<TrackingEvent, "id">) => void;
  updateEvent: (id: string, event: Omit<TrackingEvent, "id">) => void;
  deleteEvent: (id: string) => void;
  reorderEvents: (events: TrackingEvent[]) => void;
  importConfiguration: (config: TrackingConfiguration) => void;
  clearEvents: () => void;
  
  // Derived getters
  getConfiguration: () => TrackingConfiguration;
  
  // Preferences actions
  updatePreferences: (preferences: Partial<AppState["preferences"]>) => void;
}

const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      events: [],
      preferences: {
        theme: "system",
        showLineNumbers: false,
      },
      
      // Event actions
      setEvents: (events) => set({ events }),
      
      addEvent: (eventData) => {
        const newEvent: TrackingEvent = {
          ...eventData,
          id: Date.now().toString(),
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },
      
      updateEvent: (id, eventData) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...eventData, id } : e
          ),
        }));
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },
      
      reorderEvents: (events) => set({ events }),
      
      importConfiguration: (config) => {
        const importedEvents: TrackingEvent[] = config.events.map((e, index) => ({
          ...e,
          id: Date.now().toString() + index,
        }));
        set({ events: importedEvents });
      },
      
      clearEvents: () => set({ events: [] }),
      
      // Derived getters
      getConfiguration: () => {
        const { events } = get();
        return {
          events: events.map(({ id: _, ...event }) => event),
        };
      },
      
      // Preferences actions
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        }));
      },
    }),
    {
      name: "smartcars-config-store",
      // Only persist events and preferences, not actions
      partialize: (state) => ({
        events: state.events,
        preferences: state.preferences,
      }),
    }
  )
);

export { useAppStore };