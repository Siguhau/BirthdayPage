import type { WorldInteraction } from "./worldTypes";

type WorldHudProps = {
  target: WorldInteraction | null;
};

const WorldHud = ({ target }: WorldHudProps) => (
  <div className="escape-room-world__hud">
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
