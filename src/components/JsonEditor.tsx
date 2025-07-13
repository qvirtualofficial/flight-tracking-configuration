import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import type { TrackingConfiguration } from '@/types/event';

interface JsonEditorProps {
  value: TrackingConfiguration;
  onChange: (config: TrackingConfiguration) => void;
  className?: string;
}

export function JsonEditor({ value, onChange, className }: JsonEditorProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  // Update text when value changes from outside
  useEffect(() => {
    setJsonText(JSON.stringify(value, null, 2));
    setError('');
  }, [value]);

  const handleTextChange = (text: string) => {
    setJsonText(text);
    
    // Try to parse and update
    try {
      const parsed = JSON.parse(text);
      
      // Validate structure
      if (!parsed.events || !Array.isArray(parsed.events)) {
        setError('Invalid structure: must have an "events" array');
        return;
      }
      
      // Validate each event
      for (const event of parsed.events) {
        if (!event.condition || !event.message) {
          setError('Each event must have "condition" and "message" fields');
          return;
        }
      }
      
      setError('');
      onChange(parsed);
    } catch (e) {
      if (text.trim()) {
        setError('Invalid JSON: ' + (e as Error).message);
      }
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <Textarea
        value={jsonText}
        onChange={(e) => handleTextChange(e.target.value)}
        className="flex-1 font-mono text-sm resize-none"
        placeholder='{"events": []}'
        spellCheck={false}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}