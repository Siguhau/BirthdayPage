type GameIntroductionProps = {
  onStart: () => void;
  userName: string;
};

const GameIntroduction = ({ onStart, userName }: GameIntroductionProps) => (
  <section className="escape-room-introduction">
    <div aria-hidden="true" className="escape-room-introduction__door" />
    <p className="escape-room-game__eyebrow">Det er noe der nede, {userName}</p>
    <h1 className="escape-room-game__title">Kjelleren til mor</h1>
    <p className="escape-room-game__description">
      Du kjenner huset. Lydene. Lukten av gammelt treverk.
      <br />
      Men lyset under døren har du ikke sett før.
    </p>
    <p className="escape-room-introduction__whisper">
      Mor sa du ikke skulle gå ned alene.
    </p>
    <button
      className="escape-room-game__action"
      onClick={onStart}
      type="button"
    >
      Åpne døren
    </button>
    <details className="escape-room-introduction__controls">
      <summary>Før du går inn</summary>
      <p>
        WASD beveger deg · Space hopper · Musen ser rundt · E undersøker ·
        Escape åpner menyen
      </p>
    </details>
  </section>
);

export default GameIntroduction;
