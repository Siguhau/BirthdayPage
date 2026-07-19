import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThemeProvider from "./ThemeProvider";
import type { ThemeName } from "./types";
import { useTheme } from "./useTheme";

const ThemeConsumer = () => {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <span>{theme}</span>
      <button
        onClick={() => {
          setTheme("escape-room");
        }}
        type="button"
      >
        Use escape room theme
      </button>
    </>
  );
};

const renderTheme = (initialTheme?: ThemeName) =>
  render(
    <ThemeProvider initialTheme={initialTheme}>
      <ThemeConsumer />
    </ThemeProvider>,
  );

describe("ThemeProvider", () => {
  it("applies the birthday theme by default", () => {
    renderTheme();

    expect(document.documentElement).toHaveAttribute("data-theme", "birthday");
    expect(screen.getByText("birthday")).toBeInTheDocument();
  });

  it("applies the requested initial theme", () => {
    renderTheme("escape-room");

    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
  });

  it("updates the active theme", () => {
    renderTheme();

    fireEvent.click(
      screen.getByRole("button", { name: "Use escape room theme" }),
    );

    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "escape-room",
    );
    expect(screen.getByText("escape-room")).toBeInTheDocument();
  });

  it("restores the previous document theme when unmounted", () => {
    document.documentElement.setAttribute("data-theme", "existing-theme");
    const { unmount } = renderTheme();

    unmount();

    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "existing-theme",
    );
    document.documentElement.removeAttribute("data-theme");
  });

  it("requires consumers to be inside the provider", () => {
    expect(() => render(<ThemeConsumer />)).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
  });
});
