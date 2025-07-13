import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      <button
        onClick={() => setTheme("light")}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          theme === "light" 
            ? "bg-background text-foreground shadow-sm" 
            : "hover:bg-background/10"
        }`}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          theme === "system" 
            ? "bg-background text-foreground shadow-sm" 
            : "hover:bg-background/10"
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          theme === "dark" 
            ? "bg-background text-foreground shadow-sm" 
            : "hover:bg-background/10"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  )
}