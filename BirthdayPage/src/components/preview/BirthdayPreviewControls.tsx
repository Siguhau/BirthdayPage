type BirthdayPreviewControlsProps = {
  isBirthday: boolean;
  onRestartCountdown: () => void;
  onShowBirthday: () => void;
};

const buttonStyle = {
  border: "1px solid rgba(255, 255, 255, 0.25)",
  borderRadius: "999px",
  color: "white",
  cursor: "pointer",
  font: "inherit",
  fontWeight: 600,
  padding: "0.65rem 1rem",
};

const BirthdayPreviewControls = ({
  isBirthday,
  onRestartCountdown,
  onShowBirthday,
}: BirthdayPreviewControlsProps) => (
  <div
    aria-label="Birthday preview controls"
    role="group"
    style={{
      position: "fixed",
      right: "1rem",
      bottom: "1rem",
      zIndex: 1000,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem",
      borderRadius: "1rem",
      background: "rgba(15, 15, 25, 0.82)",
      boxShadow: "0 0.5rem 1.5rem rgba(0, 0, 0, 0.35)",
      backdropFilter: "blur(8px)",
    }}
  >
    <button
      aria-pressed={!isBirthday}
      onClick={onRestartCountdown}
      style={{
        ...buttonStyle,
        background: !isBirthday ? "rgba(255, 255, 255, 0.18)" : "transparent",
      }}
      type="button"
    >
      Restart 5-second countdown
    </button>
    <button
      aria-pressed={isBirthday}
      onClick={onShowBirthday}
      style={{
        ...buttonStyle,
        background: isBirthday ? "rgba(255, 255, 255, 0.18)" : "transparent",
      }}
      type="button"
    >
      Show birthday greeting
    </button>
  </div>
);

export default BirthdayPreviewControls;
