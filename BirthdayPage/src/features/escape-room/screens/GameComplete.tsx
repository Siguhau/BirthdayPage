const GameComplete = () => (
  <section className="escape-room-complete" role="status">
    <div className="escape-room-complete__message">
      <div aria-hidden="true" className="escape-room-complete__halo" />
      <p className="escape-room-game__eyebrow">Pepsi Max funnet</p>
      <h1 className="escape-room-game__title">Kisten er åpnet</h1>
      <p className="escape-room-game__description">
        Bursdagshilsenen låses opp …
      </p>
    </div>
  </section>
);

export default GameComplete;
