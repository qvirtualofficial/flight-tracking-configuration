import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

describe("App", () => {
  it("renders the header and main sections", () => {
    render(<App />);

    expect(
      screen.getByText("Flight Tracking Configuration"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Create and manage your SmartCARS 3 flight tracking events",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("JSON Preview")).toBeInTheDocument();
  });

  it("shows empty state when no events", () => {
    render(<App />);

    expect(screen.getByText("No events configured yet")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create your first event" }),
    ).toBeInTheDocument();
  });

  it("opens dialog when add event button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Get the first Add Event button (in the header, not in the dialog)
    const addButtons = screen.getAllByRole("button", { name: /add event/i });
    await user.click(addButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Configure a flight tracking event with conditions and messages",
        ),
      ).toBeInTheDocument();
    });
  });

  it("exports JSON configuration", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Create a mock for URL.createObjectURL and click
    const mockCreateObjectURL = vi.fn(() => "blob:mock-url");
    const mockClick = vi.fn();
    const mockRevokeObjectURL = vi.fn();

    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock createElement to capture the anchor element
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn((tagName: string) => {
      const element = originalCreateElement.call(document, tagName);
      if (tagName === "a") {
        element.click = mockClick;
      }
      return element;
    });

    const exportButton = screen.getByText("Export");
    await user.click(exportButton);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();

    // Restore mocks
    document.createElement = originalCreateElement;
  });
});
