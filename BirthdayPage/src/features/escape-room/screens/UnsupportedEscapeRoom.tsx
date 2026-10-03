import type { EscapeRoomSupportReason } from "../support/escapeRoomSupport";

const explanationByReason: Record<EscapeRoomSupportReason, string> = {
  mobile:
    "Rømningsrommet trenger tastatur og mus. På denne enheten hopper vi derfor videre til bursdagsfeiringen.",
  "reduced-motion":
    "Rømningsrommet bruker førstepersonsbevegelse. Siden redusert bevegelse er aktivert, hopper vi videre til bursdagsfeiringen.",
  "webgl-unavailable":
    "Nettleseren kan ikke starte 3D-rommet. Du kan fortsatt gå videre til bursdagsfeiringen.",
};

type UnsupportedEscapeRoomProps = {
  onContinue: () => void;
  reason: EscapeRoomSupportReason;
};

const UnsupportedEscapeRoom = ({
  onContinue,
  reason,
}: UnsupportedEscapeRoomProps) => (
  <section className="escape-room-support-message">
    <div aria-hidden="true" className="escape-room-game__icon">
      🗝️
    </div>
    <p className="escape-room-game__eyebrow">En liten omvei</p>
    <h1 className="escape-room-game__title">3D-rommet støttes ikke her</h1>
    <p className="escape-room-game__description">
      {explanationByReason[reason]}
    </p>
    <button
      className="escape-room-game__action"
      onClick={onContinue}
      type="button"
    >
      Gå til feiringen
    </button>
  </section>
);

export default UnsupportedEscapeRoom;
