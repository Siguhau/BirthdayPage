import BirthdayTransitionPreview from "./pages/BirthdayTransitionPreview";
import EscapeRoomPage from "./pages/EscapeRoomPage";
import LiveBirthdayPage from "./pages/LiveBirthdayPage";

function App() {
  const preview = import.meta.env.DEV
    ? new URLSearchParams(window.location.search).get("preview")
    : null;

  if (preview === "birthday") return <BirthdayTransitionPreview />;
  if (preview === "escape-room") {
    return (
      <EscapeRoomPage locale="nb-NO" onComplete={() => {}} userName="Runar" />
    );
  }
  return <LiveBirthdayPage />;
}

export default App;
