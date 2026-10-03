import type { WorldArea, WorldInteraction } from "./worldTypes";

type WorldHudProps = {
  area: WorldArea;
  target: WorldInteraction | null;
};

const WorldHud = ({ area, target }: WorldHudProps) => (
  <div className="escape-room-world__hud">
    <div className="escape-room-world__area">
      <span>Område</span>
      <strong>{area.label}</strong>
    </div>

    <div
      aria-hidden="true"
      className={`escape-room-world__reticle ${
        target !== null ? "escape-room-world__reticle--active" : ""
      }`}
    />

    {target !== null && (
      <p className="escape-room-world__prompt" role="status">
        <kbd>E</kbd> {target.label}
      </p>
    )}

    <p className="escape-room-world__controls">
      WASD · Space hopp · Mus · E undersøk · Escape meny
    </p>
  </div>
);

export default WorldHud;
