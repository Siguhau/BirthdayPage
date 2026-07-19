const GameComplete = () => (
  <section className="escape-room-complete">
    <div aria-hidden="true" className="escape-room-game__icon">
      🔓
    </div>
    <p className="escape-room-game__eyebrow">Alle låser er åpnet</p>
    <h1 className="escape-room-game__title">Oppdrag fullført</h1>
    <p className="escape-room-game__description">
      Bursdagshilsenen låses opp …
    </p>
  </section>
);

export default GameComplete;
