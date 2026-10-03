import { describe, expect, it } from "vitest";
import { createInteractionKeyGate } from "./interactionKeyGate";

describe("interactionKeyGate", () => {
  it("allows only one world action until E is released", () => {
    const gate = createInteractionKeyGate();

    expect(gate.handleKeyDown("KeyE")).toBe(true);
    expect(gate.handleKeyDown("KeyE")).toBe(false);
    gate.handleKeyUp("KeyE");
    expect(gate.handleKeyDown("KeyE")).toBe(true);
  });

  it("does not treat puzzle controls as world interactions", () => {
    const gate = createInteractionKeyGate();

    expect(gate.handleKeyDown("KeyW")).toBe(false);
    expect(gate.handleKeyDown("Escape")).toBe(false);
    expect(gate.handleKeyDown("KeyE")).toBe(true);
  });

  it("can recover when the window loses focus before keyup", () => {
    const gate = createInteractionKeyGate();

    expect(gate.handleKeyDown("KeyE")).toBe(true);
    gate.reset();
    expect(gate.handleKeyDown("KeyE")).toBe(true);
  });
});
