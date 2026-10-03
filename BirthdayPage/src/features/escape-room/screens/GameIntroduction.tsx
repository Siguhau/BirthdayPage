type GameIntroductionProps = {
  onStart: () => void;
  userName: string;
};

const GameIntroduction = ({ onStart, userName }: GameIntroductionProps) => (
  <section className="escape-room-introduction">
    <div aria-hidden="true" className="escape-room-game__icon">
      🔐
    </div>
    <p className="escape-room-game__eyebrow">Årets bursdagsutfordring</p>
    <h1 className="escape-room-game__title">
      Velkommen til rømningsrommet, {userName}
    </h1>
    <p className="escape-room-game__description">
      En personlig reise gjennom minner, merkelige rom og gamle internvitser
      står mellom deg og årets bursdagshilsen.
    </p>
    <p className="escape-room-introduction__controls">
      WASD beveger deg · Space hopper · Musen ser rundt · E undersøker · Escape
      åpner menyen
    </p>
    <button
      className="escape-room-game__action"
      onClick={onStart}
      type="button"
    >
      Begynn oppdraget
    </button>
  </section>
);

export default GameIntroduction;
