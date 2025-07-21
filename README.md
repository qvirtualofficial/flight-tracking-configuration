# smartCARS 3 Flight Tracking Configuration Builder

A visual configuration builder for smartCARS 3 flight tracking events. Create, manage, and export your custom flight tracking rules with an intuitive drag-and-drop interface.

🚀 **[Try it live](https://qvirtualofficial.github.io/flight-tracking-configuration/)**

## Features

- 🎯 **Visual Event Builder** - Create tracking events with an intuitive form interface
- 🔧 **Condition Builder** - Build complex conditions with dropdown menus for variables and operators
- 🎨 **Drag & Drop** - Reorder events with smooth drag-and-drop functionality
- 📋 **Import/Export** - Easily import existing configurations or export your creations
- ✅ **Real-time Validation** - Instant feedback on condition syntax and variable usage
- 🔍 **JSON Preview** - See your configuration in real-time as you build
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Quick Start

### Using the Builder

1. Click "Add Event" to create a new tracking event
2. Use the condition builder to define when the event should trigger
3. Add a message template with variables that will be logged
4. Optionally set initial values and timeouts
5. Drag events to reorder them as needed
6. Export your configuration and import it into smartCARS Central

### Example Configuration

```json
{
  "events": [
    {
      "condition": "{altitude} greater_than 10000",
      "message": "Climbing through {altitude} feet at {vs} fpm",
      "timeout": 5000
    }
  ]
}
```

## Development

### Prerequisites

- Node.js 20+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/qvirtualofficial/flight-tracking-configuration.git
cd flight-tracking-configuration

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run tests
- `pnpm preview` - Preview production build
- `pnpm format` - Format code with Prettier

### Tech Stack

- **React** + **TypeScript** - Type-safe component development
- **Vite** - Lightning-fast build tooling
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible UI components
- **@dnd-kit** - Performant drag-and-drop
- **Vitest** - Fast unit testing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commits

## Documentation

For detailed information about smartCARS 3 flight tracking configuration:

- [Official Documentation](https://docs.tfdidesign.com/en/smartcars3/flight-tracking-customization)

### Available Variables

The builder includes all smartCARS 3 variables organized by category:

- **Position/Movement**: altitude, speed, heading, pitch, bank, etc.
- **Aircraft**: type, engines, fuel, controls
- **Flight Phases**: boarding, taxi, takeoff, cruise, landing, etc.
- **Environment**: wind, pressure, time
- **Status**: warnings, modes, crashed state

## Support

- 🐛 [Report Issues](https://github.com/qvirtualofficial/flight-tracking-configuration/issues)
- 🐦 Follow updates on [Twitter/X](https://x.com/xi2066)
- 🎮 Join the [QVirtual](https://qvirtual.com.au) community

## License

MIT License - see [LICENSE](LICENSE) file for details

---

Made with ❤️ in Queensland, Australia

Sponsored by [QVirtual](https://qvirtual.com.au)
