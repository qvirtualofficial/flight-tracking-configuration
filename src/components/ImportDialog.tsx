import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileJson } from "lucide-react";
import type { TrackingConfiguration } from "@/types/event";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (config: TrackingConfiguration) => void;
}

function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = () => {
    try {
      const config = JSON.parse(jsonText);

      // Validate structure
      if (!config.events || !Array.isArray(config.events)) {
        setError("Invalid configuration: missing or invalid events array");
        return;
      }

      // Validate each event has required fields
      for (const event of config.events) {
        if (!event.condition || !event.message) {
          setError(
            "Invalid configuration: each event must have condition and message",
          );
          return;
        }
      }

      onImport(config);
      setJsonText("");
      setError("");
      onOpenChange(false);
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message);
    }
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setJsonText(text);
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      handleFileRead(file);
    } else {
      setError("Please drop a JSON file");
    }
  };

  const handleClose = () => {
    setJsonText("");
    setError("");
    setIsDragging(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Configuration</DialogTitle>
          <DialogDescription>
            Paste your JSON configuration from smartCARS Central
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="json-input">JSON Configuration</Label>
            <Textarea
              id="json-input"
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setError("");
              }}
              placeholder='{"events": [...]}'
              className="font-mono text-sm min-h-[300px] resize-none"
              style={{ height: "400px" }}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Copy the JSON from smartCARS Central and paste it here
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or upload a file
              </span>
            </div>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileJson className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-2">
              Drag and drop a JSON file here, or
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-3 w-3" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {jsonText && !error && (
            <div className="rounded-md bg-primary/10 p-3">
              <p className="text-sm text-primary">
                Ready to import configuration
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!jsonText || !!error}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { ImportDialog };
