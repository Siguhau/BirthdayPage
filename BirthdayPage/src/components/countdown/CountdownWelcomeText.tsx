type CountdownWelcomeTextProps = {
  userName: string;
};

const CountdownWelcomeText = ({ userName }: CountdownWelcomeTextProps) => (
  <h1
    style={{
      fontSize: "clamp(1.5rem, 8vw, 2rem)",
      lineHeight: 1.2,
      margin: "0 1rem 1.5rem",
      textAlign: "center",
    }}
  >
    Tid til {userName}s bursdag
  </h1>
);

export default CountdownWelcomeText;
